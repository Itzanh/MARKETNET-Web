import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import AutocompleteField from '../../AutocompleteField';
import LocateAddress from '../Addresses/LocateAddress';

class SupplierForm extends Component {
    constructor({ supplier, addSupplier, updateSupplier, deleteSupplier, findLanguagesByName, defaultValueNameLanguage, findCountryByName, defaultValueNameCountry,
        findCityByName, defaultValueNameCity, findPaymentMethodByName, findBillingSerieByName, defaultValueNamePaymentMethod, defaultValueNameBillingSerie,
        tabSuppliers, locateAddress, defaultValueNameMainAddress, defaultValueNameShippingAddress, defaultValueNameBillingAddress }) {
        super();

        this.supplier = supplier;
        this.addSupplier = addSupplier;
        this.updateSupplier = updateSupplier;
        this.deleteSupplier = deleteSupplier;
        this.tabSuppliers = tabSuppliers;
        this.locateAddress = locateAddress;


        this.findLanguagesByName = findLanguagesByName;
        this.defaultValueNameLanguage = defaultValueNameLanguage;
        this.findCountryByName = findCountryByName;
        this.defaultValueNameCountry = defaultValueNameCountry;
        this.findCityByName = findCityByName;
        this.defaultValueNameCity = defaultValueNameCity;
        this.findPaymentMethodByName = findPaymentMethodByName;
        this.defaultValueNamePaymentMethod = defaultValueNamePaymentMethod;
        this.findBillingSerieByName = findBillingSerieByName;
        this.defaultValueNameBillingSerie = defaultValueNameBillingSerie;

        this.defaultValueNameMainAddress = defaultValueNameMainAddress;
        this.defaultValueNameShippingAddress = defaultValueNameShippingAddress;
        this.defaultValueNameBillingAddress = defaultValueNameBillingAddress;

        this.currentSelectedLangId = supplier != null ? supplier.language : "";
        this.currentSelectedCityId = supplier != null ? supplier.city : "";
        this.currentSelectedCountryId = supplier != null ? supplier.country : "";
        this.currentSelectedPaymentMethodId = supplier != null ? supplier.paymentMethod : "";
        this.currentSelectedBillingSerieId = supplier != null ? supplier.billingSerie : "";
        this.currentSelectedMainAddress = supplier != null ? supplier.mainAddress : null;
        this.currentSelectedShippingAddress = supplier != null ? supplier.mainShippingAddress : null;
        this.currentSelectedBillingAddress = supplier != null ? supplier.mainBillingAddress : null;

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.findCity = this.findCity.bind(this);
        this.calcName = this.calcName.bind(this);
        this.locateMainAddr = this.locateMainAddr.bind(this);
        this.locateShippingAddr = this.locateShippingAddr.bind(this);
        this.locateBillingAddr = this.locateBillingAddr.bind(this);
    }

    getSupplierFromForm() {
        const supplier = {};
        supplier.name = this.refs.name.value;
        supplier.tradename = this.refs.tradename.value;
        supplier.fiscalName = this.refs.fiscalName.value;
        supplier.taxId = this.refs.taxId.value;
        supplier.vatNumber = this.refs.vatNumber.value;
        supplier.phone = this.refs.phone.value;
        supplier.email = this.refs.email.value;
        supplier.country = parseInt(this.currentSelectedCountryId);
        supplier.city = parseInt(this.currentSelectedCityId);
        supplier.language = parseInt(this.currentSelectedLangId);
        supplier.paymentMethod = parseInt(this.currentSelectedPaymentMethodId);
        supplier.billingSeries = this.currentSelectedBillingSerieId;
        supplier.mainAddress = this.currentSelectedMainAddress;
        supplier.mainShippingAddress = this.currentSelectedShippingAddress;
        supplier.mainBillingAddress = this.currentSelectedBillingAddress;
        return supplier;
    }

    add() {
        const supplier = this.getSupplierFromForm();

        this.addSupplier(supplier).then((ok) => {
            if (ok) {
                this.tabSuppliers();
            }
        });
    }

    update() {
        const supplier = this.getSupplierFromForm();
        supplier.id = this.supplier.id;

        this.updateSupplier(supplier).then((ok) => {
            if (ok) {
                this.tabSuppliers();
            }
        });
    }

    delete() {
        const supplierId = this.supplier.id;
        this.deleteSupplier(supplierId).then((ok) => {
            if (ok) {
                this.tabSuppliers();
            }
        });
    }

    findCity(cityName) {
        return this.findCityByName(parseInt(this.currentSelectedCountryId), cityName);
    }

    calcName() {
        const tradeName = this.refs.tradename.value;
        const fiscalName = this.refs.fiscalName.value;
        if (tradeName != fiscalName && tradeName != "" && fiscalName != "") {
            this.refs.name.value = tradeName + " / " + fiscalName;
        } else if (tradeName != "") {
            this.refs.name.value = tradeName;
        } else if (fiscalName != "") {
            this.refs.name.value = fiscalName;
        }
    }

