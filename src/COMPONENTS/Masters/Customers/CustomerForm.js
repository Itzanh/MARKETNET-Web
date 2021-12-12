import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';

import AutocompleteField from '../../AutocompleteField';
import LocateAddress from '../Addresses/LocateAddress';
import AlertModal from '../../AlertModal';
import ConfirmDelete from '../../ConfirmDelete';
import CustomerFormAddresses from './CustomerFormAddresses';
import CustomerFormSaleOrders from './CustomerFormSaleOrders';
import HighlightIcon from '@material-ui/icons/Highlight';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TransactionLogViewModal from '../../VisualComponents/TransactionLogViewModal';



class CustomerForm extends Component {
    constructor({ customer, addCustomer, updateCustomer, deleteCustomer, findLanguagesByName, defaultValueNameLanguage, findCountryByName,
        defaultValueNameCountry, findStateByName, defaultValueNameState, locatePaymentMethods, locateBillingSeries, defaultValueNamePaymentMethod,
        defaultValueNameBillingSerie, tabCustomers, locateAddress, defaultValueNameMainAddress, defaultValueNameShippingAddress,
        defaultValueNameBillingAddress, getCustomerAddresses, getCustomerSaleOrders, locateAccountForCustomer, getRegisterTransactionalLogs,
        getAddressesFunctions, getSalesOrdersFunctions }) {
        super();

        this.customer = customer;
        this.addCustomer = addCustomer;
        this.updateCustomer = updateCustomer;
        this.deleteCustomer = deleteCustomer;
        this.tabCustomers = tabCustomers;
        this.locateAddress = locateAddress;


        this.findLanguagesByName = findLanguagesByName;
        this.defaultValueNameLanguage = defaultValueNameLanguage;
        this.findCountryByName = findCountryByName;
        this.defaultValueNameCountry = defaultValueNameCountry;
        this.findStateByName = findStateByName;
        this.defaultValueNameState = defaultValueNameState;
        this.locatePaymentMethods = locatePaymentMethods;
        this.defaultValueNamePaymentMethod = defaultValueNamePaymentMethod;
        this.locateBillingSeries = locateBillingSeries;
        this.defaultValueNameBillingSerie = defaultValueNameBillingSerie;

        this.defaultValueNameMainAddress = defaultValueNameMainAddress;
        this.defaultValueNameShippingAddress = defaultValueNameShippingAddress;
        this.defaultValueNameBillingAddress = defaultValueNameBillingAddress;
        this.getCustomerAddresses = getCustomerAddresses;
        this.getCustomerSaleOrders = getCustomerSaleOrders;
        this.locateAccountForCustomer = locateAccountForCustomer;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;

        this.getAddressesFunctions = getAddressesFunctions;
        this.getSalesOrdersFunctions = getSalesOrdersFunctions;

        this.currentSelectedLangId = customer != null ? customer.language : "";
        this.currentSelectedStateId = customer != null ? customer.city : "";
        this.currentSelectedCountryId = customer != null ? customer.country : "";
        this.currentSelectedPaymentMethodId = customer != null ? customer.paymentMethod : "";
        this.currentSelectedBillingSerieId = customer != null ? customer.billingSeries : "";
        this.currentSelectedMainAddress = customer != null ? customer.mainAddress : null;
        this.currentSelectedShippingAddress = customer != null ? customer.mainShippingAddress : null;
        this.currentSelectedBillingAddress = customer != null ? customer.mainBillingAddress : null;

        this.tab = 0;

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.findState = this.findState.bind(this);
        this.calcName = this.calcName.bind(this);
        this.locateMainAddr = this.locateMainAddr.bind(this);
        this.locateShippingAddr = this.locateShippingAddr.bind(this);
        this.locateBillingAddr = this.locateBillingAddr.bind(this);
        this.tabAddresses = this.tabAddresses.bind(this);
        this.tabSaleOrders = this.tabSaleOrders.bind(this);
        this.transactionLog = this.transactionLog.bind(this);
    }

    async componentDidMount() {
        await this.renderPaymentMethod();
        await this.renderBilingSeries();
        this.tabs();
        this.renderAccounts().then(() => {
            this.tabAddresses();
        });
    }

    renderPaymentMethod() {
        return new Promise((resolve) => {
            this.locatePaymentMethods().then((paymentMethods) => {
                resolve();
                const components = paymentMethods.map((paymentMethod, i) => {
                    return <option key={i + 1} value={paymentMethod.id}>{paymentMethod.name}</option>
                });
                components.unshift(<option key={0} value="0">.{i18next.t('none')}</option>);
                ReactDOM.render(components, this.refs.renderPaymentMethod);

                this.refs.renderPaymentMethod.value = this.customer != null ? this.customer.paymentMethod : "0";
            });
        });
    }

