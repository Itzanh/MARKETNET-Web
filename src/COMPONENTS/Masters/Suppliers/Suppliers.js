import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import SupplierForm from './SupplierForm';
import SearchField from '../../SearchField';


class Suppliers extends Component {
    constructor({ getSuppliers, searchSuppliers, addSupplier, updateSupplier, deleteSupplier, tabSuppliers, getCountryName, findLanguagesByName,
        findCountryByName, findStateByName, getNameLanguage, getStateName, getNamePaymentMethod, getNameBillingSerie, locatePaymentMethods,
        locateBillingSeries, locateAddress, getNameAddress, locateAccountForSupplier, getSupplierAddresses, getSupplierPurchaseOrders,
        getRegisterTransactionalLogs, checkVatNumber, getAddressesFunctions, getPurchaseOrdersFunctions, getCustomFieldsFunctions }) {
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
        this.getNameLanguage = getNameLanguage;
        this.getStateName = getStateName;
        this.getNamePaymentMethod = getNamePaymentMethod;
        this.getNameBillingSerie = getNameBillingSerie;
        this.locatePaymentMethods = locatePaymentMethods;
        this.locateBillingSeries = locateBillingSeries;

        this.locateAddress = locateAddress;
        this.getNameAddress = getNameAddress;
        this.locateAccountForSupplier = locateAccountForSupplier;
        this.getSupplierAddresses = getSupplierAddresses;
        this.getSupplierPurchaseOrders = getSupplierPurchaseOrders;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;
        this.checkVatNumber = checkVatNumber;

        this.getAddressesFunctions = getAddressesFunctions;
        this.getPurchaseOrdersFunctions = getPurchaseOrdersFunctions;
        this.getCustomFieldsFunctions = getCustomFieldsFunctions;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.search = this.search.bind(this);
    }

    componentDidMount() {
        const savedSearch = window.getSavedSearches("suppliers");
        if (savedSearch != null && savedSearch.search != "") {
            this.search(savedSearch.search).then(() => {
                if (savedSearch.scroll != null) {
                    setTimeout(() => {
                        window.scrollTo(savedSearch.scroll[0], savedSearch.scroll[1]);
                    }, 100);
                }
            });
        } else {
            this.getSuppliers().then((suppliers) => {
                this.renderSuppliers(suppliers);
                if (savedSearch != null && savedSearch.scroll != null) {
                    setTimeout(() => {
                        window.scrollTo(savedSearch.scroll[0], savedSearch.scroll[1]);
                    }, 100);
                }
            });
        }
    }

    search(searchText) {
        return new Promise(async (resolve) => {
            var savedSearch = window.getSavedSearches("suppliers");
            if (savedSearch == null) {
                savedSearch = {};
            }
            savedSearch.search = searchText;
            window.addSavedSearches("suppliers", savedSearch);

            const suppliers = await this.searchSuppliers(searchText);
            this.renderSuppliers(suppliers);
            resolve();
        });
    }

    componentWillUnmount() {
        var savedSearch = window.getSavedSearches("suppliers");
        if (savedSearch == null) {
            savedSearch = {};
        }
        savedSearch.scroll = document.getScroll();
        window.addSavedSearches("suppliers", savedSearch);
    }

    renderSuppliers(suppliers) {
        this.list = suppliers;
        this.forceUpdate();
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
                locatePaymentMethods={this.locatePaymentMethods}
                locateBillingSeries={this.locateBillingSeries}
                locateAccountForSupplier={this.locateAccountForSupplier}
                getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
                checkVatNumber={this.checkVatNumber}
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
                locatePaymentMethods={this.locatePaymentMethods}
                locateBillingSeries={this.locateBillingSeries}
                getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}

                defaultValueNameLanguage={defaultValueNameLanguage}
                defaultValueNameCountry={defaultValueNameCountry}
                defaultValueNameState={defaultValueNameState}
                defaultValueNamePaymentMethod={defaultValueNamePaymentMethod}
                defaultValueNameBillingSerie={defaultValueNameBillingSerie}
                defaultValueNameMainAddress={defaultValueNameMainAddress}
                defaultValueNameShippingAddress={defaultValueNameShippingAddress}
                defaultValueNameBillingAddress={defaultValueNameBillingAddress}

                locateAddress={this.locateAddress}
                locateAccountForSupplier={this.locateAccountForSupplier}
                getSupplierAddresses={this.getSupplierAddresses}
                getSupplierPurchaseOrders={this.getSupplierPurchaseOrders}
                checkVatNumber={this.checkVatNumber}

                getAddressesFunctions={this.getAddressesFunctions}
                getPurchaseOrdersFunctions={this.getPurchaseOrdersFunctions}
                getCustomFieldsFunctions={this.getCustomFieldsFunctions}
            />,
            document.getElementById('renderTab'));
    }

    render() {
        return <div id="tabSuppliers" className="formRowRoot">
            <h4 className="ml-2">{i18next.t('suppliers')}</h4>
            <div class="form-row">
                <div class="col">
                    <button type="button" class="btn btn-primary ml-2" onClick={this.add}>{i18next.t('add')}</button>
                </div>
                <div class="col">
                    <SearchField handleSearch={this.search} hasAdvancedSearch={false}
                        defaultSearchValue={window.savedSearches["suppliers"] != null ? window.savedSearches["suppliers"].search : ""} />
                </div>
            </div>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
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

export default Suppliers;
