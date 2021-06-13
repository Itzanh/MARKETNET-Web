import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import AddressModal from './AddressModal';


class Addresses extends Component {
    constructor({ findCustomerByName, getCustomerName, findStateByName, getStateName, findCountryByName, getCountryName,
        getAddresses, addAddress, updateAddress, deleteAddress, findSupplierByName, getSupplierName }) {
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
        this.addAddress = addAddress;
        this.updateAddress = updateAddress;
        this.deleteAddress = deleteAddress;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderAddresses();
    }

    renderAddresses() {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        this.getAddresses().then(async (addresses) => {
            await ReactDOM.render(addresses.map((element, i) => {
                element.customerName = "...";
                element.supplierName = "...";
                element.stateName = "...";
                element.countryName = "...";
                return <Address key={i}
                    address={element}
                    edit={this.edit}
                />
            }), this.refs.render);

            for (let i = 0; i < addresses.length; i++) {
                if (addresses[i].customer !== null) {
                    addresses[i].customerName = await this.getCustomerName(addresses[i].customer);
                } else {
                    addresses[i].customerName = "";
                }
                if (addresses[i].supplier !== null) {
                    addresses[i].supplierName = await this.getSupplierName(addresses[i].supplier);
                } else {
                    addresses[i].supplierName = "";
                }
                if (addresses[i].state !== null) {
                    addresses[i].stateName = await this.getStateName(addresses[i].state);
                } else {
                    addresses[i].stateName = "";
                }
                addresses[i].countryName = await this.getCountryName(addresses[i].country);
            }

            ReactDOM.render(addresses.map((element, i) => {
                return <Address key={i}
                    address={element}
                    edit={this.edit}
                />
            }), this.refs.render);
        });
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
                            this.renderAddresses();
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
                            this.renderAddresses();
                        }
                    });
                    return promise;
                }}
                deleteAddress={(addres) => {
                    const promise = this.deleteAddress(addres);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderAddresses();
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
        return <div id="tabAddresses">
            <div id="renderAddressesModal"></div>
            <h1>Addresses</h1>
            <button type="button" class="btn btn-primary" onClick={this.add}>Add</button>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Customer / Supplier</th>
                        <th scope="col">Address</th>
                        <th scope="col">Country</th>
                        <th scope="col">State</th>
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
            <td>{this.address.customer != null ? this.address.customerName : this.address.supplierName}</td>
            <td>{this.address.address}</td>
            <td>{this.address.countryName}</td>
            <td>{this.address.stateName}</td>
        </tr>
    }
}

export default Addresses;
