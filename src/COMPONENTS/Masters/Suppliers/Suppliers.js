import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';

import SupplierForm from './SupplierForm';
import SearchField from '../../SearchField';


class Suppliers extends Component {
    constructor({ getSuppliers, searchSuppliers, addSupplier, updateSupplier, deleteSupplier, tabSuppliers, getCountryName, findLanguagesByName,
        findCountryByName, findStateByName, findPaymentMethodByName, findBillingSerieByName, getNameLanguage, getStateName, getNamePaymentMethod,
        getNameBillingSerie, locateAddress, getNameAddress }) {
        super();

        this.getSuppliers = getSuppliers;
        this.searchSuppliers = searchSuppliers;
        this.addSupplier = addSupplier;
        this.updateSupplier = updateSupplier;
        this.deleteSupplier = deleteSupplier;
        this.tabSuppliers = tabSuppliers;

        this.getCountryName = getCountryName;

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

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.search = this.search.bind(this);
    }

    componentDidMount() {
        this.getSuppliers().then((suppliers) => {
            this.renderSuppliers(suppliers);
        });
    }

    async search(searchText) {
        const suppliers = await this.searchSuppliers(searchText);
        this.renderSuppliers(suppliers);
    }

    async renderSuppliers(suppliers) {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        await ReactDOM.render(suppliers.map((element, i) => {

            return <Supplier key={i}
                supplier={element}
                edit={this.edit}
            />
        }), this.refs.render);
        
        ReactDOM.render(suppliers.map((element, i) => {
            return <Supplier key={i}
                supplier={element}
                edit={this.edit}
            />
        }), this.refs.render);
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <SupplierForm
                addSupplier={this.addSupplier}
                tabSuppliers={this.tabSuppliers}

                findLanguagesByName={this.findLanguagesByName}
                findCountryByName={this.findCountryByName}
                findStateByName={this.findStateByName}
                findPaymentMethodByName={this.findPaymentMethodByName}
                findBillingSerieByName={this.findBillingSerieByName}
            />,
            document.getElementById('renderTab'));
    }

    async edit(supplier) {
        var defaultValueNameLanguage;
        var defaultValueNameCountry;
        var defaultValueNameState;
        var defaultValueNamePaymentMethod;
        var defaultValueNameBillingSerie;
        var defaultValueNameMainAddress;
        var defaultValueNameShippingAddress;
        var defaultValueNameBillingAddress;
        if (supplier.language != null)
            defaultValueNameLanguage = await this.getNameLanguage(supplier.language);
        if (supplier.country != null)
            defaultValueNameCountry = await this.getCountryName(supplier.country);
        if (supplier.state != null)
            defaultValueNameState = await this.getStateName(supplier.state);
        if (supplier.paymentMethod != null)
            defaultValueNamePaymentMethod = await this.getNamePaymentMethod(supplier.paymentMethod);
        if (supplier.billingSeries != null)
            defaultValueNameBillingSerie = await this.getNameBillingSerie(supplier.billingSeries);
        if (supplier.mainAddress != null)
            defaultValueNameMainAddress = await this.getNameAddress(supplier.mainAddress);
        if (supplier.mainShippingAddress != null)
            defaultValueNameShippingAddress = await this.getNameAddress(supplier.mainShippingAddress);
        if (supplier.mainBillingAddress != null)
            defaultValueNameBillingAddress = await this.getNameAddress(supplier.mainBillingAddress);

        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <SupplierForm
                supplier={supplier}
                tabSuppliers={this.tabSuppliers}
                updateSupplier={this.updateSupplier}
                deleteSupplier={this.deleteSupplier}

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
            />,
            document.getElementById('renderTab'));
    }

    render() {
        return <div id="tabSuppliers" className="formRowRoot menu">
            <h1>{i18next.t('suppliers')}</h1>
            <div class="form-row">
                <div class="col">
                    <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button>
                </div>
                <div class="col">
                    <SearchField handleSearch={this.search} hasAdvancedSearch={false} />
                </div>
            </div>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">{i18next.t('name')}</th>
                        <th scope="col">{i18next.t('tax-id')}</th>
                        <th scope="col">{i18next.t('phone')}</th>
                        <th scope="col">{i18next.t('email')}</th>
                        <th scope="col">{i18next.t('country')}</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class Supplier extends Component {
    constructor({ supplier, edit }) {
        super();

        this.supplier = supplier;
        this.edit = edit;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.supplier);
        }}>
            <th scope="row">{this.supplier.id}</th>
            <td>{this.supplier.name}</td>
            <td>{this.supplier.taxId}</td>
            <td>{this.supplier.Phone}</td>
            <td>{this.supplier.email}</td>
            <td>{this.supplier.countryName}</td>
        </tr>
    }
}

export default Suppliers;
