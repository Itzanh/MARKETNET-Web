import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import AutocompleteField from '../../AutocompleteField';
import LocateAddress from '../Addresses/LocateAddress';
import AlertModal from '../../AlertModal';
import ConfirmDelete from '../../ConfirmDelete';

class CustomerForm extends Component {
    constructor({ customer, addCustomer, updateCustomer, deleteCustomer, findLanguagesByName, defaultValueNameLanguage, findCountryByName, defaultValueNameCountry,
        findStateByName, defaultValueNameState, findPaymentMethodByName, findBillingSerieByName, defaultValueNamePaymentMethod, defaultValueNameBillingSerie,
        tabCustomers, locateAddress, defaultValueNameMainAddress, defaultValueNameShippingAddress, defaultValueNameBillingAddress }) {
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

        this.currentSelectedLangId = customer != null ? customer.language : "";
        this.currentSelectedStateId = customer != null ? customer.city : "";
        this.currentSelectedCountryId = customer != null ? customer.country : "";
        this.currentSelectedPaymentMethodId = customer != null ? customer.paymentMethod : "";
        this.currentSelectedBillingSerieId = customer != null ? customer.billingSerie : "";
        this.currentSelectedMainAddress = customer != null ? customer.mainAddress : null;
        this.currentSelectedShippingAddress = customer != null ? customer.mainShippingAddress : null;
        this.currentSelectedBillingAddress = customer != null ? customer.mainBillingAddress : null;

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.findState = this.findState.bind(this);
        this.calcName = this.calcName.bind(this);
        this.locateMainAddr = this.locateMainAddr.bind(this);
        this.locateShippingAddr = this.locateShippingAddr.bind(this);
        this.locateBillingAddr = this.locateBillingAddr.bind(this);
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
            errorMessage = "The name can't be empty.";
            return errorMessage;
        }
        if (customer.name.length > 303) {
            errorMessage = "The name can't be longer than 303 characters.";
            return errorMessage;
        }
        if (customer.tradename.length === 0) {
            errorMessage = "The trade name can't be empty.";
            return errorMessage;
        }
        if (customer.tradename.length > 150) {
            errorMessage = "The trade name can't be longer than 150 characters.";
            return errorMessage;
        }
        if (customer.fiscalName.length === 0) {
            errorMessage = "The fiscal name can't be empty.";
            return errorMessage;
        }
        if (customer.fiscalName.length > 150) {
            errorMessage = "The fiscal name can't be longer than 150 characters.";
            return errorMessage;
        }
        if (customer.taxId.length > 25) {
            errorMessage = "The tax id can't be longer than 25 characters.";
            return errorMessage;
        }
        if (customer.vatNumber.length > 25) {
            errorMessage = "The VAT number can't be longer than 25 characters.";
            return errorMessage;
        }
        if (customer.phone.length > 25) {
            errorMessage = "The phone number can't be longer than 25 characters.";
            return errorMessage;
        }
        if (customer.email.length > 100) {
            errorMessage = "The email can't be longer than 100 characters.";
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
                    modalTitle={"VALIDATION ERROR"}
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
                    modalTitle={"VALIDATION ERROR"}
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

    render() {
        return <div id="tabCustomer" className="formRowRoot">
            <div id="renderCustomerModal"></div>
            <h2>Customer</h2>
            <div class="form-row">
                <div class="col">
                    <label>Name</label>
                    <input type="text" class="form-control" ref="name" defaultValue={this.customer != null ? this.customer.name : ''} />
                    <div class="form-row">
                        <div class="col">
                            <label>Trade Name</label>
                            <input type="text" class="form-control" ref="tradename" defaultValue={this.customer != null ? this.customer.tradename : ''}
                                onChange={this.calcName} />
                        </div>
                        <div class="col">
                            <label>Fiscal Name</label>
                            <input type="text" class="form-control" ref="fiscalName" defaultValue={this.customer != null ? this.customer.fiscalName : ''}
                                onChange={this.calcName} />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col">
                            <label>Tax ID</label>
                            <input type="text" class="form-control" ref="taxId" defaultValue={this.customer != null ? this.customer.taxId : ''} />
                        </div>
                        <div class="col">
                            <label>VAT Number</label>
                            <input type="text" class="form-control" ref="vatNumber" defaultValue={this.customer != null ? this.customer.vatNumber : ''} />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col">
                            <label>Phone</label>
                            <input type="text" class="form-control" ref="phone" defaultValue={this.customer != null ? this.customer.phone : ''} />
                        </div>
                        <div class="col">
                            <label>Email</label>
                            <input type="text" class="form-control" ref="email" defaultValue={this.customer != null ? this.customer.email : ''} />
                        </div>
                    </div>                    <div class="form-row">
                        <div class="col">
                            <label>Billing series</label>
                            <AutocompleteField findByName={this.findBillingSerieByName} defaultValueId={this.country != null ? this.country.billingSerie : null}
                                defaultValueName={this.defaultValueNameBillingSerie} valueChanged={(value) => {
                                    this.currentSelectedBillingSerieId = value;
                                }} />
                        </div>
                        <div class="col">
                            <label>Date created</label>
                            <input type="text" class="form-control"
                                defaultValue={this.customer != null ? window.dateFormat(this.customer.dateCreated) : ''} readOnly={true} />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <label>Main address</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateMainAddr} disabled={this.customer == null}>LOCATE</button>
                        </div>
                        <input type="text" class="form-control" ref="mainAddress" defaultValue={this.defaultValueNameMainAddress} readOnly={true} />
                    </div>
                    <div class="form-row">
                        <div class="col">
                            <label>Country</label>
                            <AutocompleteField findByName={this.findCountryByName} defaultValueId={this.customer != null ? this.customer.country : null}
                                defaultValueName={this.defaultValueNameCountry} valueChanged={(value) => {
                                    this.currentSelectedCountryId = value;
                                }} />
                        </div>
                        <div class="col">
                            <label>State</label>
                            <AutocompleteField findByName={this.findState} defaultValueId={this.customer != null ? this.customer.state : null}
                                defaultValueName={this.defaultValueNameState} valueChanged={(value) => {
                                    this.currentSelectedStateId = value;
                                }} />
                        </div>
                    </div>
                    <label>Main shipping address</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateShippingAddr}
                                disabled={this.customer == null}>LOCATE</button>
                        </div>
                        <input type="text" class="form-control" ref="shippingAddress" defaultValue={this.defaultValueNameShippingAddress} readOnly={true} />
                    </div>
                    <label>Main billing address</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateBillingAddr}
                                disabled={this.customer == null}>LOCATE</button>
                        </div>
                        <input type="text" class="form-control" ref="billingAddress" defaultValue={this.defaultValueNameBillingAddress} readOnly={true} />
                    </div>
                    <div class="form-row">
                        <div class="col">
                            <label>Language</label>
                            <AutocompleteField findByName={this.findLanguagesByName} defaultValueId={this.country != null ? this.country.language : null}
                                defaultValueName={this.defaultValueNameLanguage} valueChanged={(value) => {
                                    this.currentSelectedLangId = value;
                                }} />
                        </div>
                        <div class="col">
                            <label>Payment method</label>
                            <AutocompleteField findByName={this.findPaymentMethodByName} defaultValueId={this.country != null ? this.country.paymentMethod : null}
                                defaultValueName={this.defaultValueNamePaymentMethod} valueChanged={(value) => {
                                    this.currentSelectedPaymentMethodId = value;
                                }} />
                        </div>
                    </div>
                </div>
            </div>

            <div id="buttomBottomFormContainter">
                <div id="buttomBottomForm" className="mt-1">
                    {this.customer != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>Delete</button> : null}
                    {this.customer != null ? <button type="button" class="btn btn-success" onClick={this.update}>Update</button> : null}
                    {this.customer == null ? < button type="button" class="btn btn-primary" onClick={this.add}>Add</button> : null}
                    <button type="button" class="btn btn-secondary" onClick={this.tabCustomers}>Cancel</button>
                </div>
            </div>
        </div>
    }
}

export default CustomerForm;
