import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import CustomerForm from './CustomerForm';
import SearchField from '../../SearchField';


class Customers extends Component {
    constructor({ getCustomers, searchCustomers, addCustomer, updateCustomer, deleteCustomer, tabCustomers, getCountryName, findLanguagesByName, findCountryByName,
        findStateByName, findPaymentMethodByName, findBillingSerieByName, getNameLanguage, getStateName, getNamePaymentMethod, getNameBillingSerie, locateAddress,
        getNameAddress, getCustomerAddresses, getCustomerSaleOrders, locateAccountForCustomer }) {
        super();

        this.getCustomers = getCustomers;
        this.searchCustomers = searchCustomers;
        this.addCustomer = addCustomer;
        this.updateCustomer = updateCustomer;
        this.deleteCustomer = deleteCustomer;
        this.tabCustomers = tabCustomers;

        this.getCountryName = getCountryName;
        this.list = [];

        this.findLanguagesByName = findLanguagesByName;
        this.findCountryByName = findCountryByName;
        this.findStateByName = findStateByName;
        this.findPaymentMethodByName = findPaymentMethodByName;
        this.findBillingSerieByName = findBillingSerieByName;
        this.getNameLanguage = getNameLanguage;
        this.getStateName = getStateName;
        this.getNamePaymentMethod = getNamePaymentMethod;
        this.getNameBillingSerie = getNameBillingSerie;

        this.locateAddress = locateAddress;
        this.getNameAddress = getNameAddress;
        this.getCustomerAddresses = getCustomerAddresses;
        this.getCustomerSaleOrders = getCustomerSaleOrders;
        this.locateAccountForCustomer = locateAccountForCustomer;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.search = this.search.bind(this);
    }

    async componentDidMount() {
        const customers = await this.getCustomers();
        this.renderCustomers(customers);
    }

    async search(search) {
        const customers = await this.searchCustomers(search);
        this.renderCustomers(customers);
    }

    async renderCustomers(customers) {
        this.list = customers;
        this.forceUpdate();

    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <CustomerForm
                addCustomer={this.addCustomer}
                tabCustomers={this.tabCustomers}

                findLanguagesByName={this.findLanguagesByName}
                findCountryByName={this.findCountryByName}
                findStateByName={this.findStateByName}
                findPaymentMethodByName={this.findPaymentMethodByName}
                findBillingSerieByName={this.findBillingSerieByName}
                locateAccountForCustomer={this.locateAccountForCustomer}
            />,
            document.getElementById('renderTab'));
    }

    async edit(customer) {
        var defaultValueNameLanguage;
        var defaultValueNameCountry;
        var defaultValueNameState;
        var defaultValueNamePaymentMethod;
        var defaultValueNameBillingSerie;
        var defaultValueNameMainAddress;
        var defaultValueNameShippingAddress;
        var defaultValueNameBillingAddress;
        if (customer.language != null)
            defaultValueNameLanguage = await this.getNameLanguage(customer.language);
        if (customer.country != null)
            defaultValueNameCountry = await this.getCountryName(customer.country);
        if (customer.state != null)
            defaultValueNameState = await this.getStateName(customer.state);
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
                findStateByName={this.findStateByName}
                findPaymentMethodByName={this.findPaymentMethodByName}
                findBillingSerieByName={this.findBillingSerieByName}

                defaultValueNameLanguage={defaultValueNameLanguage}
                defaultValueNameCountry={defaultValueNameCountry}
                defaultValueNameState={defaultValueNameState}
                defaultValueNamePaymentMethod={defaultValueNamePaymentMethod}
                defaultValueNameBillingSerie={defaultValueNameBillingSerie}
                defaultValueNameMainAddress={defaultValueNameMainAddress}
                defaultValueNameShippingAddress={defaultValueNameShippingAddress}
                defaultValueNameBillingAddress={defaultValueNameBillingAddress}

                locateAddress={this.locateAddress}
                getCustomerAddresses={this.getCustomerAddresses}
                getCustomerSaleOrders={this.getCustomerSaleOrders}
                locateAccountForCustomer={this.locateAccountForCustomer}
            />,
            document.getElementById('renderTab'));
    }

    render() {
        return <div id="tabCustomers" className="formRowRoot">
            <h1>{i18next.t('customers')}</h1>
            <div class="form-row">
                <div class="col">
                    <button type="button" class="btn btn-primary ml-2" onClick={this.add}>{i18next.t('add')}</button>
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
                    { field: 'name', headerName: i18next.t('name'), flex: 1 },
                    { field: 'taxId', headerName: i18next.t('tax-id'), width: 150 },
                    { field: 'phone', headerName: i18next.t('phone'), width: 150 },
                    { field: 'email', headerName: i18next.t('email'), width: 250 },
                    { field: 'countryName', headerName: i18next.t('country'), width: 200 }
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

export default Customers;
