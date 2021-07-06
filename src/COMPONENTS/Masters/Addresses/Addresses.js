import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';

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

    async renderAddresses(addresses) {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        await ReactDOM.render(addresses.map((element, i) => {
            return <Address key={i}
                address={element}
                edit={this.edit}
            />
        }), this.refs.render);

        ReactDOM.render(addresses.map((element, i) => {
            return <Address key={i}
                address={element}
                edit={this.edit}
            />
        }), this.refs.render);
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
            <div className="menu">
                <h1>{i18next.t('addresses')}</h1>
                <div class="form-row">
                    <div class="col">
                        <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button>
                    </div>
                    <div class="col">
                        <SearchField handleSearch={this.search} />
                    </div>
                </div>
            </div>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">{i18next.t('customer')} / {i18next.t('supplier')}</th>
                        <th scope="col">{i18next.t('address')}</th>
                        <th scope="col">{i18next.t('country')}</th>
                        <th scope="col">{i18next.t('state')}</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class Address extends Component {
    constructor({ address, edit }) {
        super();

        this.address = address;
        this.edit = edit;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.address);
        }}>
            <th scope="row">{this.address.id}</th>
            <td>{this.address.contactName}</td>
            <td>{this.address.address}</td>
            <td>{this.address.countryName}</td>
            <td>{this.address.stateName}</td>
        </tr>
    }
}

export default Addresses;
