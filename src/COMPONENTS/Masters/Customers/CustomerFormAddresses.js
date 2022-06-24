/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';
import AddressModal from "../Addresses/AddressModal";

class CustomerFormAddresses extends Component {
    constructor({ customerId, getCustomerAddresses, getAddressesFunctions }) {
        super();

        this.list = [];

        this.customerId = customerId;
        this.getCustomerAddresses = getCustomerAddresses;
        this.getAddressesFunctions = getAddressesFunctions;

        this.addAddr = this.addAddr.bind(this);
        this.editAddr = this.editAddr.bind(this);
    }

    componentDidMount() {
        if (this.customerId == null) {
            return;
        }

        this.getCustomerAddresses(this.customerId).then((addresses) => {
            this.list = addresses;
            this.forceUpdate();
        });
    }

    async addAddr() {
        if (this.customerId == null || this.customerId <= 0) {
            return;
        }

        const commonProps = this.getAddressesFunctions();

        const defaultValueNameCustomer = await commonProps.getCustomerName(this.customerId);

        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(
            <AddressModal
                {...commonProps}
                addAddress={(address) => {
                    return new Promise((resolve) => {
                        commonProps.addAddress(address).then((result) => {
                            if (result.id > 0) {
                                // refresh
                                this.getCustomerAddresses(this.customerId).then((addresses) => {
                                    this.list = addresses;
                                    this.forceUpdate();
                                    // close window
                                    resolve(result);
                                });
                            }
                        });
                    });
                }}
                defaultValueNameCustomer={defaultValueNameCustomer}
                defaultCustomerId={this.customerId}
            />,
            document.getElementById('renderAddressModal'));

    }

    async editAddr(addr) {
        const commonProps = this.getAddressesFunctions();
        const address = await commonProps.getAddressRow(addr.id);

        var defaultValueNameCustomer;
        if (address.customer != null)
            defaultValueNameCustomer = await commonProps.getCustomerName(address.customer);
        var defaultValueNameState;
        if (address.state != null)
            defaultValueNameState = await commonProps.getStateName(address.state);
        const defaultValueNameCountry = await commonProps.getCountryName(address.country);

        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(
            <AddressModal
                {...commonProps}
                updateAddress={(address) => {
                    return new Promise((resolve) => {
                        commonProps.updateAddress(address).then((result) => {
                            if (result) {
                                // refresh
                                this.getCustomerAddresses(this.customerId).then((addresses) => {
                                    this.list = addresses;
                                    this.forceUpdate();
                                    // close window
                                    resolve(result);
                                });
                            }
                        });
                    });
                }}
                deleteAddress={(address) => {
                    return new Promise((resolve) => {
                        commonProps.deleteAddress(address).then((result) => {
                            if (result) {
                                // refresh
                                this.getCustomerAddresses(this.customerId).then((addresses) => {
                                    this.list = addresses;
                                    this.forceUpdate();
                                    // close window
                                    resolve(result);
                                });
                            }
                        });
                    });
                }}
                address={address}
                defaultValueNameCustomer={defaultValueNameCustomer}
                defaultValueNameState={defaultValueNameState}
                defaultValueNameCountry={defaultValueNameCountry}
            />,
            document.getElementById('renderAddressModal'));
    }

    render() {
        return <div>
            <div id="renderAddressModal"></div>
            <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.addAddr}>{i18next.t('add')}</button>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'id', headerName: '#', width: 90 },
                    {
                        field: 'contactName', headerName: i18next.t('customer'), flex: 1, valueGetter: (params) => {
                            return params.row.customer != null ? params.row.customer.name : params.row.supplier != null ? params.row.supplier.name : '';
                        }
                    },
                    { field: 'address', headerName: i18next.t('address'), width: 500 },
                    {
                        field: 'countryName', headerName: i18next.t('country'), width: 150, valueGetter: (params) => {
                            return params.row.country != null ? params.row.country.name : '';
                        }
                    },
                    {
                        field: 'stateName', headerName: i18next.t('state'), width: 250, valueGetter: (params) => {
                            return params.row.state != null ? params.row.state.name : '';
                        }
                    }
                ]}
                onRowClick={(data) => {
                    this.editAddr(data.row);
                }}
            />
        </div>
    }
}

export default CustomerFormAddresses;
