import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';

import AutocompleteField from '../../AutocompleteField';


class AddressModal extends Component {
    constructor({ address, findCustomerByName, findStateByName, findCountryByName, defaultValueNameCustomer, defaultValueNameCountry, defaultValueNameState,
        addAddress, updateAddress, deleteAddress, findSupplierByName, defaultValueNameSupplier }) {
        super();

        this.address = address;
        this.findCustomerByName = findCustomerByName;
        this.findStateByName = findStateByName;
        this.findCountryByName = findCountryByName;
        this.findSupplierByName = findSupplierByName;

        this.defaultValueNameCustomer = defaultValueNameCustomer;
        this.defaultValueNameCountry = defaultValueNameCountry;
        this.defaultValueNameState = defaultValueNameState;
        this.defaultValueNameSupplier = defaultValueNameSupplier;

        this.addAddress = addAddress;
        this.updateAddress = updateAddress;
        this.deleteAddress = deleteAddress;

        this.currentSelectedCustomerId = address != null ? address.customer : "";
        this.currentSelectedSupplierId = address != null ? address.supplier : "";
        this.currentSelectedStateId = address != null ? address.state : "";
        this.currentSelectedCountryId = address != null ? address.country : "";

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.findState = this.findState.bind(this);
        this.setContactType = this.setContactType.bind(this);
    }

    componentDidMount() {
        window.$('#addressModal').modal({ show: true });
        this.refs.contactType.value = this.address != null && this.address.supplier != null ? "S" : "C";
        this.setContactType();
    }

    getAddressFromForm() {
        const address = {}
        if (this.refs.contactType.value === "C") {
            address.customer = parseInt(this.currentSelectedCustomerId);
        } else {
            address.supplier = parseInt(this.currentSelectedSupplierId);
        }
        address.address = this.refs.address.value;
        address.address2 = this.refs.address2.value;
        address.country = parseInt(this.currentSelectedCountryId);
        address.state = parseInt(this.currentSelectedStateId);
        address.city = this.refs.city.value;
        address.zipCode = this.refs.zipCode.value;
        address.privateOrBusiness = this.refs.type.value;
        address.notes = this.refs.notes.value;
        return address;
    }

    isValid(address) {
        this.refs.errorMessage.innerText = "";
        if ((address.customer === 0 || isNaN(address.customer)) && (address.supplier === 0 || isNaN(address.supplier))) {
            this.refs.errorMessage.innerText = i18next.t('must-customer-supplier');
            return false;
        }
        if (address.address.length === 0) {
            this.refs.errorMessage.innerText = i18next.t('address-0');
            return false;
        }
        if (address.address.length > 200) {
            this.refs.errorMessage.innerText = i18next.t('address-200');
            return false;
        }
        if (address.address2.length > 200) {
            this.refs.errorMessage.innerText = i18next.t('address-2-200');
            return false;
        }
        if (address.country === 0 || isNaN(address.country)) {
            this.refs.errorMessage.innerText = i18next.t('must-country');
            return false;
        }
        if (address.city.length > 100) {
            this.refs.errorMessage.innerText = i18next.t('city-100');
            return false;
        }
        if (address.zipCode.length > 12) {
            this.refs.errorMessage.innerText = i18next.t('zip-12');
            return false;
        }
        if (address.notes.length > 200) {
            this.refs.errorMessage.innerText = i18next.t('notes-1000');
            return false;
        }
        return true;
    }

    add() {
        const address = this.getAddressFromForm();
        if (!this.isValid(address)) {
            return;
        }

        this.addAddress(address).then((ok) => {
            if (ok) {
                window.$('#addressModal').modal('hide');
            }
        });
    }

    update() {
        const address = this.getAddressFromForm();
        if (!this.isValid(address)) {
            return;
        }
        address.id = this.address.id;

        this.updateAddress(address).then((ok) => {
            if (ok) {
                window.$('#addressModal').modal('hide');
            }
        });
    }

