import React, { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AutocompleteField from "../../AutocompleteField";
import { DataGrid } from '@material-ui/data-grid';

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

import './../../../CSS/settings.css';
import dateFormat from './../../../date.format.js'
import ConfirmDelete from "../../ConfirmDelete";
import AlertModal from "../../AlertModal";

import { TextField, FormControl, NativeSelect } from "@material-ui/core";
import { InputLabel } from "@mui/material";



class Settings extends Component {
    constructor({ settings, findWarehouseByName, updateSettings, getConfigAccountsVat, insertConfigAccountsVat, deleteConfigAccountsVat, getEnterpriseLogo,
        setEnterpriseLogo, deleteEnterpriseLogo, getLabelPrinterProfiles, insertLabelPrinterProfile, updateLabelPrinterProfile, deleteLabelPrinterProfile }) {
        super();

        this.settings = settings;
        this.findWarehouseByName = findWarehouseByName;
        this.updateSettings = updateSettings;

        this.getConfigAccountsVat = getConfigAccountsVat;
        this.insertConfigAccountsVat = insertConfigAccountsVat;
        this.deleteConfigAccountsVat = deleteConfigAccountsVat;

        this.getEnterpriseLogo = getEnterpriseLogo;
        this.setEnterpriseLogo = setEnterpriseLogo;
        this.deleteEnterpriseLogo = deleteEnterpriseLogo;
        this.getLabelPrinterProfiles = getLabelPrinterProfiles;
        this.insertLabelPrinterProfile = insertLabelPrinterProfile;
        this.updateLabelPrinterProfile = updateLabelPrinterProfile;
        this.deleteLabelPrinterProfile = deleteLabelPrinterProfile;

        this.currentSelectedWarehouseId = settings.defaultWarehouse;
        this.tab = 0;
        this.open = true;

        this.tabGeneral = this.tabGeneral.bind(this);
        this.tabEnterprise = this.tabEnterprise.bind(this);
        this.tabEcommerce = this.tabEcommerce.bind(this);
        this.tabEmail = this.tabEmail.bind(this);
        this.tabCurrency = this.tabCurrency.bind(this);
        this.tabCron = this.tabCron.bind(this);
        this.tabAccounting = this.tabAccounting.bind(this);
        this.saveTab = this.saveTab.bind(this);
        this.save = this.save.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.tabs();
            this.tabGeneral();
        }, 10);
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    tabs() {
        ReactDOM.render(<AppBar position="static" style={{ 'backgroundColor': '#3f51b5' }}>
            <Tabs value={this.tab} variant="scrollable" scrollButtons="auto" onChange={(_, tab) => {
                this.tab = tab;
                switch (tab) {
                    case 0: {
                        this.tabGeneral();
                        break;
                    }
                    case 1: {
                        this.tabEnterprise();
                        break;
                    }
                    case 2: {
                        this.tabEcommerce();
                        break;
                    }
                    case 3: {
                        this.tabEmail();
                        break;
                    }
                    case 4: {
                        this.tabCurrency();
                        break;
                    }
                    case 5: {
                        this.tabCron();
                        break;
                    }
                    case 6: {
                        this.tabAccounting();
                        break;
                    }
                    case 7: {
                        this.tabEmailAlerts();
                        break;
                    }
                    case 8: {
                        this.tabLabels();
                        break;
                    }
                }
            }}>
                <Tab label='General' />
                <Tab label={i18next.t('enterprise')} />
                <Tab label='E-Commerce' />
                <Tab label='Email' />
                <Tab label={i18next.t('currency')} />
                <Tab label='Cron' />
                <Tab label={i18next.t('accounting')} />
                <Tab label={i18next.t('email-alerts')} />
                <Tab label={i18next.t('labels')} />
            </Tabs>
        </AppBar>, this.refs.tabs);
    }

    saveTab(changes) {
        Object.keys(changes).forEach((key) => {
            if (typeof changes[key] === 'object') {
                Object.keys(changes[key]).forEach((key2) => {
                    this.settings[key][key2] = changes[key][key2];
                });
            } else {
                this.settings[key] = changes[key];
            }
        });
    }

    tabGeneral() {
        this.tab = 0;
        this.tabs();
        ReactDOM.render(<SettingsGeneral
            settings={this.settings}
            findWarehouseByName={this.findWarehouseByName}
            saveTab={this.saveTab}
        />, this.refs.render);
    }

    tabEnterprise() {
        this.tab = 1;
        this.tabs();
        ReactDOM.render(<SettingsEnterprise
            settings={this.settings}
            saveTab={this.saveTab}
            getEnterpriseLogo={this.getEnterpriseLogo}
            setEnterpriseLogo={this.setEnterpriseLogo}
            deleteEnterpriseLogo={this.deleteEnterpriseLogo}
        />, this.refs.render);
    }

    tabEcommerce() {
        this.tab = 2;
        this.tabs();
        ReactDOM.render(<SettingsEcommerce
            settings={this.settings.settingsEcommerce}
            saveTab={this.saveTab}
        />, this.refs.render);
    }

    tabEmail() {
        this.tab = 3;
        this.tabs();
        ReactDOM.render(<SettingsEmail
            settings={this.settings.settingsEmail}
            saveTab={this.saveTab}
        />, this.refs.render);
    }

    tabCurrency() {
        this.tab = 4;
        this.tabs();
        ReactDOM.render(<SettingsCurrency
            settings={this.settings}
            saveTab={this.saveTab}
        />, this.refs.render);
    }

    tabCron() {
        this.tab = 5;
        this.tabs();
        ReactDOM.render(<SettingsCron
            settings={this.settings}
            saveTab={this.saveTab}
        />, this.refs.render);
    }

    tabAccounting() {
        this.tab = 6;
        this.tabs();
        ReactDOM.render(<SettingsAccounting
            settings={this.settings}
            saveTab={this.saveTab}

            getConfigAccountsVat={this.getConfigAccountsVat}
            insertConfigAccountsVat={this.insertConfigAccountsVat}
            deleteConfigAccountsVat={this.deleteConfigAccountsVat}
        />, this.refs.render);
    }

    tabEmailAlerts() {
        this.tab = 7;
        this.tabs();
        ReactDOM.render(<SettingsEmailAlerts
            settings={this.settings}
            saveTab={this.saveTab}
        />, this.refs.render);
    }

    tabLabels() {
        this.tab = 8;
        this.tabs();
        ReactDOM.render(<SettingsLabels
            settings={this.settings}
            saveTab={this.saveTab}
            getLabelPrinterProfiles={this.getLabelPrinterProfiles}
            insertLabelPrinterProfile={this.insertLabelPrinterProfile}
            updateLabelPrinterProfile={this.updateLabelPrinterProfile}
            deleteLabelPrinterProfile={this.deleteLabelPrinterProfile}
        />, this.refs.render);
    }

    emailIsValid(email) {
        return String(email).toLowerCase().match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    }

    hostnameWithPortValid(hostname) {
        const colonCount = this.stringCount(hostname, ":");
        if (colonCount != 1) {
            return false;
        }

        const colonIndexOf = hostname.indexOf(":");
        if (colonIndexOf < 1) {
            return false;
        }

        const host = hostname.substring(0, colonIndexOf);
        if (host.length == 0) {
            return false;
        }

        const port = hostname.substring(colonIndexOf + 1);
        if (port.length == 0) {
            return false;
        }

        try {
            const portNum = parseInt(port);
            return portNum >= 1 && portNum <= 65535;
        } catch (_) {

        }
        return false;
    }

    stringCount(string, substring) {
        var count = 0;
        for (let i = 0; i < string.length; i++) {
            if (string[i] == substring) {
                count++;
            }
        }
        return count;
    }

    // 0: is valid
    // != 0: the tab where the error is
    isValid() {
        console.log(this.settings);
        var errorMessage = "";

        // TAB 1: GENERAL
        if (this.settings.defaultWarehouseId == null || this.settings.defaultWarehouseId.length <= 0) {
            errorMessage = i18next.t("you-must-select-a-default-warehouse");
        } else if (this.settings.dateFormat.length <= 0) {
            errorMessage = i18next.t("you-must-write-a-date-format");
        } else if (this.settings.dateFormat.length > 25) {
            errorMessage = i18next.t("the-date-format-cant-be-longer-than-25-characters");
        } else if (this.settings.barcodePrefix.length > 4) {
            errorMessage = i18next.t("the-barcode-prefix-cant-be-longer-than-4-digits");
        }

        if (errorMessage.length > 0) {
            ReactDOM.unmountComponentAtNode(this.refs.renderModal);
            ReactDOM.render(<AlertModal
                modalTitle={i18next.t('VALIDATION-ERROR')}
                modalText={errorMessage}
            />, this.refs.renderModal);
            return 1;
        }

        // TAB 2: ENTERPRISE
        if (this.settings.enterpriseName.length == 0) {
            errorMessage = i18next.t("the-enterprise-name-cant-be-empty");
        } else if (this.settings.enterpriseName.length >= 50) {
            errorMessage = i18next.t("the-enterprise-name-cant-be-longer-than-50-characters");
        } else if (this.settings.enterpriseDescription.length >= 250) {
            errorMessage = i18next.t("the-enterprise-description-cant-be-longer-than-250-characters");
        }

        if (errorMessage.length > 0) {
            ReactDOM.unmountComponentAtNode(this.refs.renderModal);
            ReactDOM.render(<AlertModal
                modalTitle={i18next.t('VALIDATION-ERROR')}
                modalText={errorMessage}
            />, this.refs.renderModal);
            return 2;
        }

        // TAB 3: E-COMMERCE
        if (this.settings.settingsEcommerce.ecommerce == "P") {
            if (this.settings.settingsEcommerce.prestaShopUrl.length > 100) {
                errorMessage = i18next.t("the-prestashop-url-cant-be-longer-than-100-characters");
            } else if (this.settings.settingsEcommerce.prestaShopApiKey.length > 32) {
                errorMessage = i18next.t("the-prestashop-api-key-cant-be-longer-than-32-characters");
            } else if (this.settings.settingsEcommerce.prestaShopUrl.length == 0) {
                errorMessage = i18next.t("the-prestashop-url-cant-be-empty");
            } else if (this.settings.settingsEcommerce.prestaShopApiKey.length == 0) {
                errorMessage = i18next.t("the-prestashop-api-key-cant-be-empty");
            } else if (this.settings.settingsEcommerce.prestaShopExportSerieId == null) {
                errorMessage = i18next.t("you-must-select-a-billing-series-for-the-export-orders");
            } else if (this.settings.settingsEcommerce.prestaShopIntracommunitySerieId == null) {
                errorMessage = i18next.t("you-must-select-a-billing-series-for-the-intracommunity-orders");
            } else if (this.settings.settingsEcommerce.prestaShopInteriorSerieId == null) {
                errorMessage = i18next.t("you-must-select-a-billing-series-for-the-interior-operations-orders");
            }
        } else if (this.settings.settingsEcommerce.ecommerce == "W") {
            if (this.settings.settingsEcommerce.woocommerceUrl.length > 100) {
                errorMessage = i18next.t("the-woocommerce-url-cant-be-longer-than-100-characters");
            } else if (this.settings.settingsEcommerce.woocommerceConsumerKey.length > 50) {
                errorMessage = i18next.t("the-woocommerce-consumter-key-cant-be-longer-than-50-characters");
            } else if (this.settings.settingsEcommerce.woocommerceConsumerSecret.length > 50) {
                errorMessage = i18next.t("the-woocommerce-consumter-secret-cant-be-longer-than-50-characters");
            } else if (this.settings.settingsEcommerce.woocommerceUrl.length == 0) {
                errorMessage = i18next.t("the-woocommerce-url-cant-be-empty");
            } else if (this.settings.settingsEcommerce.woocommerceConsumerKey.length == 0) {
                errorMessage = i18next.t("the-woocommerce-consumter-key-cant-be-empty");
            } else if (this.settings.settingsEcommerce.woocommerceConsumerSecret.length == 0) {
                errorMessage = i18next.t("the-woocommerce-consumter-secret-cant-be-empty");
            } else if (this.settings.settingsEcommerce.wooCommerceDefaultPaymentMethodId == null) {
                errorMessage = i18next.t("you-must-select-a-default-payment-method-for-the-orders");
            } else if (this.settings.settingsEcommerce.wooCommerceExportSerieId == null) {
                errorMessage = i18next.t("you-must-select-a-billing-series-for-the-export-orders");
            } else if (this.settings.settingsEcommerce.wooCommerceIntracommunitySerieId == null) {
                errorMessage = i18next.t("you-must-select-a-billing-series-for-the-intracommunity-orders");
            } else if (this.settings.settingsEcommerce.wooCommerceInteriorSerieId == null) {
                errorMessage = i18next.t("you-must-select-a-billing-series-for-the-interior-operations-orders");
            }
        } else if (this.settings.settingsEcommerce.ecommerce == "S") {
            if (this.settings.settingsEcommerce.shopifyUrl.length > 100) {
                errorMessage = i18next.t("the-shopify-url-cant-be-longer-than-100-characters");
            } else if (this.settings.settingsEcommerce.shopifyToken.length > 50) {
                errorMessage = i18next.t("the-shopify-token-cant-be-longer-than-50-characters");
            } else if (this.settings.settingsEcommerce.shopifyUrl.length == 0) {
                errorMessage = i18next.t("the-shopify-url-cant-be-empty");
            } else if (this.settings.settingsEcommerce.shopifyToken.length == 0) {
                errorMessage = i18next.t("the-shopify-token-cant-be-empty");
            } else if (this.settings.settingsEcommerce.shopifyDefaultPaymentMethodId == null) {
                errorMessage = i18next.t("you-must-select-a-default-payment-method-for-the-orders");
            } else if (this.settings.settingsEcommerce.shopifyExportSerieId == null) {
                errorMessage = i18next.t("you-must-select-a-billing-series-for-the-export-orders");
            } else if (this.settings.settingsEcommerce.shopifyIntracommunitySerieId == null) {
                errorMessage = i18next.t("you-must-select-a-billing-series-for-the-intracommunity-orders");
            } else if (this.settings.settingsEcommerce.shopifyInteriorSerieId == null) {
                errorMessage = i18next.t("you-must-select-a-billing-series-for-the-interior-operations-orders");
            }
        }

        if (errorMessage.length > 0) {
            ReactDOM.unmountComponentAtNode(this.refs.renderModal);
            ReactDOM.render(<AlertModal
                modalTitle={i18next.t('VALIDATION-ERROR')}
                modalText={errorMessage}
            />, this.refs.renderModal);
            return 3;
        }

        // TAB 4: EMAIL
        if (this.settings.settingsEmail.email == "S") {
            if (this.settings.settingsEmail.sendGridKey.length > 75) {
                errorMessage = i18next.t("the-sendgrid-key-cant-be-longer-than-75-characters");
            } else if (this.settings.settingsEmail.emailFrom.length > 50) {
                errorMessage = i18next.t("the-email-from-cant-be-longer-than-50-characters");
            } else if (this.settings.settingsEmail.nameFrom.length > 50) {
                errorMessage = i18next.t("the-name-from-cant-be-longer-than-50-characters");
            } else if (this.settings.settingsEmail.sendGridKey.length == 0) {
                errorMessage = i18next.t("the-sendgrid-key-cant-be-empty");
            } else if (this.settings.settingsEmail.emailFrom.length == 0) {
                errorMessage = i18next.t("the-email-from-cant-be-empty");
            } else if (this.settings.settingsEmail.nameFrom.length == 0) {
                errorMessage = i18next.t("the-name-from-cant-be-empty");
            } else if (!this.emailIsValid(this.settings.settingsEmail.emailFrom)) {
                errorMessage = i18next.t("the-email-from-must-be-a-valid-email-address");
            }
        } else if (this.settings.settingsEmail.email == "T") {
            if (this.settings.settingsEmail.SMTPIdentity.length > 50) {
                errorMessage = i18next.t("the-smtp-identity-cant-be-longer-than-50-characters");
            } else if (this.settings.settingsEmail.SMTPUsername.length > 50) {
                errorMessage = i18next.t("the-smtp-username-cant-be-longer-than-50-characters");
            } else if (this.settings.settingsEmail.SMTPPassword.length > 50) {
                errorMessage = i18next.t("the-smtp-password-cant-be-longer-than-50-characters");
            } else if (this.settings.settingsEmail.SMTPHostname.length > 50) {
                errorMessage = i18next.t("the-smtp-host-cant-be-longer-than-50-characters");
            } else if (this.settings.settingsEmail.SMTPReplyTo.length > 50) {
                errorMessage = i18next.t("the-smtp-reply-to-cant-be-longer-than-50-characters");
            } else if (this.settings.settingsEmail.SMTPUsername.length == 0) {
                errorMessage = i18next.t("the-smtp-username-cant-be-empty");
            } else if (this.settings.settingsEmail.SMTPPassword.length == 0) {
                errorMessage = i18next.t("the-smtp-password-cant-be-empty");
            } else if (this.settings.settingsEmail.SMTPHostname.length == 0) {
                errorMessage = i18next.t("the-smtp-host-cant-be-empty");
            } else if (!this.emailIsValid(this.settings.settingsEmail.SMTPUsername)) {
                errorMessage = i18next.t("the-smtp-username-must-be-a-valid-email-address");
            } else if (!this.hostnameWithPortValid(this.settings.settingsEmail.SMTPHostname)) {
                errorMessage = i18next.t("the-smtp-host-must-be-a-valid-email-hostname-in-the-following-format-hostname-port");
            }
        }

        if (errorMessage.length > 0) {
            ReactDOM.unmountComponentAtNode(this.refs.renderModal);
            ReactDOM.render(<AlertModal
                modalTitle={i18next.t('VALIDATION-ERROR')}
                modalText={errorMessage}
            />, this.refs.renderModal);
            return 4;
        }

        // TAB 5: CURRENCY
        if (this.settings.currencyECBurl.length > 100) {
            errorMessage = i18next.t("the-currency-exchange-webservice-url-cant-be-longer-than-100-characters");
        } else if (this.settings.currency == "E") {
            if (this.settings.currencyECBurl.length == 0) {
                errorMessage = i18next.t("the-currency-exchange-webservice-url-cant-be-empty");
            }
        }

        if (errorMessage.length > 0) {
            ReactDOM.unmountComponentAtNode(this.refs.renderModal);
            ReactDOM.render(<AlertModal
                modalTitle={i18next.t('VALIDATION-ERROR')}
                modalText={errorMessage}
            />, this.refs.renderModal);
            return 5;
        }

        // TAB 6: CRON
        if (this.settings.cronCurrency.length > 25) {
            errorMessage = i18next.t("the-currency-cron-cant-have-more-than-25-characters");
        } else if (this.settings.cronPrestaShop.length > 25) {
            errorMessage = i18next.t("the-prestashop-cron-cant-have-more-than-25-characters");
        } else if (this.settings.cronSendCloudTracking.length > 25) {
            errorMessage = i18next.t("the-sendcloud-tracking-cron-cant-have-more-than-25-characters");
        }

        if (errorMessage.length > 0) {
            ReactDOM.unmountComponentAtNode(this.refs.renderModal);
            ReactDOM.render(<AlertModal
                modalTitle={i18next.t('VALIDATION-ERROR')}
                modalText={errorMessage}
            />, this.refs.renderModal);
            return 6;
        }

        // TAB 7: ACCOUNTING

        // TAB 8: EMAIL ALERTS
        if (this.settings.settingsEmail.emailSendErrorEcommerce.length > 150) {
            errorMessage = i18next.t("the-email-to-send-errors-in-ecommerce-synchronization-cant-have-more-than-150-characters");
        } else if (this.settings.settingsEmail.emailSendErrorSendCloud.length > 150) {
            errorMessage = i18next.t("the-email-to-send-errors-in-sendcloud-shippings-cant-have-more-than-150-characters");
        }

        if (errorMessage.length > 0) {
            ReactDOM.unmountComponentAtNode(this.refs.renderModal);
            ReactDOM.render(<AlertModal
                modalTitle={i18next.t('VALIDATION-ERROR')}
                modalText={errorMessage}
            />, this.refs.renderModal);
            return 8;
        }

        // TAB 9: LABELS

        return 0;
    }

    async save() {
        await ReactDOM.unmountComponentAtNode(this.refs.render);

        const errorTab = this.isValid();
        if (errorTab != 0) {
            switch (errorTab - 1) {
                case 0: {
                    this.tabGeneral();
                    break;
                }
                case 1: {
                    this.tabEnterprise();
                    break;
                }
                case 2: {
                    this.tabEcommerce();
                    break;
                }
                case 3: {
                    this.tabEmail();
                    break;
                }
                case 4: {
                    this.tabCurrency();
                    break;
                }
                case 5: {
                    this.tabCron();
                    break;
                }
                case 6: {
                    this.tabAccounting();
                    break;
                }
                case 7: {
                    this.tabEmailAlerts();
                    break;
                }
                case 8: {
                    this.tabLabels();
                    break;
                }
            }
            return;
        }

        this.updateSettings(this.settings).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
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
        return <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'lg'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('settings')}
            </this.DialogTitle>
            <DialogContent>
                <div ref="renderModal"></div>

                <div ref="tabs"></div>

                <div ref="render">
                </div>

            </DialogContent>
            <DialogActions>
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                <button type="button" class="btn btn-primary" onClick={this.save}>{i18next.t('save')}</button>
            </DialogActions>
        </Dialog>
    }
}

