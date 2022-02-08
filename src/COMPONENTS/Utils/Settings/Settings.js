import React, { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AutocompleteField from "../../AutocompleteField";

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
        setEnterpriseLogo, deleteEnterpriseLogo }) {
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
            <Tabs value={this.tab} onChange={(_, tab) => {
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
                }
            }}>
                <Tab label='General' />
                <Tab label={i18next.t('enterprise')} />
                <Tab label='E-Commerce' />
                <Tab label='Email' />
                <Tab label={i18next.t('currency')} />
                <Tab label='Cron' />
                <Tab label={i18next.t('accounting')} />
            </Tabs>
        </AppBar>, this.refs.tabs);
    }

    saveTab(changes) {
        Object.keys(changes).forEach((key) => {
            this.settings[key] = changes[key];
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
            settings={this.settings}
            saveTab={this.saveTab}
        />, this.refs.render);
    }

    tabEmail() {
        this.tab = 3;
        this.tabs();
        ReactDOM.render(<SettingsEmail
            settings={this.settings}
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

    save() {
        ReactDOM.unmountComponentAtNode(this.refs.render);
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

        this.currentSelectedWarehouseId = settings.defaultWarehouse;
    }

    componentWillUnmount() {
        this.saveTab({
            defaultVatPercent: parseInt(this.defaultVatPercent.current.value),
            dateFormat: this.dateFormat.current.value,
            defaultWarehouse: this.currentSelectedWarehouseId,
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
            <label>{i18next.t('default-warehouse')}</label>
            <AutocompleteField findByName={this.findWarehouseByName}
                defaultValueId={this.settings.defaultWarehouse} defaultValueName={this.settings.defaultWarehouseName}
                valueChanged={(value) => {
                    this.currentSelectedWarehouseId = value;
                }} />
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
                                defaultValue={this.settings.passwordMinimumLength} InputProps={{ inputProps: { min: 8 } }} />
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
        this.saveTab({
            ecommerce: document.getElementById("ecommerce").value,
            prestaShopUrl: document.getElementById("ecommerce").value != 'P' ? '' : this.prestaShopUrl.current.value,
            prestaShopApiKey: document.getElementById("ecommerce").value != 'P' ? '' : this.prestaShopApiKey.current.value,
            prestaShopLanguageId: document.getElementById("ecommerce").value != 'P' ? 0 : parseInt(this.prestaShopLanguageId.current.value),
            prestaShopExportSerie: document.getElementById("ecommerce").value != 'P' ? null : this.prestaShopExportSerie.current.value,
            prestaShopIntracommunitySerie: document.getElementById("ecommerce").value != 'P' ? null : this.prestaShopIntracommunitySerie.current.value,
            prestaShopInteriorSerie: document.getElementById("ecommerce").value != 'P' ? null : this.prestaShopInteriorSerie.current.value,
            prestashopStatusPaymentAccepted: document.getElementById("ecommerce").value != 'P' ? 0 : parseInt(this.prestashopStatusPaymentAccepted.current.value),
            prestashopStatusShipped: document.getElementById("ecommerce").value != 'P' ? 0 : parseInt(this.prestashopStatusShipped.current.value),
            woocommerceUrl: document.getElementById("ecommerce").value != 'W' ? '' : this.woocommerceUrl.current.value,
            woocommerceConsumerKey: document.getElementById("ecommerce").value != 'W' ? '' : this.woocommerceConsumerKey.current.value,
            woocommerceConsumerSecret: document.getElementById("ecommerce").value != 'W' ? '' : this.woocommerceConsumerSecret.current.value,
            wooCommerceExportSerie: document.getElementById("ecommerce").value != 'W' ? null : this.wooCommerceExportSerie.current.value,
            wooCommerceIntracommunitySerie: document.getElementById("ecommerce").value != 'W' ? null : this.wooCommerceIntracommunitySerie.current.value,
            wooCommerceInteriorSerie: document.getElementById("ecommerce").value != 'W' ? null : this.wooCommerceInteriorSerie.current.value,
            wooCommerceDefaultPaymentMethod: document.getElementById("ecommerce").value != 'W' ? null :
                (this.wooCommerceDefaultPaymentMethod.current.value == "" || this.wooCommerceDefaultPaymentMethod.current.value == "0" ?
                    null : parseInt(this.wooCommerceDefaultPaymentMethod.current.value)),
            shopifyUrl: document.getElementById("ecommerce").value != 'S' ? '' : this.shopifyUrl.current.value,
            shopifyToken: document.getElementById("ecommerce").value != 'S' ? '' : this.shopifyToken.current.value,
            shopifyExportSerie: document.getElementById("ecommerce").value != 'S' ? null : this.shopifyExportSerie.current.value,
            shopifyIntracommunitySerie: document.getElementById("ecommerce").value != 'S' ? null : this.shopifyIntracommunitySerie.current.value,
            shopifyInteriorSerie: document.getElementById("ecommerce").value != 'S' ? null : this.shopifyInteriorSerie.current.value,
            shopifyDefaultPaymentMethod: document.getElementById("ecommerce").value != 'S' ? null :
                (this.shopifyDefaultPaymentMethod.current.value == "" || this.shopifyDefaultPaymentMethod.current.value == "0" ?
                    null : parseInt(this.shopifyDefaultPaymentMethod.current.value)),
            shopifyShopLocationId: document.getElementById("ecommerce").value != 'S' ? null : parseInt(this.shopifyShopLocationId.current.value),
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
                    defaultValue={this.settings.prestaShopExportSerie} />
                <br />
                <br />
                <TextField label={i18next.t('prestashop-intracommunity-operations-serie')} variant="outlined" fullWidth size="small"
                    inputRef={this.prestaShopIntracommunitySerie} defaultValue={this.settings.prestaShopIntracommunitySerie} />
                <br />
                <br />
                <TextField label={i18next.t('prestashop-interior-operations-serie')} variant="outlined" fullWidth size="small"
                    inputRef={this.prestaShopInteriorSerie} defaultValue={this.settings.prestaShopInteriorSerie} />
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
                    defaultValue={this.settings.wooCommerceExportSerie} />
                <br />
                <br />
                <TextField label={i18next.t('woocommerce-intracommunity-operations-serie')} variant="outlined" fullWidth size="small"
                    inputRef={this.wooCommerceIntracommunitySerie} defaultValue={this.settings.wooCommerceIntracommunitySerie} />
                <br />
                <br />
                <TextField label={i18next.t('woocommerce-interior-operations-serie')} variant="outlined" fullWidth size="small"
                    inputRef={this.wooCommerceInteriorSerie} defaultValue={this.settings.wooCommerceInteriorSerie} />
                <br />
                <br />
                <TextField label={i18next.t('woocommerce-default-payment-method')} variant="outlined" fullWidth size="small" type="number"
                    inputRef={this.wooCommerceDefaultPaymentMethod} defaultValue={this.settings.wooCommerceDefaultPaymentMethod}
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
                    defaultValue={this.settings.shopifyExportSerie} />
                <br />
                <br />
                <TextField label={i18next.t('shopify-intracommunity-operations-serie')} variant="outlined" fullWidth size="small"
                    inputRef={this.shopifyIntracommunitySerie} defaultValue={this.settings.shopifyIntracommunitySerie} />
                <br />
                <br />
                <TextField label={i18next.t('shopify-interior-operations-serie')} variant="outlined" fullWidth size="small" inputRef={this.shopifyInteriorSerie}
                    defaultValue={this.settings.shopifyInteriorSerie} />
                <br />
                <br />
                <TextField label={i18next.t('shopify-default-payment-method')} variant="outlined" fullWidth size="small" type="number"
                    inputRef={this.shopifyDefaultPaymentMethod} defaultValue={this.settings.shopifyDefaultPaymentMethod}
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
        this.saveTab({
            email: document.getElementById("email").value,
            sendGridKey: document.getElementById("email").value == "S" ? this.sendGridKey.current.value : "",
            emailFrom: document.getElementById("email").value == "S" ? this.emailFrom.current.value : "",
            nameFrom: document.getElementById("email").value == "S" ? this.nameFrom.current.value : "",
            SMTPIdentity: document.getElementById("email").value == "T" ? this.SMTPIdentity.current.value : "",
            SMTPUsername: document.getElementById("email").value == "T" ? this.SMTPUsername.current.value : "",
            SMTPPassword: document.getElementById("email").value == "T" ? this.SMTPPassword.current.value : "",
            SMTPHostname: document.getElementById("email").value == "T" ? this.SMTPHostname.current.value : "",
            SMTPSTARTTLS: this.refs.SMTPSTARTTLS.checked,
            SMTPReplyTo: document.getElementById("email").value == "T" ? this.SMTPReplyTo.current.value : "",
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
                    <TextField label='Email from' variant="outlined" fullWidth size="small" inputRef={this.emailFrom}
                        defaultValue={this.settings.emailFrom} />
                    <br />
                    <br />
                    <TextField label='Name from' variant="outlined" fullWidth size="small" inputRef={this.nameFrom}
                        defaultValue={this.settings.nameFrom} />
                </div>
                : null}
            {this.settings.email == "T" ?
                <div>
                    <br />
                    <TextField label='SMTP Identity' variant="outlined" fullWidth size="small" inputRef={this.SMTPIdentity}
                        defaultValue={this.settings.SMTPIdentity} />
                    <br />
                    <br />
                    <TextField label='SMTP Username' variant="outlined" fullWidth size="small" inputRef={this.SMTPUsername}
                        defaultValue={this.settings.SMTPUsername} />
                    <br />
                    <br />
                    <TextField label='SMTP Password' variant="outlined" fullWidth size="small" inputRef={this.SMTPPassword} type="password"
                        defaultValue={this.settings.SMTPPassword} />
                    <br />
                    <br />
                    <TextField label='SMTP Host' variant="outlined" fullWidth size="small" inputRef={this.SMTPHostname}
                        defaultValue={this.settings.SMTPHostname} />
                    <br />
                    <br />
                    <div class="custom-control custom-switch">
                        <input type="checkbox" class="custom-control-input" ref="SMTPSTARTTLS" id="SMTPSTARTTLS"
                            defaultChecked={this.settings.SMTPSTARTTLS} />
                        <label class="custom-control-label" htmlFor="SMTPSTARTTLS">SMTPSTARTTLS</label>
                    </div>
                    <br />
                    <TextField label='SMTP Reply to' variant="outlined" fullWidth size="small" inputRef={this.SMTPReplyTo}
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
        this.saveTab({
            currency: document.getElementById("currency").value,
            currencyECBurl: this.currencyECBurl.current.value,
        });
    }

    render() {
        return <div>
            <br />
            <FormControl fullWidth>
                <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('currency-exchange-sync')}</InputLabel>
                <NativeSelect
                    style={{ 'marginTop': '0' }}
                    id="currency">
                    <option value="_">{i18next.t('no-sync-configured')}</option>
                    <option value="E">European Central Bank</option>
                </NativeSelect>
            </FormControl>
            <br />
            <br />
            <TextField label={i18next.t('currency-exchange-webservice-url')} variant="outlined" fullWidth size="small" inputRef={this.currencyECBurl}
                defaultValue={this.settings.currencyECBurl} />
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
        this.cronSendcloudTracking = React.createRef();
    }

    componentWillUnmount() {
        this.saveTab({
            cronCurrency: this.cronCurrency.current.value,
            cronPrestaShop: this.cronPrestaShop.current.value,
            cronClearLabels: this.cronClearLabels.current.value,
            cronSendcloudTracking: this.cronSendcloudTracking.current.value,
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
            <TextField label={i18next.t('cron-get-sendcloud-tracking')} variant="outlined" fullWidth size="small" inputRef={this.cronSendcloudTracking}
                defaultValue={this.settings.cronSendcloudTracking} />
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
                    <td>{element.journalSale}.{this.padLeadingZeros(element.accountSaleNumber, 6)}</td>
                    <td>{element.journalPurchase}.{this.padLeadingZeros(element.accountPurchaseNumber, 6)}</td>
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
            customerJournal: this.customerJournal.current.value == "" ? null : parseInt(this.customerJournal.current.value),
            salesJournal: this.salesJournal.current.value == "" ? null : parseInt(this.salesJournal.current.value),
            supplierJournal: this.supplierJournal.current.value == "" ? null : parseInt(this.supplierJournal.current.value),
            purchaseJournal: this.purchaseJournal.current.value == "" ? null : parseInt(this.purchaseJournal.current.value),
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
                        defaultValue={this.settings.customerJournal} InputProps={{ inputProps: { min: 1 } }} />
                </div>
                <div class="col">
                    <TextField label={i18next.t('sales-journal')} variant="outlined" fullWidth size="small" inputRef={this.salesJournal} type="number"
                        defaultValue={this.settings.salesJournal} InputProps={{ inputProps: { min: 1 } }} />
                </div>
                <div class="col">
                    <TextField label={i18next.t('sales-journal')} variant="outlined" fullWidth size="small" inputRef={this.supplierJournal} type="number"
                        defaultValue={this.settings.supplierJournal} InputProps={{ inputProps: { min: 1 } }} />
                </div>
                <div class="col">
                    <TextField label={i18next.t('purchase-journal')} variant="outlined" fullWidth size="small" inputRef={this.purchaseJournal} type="number"
                        defaultValue={this.settings.purchaseJournal} InputProps={{ inputProps: { min: 1 } }} />
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
                            defaultChecked={this.settings.transactionLog != null} />
                        <label className="checkbox-label custom-control-label" htmlFor="transactionLog">{i18next.t('transactional-log')}</label>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default Settings;
