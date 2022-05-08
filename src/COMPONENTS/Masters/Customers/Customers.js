import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import CustomerForm from './CustomerForm';
import SearchField from '../../SearchField';


class Customers extends Component {
    constructor({ getCustomers, searchCustomers, addCustomer, updateCustomer, deleteCustomer, tabCustomers, findLanguagesByName,
        findCountryByName, findStateByName, locatePaymentMethods, locateBillingSeries,
        locateAddress, getCustomerAddresses, getCustomerSaleOrders, locateAccountForCustomer, getRegisterTransactionalLogs,
        checkVatNumber, getAddressesFunctions, getSalesOrdersFunctions, getCustomFieldsFunctions }) {
        super();

        this.getCustomers = getCustomers;
        this.searchCustomers = searchCustomers;
        this.addCustomer = addCustomer;
        this.updateCustomer = updateCustomer;
        this.deleteCustomer = deleteCustomer;
        this.tabCustomers = tabCustomers;

        this.list = [];
        this.loading = true;
        this.rows = 0;
        this.searchText = "";
        this.offset = 0;
        this.limit = 100;

        const savedSearch = window.getSavedSearches("customers");
        // initialize the datagrid
        if (savedSearch != null && savedSearch.offset != null && savedSearch.limit != null) {
            this.offset = savedSearch.offset;
            this.limit = savedSearch.limit;
        }

        this.findLanguagesByName = findLanguagesByName;
        this.findCountryByName = findCountryByName;
        this.findStateByName = findStateByName;
        this.locatePaymentMethods = locatePaymentMethods;
        this.locateBillingSeries = locateBillingSeries;

        this.locateAddress = locateAddress;
        this.getCustomerAddresses = getCustomerAddresses;
        this.getCustomerSaleOrders = getCustomerSaleOrders;
        this.locateAccountForCustomer = locateAccountForCustomer;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;
        this.checkVatNumber = checkVatNumber;

        this.getAddressesFunctions = getAddressesFunctions;
        this.getSalesOrdersFunctions = getSalesOrdersFunctions;
        this.getCustomFieldsFunctions = getCustomFieldsFunctions;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.search = this.search.bind(this);
    }

    async componentDidMount() {
        const savedSearch = window.getSavedSearches("customers");

        // the user goes back to the second, third, etc. page
        var offset = this.offset;
        if (savedSearch != null && savedSearch.offset != null && savedSearch.limit != null) {
            offset = savedSearch.offset;
        }
        if (offset > 0) {
            this.limit = this.offset + this.limit;
            this.offset = 0;
        }

        if (savedSearch != null && savedSearch.search != "") {
            this.search(savedSearch.search).then(() => {
                if (savedSearch.scroll != null) {
                    setTimeout(() => {
                        window.scrollTo(savedSearch.scroll[0], savedSearch.scroll[1]);
                    }, 100);
                }
            });
        } else {
            const customers = await this.getCustomers({
                offset: this.offset,
                limit: this.limit
            });
            this.renderCustomers(customers);
        }

        // the user goes back to the second, third, etc. page
        if (savedSearch != null && savedSearch.offset != null && savedSearch.limit != null) {
            this.offset = savedSearch.offset;
            this.limit = savedSearch.limit;
        }
    }

    async search(search) {
        return new Promise(async (resolve) => {
            var savedSearch = window.getSavedSearches("customers");
            if (savedSearch == null) {
                savedSearch = {};
            }
            savedSearch.search = search;
            window.addSavedSearches("customers", savedSearch);

            this.searchText = search;
            const customers = await this.searchCustomers({
                search,
                offset: this.offset,
                limit: this.limit
            });
            this.renderCustomers(customers);
            resolve();
        });
    }

    componentWillUnmount() {
        var savedSearch = window.getSavedSearches("customers");
        if (savedSearch == null) {
            savedSearch = {};
        }
        savedSearch.scroll = document.getScroll();
        savedSearch.offset = this.offset;
        savedSearch.limit = this.limit;
        window.addSavedSearches("customers", savedSearch);
    }

    renderCustomers(customers) {
        console.log(customers);
        this.loading = false;
        this.rows = customers.rows;
        if (this.offset > 0) {
            this.list = this.list.concat(customers.customers);
        } else {
            this.list = customers.customers;
        }
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
                locatePaymentMethods={this.locatePaymentMethods}
                locateBillingSeries={this.locateBillingSeries}
                locateAccountForCustomer={this.locateAccountForCustomer}
                getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
                checkVatNumber={this.checkVatNumber}
            />,
            document.getElementById('renderTab'));
    }

    async edit(customer) {
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
                locatePaymentMethods={this.locatePaymentMethods}
                locateBillingSeries={this.locateBillingSeries}
                getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}

                locateAddress={this.locateAddress}
                getCustomerAddresses={this.getCustomerAddresses}
                getCustomerSaleOrders={this.getCustomerSaleOrders}
                locateAccountForCustomer={this.locateAccountForCustomer}
                checkVatNumber={this.checkVatNumber}
                getAddressesFunctions={this.getAddressesFunctions}
                getSalesOrdersFunctions={this.getSalesOrdersFunctions}
                getCustomFieldsFunctions={this.getCustomFieldsFunctions}
            />,
            document.getElementById('renderTab'));
    }

    render() {
        return <div id="tabCustomers" className="formRowRoot">
            <h4 className="ml-2">{i18next.t('customers')}</h4>
            <div class="form-row">
                <div class="col">
                    <button type="button" class="btn btn-primary ml-2" onClick={this.add}>{i18next.t('add')}</button>
                </div>
                <div class="col">
                    <SearchField handleSearch={this.search}
                        defaultSearchValue={window.savedSearches["customers"] != null ? window.savedSearches["customers"].search : ""} />
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
                    {
                        field: 'countryName', headerName: i18next.t('country'), width: 200, valueGetter: (params) => {
                            return params.row.country != null ? params.row.country.name : '';
                        }
                    }
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
                loading={this.loading}
                page={this.offset / this.limit}
                pageSize={this.limit}
                onPageChange={(data) => {
                    this.offset = data * this.limit;
                    this.search(this.searchText);
                }}
                rowCount={this.rows}
            />
        </div>
    }
}

export default Customers;
