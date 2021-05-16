import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import CustomerForm from './CustomerForm';


class Customers extends Component {
    constructor({ getCustomers, addCustomer, updateCustomer, deleteCustomer, tabCustomers, getCountryName, findLanguagesByName, findCountryByName, findCityByName,
        findPaymentMethodByName, findBillingSerieByName, getNameLanguage, getCityName, getNamePaymentMethod, getNameBillingSerie, locateAddress, getNameAddress }) {
        super();

        this.getCustomers = getCustomers;
        this.addCustomer = addCustomer;
        this.updateCustomer = updateCustomer;
        this.deleteCustomer = deleteCustomer;
        this.tabCustomers = tabCustomers;

        this.getCountryName = getCountryName;

        this.findLanguagesByName = findLanguagesByName;
        this.findCountryByName = findCountryByName;
        this.findCityByName = findCityByName;
        this.findPaymentMethodByName = findPaymentMethodByName;
        this.findBillingSerieByName = findBillingSerieByName;
        this.getNameLanguage = getNameLanguage;
        this.getCityName = getCityName;
        this.getNamePaymentMethod = getNamePaymentMethod;
        this.getNameBillingSerie = getNameBillingSerie;

        this.locateAddress = locateAddress;
        this.getNameAddress = getNameAddress;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.getCustomers().then(async (customers) => {
            console.log(customers)
            await ReactDOM.render(customers.map((element, i) => {
                element.countryName = "...";
                return <Customer key={i}
                    customer={element}
                    edit={this.edit}
                />
            }), this.refs.render);

            for (let i = 0; i < customers.length; i++) {
                if (customers[i].country != null) {
                    customers[i].countryName = await this.getCountryName(customers[i].country);
                } else {
                    customers[i].countryName = "";
                }
            }

            ReactDOM.render(customers.map((element, i) => {
                return <Customer key={i}
                    customer={element}
                    edit={this.edit}
                />
            }), this.refs.render);
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <CustomerForm
                addCustomer={this.addCustomer}
                tabCustomers={this.tabCustomers}

                findLanguagesByName={this.findLanguagesByName}
                findCountryByName={this.findCountryByName}
                findCityByName={this.findCityByName}
                findPaymentMethodByName={this.findPaymentMethodByName}
                findBillingSerieByName={this.findBillingSerieByName}
            />,
            document.getElementById('renderTab'));
    }

    async edit(customer) {
        var defaultValueNameLanguage;
        var defaultValueNameCountry;
        var defaultValueNameCity;
        var defaultValueNamePaymentMethod;
        var defaultValueNameBillingSerie;
        var defaultValueNameMainAddress;
        var defaultValueNameShippingAddress;
        var defaultValueNameBillingAddress;
        if (customer.language != null)
            defaultValueNameLanguage = await this.getNameLanguage(customer.language);
        if (customer.country != null)
            defaultValueNameCountry = await this.getCountryName(customer.country);
        if (customer.city != null)
            defaultValueNameCity = await this.getCityName(customer.city);
        if (customer.paymentMethod != null)
            defaultValueNamePaymentMethod = await this.getNamePaymentMethod(customer.paymentMethod);
        if (customer.billingSeries != null)
            defaultValueNameBillingSerie = await this.getNameBillingSerie(customer.billingSeries);
        if (customer.mainAddress != null)
            defaultValueNameMainAddress = await this.getNameAddress(customer.mainAddress);
        if (customer.mainShippingAddress != null)
            defaultValueNameShippingAddress = await this.getNameAddress(customer.mainShippingAddress);
        if (customer.mainBillingAddress != null)
            defaultValueNameBillingAddress = await this.getNameAddress(customer.mainBillingAddress);

        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <CustomerForm
                customer={customer}
                tabCustomers={this.tabCustomers}
                updateCustomer={this.updateCustomer}
                deleteCustomer={this.deleteCustomer}

                findLanguagesByName={this.findLanguagesByName}
                findCountryByName={this.findCountryByName}
                findCityByName={this.findCityByName}
                findPaymentMethodByName={this.findPaymentMethodByName}
                findBillingSerieByName={this.findBillingSerieByName}

                defaultValueNameLanguage={defaultValueNameLanguage}
                defaultValueNameCountry={defaultValueNameCountry}
                defaultValueNameCity={defaultValueNameCity}
                defaultValueNamePaymentMethod={defaultValueNamePaymentMethod}
                defaultValueNameBillingSerie={defaultValueNameBillingSerie}
                defaultValueNameMainAddress={defaultValueNameMainAddress}
                defaultValueNameShippingAddress={defaultValueNameShippingAddress}
                defaultValueNameBillingAddress={defaultValueNameBillingAddress}

                locateAddress={this.locateAddress}
            />,
            document.getElementById('renderTab'));
    }

    render() {
        return <div id="tabCustomers">
            <div id="renderCustomersModal"></div>
            <h1>Customers</h1>
            <button type="button" class="btn btn-primary" onClick={this.add}>Add</button>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Tax ID</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Email</th>
                        <th scope="col">Country</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class Customer extends Component {
    constructor({ customer, edit }) {
        super();

        this.customer = customer;
        this.edit = edit;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.customer);
        }}>
            <th scope="row">{this.customer.id}</th>
            <td>{this.customer.name}</td>
            <td>{this.customer.taxId}</td>
            <td>{this.customer.Phone}</td>
            <td>{this.customer.email}</td>
            <td>{this.customer.countryName}</td>
        </tr>
    }
}

export default Customers;
