/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';

import AutocompleteField from '../../AutocompleteField';
import LocateAddress from '../Addresses/LocateAddress';
import AlertModal from '../../AlertModal';
import ConfirmDelete from '../../ConfirmDelete';
import SupplierFormAddresses from './SupplierFormAddresses';
import SupplierFormPurchaseOrders from './SupplierFormPurchaseOrders';
import HighlightIcon from '@material-ui/icons/Highlight';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TransactionLogViewModal from '../../VisualComponents/TransactionLogViewModal';
import LibraryAddCheckIcon from '@material-ui/icons/LibraryAddCheck';

import { TextField, FormControl, NativeSelect } from "@material-ui/core";
import { InputLabel } from "@mui/material";
import CustomFields from '../CustomFields/CustomFields';



class SupplierForm extends Component {
    constructor({ supplier, addSupplier, updateSupplier, deleteSupplier, findLanguagesByName, findCountryByName, findStateByName, locatePaymentMethods,
        locateBillingSeries, tabSuppliers, locateAddress, locateAccountForSupplier, getSupplierAddresses, getSupplierPurchaseOrders, getRegisterTransactionalLogs,
        checkVatNumber, getAddressesFunctions, getPurchaseOrdersFunctions, getCustomFieldsFunctions }) {
        super();

        this.supplier = supplier;
        this.addSupplier = addSupplier;
        this.updateSupplier = updateSupplier;
        this.deleteSupplier = deleteSupplier;
        this.tabSuppliers = tabSuppliers;
        this.locateAddress = locateAddress;


        this.findLanguagesByName = findLanguagesByName;
        this.findCountryByName = findCountryByName;
        this.findStateByName = findStateByName;
        this.locatePaymentMethods = locatePaymentMethods;
        this.locateBillingSeries = locateBillingSeries;

        this.locateAccountForSupplier = locateAccountForSupplier;
        this.getSupplierAddresses = getSupplierAddresses;
        this.getSupplierPurchaseOrders = getSupplierPurchaseOrders;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;
        this.checkVatNumber = checkVatNumber;

        this.getAddressesFunctions = getAddressesFunctions;
        this.getPurchaseOrdersFunctions = getPurchaseOrdersFunctions;
        this.getCustomFieldsFunctions = getCustomFieldsFunctions;

        this.currentSelectedLangId = supplier != null ? supplier.languageId : "";
        this.currentSelectedStateId = supplier != null ? supplier.stateId : "";
        this.currentSelectedCountryId = supplier != null ? supplier.countryId : "";
        this.currentSelectedPaymentMethodId = supplier != null ? supplier.paymentMethodId : "";
        this.currentSelectedBillingSerieId = supplier != null ? supplier.billingSeriesId : "";
        this.currentSelectedMainAddress = supplier != null ? supplier.mainAddressId : null;
        this.currentSelectedShippingAddress = supplier != null ? supplier.mainShippingAddressId : null;
        this.currentSelectedBillingAddress = supplier != null ? supplier.mainBillingAddressId : null;

        this.tab = 0;

        this.name = React.createRef();
        this.tradename = React.createRef();
        this.fiscalName = React.createRef();
        this.taxId = React.createRef();
        this.vatNumber = React.createRef();
        this.phone = React.createRef();
        this.email = React.createRef();
        this.mainAddress = React.createRef();
        this.shippingAddress = React.createRef();
        this.billingAddress = React.createRef();

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.findState = this.findState.bind(this);
        this.calcName = this.calcName.bind(this);
        this.locateMainAddr = this.locateMainAddr.bind(this);
        this.locateShippingAddr = this.locateShippingAddr.bind(this);
        this.locateBillingAddr = this.locateBillingAddr.bind(this);
        this.tabAddresses = this.tabAddresses.bind(this);
        this.tabPurchaseOrders = this.tabPurchaseOrders.bind(this);
        this.transactionLog = this.transactionLog.bind(this);
        this.checkVat = this.checkVat.bind(this);
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
                ReactDOM.render(components, document.getElementById("renderPaymentMethod"));

                document.getElementById("renderPaymentMethod").value = this.supplier != null ? this.supplier.paymentMethodId : "0";
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
                ReactDOM.render(components, document.getElementById("renderBillingSerie"));

                document.getElementById("renderBillingSerie").value = this.currentSelectedBillingSerieId;
            });
        });
    }

    tabs() {
        ReactDOM.render(<AppBar position="static" style={{ 'backgroundColor': '#1976d2' }}>
            <Tabs value={this.tab} onChange={(_, tab) => {
                this.tab = tab;
                switch (tab) {
                    case 0: {
                        this.tabAddresses();
                        break;
                    }
                    case 1: {
                        this.tabPurchaseOrders();
                        break;
                    }
                    case 2: {
                        this.tabCustomFields();
                        break;
                    }
                }
            }}>
                <Tab label={i18next.t('addresses')} />
                <Tab label={i18next.t('purchase-orders')} />
                <Tab label={i18next.t('custom-fields')} disabled={this.supplier == null} />
            </Tabs>
        </AppBar>, this.refs.tabs);
    }

    renderAccounts() {
        return new Promise((resolve) => {
            this.locateAccountForSupplier().then(async (accounts) => {
                resolve();
                const options = accounts.map((element, i) => {
                    return <option key={i} value={element.id}>{element.name}</option>
                });
                options.unshift(<option key={0} value="">.{i18next.t('none')}</option>);

                await ReactDOM.render(options, document.getElementById("accounts"));
                document.getElementById("accounts").value = this.supplier != null ? (this.supplier.accountId != null ? this.supplier.accountId : '') : '';
            });
        });
    }

    getSupplierFromForm() {
        const supplier = {};
        supplier.name = this.name.current.value;
        supplier.tradename = this.tradename.current.value;
        supplier.fiscalName = this.fiscalName.current.value;
        supplier.taxId = this.taxId.current.value;
        supplier.vatNumber = this.vatNumber.current.value;
        supplier.phone = this.phone.current.value;
        supplier.email = this.email.current.value;
        supplier.countryId = parseInt(this.currentSelectedCountryId);
        supplier.stateId = parseInt(this.currentSelectedStateId);
        supplier.languageId = parseInt(this.currentSelectedLangId);
        supplier.paymentMethodId = parseInt(this.currentSelectedPaymentMethodId);
        supplier.billingSeriesId = this.currentSelectedBillingSerieId;
        supplier.mainAddressId = this.currentSelectedMainAddress;
        supplier.mainShippingAddressId = this.currentSelectedShippingAddress;
        supplier.mainBillingAddressId = this.currentSelectedBillingAddress;
        return supplier;
    }

    isValid(supplier) {
        var errorMessage = "";
        if (supplier.name.length === 0) {
            errorMessage = i18next.t('name-0');
            return errorMessage;
        }
        if (supplier.name.length > 303) {
            errorMessage = i18next.t('name-303');
            return errorMessage;
        }
        if (supplier.tradename.length === 0) {
            errorMessage = i18next.t('tradename-0');
            return errorMessage;
        }
        if (supplier.tradename.length > 150) {
            errorMessage = i18next.t('tradename-150');
            return errorMessage;
        }
        if (supplier.fiscalName.length === 0) {
            errorMessage = i18next.t('fiscalname-0');
            return errorMessage;
        }
        if (supplier.fiscalName.length > 150) {
            errorMessage = i18next.t('fiscalname-150');
            return errorMessage;
        }
        if (supplier.taxId.length > 25) {
            errorMessage = i18next.t('taxid-25');
            return errorMessage;
        }
        if (supplier.vatNumber.length > 25) {
            errorMessage = i18next.t('vatnumber-25');
            return errorMessage;
        }
        if (supplier.phone.length > 25) {
            errorMessage = i18next.t('phone-25');
            return errorMessage;
        }
        if (supplier.email.length > 100) {
            errorMessage = i18next.t('email-100');
            return errorMessage;
        }
        if (supplier.email.length > 0 && !window.validateEmail(supplier.email)) {
            errorMessage = i18next.t('invalid-email');
            return errorMessage;
        }
        if (supplier.phone.length > 0 && !window.phoneIsValid(supplier.phone)) {
            errorMessage = i18next.t('invalid-phone');
            return errorMessage;
        }
        return errorMessage;
    }

    add() {
        const supplier = this.getSupplierFromForm();
        const errorMessage = this.isValid(supplier);
        if (errorMessage !== "") {
            ReactDOM.unmountComponentAtNode(document.getElementById('renderSupplierModal'));
            ReactDOM.render(
                <AlertModal
                    modalTitle={i18next.t('VALIDATION-ERROR')}
                    modalText={errorMessage}
                />,
                document.getElementById('renderSupplierModal'));
            return;
        }

        this.addSupplier(supplier).then((res) => {
            if (res.id > 0) {
                this.tabSuppliers();
            }
        });
    }

    update() {
        const supplier = this.getSupplierFromForm();
        const errorMessage = this.isValid(supplier);
        if (errorMessage !== "") {
            ReactDOM.unmountComponentAtNode(document.getElementById('renderSupplierModal'));
            ReactDOM.render(
                <AlertModal
                    modalTitle={i18next.t('VALIDATION-ERROR')}
                    modalText={errorMessage}
                />,
                document.getElementById('renderSupplierModal'));
            return;
        }
        supplier.id = this.supplier.id;

        this.updateSupplier(supplier).then((ok) => {
            if (ok) {
                this.tabSuppliers();
            }
        });
    }

    delete() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderSupplierModal'));
        ReactDOM.render(
            <ConfirmDelete
                onDelete={() => {
                    const supplierId = this.supplier.id;
                    this.deleteSupplier(supplierId).then((ok) => {
                        if (ok) {
                            this.tabSuppliers();
                        }
                    });
                }}
            />,
            document.getElementById('renderSupplierModal'));
    }

    transactionLog() {
        if (this.supplier == null) {
            return;
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('renderSupplierModal'));
        ReactDOM.render(<TransactionLogViewModal
            getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
            tableName={"suppliers"}
            registerId={this.supplier.id}
        />,
            document.getElementById('renderSupplierModal'));
    }

    findState(stateName) {
        return this.findStateByName(parseInt(this.currentSelectedCountryId), stateName);
    }

    calcName() {
        const tradeName = this.tradename.current.value;
        const fiscalName = this.fiscalName.current.value;
        if (tradeName !== fiscalName && tradeName !== "" && fiscalName !== "") {
            this.name.current.value = tradeName + " / " + fiscalName;
        } else if (tradeName !== "") {
            this.name.current.value = tradeName;
        } else if (fiscalName !== "") {
            this.name.current.value = fiscalName;
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
                    this.mainAddress.current.value = addressName;
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
                    this.shippingAddress.current.value = addressName;
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
                    this.billingAddress.current.value = addressName;
                }}
            />,
            document.getElementById('renderSupplierModal'));
    }

    tabAddresses() {
        this.tab = 0;
        this.tabs();

        ReactDOM.render(<SupplierFormAddresses
            supplierId={this.supplier == null ? null : this.supplier.id}
            getSupplierAddresses={this.getSupplierAddresses}
            getAddressesFunctions={this.getAddressesFunctions}
        />, this.refs.render);
    }

    tabPurchaseOrders() {
        this.tab = 1;
        this.tabs();

        ReactDOM.render(<SupplierFormPurchaseOrders
            supplierId={this.supplier == null ? null : this.supplier.id}
            getSupplierPurchaseOrders={this.getSupplierPurchaseOrders}
            getPurchaseOrdersFunctions={this.getPurchaseOrdersFunctions}
        />, this.refs.render);
    }

    tabCustomFields() {
        this.tab = 2;
        this.tabs();

        const commonProps = this.getCustomFieldsFunctions();

        ReactDOM.render(<CustomFields
            {...commonProps}
            supplierId={this.supplier.id}
        />, this.refs.render);
    }

    checkVat() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderSupplierModal'));
        if (this.vatNumber.current.value.length < 5) {
            return;
        }

        this.checkVatNumber({
            countryIsoCode2: this.vatNumber.current.value.substring(0, 2),
            VATNumber: this.vatNumber.current.value.substring(2)
        }).then((ok) => {
            if (ok.ok) {
                if (ok.errorCode == 1) {
                    ReactDOM.render(<AlertModal
                        modalTitle={i18next.t('VAT-NUMBER-CHECK')}
                        modalText={i18next.t('the-number-is-a-valid-vat-number')}
                    />, document.getElementById('renderSupplierModal'));
                } else if (ok.errorCode == 2) {
                    ReactDOM.render(<AlertModal
                        modalTitle={i18next.t('VAT-NUMBER-CHECK')}
                        modalText={i18next.t('the-number-not-is-a-valid-vat-number')}
                    />, document.getElementById('renderSupplierModal'));
                }
            } else {
                ReactDOM.render(<AlertModal
                    modalTitle={i18next.t('VAT-NUMBER-CHECK-ERROR')}
                    modalText={i18next.t('an-unknown-error-ocurred')}
                />, document.getElementById('renderSupplierModal'));
            }
        });
    }

    render() {
        return <div id="tabSupplier" className="formRowRoot">
            <div id="renderSupplierModal"></div>
            <h4 className="ml-2">{i18next.t('supplier')}</h4>
            <div class="form-row">
                <div class="col">
                    <TextField label={i18next.t('name')} variant="outlined" fullWidth size="small" inputRef={this.name}
                        defaultValue={this.supplier != null ? this.supplier.name : ''} inputProps={{ maxLength: 303 }} />
                </div>
                <div class="col">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateMainAddr}
                                disabled={this.supplier == null}><HighlightIcon /></button>
                        </div>
                        <TextField label={i18next.t('main-address')} variant="outlined" fullWidth focused InputProps={{ readOnly: true }} size="small"
                            inputRef={this.mainAddress}
                            defaultValue={this.supplier != null && this.supplier.mainAddress != null ? this.supplier.mainAddress.address : ''} />
                    </div>
                </div>
            </div>
            <div class="form-row mt-3">
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <TextField label={i18next.t('trade-name')} variant="outlined" fullWidth size="small" inputRef={this.tradename}
                                defaultValue={this.supplier != null ? this.supplier.tradename : ''} onChange={this.calcName} inputProps={{ maxLength: 150 }} />
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('fiscal-name')} variant="outlined" fullWidth size="small" inputRef={this.fiscalName}
                                defaultValue={this.supplier != null ? this.supplier.fiscalName : ''} onChange={this.calcName} inputProps={{ maxLength: 150 }} />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <AutocompleteField findByName={this.findCountryByName} defaultValueId={this.supplier != null ? this.supplier.countryId : null}
                                defaultValueName={this.supplier != null && this.supplier.country != null ? this.supplier.country.name : ''}
                                valueChanged={(value) => {
                                    this.currentSelectedCountryId = value;
                                }}
                                label={i18next.t('country')} />
                        </div>
                        <div class="col">
                            <AutocompleteField findByName={this.findState} defaultValueId={this.supplier != null ? this.supplier.stateId : null}
                                defaultValueName={this.supplier != null && this.supplier.state != null ? this.supplier.state.name : ''}
                                valueChanged={(value) => {
                                    this.currentSelectedStateId = value;
                                }}
                                label={i18next.t('state')} />
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-row mt-3">
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <TextField label={i18next.t('tax-id')} variant="outlined" fullWidth size="small" inputRef={this.taxId}
                                defaultValue={this.supplier != null ? this.supplier.taxId : ''} inputProps={{ maxLength: 25 }} />
                        </div>
                        <div class="col">
                            <div class="input-group mb-3">
                                <TextField label={i18next.t('vat-number')} variant="outlined" fullWidth size="small" inputRef={this.vatNumber}
                                    defaultValue={this.supplier != null ? this.supplier.vatNumber : ''} inputProps={{ maxLength: 25 }} />
                                <div class="input-group-append">
                                    <button class="btn btn-outline-secondary" type="button" onClick={this.checkVat}>
                                        <LibraryAddCheckIcon />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('date-created')} variant="outlined" fullWidth InputProps={{ readOnly: true }} size="small"
                                defaultValue={this.supplier != null ? window.dateFormat(this.supplier.dateCreated) : ''} />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateShippingAddr}
                                disabled={this.supplier == null}><HighlightIcon /></button>
                        </div>
                        <TextField label={i18next.t('main-shipping-address')} variant="outlined" fullWidth focused InputProps={{ readOnly: true }} size="small"
                            inputRef={this.shippingAddress}
                            defaultValue={this.supplier != null && this.supplier.mainShippingAddress != null ? this.supplier.mainShippingAddress.address : ''} />
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <TextField label={i18next.t('phone')} variant="outlined" fullWidth size="small" inputRef={this.phone}
                                defaultValue={this.supplier != null ? this.supplier.phone : ''} inputProps={{ maxLength: 25 }} />
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('email')} variant="outlined" fullWidth size="small" inputRef={this.email} type="email"
                                defaultValue={this.supplier != null ? this.supplier.email : ''} inputProps={{ maxLength: 100 }} />
                        </div>
                    </div>
                    <div class="form-row mt-3">
                        <div class="col">
                            <FormControl fullWidth>
                                <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('billing-serie')}</InputLabel>
                                <NativeSelect
                                    style={{ 'marginTop': '0' }}
                                    id="renderBillingSerie"
                                    onChange={(e) => {
                                        this.currentSelectedBillingSerieId = e.target.value == "" ? null : e.target.value;
                                    }}
                                >

                                </NativeSelect>
                            </FormControl>
                        </div>
                        <div class="col">
                            <FormControl fullWidth>
                                <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('account')}</InputLabel>
                                <NativeSelect
                                    style={{ 'marginTop': '0' }}
                                    id="accounts">

                                </NativeSelect>
                            </FormControl>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateBillingAddr}
                                disabled={this.supplier == null}><HighlightIcon /></button>
                        </div>
                        <TextField label={i18next.t('main-billing-address')} variant="outlined" fullWidth focused InputProps={{ readOnly: true }} size="small"
                            inputRef={this.billingAddress}
                            defaultValue={this.supplier != null && this.supplier.mainBillingAddress != null ? this.supplier.mainBillingAddress.address : ''} />
                    </div>
                    <div class="form-row mt-3">
                        <div class="col">
                            <AutocompleteField findByName={this.findLanguagesByName} defaultValueId={this.supplier != null ? this.supplier.languageId : null}
                                defaultValueName={this.supplier != null && this.supplier.language != null ? this.supplier.language.name : ''}
                                valueChanged={(value) => {
                                    this.currentSelectedLangId = value;
                                }}
                                label={i18next.t('language')} />
                        </div>
                        <div class="col">
                            <FormControl fullWidth>
                                <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('payment-method')}</InputLabel>
                                <NativeSelect
                                    style={{ 'marginTop': '0' }}
                                    id="renderPaymentMethod"
                                    onChange={(e) => {
                                        this.currentSelectedPaymentMethodId = e.target.value.value == "0" ? null : e.target.value.value;
                                    }}
                                >

                                </NativeSelect>
                            </FormControl>
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
                            {this.supplier != null ? <a class="dropdown-item" href="#" onClick={this.transactionLog}>{i18next.t('transactional-log')}</a> : null}
                        </div>
                    </div>

                    {this.supplier != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                    {this.supplier != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
                    {this.supplier == null ? < button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                    <button type="button" class="btn btn-secondary" onClick={this.tabSuppliers}>{i18next.t('cancel')}</button>
                </div>
            </div>
        </div>
    }
}

export default SupplierForm;