class SettingsGeneral extends Component {
    constructor({ settings, findWarehouseByName, saveTab }) {
        super();

        this.settings = settings;
        this.findWarehouseByName = findWarehouseByName;
        this.saveTab = saveTab;

        this.defaultVatPercent = React.createRef();
        this.dateFormat = React.createRef();
        this.barcodePrefix = React.createRef();
        this.passwordMinimumLength = React.createRef();
        this.palletWeight = React.createRef();
        this.palletWidth = React.createRef();
        this.palletHeight = React.createRef();
        this.palletDepth = React.createRef();
        this.maxConnections = React.createRef();
        this.minimumStockSalesPeriods = React.createRef();
        this.minimumStockSalesDays = React.createRef();
        this.undoManufacturingOrderSeconds = React.createRef();

        this.currentSelectedWarehouseId = settings.defaultWarehouseId;
    }

    componentWillUnmount() {
        this.saveTab({
            defaultVatPercent: parseInt(this.defaultVatPercent.current.value),
            dateFormat: this.dateFormat.current.value,
            defaultWarehouseId: this.currentSelectedWarehouseId,
            barcodePrefix: this.barcodePrefix.current.value,
            palletWeight: parseFloat(this.palletWeight.current.value),
            palletWidth: parseFloat(this.palletWidth.current.value),
            palletHeight: parseFloat(this.palletHeight.current.value),
            palletDepth: parseFloat(this.palletDepth.current.value),
            maxConnections: parseInt(this.maxConnections.current.value),
            minimumStockSalesPeriods: parseInt(this.minimumStockSalesPeriods.current.value),
            minimumStockSalesDays: parseInt(this.minimumStockSalesDays.current.value),
            enableApiKey: this.refs.enableApiKey.checked,
            connectionLog: this.refs.connectionLog.checked,
            filterConnections: this.refs.filterConnections.checked,
            passwordMinumumComplexity: document.getElementById("passwordMinumumComplexity").value,
            passwordMinimumLength: parseInt(this.passwordMinimumLength.current.value),
            undoManufacturingOrderSeconds: parseInt(this.undoManufacturingOrderSeconds.current.value),
        });
    }

