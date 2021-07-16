import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import AddressModal from './AddressModal';
import SearchField from '../../SearchField';


class Addresses extends Component {
    constructor({ findCustomerByName, getCustomerName, findStateByName, getStateName, findCountryByName, getCountryName,
        getAddresses, searchSAddress, addAddress, updateAddress, deleteAddress, findSupplierByName, getSupplierName }) {
        super();

        this.findCustomerByName = findCustomerByName;
        this.getCustomerName = getCustomerName;
        this.findStateByName = findStateByName;
        this.getStateName = getStateName;
        this.findCountryByName = findCountryByName;
        this.getCountryName = getCountryName;
        this.findSupplierByName = findSupplierByName;
        this.getSupplierName = getSupplierName;

        this.getAddresses = getAddresses;
        this.searchSAddress = searchSAddress;
        this.addAddress = addAddress;
        this.updateAddress = updateAddress;
        this.deleteAddress = deleteAddress;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.search = this.search.bind(this);
    }

    componentDidMount() {
        this.printAddresses();
    }

    printAddresses() {
        this.getAddresses().then(async (addresses) => {
            this.renderAddresses(addresses);
        });
    }

    renderAddresses(addresses) {
        this.list = addresses;
        this.forceUpdate();
    }

    async search(search) {
        const addresses = await this.searchSAddress(search);
        console.log(addresses)
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
        var defaultValueNameCustomer;
        if (address.customer != null)
            defaultValueNameCustomer = await this.getCustomerName(address.customer);
        var defaultValueNameSupplier;
        if (address.supplier != null)
            defaultValueNameSupplier = await this.getSupplierName(address.supplier);
        var defaultValueNameState;
        if (address.state != null)
            defaultValueNameState = await this.getStateName(address.state);
        const defaultValueNameCountry = await this.getCountryName(address.country);

        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressesModal'));
        ReactDOM.render(
            <AddressModal
                address={address}
                findCustomerByName={this.findCustomerByName}
                findSupplierByName={this.findSupplierByName}
                findStateByName={this.findStateByName}
                findCountryByName={this.findCountryByName}
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

                defaultValueNameCustomer={defaultValueNameCustomer}
                defaultValueNameCountry={defaultValueNameCountry}
                defaultValueNameState={defaultValueNameState}
                defaultValueNameSupplier={defaultValueNameSupplier}
            />,
            document.getElementById('renderAddressesModal'));
    }

    render() {
        return <div id="tabAddresses" className="formRowRoot">
            <div id="renderAddressesModal"></div>
            <h1>{i18next.t('addresses')}</h1>
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
                    { field: 'id', headerName: '#', width: 90 },
                    { field: 'contactName', headerName: i18next.t('customer') + "/" + i18next.t('supplier'), width: 500 },
                    { field: 'address', headerName: i18next.t('address'), flex: 1 },
                    { field: 'countryName', headerName: i18next.t('country'), width: 250 },
                    { field: 'stateName', headerName: i18next.t('state'), width: 250 }
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

export default Addresses;
