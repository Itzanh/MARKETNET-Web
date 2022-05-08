import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import AddressModal from './AddressModal';
import SearchField from '../../SearchField';


class Addresses extends Component {
    constructor({ findCustomerByName, findStateByName, findCountryByName, getAddresses, searchSAddress,
        addAddress, updateAddress, deleteAddress, findSupplierByName, locateCustomers, locateSuppliers }) {
        super();

        this.findCustomerByName = findCustomerByName;
        this.findStateByName = findStateByName;
        this.findCountryByName = findCountryByName;
        this.findSupplierByName = findSupplierByName;

        this.locateCustomers = locateCustomers;
        this.locateSuppliers = locateSuppliers;

        this.getAddresses = getAddresses;
        this.searchSAddress = searchSAddress;
        this.addAddress = addAddress;
        this.updateAddress = updateAddress;
        this.deleteAddress = deleteAddress;

        this.list = [];
        this.loading = true;
        this.rows = 0;
        this.searchText = "";
        this.limit = 100;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.search = this.search.bind(this);
    }

    componentDidMount() {
        this.printAddresses();
    }

    printAddresses() {
        this.loading = true;
        this.searchSAddress({
            search: this.searchText,
            offset: 0,
            limit: 100
        }).then(async (addresses) => {
            this.renderAddresses(addresses);
        });
    }

    renderAddresses(addresses) {
        this.loading = false;
        this.rows = addresses.rows;
        this.list = addresses.addresses;
        this.forceUpdate();
    }

    async search(search) {
        this.loading = true;
        this.searchText = search;
        const addresses = await this.searchSAddress({
            search,
            offset: 0,
            limit: 100
        });
        this.renderAddresses(addresses);
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressesModal'));
        ReactDOM.render(
            <AddressModal
                findCustomerByName={this.findCustomerByName}
                findSupplierByName={this.findSupplierByName}
                findStateByName={this.findStateByName}
                findCountryByName={this.findCountryByName}
                locateCustomers={this.locateCustomers}
                locateSuppliers={this.locateSuppliers}
                addAddress={(addres) => {
                    const promise = this.addAddress(addres);
                    promise.then((ok) => {
                        if (ok) {
                            this.printAddresses();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderAddressesModal'));
    }

    async edit(address) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressesModal'));
        ReactDOM.render(
            <AddressModal
                address={address}
                findCustomerByName={this.findCustomerByName}
                findSupplierByName={this.findSupplierByName}
                findStateByName={this.findStateByName}
                findCountryByName={this.findCountryByName}
                locateCustomers={this.locateCustomers}
                locateSuppliers={this.locateSuppliers}
                updateAddress={(addres) => {
                    const promise = this.updateAddress(addres);
                    promise.then((ok) => {
                        if (ok) {
                            this.printAddresses();
                        }
                    });
                    return promise;
                }}
                deleteAddress={(addres) => {
                    const promise = this.deleteAddress(addres);
                    promise.then((ok) => {
                        if (ok) {
                            this.printAddresses();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderAddressesModal'));
    }

    render() {
        return <div id="tabAddresses" className="formRowRoot">
            <div id="renderAddressesModal"></div>
            <h4 className="ml-2">{i18next.t('addresses')}</h4>
            <div class="form-row">
                <div class="col">
                    <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add')}</button>
                </div>
                <div class="col">
                    <SearchField handleSearch={this.search} />
                </div>
            </div>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    {
                        field: 'contactName', headerName: i18next.t('customer') + "/" + i18next.t('supplier'), width: 500, valueGetter: (params) => {
                            return params.row.customer != null ? params.row.customer.name : (params.row.supplier != null ? params.row.supplier.name : "");
                        }
                    },
                    { field: 'address', headerName: i18next.t('address'), flex: 1 },
                    {
                        field: 'countryName', headerName: i18next.t('country'), width: 250, valueGetter: (params) => {
                            return params.row.country.name;
                        }
                    },
                    {
                        field: 'stateName', headerName: i18next.t('state'), width: 250, valueGetter: (params) => {
                            return params.row.state != null ? params.row.state.name : "";
                        }
                    }
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
                loading={this.loading}
                onPageChange={(data) => {
                    this.searchSAddress({
                        search: this.searchText,
                        offset: data * this.limit,
                        limit: this.limit
                    }).then(async (addresses) => {
                        addresses.addresses = this.list.concat(addresses.addresses);
                        this.renderAddresses(addresses);
                    });
                }}
                rowCount={this.rows}
            />
        </div>
    }
}

export default Addresses;