    render() {
        return <div>
            <div class="form-row mt-3">
                <div class="col">
                    <TextField id="defaultVatPercent" label={i18next.t('default-vat-percent')} variant="outlined"
                        fullWidth size="small" type="number" inputRef={this.defaultVatPercent}
                        defaultValue={this.settings.defaultVatPercent} InputProps={{ inputProps: { min: 0 } }} />
                </div>
                <div class="col">
                    <TextField id="dateFormat" label={i18next.t('date-format')} variant="outlined"
                        fullWidth size="small" inputRef={this.dateFormat} defaultValue={this.settings.dateFormat} />
                    <a href="https://blog.stevenlevithan.com/archives/date-time-format">{i18next.t('documentation')}</a>
                </div>
            </div>
            <div class="form-group">
                <AutocompleteField findByName={this.findWarehouseByName}
                    defaultValueId={this.settings.defaultWarehouseId} defaultValueName={this.settings.defaultWarehouse == null ? '' : this.settings.defaultWarehouse.name}
                    valueChanged={(value) => {
                        this.currentSelectedWarehouseId = value;
                    }}
                    label={i18next.t('default-warehouse')} />
            </div>
            <div class="form-row mt-3">
                <div class="col">
                    <TextField id="defaultVatPercent" label={i18next.t('barcode-prefix')} variant="outlined"
                        fullWidth size="small" type="number" inputRef={this.barcodePrefix}
                        defaultValue={this.settings.barcodePrefix} InputProps={{ inputProps: { min: 0 } }} />
                </div>
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <FormControl fullWidth>
                                <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('minimum-password-complexity')}</InputLabel>
                                <NativeSelect
                                    style={{ 'marginTop': '0' }}
                                    id="passwordMinumumComplexity"
                                    defaultValue={this.settings.passwordMinumumComplexity}>
                                    <option value="A">{i18next.t('alphabetical')}</option>
                                    <option value="B">{i18next.t('alphabetical-+-numbers')}</option>
                                    <option value="C">{i18next.t('uppercase-+-lowercase-+-numbers')}</option>
                                    <option value="D">{i18next.t('uppercase-+-lowercase-+-numbers-+-symbols')}</option>
                                </NativeSelect>
                            </FormControl>
                        </div>
                        <div class="col">
                            <TextField id="passwordMinimumLength" label={i18next.t('minimum-password-length')} variant="outlined"
                                fullWidth size="small" type="number" inputRef={this.passwordMinimumLength}
                                defaultValue={this.settings.passwordMinimumLength} InputProps={{ inputProps: { min: 6 } }} />
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-row mt-3">
                <div class="col">
                    <TextField id="palletWeight" label={i18next.t('pallet-weight')} variant="outlined"
                        fullWidth size="small" type="number" inputRef={this.palletWeight}
                        defaultValue={this.settings.palletWeight} InputProps={{ inputProps: { min: 0 } }} />
                </div>
                <div class="col">
                    <TextField id="palletWidth" label={i18next.t('pallet-width')} variant="outlined"
                        fullWidth size="small" type="number" inputRef={this.palletWidth}
                        defaultValue={this.settings.palletWidth} InputProps={{ inputProps: { min: 0 } }} />
                </div>
                <div class="col">
                    <TextField id="palletHeight" label={i18next.t('pallet-width')} variant="outlined"
                        fullWidth size="small" type="number" inputRef={this.palletHeight}
                        defaultValue={this.settings.palletHeight} InputProps={{ inputProps: { min: 0 } }} />
                </div>
                <div class="col">
                    <TextField id="palletDepth" label={i18next.t('pallet-depth')} variant="outlined"
                        fullWidth size="small" type="number" inputRef={this.palletDepth}
                        defaultValue={this.settings.palletDepth} InputProps={{ inputProps: { min: 0 } }} />
                </div>
            </div>
            <div class="form-row mt-3">
                <div class="col">
                    <TextField id="maxConnections" label={i18next.t('maximum-connections')} variant="outlined"
                        fullWidth size="small" type="number" inputRef={this.maxConnections}
                        defaultValue={this.settings.maxConnections} InputProps={{ inputProps: { min: 1 } }} />
                </div>
                <div class="col">
                    <div class="custom-control custom-switch" style={{ 'marginTop': '2%' }}>
                        <input type="checkbox" class="custom-control-input" ref="enableApiKey" id="enableApiKey"
                            defaultChecked={this.settings.enableApiKey} />
                        <label class="custom-control-label" htmlFor="enableApiKey">{i18next.t('enable-api-key')}</label>
                    </div>
                </div>
                <div class="col">
                    <div class="custom-control custom-switch" style={{ 'marginTop': '2%' }}>
                        <input type="checkbox" defaultChecked={this.settings.connectionLog} ref="connectionLog" onChange={() => {
                            if (!this.refs.connectionLog.checked) {
                                this.refs.filterConnections.checked = false;
                            }
                        }} id="connectionLog" class="custom-control-input" />
                        <label class="custom-control-label" htmlFor="connectionLog">{i18next.t('connection-log')}</label>
                    </div>
                </div>
                <div class="col">
                    <div class="custom-control custom-switch" style={{ 'marginTop': '2%' }}>
                        <input type="checkbox" defaultChecked={this.settings.filterConnections} ref="filterConnections" onChange={() => {
                            if (this.refs.filterConnections.checked) {
                                this.refs.connectionLog.checked = true;
                            }
                        }} class="custom-control-input" id="filterConnections" />
                        <label class="custom-control-label" htmlFor="filterConnections">{i18next.t('filter-connections')}</label>
                    </div>
                </div>
            </div>
            <div class="form-row mt-3">
                <div class="col">
                    <TextField id="minimumStockSalesPeriods" label={i18next.t('minimum-stock-sales-periods')} variant="outlined"
                        fullWidth size="small" type="number" inputRef={this.minimumStockSalesPeriods}
                        defaultValue={this.settings.minimumStockSalesPeriods} InputProps={{ inputProps: { min: 0 } }} />
                </div>
                <div class="col">
                    <TextField id="minimumStockSalesDays" label={i18next.t('minimum-stock-sales-days')} variant="outlined"
                        fullWidth size="small" type="number" inputRef={this.minimumStockSalesDays}
                        defaultValue={this.settings.minimumStockSalesDays} InputProps={{ inputProps: { min: 0 } }} />
                </div>
            </div>
            <div class="form-row mt-3">
                <div class="col">
                    <TextField id="undoManufacturingOrderSeconds" label={i18next.t('seconds-to-undo-manufacturing-order-manufactured')} variant="outlined"
                        fullWidth size="small" type="number" inputRef={this.undoManufacturingOrderSeconds}
                        defaultValue={this.settings.undoManufacturingOrderSeconds} InputProps={{ inputProps: { min: 0 } }} />
                </div>
                <div class="col">
                </div>
            </div>
        </div >
    }
}

