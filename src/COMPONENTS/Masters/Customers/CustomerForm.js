import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';

import AutocompleteField from '../../AutocompleteField';
import LocateAddress from '../Addresses/LocateAddress';
import AlertModal from '../../AlertModal';
import ConfirmDelete from '../../ConfirmDelete';
import CustomerFormAddresses from './CustomerFormAddresses';
import CustomerFormSaleOrders from './CustomerFormSaleOrders';

class CustomerForm extends Component {
    constructor({ customer, addCustomer, updateCustomer, deleteCustomer, findLanguagesByName, defaultValueNameLanguage, findCountryByName, defaultValueNameCountry,
        findStateByName, defaultValueNameState, findPaymentMethodByName, findBillingSerieByName, defaultValueNamePaymentMethod, defaultValueNameBillingSerie,
        tabCustomers, locateAddress, defaultValueNameMainAddress, defaultValueNameShippingAddress, defaultValueNameBillingAddress, getCustomerAddresses, getCustomerSaleOrders }) {
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
        this.findPaymentMethodByName = findPaymentMethodByName;
        this.defaultValueNamePaymentMethod = defaultValueNamePaymentMethod;
        this.findBillingSerieByName = findBillingSerieByName;
        this.defaultValueNameBillingSerie = defaultValueNameBillingSerie;

        this.defaultValueNameMainAddress = defaultValueNameMainAddress;
        this.defaultValueNameShippingAddress = defaultValueNameShippingAddress;
        this.defaultValueNameBillingAddress = defaultValueNameBillingAddress;
        this.getCustomerAddresses = getCustomerAddresses;
        this.getCustomerSaleOrders = getCustomerSaleOrders;

        this.currentSelectedLangId = customer != null ? customer.language : "";
        this.currentSelectedStateId = customer != null ? customer.city : "";
        this.currentSelectedCountryId = customer != null ? customer.country : "";
        this.currentSelectedPaymentMethodId = customer != null ? customer.paymentMethod : "";
        this.currentSelectedBillingSerieId = customer != null ? customer.billingSerie : "";
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
    }

    componentDidMount() {
        this.tabs();
        this.tabAddresses();
    }

    tabs() {
        ReactDOM.render(<ul class="nav nav-tabs">
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 0 ? " active" : "")} href="#" onClick={this.tabAddresses}>{i18next.t('addresses')}</a>
            </li>
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 1 ? " active" : "")} href="#" onClick={this.tabSaleOrders}>{i18next.t('sales-orders')}</a>
            </li>
        </ul>, this.refs.tabs);
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

        this.addCustomer(customer).then((ok) => {
            if (ok) {
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
        />, this.refs.render);
    }

    tabSaleOrders() {
        this.tab = 1;
        this.tabs();

        ReactDOM.render(<CustomerFormSaleOrders
            customerId={this.customer == null ? null : this.customer.id}
            getCustomerSaleOrders={this.getCustomerSaleOrders}
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
                    </div>                    <div class="form-row">
                        <div class="col">
                            <label>{i18next.t('billing-series')}</label>
                            <AutocompleteField findByName={this.findBillingSerieByName} defaultValueId={this.country != null ? this.country.billingSerie : null}
                                defaultValueName={this.defaultValueNameBillingSerie} valueChanged={(value) => {
                                    this.currentSelectedBillingSerieId = value;
                                }} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('date-created')}</label>
                            <input type="text" class="form-control"
                                defaultValue={this.customer != null ? window.dateFormat(this.customer.dateCreated) : ''} readOnly={true} />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <label>{i18next.t('main-address')}</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateMainAddr} disabled={this.customer == null}>{i18next.t('LOCATE')}</button>
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
                                disabled={this.customer == null}>{i18next.t('LOCATE')}</button>
                        </div>
                        <input type="text" class="form-control" ref="shippingAddress" defaultValue={this.defaultValueNameShippingAddress} readOnly={true} />
                    </div>
                    <label>{i18next.t('main-billing-address')}</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateBillingAddr}
                                disabled={this.customer == null}>{i18next.t('LOCATE')}</button>
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
                            <AutocompleteField findByName={this.findPaymentMethodByName} defaultValueId={this.country != null ? this.country.paymentMethod : null}
                                defaultValueName={this.defaultValueNamePaymentMethod} valueChanged={(value) => {
                                    this.currentSelectedPaymentMethodId = value;
                                }} />
                        </div>
                    </div>
                </div>
            </div>

            <div ref="tabs" className="mt-2 mb-2"></div>

            <div ref="render"></div>

            <div id="buttomBottomFormContainter">
                <div id="buttomBottomForm" className="mt-1">
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