    renderBilingSeries() {
        return new Promise((resolve) => {
            this.locateBillingSeries().then((series) => {
                resolve();
                const components = series.map((serie, i) => {
                    return <option key={i + 1} value={serie.id}>{serie.name}</option>
                });
                components.unshift(<option key={0} value="">.{i18next.t('none')}</option>);
                ReactDOM.render(components, this.refs.renderBillingSerie);

                this.refs.renderBillingSerie.value = this.currentSelectedBillingSerieId;
            });
        });
    }

    tabs() {
        ReactDOM.render(<AppBar position="static" style={{
            'backgroundColor': '#343a40'
        }}>
            <Tabs value={this.tab} onChange={(_, tab) => {
                this.tab = tab;
                switch (tab) {
                    case 0: {
                        this.tabAddresses();
                        break;
                    }
                    case 1: {
                        this.tabSaleOrders();
                        break;
                    }
                }
            }}>
                <Tab label={i18next.t('addresses')} />
                <Tab label={i18next.t('sales-orders')} />
            </Tabs>
        </AppBar>, this.refs.tabs);
    }

    renderAccounts() {
        return new Promise((resolve) => {
            this.locateAccountForCustomer().then(async (accounts) => {
                resolve();
                const options = accounts.map((element, i) => {
                    return <option key={i} value={element.id}>{element.name}</option>
                });
                options.unshift(<option key={0} value="">.{i18next.t('none')}</option>);

                await ReactDOM.render(options, this.refs.accounts);
                this.refs.accounts.value = this.customer != null ? (this.customer.account != null ? this.customer.account : '') : '';
            });
        });
    }

    getCustomerFromForm() {
        const customer = {};
        customer.name = this.refs.name.value;
        customer.tradename = this.refs.tradename.value;
        customer.fiscalName = this.refs.fiscalName.value;
        customer.taxId = this.refs.taxId.value;
        customer.vatNumber = this.refs.vatNumber.value;
        customer.phone = this.refs.phone.value;
        customer.email = this.refs.email.value;
        customer.country = parseInt(this.currentSelectedCountryId);
        customer.state = parseInt(this.currentSelectedStateId);
        customer.language = parseInt(this.currentSelectedLangId);
        customer.paymentMethod = parseInt(this.currentSelectedPaymentMethodId);
        customer.billingSeries = this.currentSelectedBillingSerieId;
        customer.mainAddress = this.currentSelectedMainAddress;
        customer.mainShippingAddress = this.currentSelectedShippingAddress;
        customer.mainBillingAddress = this.currentSelectedBillingAddress;
        return customer;
    }

    isValid(customer) {
        var errorMessage = "";
        if (customer.name.length === 0) {
            errorMessage = i18next.t('name-0');
            return errorMessage;
        }
        if (customer.name.length > 303) {
            errorMessage = i18next.t('name-303');
            return errorMessage;
        }
        if (customer.tradename.length === 0) {
            errorMessage = i18next.t('tradename-0');
            return errorMessage;
        }
        if (customer.tradename.length > 150) {
            errorMessage = i18next.t('tradename-150');
            return errorMessage;
        }
        if (customer.fiscalName.length === 0) {
            errorMessage = i18next.t('fiscalname-0');
            return errorMessage;
        }
        if (customer.fiscalName.length > 150) {
            errorMessage = i18next.t('fiscalname-150');
            return errorMessage;
        }
        if (customer.taxId.length > 25) {
            errorMessage = i18next.t('taxid-25');
            return errorMessage;
        }
        if (customer.vatNumber.length > 25) {
            errorMessage = i18next.t('vatnumber-25');
            return errorMessage;
        }
        if (customer.phone.length > 25) {
            errorMessage = i18next.t('phone-25');
            return errorMessage;
        }
        if (customer.email.length > 100) {
            errorMessage = i18next.t('email-100');
            return errorMessage;
        }
        return errorMessage;
    }

    add() {
        const customer = this.getCustomerFromForm();
        const errorMessage = this.isValid(customer);
        if (errorMessage !== "") {
            ReactDOM.unmountComponentAtNode(document.getElementById('renderCustomerModal'));
            ReactDOM.render(
                <AlertModal
                    modalTitle={i18next.t('VALIDATION-ERROR')}
                    modalText={errorMessage}
                />,
                document.getElementById('renderCustomerModal'));
            return;
        }

        this.addCustomer(customer).then((res) => {
            if (res.id > 0) {
                this.tabCustomers();
            }
        });
    }