class SettingsEnterprise extends Component {
    constructor({ settings, saveTab, getEnterpriseLogo, setEnterpriseLogo, deleteEnterpriseLogo }) {
        super();

        this.settings = settings;
        this.saveTab = saveTab;

        this.getEnterpriseLogo = getEnterpriseLogo;
        this.setEnterpriseLogo = setEnterpriseLogo;
        this.deleteEnterpriseLogo = deleteEnterpriseLogo;

        this.enterpriseName = React.createRef();
        this.enterpriseDescription = React.createRef();

        this.uploadFile = this.uploadFile.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        this.renderEnterpriseLogo();
    }

    renderEnterpriseLogo() {
        this.getEnterpriseLogo().then((data) => {
            if (data.base64.length > 0) {
                this.refs.logoImg.src = "data:" + data.mimeType + ";base64," + data.base64;
                this.refs.noImage.style.display = "none";
                this.refs.logoImg.style.display = "";
            } else {
                this.refs.noImage.style.display = "";
                this.refs.logoImg.style.display = "none";
            }
        });
    }

    componentWillUnmount() {
        this.saveTab({
            enterpriseName: this.enterpriseName.current.value,
            enterpriseDescription: this.enterpriseDescription.current.value
        });
    }

    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = (error) => {
                reject('Error: ', error);
            };
        });
    }

    async uploadFile() {
        if (this.refs.logoFileInput.files.length != 1) {
            return;
        }

        var base64 = await this.getBase64(this.refs.logoFileInput.files[0]);
        const index = base64.indexOf("base64,")
        base64 = base64.substr(index + "base64,".length);
        this.setEnterpriseLogo(base64).then((ok) => {
            if (ok) {
                this.renderEnterpriseLogo();
            } else {
                ReactDOM.unmountComponentAtNode(this.refs.renderModal);
                ReactDOM.render(<AlertModal
                    modalTitle={i18next.t('error-ocurred')}
                    modalText={i18next.t('img-enterprise-logo-error-dsc')}
                />, this.refs.renderModal);
            }
        })
    }

    delete() {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(<ConfirmDelete
            onDelete={() => {
                this.deleteEnterpriseLogo().then((ok) => {
                    if (ok) {
                        this.renderEnterpriseLogo();
                    }
                });
            }}
        />, this.refs.renderModal);
    }

    render() {
        return <div>
            <div ref="renderModal"></div>
            <h5>Logo</h5>
            <img alt="LOGO" ref="logoImg" />
            <p style={{ 'display': 'none' }} ref="noImage">{i18next.t('no-image-selected')}</p>
            <div class="form-row">
                <div class="col">
                    <input type="file" class="form-control-file ml-1 mt-1 mb-1" ref="logoFileInput" />
                </div>
                <div class="col">
                    <button type="button" class="btn btn-primary ml-1 mt-1 mb-1" onClick={this.uploadFile}>{i18next.t('upload-image')}</button>
                    <button type="button" class="btn btn-danger ml-1 mt-1 mb-1" onClick={this.delete}>{i18next.t('delete-image')}</button>
                </div>
            </div>
            <h5>{i18next.t('details')}</h5>
            <br />
            <TextField label={i18next.t('enterprise-key')} variant="outlined" fullWidth size="small"
                defaultValue={this.settings.enterpriseKey} InputProps={{ readOnly: true }} />
            <br />
            <br />
            <TextField label={i18next.t('enterprise-name')} variant="outlined" fullWidth size="small" inputRef={this.enterpriseName}
                defaultValue={this.settings.enterpriseName} />
            <br />
            <br />
            <TextField label={i18next.t('enterprise-description')} variant="outlined" fullWidth size="small" inputRef={this.enterpriseDescription}
                defaultValue={this.settings.enterpriseDescription} />
        </div>
    }
}

class SettingsEcommerce extends Component {
    constructor({ settings, saveTab }) {
        super();

        this.settings = settings;
        this.saveTab = saveTab;

        this.prestaShopUrl = React.createRef();
        this.prestaShopApiKey = React.createRef();
        this.prestaShopLanguageId = React.createRef();
        this.prestaShopExportSerie = React.createRef();
        this.prestaShopIntracommunitySerie = React.createRef();
        this.prestaShopInteriorSerie = React.createRef();
        this.prestashopStatusPaymentAccepted = React.createRef();
        this.prestashopStatusShipped = React.createRef();

        this.woocommerceUrl = React.createRef();
        this.woocommerceConsumerKey = React.createRef();
        this.woocommerceConsumerSecret = React.createRef();
        this.wooCommerceExportSerie = React.createRef();
        this.wooCommerceIntracommunitySerie = React.createRef();
        this.wooCommerceInteriorSerie = React.createRef();
        this.wooCommerceDefaultPaymentMethod = React.createRef();

        this.shopifyUrl = React.createRef();
        this.shopifyToken = React.createRef();
        this.shopifyExportSerie = React.createRef();
        this.shopifyIntracommunitySerie = React.createRef();
        this.shopifyInteriorSerie = React.createRef();
        this.shopifyDefaultPaymentMethod = React.createRef();
        this.shopifyShopLocationId = React.createRef();
    }