    delete() {
        const addressId = this.address.id;
        this.deleteAddress(addressId).then((ok) => {
            if (ok) {
                window.$('#addressModal').modal('hide');
            }
        });
    }

    findState(stateName) {
        return this.findStateByName(parseInt(this.currentSelectedCountryId), stateName);
    }

    setContactType() {
        ReactDOM.unmountComponentAtNode(this.refs.renderContact);
        if (this.refs.contactType.value === "C") {
            ReactDOM.render(<div>
                <label>{i18next.t('customer')}</label>
                <AutocompleteField findByName={this.findCustomerByName} defaultValueId={this.address != null ? this.address.customer : null}
                    defaultValueName={this.defaultValueNameCustomer} valueChanged={(value) => {
                        this.currentSelectedCustomerId = value;
                    }} />
            </div>, this.refs.renderContact);
        } else {
            ReactDOM.render(<div>
                <label>{i18next.t('supplier')}</label>
                <AutocompleteField findByName={this.findSupplierByName} defaultValueId={this.address != null ? this.address.supplier : null}
                    defaultValueName={this.defaultValueNameSupplier} valueChanged={(value) => {
                        this.currentSelectedSupplierId = value;
                    }} />
            </div>, this.refs.renderContact);
        }
    }

    render() {
        return <div class="modal fade" id="addressModal" tabindex="-1" role="dialog" aria-labelledby="addressModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addressModalLabel">{i18next.t('address')}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <label>{i18next.t('contact-type')}</label>
                        <select class="form-control" ref="contactType" onChange={this.setContactType}>
                            <option value="C">{i18next.t('customer')}</option>
                            <option value="S">{i18next.t('supplier')}</option>
                        </select>
                        <div ref="renderContact"></div>
                        <div class="form-group">
                            <label>{i18next.t('address')}</label>
                            <input type="text" class="form-control" ref="address" defaultValue={this.address != null ? this.address.address : ''} />
                        </div>
                        <div class="form-group">
                            <label>{i18next.t('address-2')}</label>
                            <input type="text" class="form-control" ref="address2" defaultValue={this.address != null ? this.address.address2 : ''} />
                        </div>
                        <div class="form-row">
                            <div class="col">
                                <label>{i18next.t('country')}</label>
                                <AutocompleteField findByName={this.findCountryByName} defaultValueId={this.address != null ? this.address.country : null}
                                    defaultValueName={this.defaultValueNameCountry} valueChanged={(value) => {
                                        this.currentSelectedCountryId = value;
                                    }} />
                            </div>
                            <div class="col">
                                <div class="form-group">
                                    <label>{i18next.t('state')}</label>
                                    <AutocompleteField findByName={this.findState} defaultValueId={this.address != null ? this.address.state : null}
                                        defaultValueName={this.defaultValueNameState} valueChanged={(value) => {
                                            this.currentSelectedStateId = value;
                                        }} />
                                </div>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="col">
                                <label>{i18next.t('city')}</label>
                                <input type="text" class="form-control" ref="city" defaultValue={this.address != null ? this.address.city : ''} />
                            </div>
                            <div class="col">
                                <label>{i18next.t('zip-code')}</label>
                                <input type="text" class="form-control" ref="zipCode" defaultValue={this.address != null ? this.address.zipCode : ''} />
                            </div>
                        </div>
                        <div class="form-group">
                            <label>{i18next.t('private-or-business')}</label>
                            <select class="form-control" ref="type" defaultValue={this.address != null ? this.address.privateOrBusiness : 'P'}>
                                <option value="P">{i18next.t('private')}</option>
                                <option value="B">{i18next.t('business')}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>{i18next.t('notes')}</label>
                            <textarea class="form-control" rows="3" ref="notes" defaultValue={this.address != null ? this.address.notes : ''}></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <p className="errorMessage" ref="errorMessage"></p>
                        {this.address != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                        {this.address == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                        {this.address != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default AddressModal;