    locateMainAddr() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderSupplierModal'));
        ReactDOM.render(
            <LocateAddress
                locateAddress={() => {
                    return this.locateAddress(this.supplier.id);
                }}
                handleSelect={(addressId, addressName) => {
                    this.currentSelectedMainAddress = addressId;
                    this.refs.mainAddress.value = addressName;
                }}
            />,
            document.getElementById('renderSupplierModal'));
    }

    locateShippingAddr() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderSupplierModal'));
        ReactDOM.render(
            <LocateAddress
                locateAddress={() => {
                    return this.locateAddress(this.supplier.id);
                }}
                handleSelect={(addressId, addressName) => {
                    this.currentSelectedShippingAddress = addressId;
                    this.refs.shippingAddress.value = addressName;
                }}
            />,
            document.getElementById('renderSupplierModal'));
    }

    locateBillingAddr() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderSupplierModal'));
        ReactDOM.render(
            <LocateAddress
                locateAddress={() => {
                    return this.locateAddress(this.supplier.id);
                }}
                handleSelect={(addressId, addressName) => {
                    this.currentSelectedBillingAddress = addressId;
                    this.refs.billingAddress.value = addressName;
                }}
            />,
            document.getElementById('renderSupplierModal'));
    }

    render() {
        return <div id="tabSupplier" className="formRowRoot">
            <div id="renderSupplierModal"></div>
            <h2>Supplier</h2>
            <div class="form-row">
                <div class="col">
                    <label>Name</label>
                    <input type="text" class="form-control" ref="name" defaultValue={this.supplier != null ? this.supplier.name : ''} />
                    <div class="form-row">
                        <div class="col">
                            <label>Trade Name</label>
                            <input type="text" class="form-control" ref="tradename" defaultValue={this.supplier != null ? this.supplier.tradename : ''}
                                onChange={this.calcName} />
                        </div>
                        <div class="col">
                            <label>Fiscal Name</label>
                            <input type="text" class="form-control" ref="fiscalName" defaultValue={this.supplier != null ? this.supplier.fiscalName : ''}
                                onChange={this.calcName} />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col">
                            <label>Tax ID</label>
                            <input type="text" class="form-control" ref="taxId" defaultValue={this.supplier != null ? this.supplier.taxId : ''} />
                        </div>
                        <div class="col">
                            <label>VAT Number</label>
                            <input type="text" class="form-control" ref="vatNumber" defaultValue={this.supplier != null ? this.supplier.vatNumber : ''} />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col">
                            <label>Phone</label>
                            <input type="text" class="form-control" ref="phone" defaultValue={this.supplier != null ? this.supplier.phone : ''} />
                        </div>
                        <div class="col">
                            <label>Email</label>
                            <input type="text" class="form-control" ref="email" defaultValue={this.supplier != null ? this.supplier.email : ''} />
                        </div>
                    </div>
                    <label>Main address</label>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateMainAddr} disabled={this.supplier == null}>LOCATE</button>
                        </div>
                        <input type="text" class="form-control" ref="mainAddress" defaultValue={this.defaultValueNameMainAddress} readOnly={true} />
                    </div>
                    <div class="form-row">
                        <div class="col">
                            <label>Country</label>
                            <AutocompleteField findByName={this.findCountryByName} defaultValueId={this.address != null ? this.address.country : null}
                                defaultValueName={this.defaultValueNameCountry} valueChanged={(value) => {
                                    this.currentSelectedCountryId = value;
                                }} />
                        </div>
                        <div class="col">
                            <label>City</label>
                            <AutocompleteField findByName={this.findCity} defaultValueId={this.address != null ? this.address.city : null}
                                defaultValueName={this.defaultValueNameCity} valueChanged={(value) => {
                                    this.currentSelectedCityId = value;
                                }} />
                        </div>
                    </div>
                    <label>Main shipping address</label>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateShippingAddr}
                                disabled={this.supplier == null}>LOCATE</button>
                        </div>
                        <input type="text" class="form-control" ref="shippingAddress" defaultValue={this.defaultValueNameShippingAddress} readOnly={true} />
                    </div>
                    <label>Main billing address</label>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateBillingAddr}
                                disabled={this.supplier == null}>LOCATE</button>
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
                    <div class="form-row">
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
                                defaultValue={this.supplier != null ? window.dateFormat(this.supplier.dateCreated) : ''} readOnly={true} />
                        </div>
                    </div>
                </div>
                <div class="col">
                </div>
            </div>

            <div id="buttomBottomForm">
                {this.supplier != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>Delete</button> : null}
                {this.supplier != null ? <button type="button" class="btn btn-success" onClick={this.update}>Update</button> : null}
                {this.supplier == null ? < button type="button" class="btn btn-primary" onClick={this.add}>Add</button> : null}
                <button type="button" class="btn btn-secondary" onClick={this.tabSuppliers}>Cancel</button>
            </div>
        </div>
    }
}

export default SupplierForm;