    componentWillUnmount() {
        const ecommerce = document.getElementById("ecommerce").value;
        const data = {
            ecommerce: ecommerce
        };
        if (ecommerce == "P") {
            data.prestaShopUrl = this.prestaShopUrl.current.value;
            data.prestaShopApiKey = this.prestaShopApiKey.current.value;
            data.prestaShopLanguageId = parseInt(this.prestaShopLanguageId.current.value);
            data.prestaShopExportSerieId = this.prestaShopExportSerie.current.value;
            data.prestaShopIntracommunitySerieId = this.prestaShopIntracommunitySerie.current.value;
            data.prestaShopInteriorSerieId = this.prestaShopInteriorSerie.current.value;
            data.prestashopStatusPaymentAccepted = parseInt(this.prestashopStatusPaymentAccepted.current.value);
            data.prestashopStatusShipped = parseInt(this.prestashopStatusShipped.current.value);
        } else if (ecommerce == "W") {
            data.woocommerceUrl = this.woocommerceUrl.current.value;
            data.woocommerceConsumerKey = this.woocommerceConsumerKey.current.value;
            data.woocommerceConsumerSecret = this.woocommerceConsumerSecret.current.value;
            data.wooCommerceExportSerieId = this.wooCommerceExportSerie.current.value;
            data.wooCommerceIntracommunitySerieId = this.wooCommerceIntracommunitySerie.current.value;
            data.wooCommerceInteriorSerieId = this.wooCommerceInteriorSerie.current.value;
            data.wooCommerceDefaultPaymentMethodId = (this.wooCommerceDefaultPaymentMethod.current.value == "" ||
                this.wooCommerceDefaultPaymentMethod.current.value == "0" ?
                null : parseInt(this.wooCommerceDefaultPaymentMethod.current.value));
        } else if (ecommerce == "S") {
            data.shopifyUrl = this.shopifyUrl.current.value;
            data.shopifyToken = this.shopifyToken.current.value;
            data.shopifyExportSerieId = this.shopifyExportSerie.current.value;
            data.shopifyIntracommunitySerieId = this.shopifyIntracommunitySerie.current.value;
            data.shopifyInteriorSerieId = this.shopifyInteriorSerie.current.value;
            data.shopifyDefaultPaymentMethodId = (this.shopifyDefaultPaymentMethod.current.value == "" ||
                this.shopifyDefaultPaymentMethod.current.value == "0" ?
                null : parseInt(this.shopifyDefaultPaymentMethod.current.value));
            data.shopifyShopLocationId = parseInt(this.shopifyShopLocationId.current.value);
        }
        this.saveTab({
            settingsEcommerce: data
        });
    }

    render() {
        return <div>
            <br />
            <FormControl fullWidth>
                <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('ecommerce-platform')}</InputLabel>
                <NativeSelect
                    style={{ 'marginTop': '0' }}
                    id="ecommerce"
                    onClick={() => {
                        this.settings.ecommerce = document.getElementById("ecommerce").value;
                        this.forceUpdate();
                    }} defaultValue={this.settings.ecommerce}>
                    <option value="_">{i18next.t('no-ecommerce-connected')}</option>
                    <option value="P">PrestaShop</option>
                    <option value="W">WooCommerce</option>
                    <option value="S">Shopify</option>
                </NativeSelect>
            </FormControl>
            {this.settings.ecommerce != 'P' ? null : <div>
                <br />
                <TextField label='PrestaShop API URL' variant="outlined" fullWidth size="small" inputRef={this.prestaShopUrl}
                    defaultValue={this.settings.prestaShopUrl} />
                <br />
                <br />
                <TextField label='PrestaShop API KEY' variant="outlined" fullWidth size="small" inputRef={this.prestaShopApiKey}
                    defaultValue={this.settings.prestaShopApiKey} />
                <br />
                <br />
                <TextField label={i18next.t('prestashop-language-id')} variant="outlined" fullWidth size="small" inputRef={this.prestaShopLanguageId}
                    type="number" defaultValue={this.settings.prestaShopLanguageId} InputProps={{ inputProps: { min: 0 } }} />
                <br />
                <br />
                <TextField label={i18next.t('prestashop-export-serie-key')} variant="outlined" fullWidth size="small" inputRef={this.prestaShopExportSerie}
                    defaultValue={this.settings.prestaShopExportSerieId} />
                <br />
                <br />
                <TextField label={i18next.t('prestashop-intracommunity-operations-serie')} variant="outlined" fullWidth size="small"
                    inputRef={this.prestaShopIntracommunitySerie} defaultValue={this.settings.prestaShopIntracommunitySerieId} />
                <br />
                <br />
                <TextField label={i18next.t('prestashop-interior-operations-serie')} variant="outlined" fullWidth size="small"
                    inputRef={this.prestaShopInteriorSerie} defaultValue={this.settings.prestaShopInteriorSerieId} />
                <br />
                <br />
                <div class="form-row">
                    <div class="col">
                        <TextField label={i18next.t('prestashop-status-payment-accepted-id')} variant="outlined" fullWidth size="small" type="number"
                            inputRef={this.prestashopStatusPaymentAccepted} defaultValue={this.settings.prestashopStatusPaymentAccepted}
                            InputProps={{ inputProps: { min: 0 } }} />
                    </div>
                    <div class="col">
                        <TextField label={i18next.t('prestashop-status-shipped-id')} variant="outlined" fullWidth size="small" type="number"
                            inputRef={this.prestashopStatusShipped} defaultValue={this.settings.prestashopStatusShipped}
                            InputProps={{ inputProps: { min: 0 } }} />
                    </div>
                </div>
            </div>}
            {this.settings.ecommerce != 'W' ? null : <div>
                <br />
                <TextField label='WooCommerce API URL' variant="outlined" fullWidth size="small" inputRef={this.woocommerceUrl}
                    defaultValue={this.settings.woocommerceUrl} />
                <br />
                <br />
                <TextField label='WooCommerce consumer key' variant="outlined" fullWidth size="small" inputRef={this.woocommerceConsumerKey}
                    defaultValue={this.settings.woocommerceConsumerKey} />
                <br />
                <br />
                <TextField label='WooCommerce consumer secret' variant="outlined" fullWidth size="small" inputRef={this.woocommerceConsumerSecret}
                    defaultValue={this.settings.woocommerceConsumerSecret} />
                <br />
                <br />
                <TextField label={i18next.t('woocommerce-export-serie-key')} variant="outlined" fullWidth size="small" inputRef={this.wooCommerceExportSerie}
                    defaultValue={this.settings.wooCommerceExportSerieId} />
                <br />
                <br />
                <TextField label={i18next.t('woocommerce-intracommunity-operations-serie')} variant="outlined" fullWidth size="small"
                    inputRef={this.wooCommerceIntracommunitySerie} defaultValue={this.settings.wooCommerceIntracommunitySerieId} />
                <br />
                <br />
                <TextField label={i18next.t('woocommerce-interior-operations-serie')} variant="outlined" fullWidth size="small"
                    inputRef={this.wooCommerceInteriorSerie} defaultValue={this.settings.wooCommerceInteriorSerieId} />
                <br />
                <br />
                <TextField label={i18next.t('woocommerce-default-payment-method')} variant="outlined" fullWidth size="small" type="number"
                    inputRef={this.wooCommerceDefaultPaymentMethod} defaultValue={this.settings.wooCommerceDefaultPaymentMethodId}
                    InputProps={{ inputProps: { min: 0 } }} />
            </div>}
            {this.settings.ecommerce != 'S' ? null : <div>
                <br />
                <TextField label='Shopify API URL' variant="outlined" fullWidth size="small" inputRef={this.shopifyUrl}
                    defaultValue={this.settings.shopifyUrl} />
                <br />
                <br />
                <TextField label='Shopify token' variant="outlined" fullWidth size="small" inputRef={this.shopifyToken}
                    defaultValue={this.settings.shopifyToken} />
                <br />
                <br />
                <TextField label={i18next.t('shopify-export-serie-key')} variant="outlined" fullWidth size="small" inputRef={this.shopifyExportSerie}
                    defaultValue={this.settings.shopifyExportSerieId} />
                <br />
                <br />
                <TextField label={i18next.t('shopify-intracommunity-operations-serie')} variant="outlined" fullWidth size="small"
                    inputRef={this.shopifyIntracommunitySerie} defaultValue={this.settings.shopifyIntracommunitySerieId} />
                <br />
                <br />
                <TextField label={i18next.t('shopify-interior-operations-serie')} variant="outlined" fullWidth size="small" inputRef={this.shopifyInteriorSerie}
                    defaultValue={this.settings.shopifyInteriorSerieId} />
                <br />
                <br />
                <TextField label={i18next.t('shopify-default-payment-method')} variant="outlined" fullWidth size="small" type="number"
                    inputRef={this.shopifyDefaultPaymentMethod} defaultValue={this.settings.shopifyDefaultPaymentMethodId}
                    InputProps={{ inputProps: { min: 0 } }} />
                <br />
                <br />
                <TextField label='Shopify shop location ID' variant="outlined" fullWidth size="small" type="number"
                    inputRef={this.shopifyShopLocationId} defaultValue={this.settings.shopifyShopLocationId}
                    InputProps={{ inputProps: { min: 0 } }} />
            </div>}
        </div>
    }
}