    update() {
        const customer = this.getCustomerFromForm();
        const errorMessage = this.isValid(customer);
        if (errorMessage !== "") {
            ReactDOM.unmountComponentAtNode(document.getElementById('renderCustomerModal'));
            ReactDOM.render(
                <AlertModal
                    modalTitle={i18next.t('VALIDATION-ERROR')}
                    modalText={errorMessage}
                />,
                document.getElementById('renderCustomerModal'));
            return;
        }
        customer.id = this.customer.id;

        this.updateCustomer(customer).then((ok) => {
            if (ok) {
                this.tabCustomers();
            }
        });
    }

    delete() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderCustomerModal'));
        ReactDOM.render(
            <ConfirmDelete
                onDelete={() => {
                    const customerId = this.customer.id;
                    this.deleteCustomer(customerId).then((ok) => {
                        if (ok) {
                            this.tabCustomers();
                        }
                    });
                }}
            />,
            document.getElementById('renderCustomerModal'));
    }

    findState(stateName) {
        return this.findStateByName(parseInt(this.currentSelectedCountryId), stateName);
    }

    calcName() {
        const tradeName = this.refs.tradename.value;
        const fiscalName = this.refs.fiscalName.value;
        if (tradeName !== fiscalName && tradeName !== "" && fiscalName !== "") {
            this.refs.name.value = tradeName + " / " + fiscalName;
        } else if (tradeName !== "") {
            this.refs.name.value = tradeName;
        } else if (fiscalName !== "") {
            this.refs.name.value = fiscalName;
        }
    }

    locateMainAddr() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderCustomerModal'));
        ReactDOM.render(
            <LocateAddress
                locateAddress={() => {
                    return this.locateAddress(this.customer.id);
                }}
                handleSelect={(addressId, addressName) => {
                    this.currentSelectedMainAddress = addressId;
                    this.refs.mainAddress.value = addressName;
                }}
            />,
            document.getElementById('renderCustomerModal'));
    }

    transactionLog() {
        if (this.customer == null) {
            return;
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('renderCustomerModal'));
        ReactDOM.render(<TransactionLogViewModal
            getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
            tableName={"customer"}
            registerId={this.customer.id}
        />,
            document.getElementById('renderCustomerModal'));
    }

    locateShippingAddr() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderCustomerModal'));
        ReactDOM.render(
            <LocateAddress
                locateAddress={() => {
                    return this.locateAddress(this.customer.id);
                }}
                handleSelect={(addressId, addressName) => {
                    this.currentSelectedShippingAddress = addressId;
                    this.refs.shippingAddress.value = addressName;
                }}
            />,
            document.getElementById('renderCustomerModal'));
    }

    locateBillingAddr() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderCustomerModal'));
        ReactDOM.render(
            <LocateAddress
                locateAddress={() => {
                    return this.locateAddress(this.customer.id);
                }}
                handleSelect={(addressId, addressName) => {
                    this.currentSelectedBillingAddress = addressId;
                    this.refs.billingAddress.value = addressName;
                }}
            />,
            document.getElementById('renderCustomerModal'));
    }

    tabAddresses() {
        this.tab = 0;
        this.tabs();

        ReactDOM.render(<CustomerFormAddresses
            customerId={this.customer == null ? null : this.customer.id}
            getCustomerAddresses={this.getCustomerAddresses}
            getAddressesFunctions={this.getAddressesFunctions}
        />, this.refs.render);
    }

    tabSaleOrders() {
        this.tab = 1;
        this.tabs();

        ReactDOM.render(<CustomerFormSaleOrders
            customerId={this.customer == null ? null : this.customer.id}
            getCustomerSaleOrders={this.getCustomerSaleOrders}
            getSalesOrdersFunctions={this.getSalesOrdersFunctions}
        />, this.refs.render);
    }

    render() {
        return <div id="tabCustomer" className="formRowRoot">
            <div id="renderCustomerModal"></div>
            <h2>{i18next.t('customer')}</h2>
            <div class="form-row">
                <div class="col">
                    <label>{i18next.t('name')}</label>
                    <input type="text" class="form-control" ref="name" defaultValue={this.customer != null ? this.customer.name : ''} />
                    <div class="form-row">
                        <div class="col">
                            <label>{i18next.t('trade-name')}</label>
                            <input type="text" class="form-control" ref="tradename" defaultValue={this.customer != null ? this.customer.tradename : ''}
                                onChange={this.calcName} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('fiscal-name')}</label>
                            <input type="text" class="form-control" ref="fiscalName" defaultValue={this.customer != null ? this.customer.fiscalName : ''}
                                onChange={this.calcName} />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col">
                            <label>{i18next.t('tax-id')}</label>
                            <input type="text" class="form-control" ref="taxId" defaultValue={this.customer != null ? this.customer.taxId : ''} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('vat-number')}</label>
                            <input type="text" class="form-control" ref="vatNumber" defaultValue={this.customer != null ? this.customer.vatNumber : ''} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('date-created')}</label>
                            <input type="text" class="form-control"
                                defaultValue={this.customer != null ? window.dateFormat(this.customer.dateCreated) : ''} readOnly={true} />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col">
                            <label>{i18next.t('phone')}</label>
                            <input type="text" class="form-control" ref="phone" defaultValue={this.customer != null ? this.customer.phone : ''} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('email')}</label>
                            <input type="text" class="form-control" ref="email" defaultValue={this.customer != null ? this.customer.email : ''} />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col">
                            <label>{i18next.t('billing-series')}</label>
                            <select class="form-control" ref="renderBillingSerie" onChange={() => {
                                this.currentSelectedBillingSerieId = this.refs.renderBillingSerie.value == "" ? null : this.refs.renderBillingSerie.value;
                            }}>

                            </select>
                        </div>
                        <div class="col">
                            <label>{i18next.t('account')}</label>
                            <select class="form-control" ref="accounts" >
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <label>{i18next.t('main-address')}</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateMainAddr}
                                disabled={this.customer == null}><HighlightIcon /></button>
                        </div>
                        <input type="text" class="form-control" ref="mainAddress" defaultValue={this.defaultValueNameMainAddress} readOnly={true} />
                    </div>
                    <div class="form-row">
                        <div class="col">
                            <label>{i18next.t('country')}</label>
                            <AutocompleteField findByName={this.findCountryByName} defaultValueId={this.customer != null ? this.customer.country : null}
                                defaultValueName={this.defaultValueNameCountry} valueChanged={(value) => {
                                    this.currentSelectedCountryId = value;
                                }} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('state')}</label>
                            <AutocompleteField findByName={this.findState} defaultValueId={this.customer != null ? this.customer.state : null}
                                defaultValueName={this.defaultValueNameState} valueChanged={(value) => {
                                    this.currentSelectedStateId = value;
                                }} />
                        </div>
                    </div>
                    <label>{i18next.t('main-shipping-address')}</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateShippingAddr}
                                disabled={this.customer == null}><HighlightIcon /></button>
                        </div>
                        <input type="text" class="form-control" ref="shippingAddress" defaultValue={this.defaultValueNameShippingAddress} readOnly={true} />
                    </div>
                    <label>{i18next.t('main-billing-address')}</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateBillingAddr}
                                disabled={this.customer == null}><HighlightIcon /></button>
                        </div>
                        <input type="text" class="form-control" ref="billingAddress" defaultValue={this.defaultValueNameBillingAddress} readOnly={true} />
                    </div>
                    <div class="form-row">
                        <div class="col">
                            <label>{i18next.t('language')}</label>
                            <AutocompleteField findByName={this.findLanguagesByName} defaultValueId={this.country != null ? this.country.language : null}
                                defaultValueName={this.defaultValueNameLanguage} valueChanged={(value) => {
                                    this.currentSelectedLangId = value;
                                }} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('payment-method')}</label>
                            <select class="form-control" ref="renderPaymentMethod" onChange={() => {
                                this.currentSelectedPaymentMethodId = this.refs.renderPaymentMethod.value == "0" ? null : this.refs.renderPaymentMethod.value;
                            }}>

                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div ref="tabs" className="mt-2 mb-2"></div>

            <div ref="render"></div>

            <div id="buttomBottomFormContainter">
                <div id="buttomBottomForm" className="mt-1">
                    <div class="btn-group dropup">
                        <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {i18next.t('options')}
                        </button>
                        <div class="dropdown-menu">
                            {this.customer != null ? <a class="dropdown-item" href="#" onClick={this.transactionLog}>{i18next.t('transactional-log')}</a> : null}
                        </div>
                    </div>

                    {this.customer != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                    {this.customer != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
                    {this.customer == null ? < button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                    <button type="button" class="btn btn-secondary" onClick={this.tabCustomers}>{i18next.t('cancel')}</button>
                </div>
            </div>
        </div>
    }
}

export default CustomerForm;
