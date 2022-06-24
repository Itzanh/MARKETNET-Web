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
import CustomerFormAddresses from './CustomerFormAddresses';
import CustomerFormSaleOrders from './CustomerFormSaleOrders';
import HighlightIcon from '@material-ui/icons/Highlight';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TransactionLogViewModal from '../../VisualComponents/TransactionLogViewModal';
import LibraryAddCheckIcon from '@material-ui/icons/LibraryAddCheck';

import { TextField, FormControl, NativeSelect } from "@material-ui/core";
import { InputLabel } from "@mui/material";

// CSS
import './../../../CSS/masters.css';
import CustomFields from '../CustomFields/CustomFields';



class CustomerForm extends Component {
    constructor({ customer, addCustomer, updateCustomer, deleteCustomer, findLanguagesByName, findCountryByName,
        findStateByName, locatePaymentMethods, locateBillingSeries,
        tabCustomers, locateAddress,
        getCustomerAddresses, getCustomerSaleOrders, locateAccountForCustomer, getRegisterTransactionalLogs,
        checkVatNumber, getAddressesFunctions, getSalesOrdersFunctions, getCustomFieldsFunctions }) {
        super();

        this.customer = customer;
        this.addCustomer = addCustomer;
        this.updateCustomer = updateCustomer;
        this.deleteCustomer = deleteCustomer;
        this.tabCustomers = tabCustomers;
        this.locateAddress = locateAddress;


        this.findLanguagesByName = findLanguagesByName;
        this.findCountryByName = findCountryByName;
        this.findStateByName = findStateByName;
        this.locatePaymentMethods = locatePaymentMethods;
        this.locateBillingSeries = locateBillingSeries;

        this.getCustomerAddresses = getCustomerAddresses;
        this.getCustomerSaleOrders = getCustomerSaleOrders;
        this.locateAccountForCustomer = locateAccountForCustomer;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;
        this.checkVatNumber = checkVatNumber;

        this.getAddressesFunctions = getAddressesFunctions;
        this.getSalesOrdersFunctions = getSalesOrdersFunctions;
        this.getCustomFieldsFunctions = getCustomFieldsFunctions;

        this.currentSelectedLangId = customer != null ? customer.languageId : "";
        this.currentSelectedStateId = customer != null ? customer.stateId : "";
        this.currentSelectedCountryId = customer != null ? customer.countryId : "";
        this.currentSelectedPaymentMethodId = customer != null ? customer.paymentMethodId : "";
        this.currentSelectedBillingSerieId = customer != null ? customer.billingSeriesId : "";
        this.currentSelectedMainAddress = customer != null ? customer.mainAddressId : null;
        this.currentSelectedShippingAddress = customer != null ? customer.mainShippingAddressId : null;
        this.currentSelectedBillingAddress = customer != null ? customer.mainBillingAddressId : null;

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
        this.tabSaleOrders = this.tabSaleOrders.bind(this);
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

                document.getElementById("renderPaymentMethod").value = this.customer != null ? this.customer.paymentMethodId : "0";
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
                        this.tabSaleOrders();
                        break;
                    }
                    case 2: {
                        this.tabCustomFields();
                        break;
                    }
                }
            }}>
                <Tab label={i18next.t('addresses')} />
                <Tab label={i18next.t('sales-orders')} />
                <Tab label={i18next.t('custom-fields')} disabled={this.customer == null} />
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

                await ReactDOM.render(options, document.getElementById("accounts"));
                document.getElementById("accounts").value = this.customer != null ? (this.customer.accountId != null ? this.customer.accountId : '') : '';
            });
        });
    }

    getCustomerFromForm() {
        const customer = {};
        customer.name = this.name.current.value;
        customer.tradename = this.tradename.current.value;
        customer.fiscalName = this.fiscalName.current.value;
        customer.taxId = this.taxId.current.value;
        customer.vatNumber = this.vatNumber.current.value;
        customer.phone = this.phone.current.value;
        customer.email = this.email.current.value;
        customer.countryId = parseInt(this.currentSelectedCountryId);
        customer.stateId = parseInt(this.currentSelectedStateId);
        customer.languageId = parseInt(this.currentSelectedLangId);
        customer.paymentMethodId = parseInt(this.currentSelectedPaymentMethodId);
        customer.billingSeriesId = this.currentSelectedBillingSerieId;
        customer.mainAddressId = this.currentSelectedMainAddress;
        customer.mainShippingAddressId = this.currentSelectedShippingAddress;
        customer.mainBillingAddressId = this.currentSelectedBillingAddress;
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
        if (customer.email.length > 0 && !window.validateEmail(customer.email)) {
            errorMessage = i18next.t('invalid-email');
            return errorMessage;
        }
        if (customer.phone.length > 0 && !window.phoneIsValid(customer.phone)) {
            errorMessage = i18next.t('invalid-phone');
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
        ReactDOM.unmountComponentAtNode(document.getElementById('renderCustomerModal'));
        ReactDOM.render(
            <LocateAddress
                locateAddress={() => {
                    return this.locateAddress(this.customer.id);
                }}
                handleSelect={(addressId, addressName) => {
                    this.currentSelectedMainAddress = addressId;
                    this.mainAddress.current.value = addressName;
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
                    this.shippingAddress.current.value = addressName;
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
                    this.billingAddress.current.value = addressName;
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

    tabCustomFields() {
        this.tab = 2;
        this.tabs();

        const commonProps = this.getCustomFieldsFunctions();

        ReactDOM.render(<CustomFields
            {...commonProps}
            customerId={this.customer.id}
        />, this.refs.render);
    }

    checkVat() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderCustomerModal'));
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
                    />, document.getElementById('renderCustomerModal'));
                } else if (ok.errorCode == 2) {
                    ReactDOM.render(<AlertModal
                        modalTitle={i18next.t('VAT-NUMBER-CHECK')}
                        modalText={i18next.t('the-number-not-is-a-valid-vat-number')}
                    />, document.getElementById('renderCustomerModal'));
                }
            } else {
                ReactDOM.render(<AlertModal
                    modalTitle={i18next.t('VAT-NUMBER-CHECK-ERROR')}
                    modalText={i18next.t('an-unknown-error-ocurred')}
                />, document.getElementById('renderCustomerModal'));
            }
        });
    }

    render() {
        return <div id="tabCustomer" className="formRowRoot">
            <div id="renderCustomerModal"></div>
            <h4 className="ml-2">{i18next.t('customer')}</h4>
            <div class="form-row">
                <div class="col">
                    <TextField label={i18next.t('name')} variant="outlined" fullWidth size="small" inputRef={this.name}
                        defaultValue={this.customer != null ? this.customer.name : ''} inputProps={{ maxLength: 303 }} />
                </div>
                <div class="col">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateMainAddr}
                                disabled={this.customer == null}><HighlightIcon /></button>
                        </div>
                        <TextField label={i18next.t('main-address')} variant="outlined" fullWidth focused InputProps={{ readOnly: true }} size="small"
                            inputRef={this.mainAddress}
                            defaultValue={this.customer != null && this.customer.mainAddress != null ? this.customer.mainAddress.address : ''} />
                    </div>
                </div>
            </div>
            <div class="form-row mt-3">
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <TextField label={i18next.t('trade-name')} variant="outlined" fullWidth size="small" inputRef={this.tradename}
                                defaultValue={this.customer != null ? this.customer.tradename : ''} onChange={this.calcName} inputProps={{ maxLength: 150 }} />
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('fiscal-name')} variant="outlined" fullWidth size="small" inputRef={this.fiscalName}
                                defaultValue={this.customer != null ? this.customer.fiscalName : ''} onChange={this.calcName} inputProps={{ maxLength: 150 }} />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <AutocompleteField findByName={this.findCountryByName} defaultValueId={this.customer != null ? this.customer.countryId : null}
                                defaultValueName={this.customer != null && this.customer.country != null ? this.customer.country.name : ''}
                                valueChanged={(value) => {
                                    this.currentSelectedCountryId = value;
                                }}
                                label={i18next.t('country')} />
                        </div>
                        <div class="col">
                            <AutocompleteField findByName={this.findState} defaultValueId={this.customer != null ? this.customer.stateId : null}
                                defaultValueName={this.customer != null && this.customer.state != null ? this.customer.state.name : ''}
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
                                defaultValue={this.customer != null ? this.customer.taxId : ''} inputProps={{ maxLength: 25 }} />
                        </div>
                        <div class="col">
                            <div class="input-group mb-3">
                                <TextField label={i18next.t('vat-number')} variant="outlined" fullWidth size="small" inputRef={this.vatNumber}
                                    defaultValue={this.customer != null ? this.customer.vatNumber : ''} inputProps={{ maxLength: 25 }} />
                                <div class="input-group-append">
                                    <button class="btn btn-outline-secondary" type="button" onClick={this.checkVat}>
                                        <LibraryAddCheckIcon />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('date-created')} variant="outlined" fullWidth InputProps={{ readOnly: true }} size="small"
                                defaultValue={this.customer != null ? window.dateFormat(this.customer.dateCreated) : ''} />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateShippingAddr}
                                disabled={this.customer == null}><HighlightIcon /></button>
                        </div>
                        <TextField label={i18next.t('main-shipping-address')} variant="outlined" fullWidth focused InputProps={{ readOnly: true }} size="small"
                            inputRef={this.shippingAddress}
                            defaultValue={this.customer != null && this.customer.mainShippingAddressId != null ?
                                this.customer.mainShippingAddress.address : ''} />
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <TextField label={i18next.t('phone')} variant="outlined" fullWidth size="small" inputRef={this.phone}
                                defaultValue={this.customer != null ? this.customer.phone : ''} inputProps={{ maxLength: 25 }} />
                        </div>
                        <div class="col">
                            <TextField label={i18next.t('email')} variant="outlined" fullWidth size="small" inputRef={this.email} type="email"
                                defaultValue={this.customer != null ? this.customer.email : ''} inputProps={{ maxLength: 100 }} />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateBillingAddr}
                                disabled={this.customer == null}><HighlightIcon /></button>
                        </div>
                        <TextField label={i18next.t('main-billing-address')} variant="outlined" fullWidth focused InputProps={{ readOnly: true }} size="small"
                            inputRef={this.billingAddress}
                            defaultValue={this.customer != null && this.customer.mainBillingAddressId != null ?
                                this.customer.mainBillingAddress.address : ''} />
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="col">
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
                    <div class="form-row mt-3">
                        <div class="col">
                            <AutocompleteField findByName={this.findLanguagesByName} defaultValueId={this.country != null ? this.country.languageId : null}
                                defaultValueName={this.customer != null && this.customer.language != null ? this.customer.language.name : ''}
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
