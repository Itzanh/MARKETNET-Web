import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import HighlightIcon from '@material-ui/icons/Highlight';

import AutocompleteField from '../../AutocompleteField';
import LocateCustomer from '../Customers/LocateCustomer';
import LocateSupplier from '../Suppliers/LocateSupplier';



class AddressModal extends Component {
    constructor({ address, findCustomerByName, findStateByName, findCountryByName, defaultValueNameCustomer, defaultValueNameCountry, defaultValueNameState,
        addAddress, updateAddress, deleteAddress, findSupplierByName, defaultValueNameSupplier, locateCustomers, locateSuppliers,
        defaultCustomerId, defaultSupplierId }) {
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

        this.locateCustomers = locateCustomers;
        this.locateSuppliers = locateSuppliers;

        this.addAddress = addAddress;
        this.updateAddress = updateAddress;
        this.deleteAddress = deleteAddress;

        this.addingWithCustomerOrSupplier = defaultCustomerId != null || defaultSupplierId != null;
        this.open = true;
        this.defaultValueContactType = defaultSupplierId != null ? "S" : "C";

        this.currentSelectedCustomerId = address != null ? address.customer : defaultCustomerId;
        this.currentSelectedSupplierId = address != null ? address.supplier : defaultSupplierId;
        this.currentSelectedStateId = address != null ? address.state : "";
        this.currentSelectedCountryId = address != null ? address.country : "";

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.findState = this.findState.bind(this);
        this.setContactType = this.setContactType.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.locateCustomer = this.locateCustomer.bind(this);
        this.locateSupplier = this.locateSupplier.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.setContactType();
        }, 10);
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

        this.addAddress(address).then((result) => {
            if (result.id > 0) {
                this.handleClose();
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
                this.handleClose();
            }
        });
    }

    delete() {
        const addressId = this.address.id;
        this.deleteAddress(addressId).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    findState(stateName) {
        return this.findStateByName(parseInt(this.currentSelectedCountryId), stateName);
    }

    setContactType() {
        this.defaultValueContactType = this.refs.contactType.value;
        ReactDOM.unmountComponentAtNode(this.refs.renderContact);
        if (this.defaultValueContactType === "C") {
            ReactDOM.render(<div>
                <label>{i18next.t('customer')}</label>
                <div class="input-group">
                    <div class="input-group-prepend">
                        <button class="btn btn-outline-secondary" type="button" onClick={this.locateCustomer}
                            disabled={this.addingWithCustomerOrSupplier || this.address != null}><HighlightIcon /></button>
                    </div>
                    <input type="text" class="form-control" defaultValue={this.defaultValueNameCustomer}
                        readOnly={true} />
                </div>
            </div>, this.refs.renderContact);
        } else {
            ReactDOM.render(<div>
                <label>{i18next.t('supplier')}</label>
                <div class="input-group">
                    <div class="input-group-prepend">
                        <button class="btn btn-outline-secondary" type="button" onClick={this.locateSupplier}
                            disabled={this.addingWithCustomerOrSupplier || this.address != null}><HighlightIcon /></button>
                    </div>
                    <input type="text" class="form-control" defaultValue={this.defaultValueNameSupplier}
                        readOnly={true} />
                </div>
            </div>, this.refs.renderContact);
        }
    }

    locateCustomer() {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(<LocateCustomer
            locateCustomers={this.locateCustomers}
            onSelect={(customer) => {
                this.currentSelectedCustomerId = customer.id;
                this.defaultValueNameCustomer = customer.name;
                this.setContactType();
            }}
        />, this.refs.renderModal);
    }

    locateSupplier() {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(<LocateSupplier
            locateSuppliers={this.locateSuppliers}
            onSelect={(supplier) => {
                this.currentSelectedSupplierId = supplier.id;
                this.defaultValueNameSupplier = supplier.name;
                this.setContactType();
            }}
        />, this.refs.renderModal);
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    styles = (theme) => ({
        root: {
            margin: 0,
            padding: theme.spacing(2),
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
    });

    DialogTitle = withStyles(this.styles)((props) => {
        const { children, classes, onClose, ...other } = props;
        return (
            <DialogTitle disableTypography className={classes.root} {...other}>
                <Typography variant="h6">{children}</Typography>
                <IconButton aria-label="close" className={classes.closeButton} onClick={this.handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
        );
    });

    PaperComponent(props) {
        return (
            <Draggable handle="#draggable-dialog-title" cancel={'[class*="DialogContent-root"]'}>
                <Paper {...props} />
            </Draggable>
        );
    }

    render() {
        return <div>
            <div ref="renderModal"></div>
            <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'md'}
                PaperComponent={this.PaperComponent}>
                <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    {i18next.t('address')}
                </this.DialogTitle>
                <DialogContent>
                    <label>{i18next.t('contact-type')}</label>
                    <select class="form-control" ref="contactType" onChange={this.setContactType}
                        disabled={this.addingWithCustomerOrSupplier || this.address != null} defaultValue={this.defaultValueContactType}>
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
                </DialogContent>
                <DialogActions>
                    <p className="errorMessage" ref="errorMessage"></p>
                    {this.address != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                    {this.address == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                    {this.address != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
                </DialogActions>
            </Dialog>
        </div>
    }
}

export default AddressModal;