class SettingsEmail extends Component {
    constructor({ settings, saveTab }) {
        super();

        this.settings = settings;
        this.saveTab = saveTab;

        this.sendGridKey = React.createRef();
        this.emailFrom = React.createRef();
        this.nameFrom = React.createRef();

        this.SMTPIdentity = React.createRef();
        this.SMTPUsername = React.createRef();
        this.SMTPPassword = React.createRef();
        this.SMTPHostname = React.createRef();
        this.SMTPReplyTo = React.createRef();
    }

    componentWillUnmount() {
        const email = document.getElementById("email").value;
        const data = {
            email: email,
        };
        if (email == "S") {
            data.sendGridKey = this.sendGridKey.current.value;
            data.emailFrom = this.emailFrom.current.value;
            data.nameFrom = this.nameFrom.current.value;
        } else if (email == "T") {
            data.SMTPIdentity = this.SMTPIdentity.current.value;
            data.SMTPUsername = this.SMTPUsername.current.value;
            data.SMTPPassword = this.SMTPPassword.current.value;
            data.SMTPHostname = this.SMTPHostname.current.value;
            data.SMTPSTARTTLS = this.refs.SMTPSTARTTLS.checked;
            data.SMTPReplyTo = this.SMTPReplyTo.current.value;
        }
        this.saveTab({
            settingsEmail: data
        });
    }

    render() {
        return <div>
            <br />
            <FormControl fullWidth>
                <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('email-platform')}</InputLabel>
                <NativeSelect
                    style={{ 'marginTop': '0' }}
                    id="email"
                    defaultValue={this.settings.email}
                    onClick={() => {
                        this.settings.email = document.getElementById("email").value;
                        this.forceUpdate();
                    }}>
                    <option value="_">{i18next.t('no-email-configured')}</option>
                    <option value="S">SendGrid</option>
                    <option value="T">SMTP</option>
                </NativeSelect>
            </FormControl>
            {this.settings.email == "S" ?
                <div>
                    <br />
                    <TextField label={i18next.t('sendgrid-key')} variant="outlined" fullWidth size="small" inputRef={this.sendGridKey}
                        defaultValue={this.settings.sendGridKey} />
                    <br />
                    <br />
                    <TextField label={i18next.t('email-from')} variant="outlined" fullWidth size="small" inputRef={this.emailFrom}
                        defaultValue={this.settings.emailFrom} />
                    <br />
                    <br />
                    <TextField label={i18next.t('name-from')} variant="outlined" fullWidth size="small" inputRef={this.nameFrom}
                        defaultValue={this.settings.nameFrom} />
                </div>
                : null}
            {this.settings.email == "T" ?
                <div>
                    <br />
                    <TextField label={i18next.t('smtp-identity')} variant="outlined" fullWidth size="small" inputRef={this.SMTPIdentity}
                        defaultValue={this.settings.SMTPIdentity} />
                    <br />
                    <br />
                    <TextField label={i18next.t('smtp-username')} variant="outlined" fullWidth size="small" inputRef={this.SMTPUsername}
                        defaultValue={this.settings.SMTPUsername} />
                    <br />
                    <br />
                    <TextField label={i18next.t('smtp-password')} variant="outlined" fullWidth size="small" inputRef={this.SMTPPassword} type="password"
                        defaultValue={this.settings.SMTPPassword} />
                    <br />
                    <br />
                    <TextField label={i18next.t('smtp-host')} variant="outlined" fullWidth size="small" inputRef={this.SMTPHostname}
                        defaultValue={this.settings.SMTPHostname} />
                    <br />
                    <br />
                    <div class="custom-control custom-switch">
                        <input type="checkbox" class="custom-control-input" ref="SMTPSTARTTLS" id="SMTPSTARTTLS"
                            defaultChecked={this.settings.SMTPSTARTTLS} />
                        <label class="custom-control-label" htmlFor="SMTPSTARTTLS">SMTPSTARTTLS</label>
                    </div>
                    <br />
                    <TextField label={i18next.t('smtp-reply-to')} variant="outlined" fullWidth size="small" inputRef={this.SMTPReplyTo}
                        defaultValue={this.settings.SMTPReplyTo} />
                </div>
                : null}
        </div>
    }
}

class SettingsCurrency extends Component {
    constructor({ settings, saveTab }) {
        super();

        this.settings = settings;
        this.saveTab = saveTab;

        this.currencyECBurl = React.createRef();
    }

    componentWillUnmount() {
        const currency = document.getElementById("currency").value;
        const data = {
            currency: currency
        };
        if (currency == "E") {
            data.currencyECBurl = this.currencyECBurl.current.value;
        }
        this.saveTab(data);
    }

    render() {
        return <div>
            <br />
            <FormControl fullWidth>
                <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('currency-exchange-sync')}</InputLabel>
                <NativeSelect
                    style={{ 'marginTop': '0' }}
                    id="currency"
                    onClick={() => {
                        this.settings.currency = document.getElementById("currency").value;
                        this.forceUpdate();
                    }}>
                    <option value="_">{i18next.t('no-sync-configured')}</option>
                    <option value="E">European Central Bank</option>
                </NativeSelect>
            </FormControl>
            <br />
            <br />
            {this.settings.currency == "E" ?
                <TextField label={i18next.t('currency-exchange-webservice-url')} variant="outlined" fullWidth size="small" inputRef={this.currencyECBurl}
                    defaultValue={this.settings.currencyECBurl} />
                : null}
        </div>
    }
}

class SettingsCron extends Component {
    constructor({ settings, saveTab }) {
        super();

        this.settings = settings;
        this.saveTab = saveTab;

        this.cronCurrency = React.createRef();
        this.cronPrestaShop = React.createRef();
        this.cronClearLabels = React.createRef();
        this.cronSendCloudTracking = React.createRef();
    }

    componentWillUnmount() {
        this.saveTab({
            cronCurrency: this.cronCurrency.current.value,
            cronPrestaShop: this.cronPrestaShop.current.value,
            cronClearLabels: this.cronClearLabels.current.value,
            cronSendCloudTracking: this.cronSendCloudTracking.current.value,
        });
    }

    render() {
        return <div>
            <br />
            <TextField label={i18next.t('currency-exchange-cron-settings')} variant="outlined" fullWidth size="small" inputRef={this.cronCurrency}
                defaultValue={this.settings.cronCurrency} />
            <br />
            <br />
            <TextField label={i18next.t('ecommerce-cron-settings')} variant="outlined" fullWidth size="small" inputRef={this.cronPrestaShop}
                defaultValue={this.settings.cronPrestaShop} />
            <br />
            <br />
            <TextField label={i18next.t('cron-delete-shipping-labels')} variant="outlined" fullWidth size="small" inputRef={this.cronClearLabels}
                defaultValue={this.settings.cronClearLabels} />
            <br />
            <br />
            <TextField label={i18next.t('cron-get-sendcloud-tracking')} variant="outlined" fullWidth size="small" inputRef={this.cronSendCloudTracking}
                defaultValue={this.settings.cronSendCloudTracking} />
            <br />
            <br />
            <a href="https://pkg.go.dev/github.com/robfig/cron">{i18next.t('cron-documentation')}</a>
        </div>
    }
}

class SettingsAccounting extends Component {
    constructor({ settings, saveTab, getConfigAccountsVat, insertConfigAccountsVat, deleteConfigAccountsVat }) {
        super();

        this.settings = settings;
        this.saveTab = saveTab;

        this.getConfigAccountsVat = getConfigAccountsVat;
        this.insertConfigAccountsVat = insertConfigAccountsVat;
        this.deleteConfigAccountsVat = deleteConfigAccountsVat;

        this.customerJournal = React.createRef();
        this.salesJournal = React.createRef();
        this.supplierJournal = React.createRef();
        this.purchaseJournal = React.createRef();

        this.vatPercent = React.createRef();

        this.journalSale = React.createRef();
        this.accountSaleNumber = React.createRef();
        this.journalPurchase = React.createRef();
        this.accountPurchaseNumber = React.createRef();

        this.add = this.add.bind(this);
    }

