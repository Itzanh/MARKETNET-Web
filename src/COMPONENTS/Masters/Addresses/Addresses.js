import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import AddressModal from './AddressModal';


class Addresses extends Component {
    constructor({ findCustomerByName, getCustomerName, findCityByName, getCityName, findCountryByName, getCountryName,
        getAddresses, addAddress, updateAddress, deleteAddress, findSupplierByName, getSupplierName }) {
        super();

        this.findCustomerByName = findCustomerByName;
        this.getCustomerName = getCustomerName;
        this.findCityByName = findCityByName;
        this.getCityName = getCityName;
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
        this.getAddresses().then(async (addresses) => {
            await ReactDOM.render(addresses.map((element, i) => {
                element.customerName = "...";
                element.supplierName = "...";
                element.cityName = "...";
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
                addresses[i].cityName = await this.getCityName(addresses[i].city);
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
                findCityByName={this.findCityByName}
                findCountryByName={this.findCountryByName}
                addAddress={this.addAddress}
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
        const defaultValueNameCountry = await this.getCountryName(address.country);
        const defaultValueNameCity = await this.getCityName(address.city);

        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressesModal'));
        ReactDOM.render(
            <AddressModal
                address={address}
                findCustomerByName={this.findCustomerByName}
                findSupplierByName={this.findSupplierByName}
                findCityByName={this.findCityByName}
                findCountryByName={this.findCountryByName}
                updateAddress={this.updateAddress}
                deleteAddress={this.deleteAddress}

                defaultValueNameCustomer={defaultValueNameCustomer}
                defaultValueNameCountry={defaultValueNameCountry}
                defaultValueNameCity={defaultValueNameCity}
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
                        <th scope="col">Customer</th>
                        <th scope="col">Address</th>
                        <th scope="col">City</th>
                        <th scope="col">Country</th>
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
            <td>{this.address.cityName}</td>
            <td>{this.address.countryName}</td>
        </tr>
    }
}

export default Addresses;
