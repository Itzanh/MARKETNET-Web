import React, { Component } from 'react';
import ReactDOM from 'react-dom';

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
            this.refs.errorMessage.innerText = "You must select a customer or a supplier.";
            return false;
        }
        if (address.address.length === 0) {
            this.refs.errorMessage.innerText = "The address can't be empty.";
            return false;
        }
        if (address.address.length > 200) {
            this.refs.errorMessage.innerText = "The address can't be longer than 200 characters.";
            return false;
        }
        if (address.address2.length > 200) {
            this.refs.errorMessage.innerText = "The name can't be longer than 200 characters.";
            return false;
        }
        if (address.country === 0 || isNaN(address.country)) {
            this.refs.errorMessage.innerText = "You must select a country.";
            return false;
        }
        if (address.state === 0 || isNaN(address.state)) {
            this.refs.errorMessage.innerText = "You must select a state.";
            return false;
        }
        if (address.city.length > 100) {
            this.refs.errorMessage.innerText = "The city name can't be longer than 100 characters.";
            return false;
        }
        if (address.zipCode.length > 12) {
            this.refs.errorMessage.innerText = "The zip code name can't be longer than 12 characters.";
            return false;
        }
        if (address.notes.length > 200) {
            this.refs.errorMessage.innerText = "The notes can't be longer than 1000 characters.";
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
                <label>Customer</label>
                <AutocompleteField findByName={this.findCustomerByName} defaultValueId={this.address != null ? this.address.customer : null}
                    defaultValueName={this.defaultValueNameCustomer} valueChanged={(value) => {
                        this.currentSelectedCustomerId = value;
                    }} />
            </div>, this.refs.renderContact);
        } else {
            ReactDOM.render(<div>
                <label>Supplier</label>
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
                        <h5 class="modal-title" id="addressModalLabel">Address</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <label>Contact type</label>
                        <select class="form-control" ref="contactType" onChange={this.setContactType}>
                            <option value="C">Customer</option>
                            <option value="S">Supplier</option>
                        </select>
                        <div ref="renderContact"></div>
                        <div class="form-group">
                            <label>Address</label>
                            <input type="text" class="form-control" ref="address" defaultValue={this.address != null ? this.address.address : ''} />
                        </div>
                        <div class="form-group">
                            <label>Address 2</label>
                            <input type="text" class="form-control" ref="address2" defaultValue={this.address != null ? this.address.address2 : ''} />
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
                                <div class="form-group">
                                    <label>State</label>
                                    <AutocompleteField findByName={this.findState} defaultValueId={this.address != null ? this.address.state : null}
                                        defaultValueName={this.defaultValueNameState} valueChanged={(value) => {
                                            this.currentSelectedStateId = value;
                                        }} />
                                </div>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="col">
                                <label>City</label>
                                <input type="text" class="form-control" ref="city" defaultValue={this.address != null ? this.address.city : ''} />
                            </div>
                            <div class="col">
                                <label>Zip Code</label>
                                <input type="text" class="form-control" ref="zipCode" defaultValue={this.address != null ? this.address.zipCode : ''} />
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Private or Business</label>
                            <select class="form-control" ref="type" defaultValue={this.address != null ? this.address.privateOrBusiness : 'P'}>
                                <option value="P">Private</option>
                                <option value="B">Business</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Notes</label>
                            <textarea class="form-control" rows="3" ref="notes" defaultValue={this.address != null ? this.address.notes : ''}></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <p className="errorMessage" ref="errorMessage"></p>
                        {this.address != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>Delete</button> : null}
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        {this.address == null ? <button type="button" class="btn btn-primary" onClick={this.add}>Add</button> : null}
                        {this.address != null ? <button type="button" class="btn btn-success" onClick={this.update}>Update</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default AddressModal;