    componentDidMount() {
        this.renderAccouts();
    }

    padLeadingZeros(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }

    renderAccouts() {
        this.getConfigAccountsVat().then((configs) => {
            ReactDOM.render(configs.map((element, i) => {
                return <tr key={i}>
                    <th scope="row">{element.vatPercent}</th>
                    <td>{element.accountSale.journalId}.{this.padLeadingZeros(element.accountSale.accountNumber, 6)}</td>
                    <td>{element.accountPurchase.journalId}.{this.padLeadingZeros(element.accountPurchase.accountNumber, 6)}</td>
                    <td onClick={() => {
                        this.deleteConfigAccountsVat(element.vatPercent).then(() => {
                            this.renderAccouts();
                        });
                    }}>{i18next.t('delete')}</td>
                </tr>
            }), this.refs.render);
        });
    }

    componentWillUnmount() {
        this.saveTab({
            customerJournalId: this.customerJournal.current.value == "" ? null : parseInt(this.customerJournal.current.value),
            salesJournalId: this.salesJournal.current.value == "" ? null : parseInt(this.salesJournal.current.value),
            supplierJournalId: this.supplierJournal.current.value == "" ? null : parseInt(this.supplierJournal.current.value),
            purchaseJournalId: this.purchaseJournal.current.value == "" ? null : parseInt(this.purchaseJournal.current.value),
            limitAccountingDate:
                this.refs.limitAccountingDate.checked ? new Date(this.refs.limitAccountingDateDate.value + " " + this.refs.limitAccountingDateTime.value) : null,
            invoiceDeletePolicy: parseInt(document.getElementById("invoiceDeletePolicy").value),
            transactionLog: this.refs.transactionLog.checked,
        });
    }

    add() {
        this.insertConfigAccountsVat({
            vatPercent: parseFloat(this.vatPercent.current.value),
            journalSale: parseInt(this.journalSale.current.value),
            accountSaleNumber: parseInt(this.accountSaleNumber.current.value),
            journalPurchase: parseInt(this.journalPurchase.current.value),
            accountPurchaseNumber: parseInt(this.accountPurchaseNumber.current.value)
        }).then(() => {
            this.renderAccouts();
        });
    }

    render() {
        return <div id="accuntingSettings">
            <div class="form-row" style={{ 'margin-top': '20px' }}>
                <div class="col">
                    <div class="custom-control custom-switch" style={{ 'margin-top': '0%' }}>
                        <input class="form-check-input custom-control-input" type="checkbox" ref="limitAccountingDate" id="limitAccountingDate"
                            defaultChecked={this.settings.limitAccountingDate != null} />
                        <label className="checkbox-label custom-control-label" htmlFor="limitAccountingDate">{i18next.t('limit-accounting-date')}</label>
                    </div>
                </div>
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <input type="date" class="form-control" ref="limitAccountingDateDate"
                                defaultValue={this.settings.limitAccountingDate == null ?
                                    '' : dateFormat(new Date(this.settings.limitAccountingDate), "yyyy-mm-dd")} />
                        </div>
                        <div class="col">
                            <input type="time" class="form-control" ref="limitAccountingDateTime"
                                defaultValue={this.settings.limitAccountingDate == null ?
                                    '' : dateFormat(new Date(this.settings.limitAccountingDate), "hh:MM")} />
                        </div>
                    </div>
                </div>
            </div>
            <br />
            <div class="form-row">
                <div class="col">
                    <TextField label={i18next.t('customer-journal')} variant="outlined" fullWidth size="small" inputRef={this.customerJournal} type="number"
                        defaultValue={this.settings.customerJournalId} InputProps={{ inputProps: { min: 1 } }} />
                </div>
                <div class="col">
                    <TextField label={i18next.t('sales-journal')} variant="outlined" fullWidth size="small" inputRef={this.salesJournal} type="number"
                        defaultValue={this.settings.salesJournalId} InputProps={{ inputProps: { min: 1 } }} />
                </div>
                <div class="col">
                    <TextField label={i18next.t('sales-journal')} variant="outlined" fullWidth size="small" inputRef={this.supplierJournal} type="number"
                        defaultValue={this.settings.supplierJournalId} InputProps={{ inputProps: { min: 1 } }} />
                </div>
                <div class="col">
                    <TextField label={i18next.t('purchase-journal')} variant="outlined" fullWidth size="small" inputRef={this.purchaseJournal} type="number"
                        defaultValue={this.settings.purchaseJournalId} InputProps={{ inputProps: { min: 1 } }} />
                </div>
            </div>
            <table class="table table-dark mt-2">
                <thead>
                    <tr>
                        <th scope="col">{i18next.t('vat-percent')}</th>
                        <th scope="col">{i18next.t('account-for-sale')}</th>
                        <th scope="col">{i18next.t('account-for-purchase')}</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
            <div class="form-row">
                <div class="col">
                    <TextField label={i18next.t('vat-percent')} variant="outlined" fullWidth size="small" inputRef={this.vatPercent} type="number"
                        defaultValue="0" InputProps={{ inputProps: { min: 0 } }} />
                </div>
                <div class="col">
                    <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button>
                </div>
            </div>
            <br />
            <div class="form-row">
                <div class="col">
                    <TextField label={i18next.t('journal-sale')} variant="outlined" fullWidth size="small" inputRef={this.journalSale} type="number"
                        defaultValue="0" InputProps={{ inputProps: { min: 0 } }} />
                </div>
                <div class="col">
                    <TextField label={i18next.t('account-number-sale')} variant="outlined" fullWidth size="small" inputRef={this.accountSaleNumber} type="number"
                        defaultValue="0" InputProps={{ inputProps: { min: 0 } }} />
                </div>
                <div class="col">
                    <TextField label={i18next.t('journal-purchase')} variant="outlined" fullWidth size="small" inputRef={this.journalPurchase} type="number"
                        defaultValue="0" InputProps={{ inputProps: { min: 0 } }} />
                </div>
                <div class="col">
                    <TextField label={i18next.t('account-number-purchase')} variant="outlined" fullWidth size="small" inputRef={this.accountPurchaseNumber}
                        type="number" defaultValue="0" InputProps={{ inputProps: { min: 0 } }} />
                </div>
            </div>
            <br />
            <div class="form-row">
                <div class="col">
                    <FormControl fullWidth>
                        <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('invoice-deletion-policy')}</InputLabel>
                        <NativeSelect
                            style={{ 'marginTop': '0' }}
                            id="invoiceDeletePolicy"
                            defaultValue={this.settings.invoiceDeletePolicy}>
                            <option value="0">{i18next.t('allow-invoice-deletion')}</option>
                            <option value="1">{i18next.t('allow-invoice-deletion-only-last')}</option>
                            <option value="2">{i18next.t('never-allow-invoice-deletion')}</option>
                        </NativeSelect>
                    </FormControl>
                </div>
                <div class="col" style={{ 'margin-top': '20px' }}>
                    <div class="custom-control custom-switch" style={{ 'margin-top': '0%' }}>
                        <input class="form-check-input custom-control-input" type="checkbox" ref="transactionLog" id="transactionLog"
                            defaultChecked={this.settings.transactionLog} />
                        <label className="checkbox-label custom-control-label" htmlFor="transactionLog">{i18next.t('transactional-log')}</label>
                    </div>
                </div>
            </div>
        </div>
    }
}

class SettingsEmailAlerts extends Component {
    constructor({ settings, saveTab }) {
        super();

        this.settings = settings;
        this.saveTab = saveTab;

        this.emailSendErrorEcommerce = React.createRef();
        this.emailSendErrorSendCloud = React.createRef();
    }

    componentWillUnmount() {
        this.saveTab({
            settingsEmail: {
                emailSendErrorEcommerce: this.emailSendErrorEcommerce.current.value,
                emailSendErrorSendCloud: this.emailSendErrorSendCloud.current.value,
            }
        });
    }

    render() {
        return <div>
            <br />
            <TextField label={i18next.t('email-to-send-errors-in-ecommerce-synchronization')} variant="outlined" fullWidth size="small"
                inputRef={this.emailSendErrorEcommerce} type="email" defaultValue={this.settings.emailSendErrorEcommerce} />
            <br />
            <br />
            <TextField label={i18next.t('email-to-send-errors-in-sendcloud-shippings')} variant="outlined" fullWidth size="small"
                inputRef={this.emailSendErrorSendCloud} type="email" defaultValue={this.settings.emailSendErrorSendCloud} />
            <br />
            <br />
            <br />
            <br />
        </div>
    }
}

const typeLabelPrinterProfile = {
    "E": "EAN13",
    "C": "Code128",
    "D": "DataMatrix"
};

class SettingsLabels extends Component {
    constructor({ settings, saveTab, getLabelPrinterProfiles, insertLabelPrinterProfile, updateLabelPrinterProfile, deleteLabelPrinterProfile }) {
        super();

        this.settings = settings;
        this.saveTab = saveTab;
        this.getLabelPrinterProfiles = getLabelPrinterProfiles;
        this.insertLabelPrinterProfile = insertLabelPrinterProfile;
        this.updateLabelPrinterProfile = updateLabelPrinterProfile;
        this.deleteLabelPrinterProfile = deleteLabelPrinterProfile;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderLabelPrinterProfiles();
    }

    renderLabelPrinterProfiles() {
        this.getLabelPrinterProfiles().then((list) => {
            this.list = list;
            this.forceUpdate();
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(<LabelPrinterProfileModal
            insertLabelPrinterProfile={(labelPrinerProfile) => {
                const promise = this.insertLabelPrinterProfile(labelPrinerProfile);
                promise.then(() => {
                    this.renderLabelPrinterProfiles();
                });
                return promise;
            }}
        />, this.refs.renderModal);
    }

    edit(labelPrinerProfile) {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(<LabelPrinterProfileModal
            labelPrinerProfile={labelPrinerProfile}
            updateLabelPrinterProfile={(labelPrinerProfile) => {
                const promise = this.updateLabelPrinterProfile(labelPrinerProfile);
                promise.then(() => {
                    this.renderLabelPrinterProfiles();
                });
                return promise;
            }}
            deleteLabelPrinterProfile={(labelPrinerProfileId) => {
                const promise = this.deleteLabelPrinterProfile(labelPrinerProfileId);
                promise.then(() => {
                    this.renderLabelPrinterProfiles();
                });
                return promise;
            }}
        />, this.refs.renderModal);
    }

    render() {
        return <div>
            <div ref="renderModal"></div>
            <br />
            <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button>
            <br />
            <br />
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    {
                        field: 'type', headerName: i18next.t('type'), flex: 1, valueGetter: (params) => {
                            return typeLabelPrinterProfile[params.row.type];
                        }
                    },
                    { field: 'active', headerName: i18next.t('active'), width: 150, type: 'boolean' },
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

class LabelPrinterProfileModal extends Component {
    constructor({ labelPrinerProfile, insertLabelPrinterProfile, updateLabelPrinterProfile, deleteLabelPrinterProfile }) {
        super();

        this.labelPrinerProfile = labelPrinerProfile;
        this.insertLabelPrinterProfile = insertLabelPrinterProfile;
        this.updateLabelPrinterProfile = updateLabelPrinterProfile;
        this.deleteLabelPrinterProfile = deleteLabelPrinterProfile;

        this.open = true;

        this.productBarCodeLabelWidth = React.createRef();
        this.productBarCodeLabelHeight = React.createRef();
        this.productBarCodeLabelSize = React.createRef();
        this.productBarCodeLabelMarginTop = React.createRef();
        this.productBarCodeLabelMarginBottom = React.createRef();
        this.productBarCodeLabelMarginLeft = React.createRef();
        this.productBarCodeLabelMarginRight = React.createRef();

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    getLabelPrinterProfileModal() {
        return {
            type: this.refs.type.value,
            active: this.refs.active.checked,
            productBarCodeLabelWidth: parseInt(this.productBarCodeLabelWidth.current.value),
            productBarCodeLabelHeight: parseInt(this.productBarCodeLabelHeight.current.value),
            productBarCodeLabelSize: parseInt(this.productBarCodeLabelSize.current.value),
            productBarCodeLabelMarginTop: parseInt(this.productBarCodeLabelMarginTop.current.value),
            productBarCodeLabelMarginBottom: parseInt(this.productBarCodeLabelMarginBottom.current.value),
            productBarCodeLabelMarginLeft: parseInt(this.productBarCodeLabelMarginLeft.current.value),
            productBarCodeLabelMarginRight: parseInt(this.productBarCodeLabelMarginRight.current.value),
        };
    }

    add() {
        const labelPrinerProfile = this.getLabelPrinterProfileModal();

        this.insertLabelPrinterProfile(labelPrinerProfile).then((ok) => {
            if (ok) {
                this.handleClose();
            } else {
                ReactDOM.unmountComponentAtNode(this.refs.renderModal);
                ReactDOM.render(<AlertModal
                    modalTitle={i18next.t('label-printer-profile-already-exists')}
                    modalText={i18next.t('there-is-already-an-active-label-printer-profile-for-this-type-of-barcode')}
                />, this.refs.renderModal);
            }
        });
    }

    update() {
        const labelPrinerProfile = this.getLabelPrinterProfileModal();
        labelPrinerProfile.id = this.labelPrinerProfile.id;

        this.updateLabelPrinterProfile(labelPrinerProfile).then((ok) => {
            if (ok) {
                this.handleClose();
            } else {
                ReactDOM.unmountComponentAtNode(this.refs.renderModal);
                ReactDOM.render(<AlertModal
                    modalTitle={i18next.t('label-printer-profile-already-exists')}
                    modalText={i18next.t('there-is-already-an-active-label-printer-profile-for-this-type-of-barcode')}
                />, this.refs.renderModal);
            }
        });
    }

    delete() {
        this.deleteLabelPrinterProfile(this.labelPrinerProfile.id).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
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
        return <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'sm'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('change-password')}
            </this.DialogTitle>
            <DialogContent>
                <div ref="renderModal"></div>
                <label>{i18next.t('type')}</label>
                <select class="form-control" ref="type" disabled={this.labelPrinerProfile != null}>
                    <option value="E">EAN13</option>
                    <option value="C">Code128</option>
                    <option value="D">DataMatrix</option>
                </select>
                <br />
                <div class="form-group form-check">
                    <input type="checkbox" class="form-check-input" id="active" ref="active"
                        defaultChecked={this.labelPrinerProfile == null ? true : this.labelPrinerProfile.active} />
                    <label class="form-check-label" for="active">{i18next.t('activated')}</label>
                </div>
                <br />
                <TextField label={i18next.t('label-width') + " (px)"} variant="outlined" fullWidth size="small"
                    inputRef={this.productBarCodeLabelWidth} type="number" InputProps={{ inputProps: { min: 0 } }}
                    defaultValue={this.labelPrinerProfile == null ? 0 : this.labelPrinerProfile.productBarCodeLabelWidth} />
                <br />
                <br />
                <TextField label={i18next.t('label-height') + " (px)"} variant="outlined" fullWidth size="small"
                    inputRef={this.productBarCodeLabelHeight} type="number" InputProps={{ inputProps: { min: 0 } }}
                    defaultValue={this.labelPrinerProfile == null ? 0 : this.labelPrinerProfile.productBarCodeLabelHeight} />
                <br />
                <br />
                <TextField label={i18next.t('barcode-size') + " (px)"} variant="outlined" fullWidth size="small"
                    inputRef={this.productBarCodeLabelSize} type="number" InputProps={{ inputProps: { min: 0 } }}
                    defaultValue={this.labelPrinerProfile == null ? 0 : this.labelPrinerProfile.productBarCodeLabelSize} />
                <br />
                <br />
                <TextField label={i18next.t('margin-top') + " (px)"} variant="outlined" fullWidth size="small"
                    inputRef={this.productBarCodeLabelMarginTop} type="number" InputProps={{ inputProps: { min: 0 } }}
                    defaultValue={this.labelPrinerProfile == null ? 0 : this.labelPrinerProfile.productBarCodeLabelMarginTop} />
                <br />
                <br />
                <TextField label={i18next.t('margin-bottom') + " (px)"} variant="outlined" fullWidth size="small"
                    inputRef={this.productBarCodeLabelMarginBottom} type="number" InputProps={{ inputProps: { min: 0 } }}
                    defaultValue={this.labelPrinerProfile == null ? 0 : this.labelPrinerProfile.productBarCodeLabelMarginBottom} />
                <br />
                <br />
                <TextField label={i18next.t('margin-left') + " (px)"} variant="outlined" fullWidth size="small"
                    inputRef={this.productBarCodeLabelMarginLeft} type="number" InputProps={{ inputProps: { min: 0 } }}
                    defaultValue={this.labelPrinerProfile == null ? 0 : this.labelPrinerProfile.productBarCodeLabelMarginLeft} />
                <br />
                <br />
                <TextField label={i18next.t('margin-right') + " (px)"} variant="outlined" fullWidth size="small"
                    inputRef={this.productBarCodeLabelMarginRight} type="number" InputProps={{ inputProps: { min: 0 } }}
                    defaultValue={this.labelPrinerProfile == null ? 0 : this.labelPrinerProfile.productBarCodeLabelMarginRight} />
                <br />
            </DialogContent>
            <DialogActions>
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                {this.labelPrinerProfile != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                {this.labelPrinerProfile == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                {this.labelPrinerProfile != null ? <button type="button" class="btn btn-success"
                    onClick={this.update}>{i18next.t('update')}</button> : null}
            </DialogActions>
        </Dialog>
    }
};



export default Settings;
