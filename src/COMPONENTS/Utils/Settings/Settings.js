import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import AutocompleteField from "../../AutocompleteField";

import './../../../CSS/settings.css';
import dateFormat from './../../../date.format.js'

class Settings extends Component {
    constructor({ settings, findWarehouseByName, updateSettings, getConfigAccountsVat, insertConfigAccountsVat, deleteConfigAccountsVat }) {
        super();

        this.settings = settings;
        this.findWarehouseByName = findWarehouseByName;
        this.updateSettings = updateSettings;

        this.getConfigAccountsVat = getConfigAccountsVat;
        this.insertConfigAccountsVat = insertConfigAccountsVat;
        this.deleteConfigAccountsVat = deleteConfigAccountsVat;

        this.currentSelectedWarehouseId = settings.defaultWarehouse;
        this.tab = 0;

        this.tabGeneral = this.tabGeneral.bind(this);
        this.tabEnterprise = this.tabEnterprise.bind(this);
        this.tabEcommerce = this.tabEcommerce.bind(this);
        this.tabEmail = this.tabEmail.bind(this);
        this.tabCurrency = this.tabCurrency.bind(this);
        this.tabCron = this.tabCron.bind(this);
        this.tabAccounting = this.tabAccounting.bind(this);
        this.saveTab = this.saveTab.bind(this);
        this.save = this.save.bind(this);
    }

    componentDidMount() {
        window.$('#settingsModal').modal({ show: true });
        this.tabs();
        this.tabGeneral();
    }

    tabs() {
        ReactDOM.render(<AppBar position="static" style={{
            'backgroundColor': '#343a40'
        }}>
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
                window.$('#settingsModal').modal('hide');
            }
        });
    }

    render() {
        return <div class="modal fade" id="settingsModal" tabindex="-1" role="dialog" aria-labelledby="settingsModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="settingsModalLabel">{i18next.t('settings')}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div ref="tabs"></div>

                        <div ref="render">
                        </div>

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                        <button type="button" class="btn btn-primary" onClick={this.save}>{i18next.t('save')}</button>
                    </div>
                </div>
            </div>
        </div>
    }
}

class SettingsGeneral extends Component {
    constructor({ settings, findWarehouseByName, saveTab }) {
        super();

        this.settings = settings;
        this.findWarehouseByName = findWarehouseByName;
        this.saveTab = saveTab;

        this.currentSelectedWarehouseId = settings.defaultWarehouse;
    }

    componentWillUnmount() {
        this.saveTab({
            defaultVatPercent: parseInt(this.refs.defaultVatPercent.value),
            dateFormat: this.refs.dateFormat.value,
            defaultWarehouse: this.currentSelectedWarehouseId,
            barcodePrefix: this.refs.barcodePrefix.value,
            palletWeight: parseFloat(this.refs.palletWeight.value),
            palletWidth: parseFloat(this.refs.palletWidth.value),
            palletHeight: parseFloat(this.refs.palletHeight.value),
            palletDepth: parseFloat(this.refs.palletDepth.value),
            maxConnections: parseInt(this.refs.maxConnections.value),
            minimumStockSalesPeriods: parseInt(this.refs.minimumStockSalesPeriods.value),
            minimumStockSalesDays: parseInt(this.refs.minimumStockSalesDays.value),
            enableApiKey: this.refs.enableApiKey.checked,
            connectionLog: this.refs.connectionLog.checked,
            filterConnections: this.refs.filterConnections.checked,
            passwordMinumumComplexity: this.refs.passwordMinumumComplexity.value,
            passwordMinimumLength: parseInt(this.refs.passwordMinimumLength.value),
        });
    }

    render() {
        return <div>
            <div class="form-row">
                <div class="col">
                    <label>{i18next.t('default-vat-percent')}</label>
                    <input type="number" class="form-control" ref="defaultVatPercent" defaultValue={this.settings.defaultVatPercent} />
                </div>
                <div class="col">
                    <label>{i18next.t('date-format')}</label>
                    <input type="text" class="form-control" ref="dateFormat" defaultValue={this.settings.dateFormat} />
                    <a href="https://blog.stevenlevithan.com/archives/date-time-format">{i18next.t('documentation')}</a>
                </div>
            </div>
            <label>{i18next.t('default-warehouse')}</label>
            <AutocompleteField findByName={this.findWarehouseByName}
                defaultValueId={this.settings.defaultWarehouse} defaultValueName={this.settings.defaultWarehouseName}
                valueChanged={(value) => {
                    this.currentSelectedWarehouseId = value;
                }} />
            <div class="form-row">
                <div class="col">
                    <label>{i18next.t('barcode-prefix')}</label>
                    <input type="number" class="form-control" ref="barcodePrefix" defaultValue={this.settings.barcodePrefix} />
                </div>
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <label>Minimum password complexity</label>
                            <select class="form-control" ref="passwordMinumumComplexity" defaultValue={this.settings.passwordMinumumComplexity}>
                                <option value="A">Alphabetical</option>
                                <option value="B">Alphabetical + numbers</option>
                                <option value="C">Uppercase + lowercase + numbers</option>
                                <option value="D">Uppercase + lowercase + numbers + symbols</option>
                            </select>
                        </div>
                        <div class="col">
                            <label>Minimum password length</label>
                            <input type="number" class="form-control" ref="passwordMinimumLength" defaultValue={this.settings.passwordMinimumLength} min="8" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="col">
                    <label>{i18next.t('pallet-weight')}</label>
                    <input type="number" class="form-control" ref="palletWeight" defaultValue={this.settings.palletWeight} min="0" />
                </div>
                <div class="col">
                    <label>{i18next.t('pallet-width')}</label>
                    <input type="number" class="form-control" ref="palletWidth" defaultValue={this.settings.palletWidth} min="0" />
                </div>
                <div class="col">
                    <label>{i18next.t('pallet-height')}</label>
                    <input type="number" class="form-control" ref="palletHeight" defaultValue={this.settings.palletHeight} min="0" />
                </div>
                <div class="col">
                    <label>{i18next.t('pallet-depth')}</label>
                    <input type="number" class="form-control" ref="palletDepth" defaultValue={this.settings.palletDepth} min="0" />
                </div>
            </div>
            <div class="form-row">
                <div class="col">
                    <label>{i18next.t('maximum-connections')}</label>
                    <input type="number" class="form-control" ref="maxConnections" defaultValue={this.settings.maxConnections} min="0" />
                </div>
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <input type="checkbox" defaultChecked={this.settings.enableApiKey} ref="enableApiKey" />
                            <label>{i18next.t('enable-api-key')}</label>
                        </div>
                        <div class="col">
                            <input type="checkbox" defaultChecked={this.settings.connectionLog} ref="connectionLog" onChange={() => {
                                if (!this.refs.connectionLog.checked) {
                                    this.refs.filterConnections.checked = false;
                                }
                            }} />
                            <label>{i18next.t('connection-log')}</label>
                            <br />
                            <input type="checkbox" defaultChecked={this.settings.filterConnections} ref="filterConnections" onChange={() => {
                                if (this.refs.filterConnections.checked) {
                                    this.refs.connectionLog.checked = true;
                                }
                            }} />
                            <label>{i18next.t('filter-connections')}</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="col">
                    <label>{i18next.t('minimum-stock-sales-periods')}</label>
                    <input type="number" class="form-control" ref="minimumStockSalesPeriods" defaultValue={this.settings.minimumStockSalesPeriods} min="0" />
                </div>
                <div class="col">
                    <label>{i18next.t('minimum-stock-sales-days')}</label>
                    <input type="number" class="form-control" ref="minimumStockSalesDays" defaultValue={this.settings.minimumStockSalesDays} min="0" />
                </div>
            </div>
        </div>
    }
}

class SettingsEnterprise extends Component {
    constructor({ settings, saveTab }) {
        super();

        this.settings = settings;
        this.saveTab = saveTab;
    }

    componentWillUnmount() {
        this.saveTab({
            enterpriseName: this.refs.enterpriseName.value,
            enterpriseDescription: this.refs.enterpriseDescription.value
        });
    }

    render() {
        return <div>
            <label>{i18next.t('enterprise-key')}</label>
            <input type="text" class="form-control" defaultValue={this.settings.enterpriseKey} readOnly={true} />
            <label>{i18next.t('enterprise-name')}</label>
            <input type="text" class="form-control" ref="enterpriseName" defaultValue={this.settings.enterpriseName} />
            <label>{i18next.t('enterprise-description')}</label>
            <textarea class="form-control" rows="5" ref="enterpriseDescription" defaultValue={this.settings.enterpriseDescription}></textarea>
        </div>
    }
}

class SettingsEcommerce extends Component {
    constructor({ settings, saveTab }) {
        super();

        this.settings = settings;
        this.saveTab = saveTab;
    }

    componentWillUnmount() {
        this.saveTab({
            ecommerce: this.refs.ecommerce.value,
            prestaShopUrl: this.refs.ecommerce.value != 'P' ? '' : this.refs.prestaShopUrl.value,
            prestaShopApiKey: this.refs.ecommerce.value != 'P' ? '' : this.refs.prestaShopApiKey.value,
            prestaShopLanguageId: this.refs.ecommerce.value != 'P' ? 0 : parseInt(this.refs.prestaShopLanguageId.value),
            prestaShopExportSerie: this.refs.ecommerce.value != 'P' ? null : this.refs.prestaShopExportSerie.value,
            prestaShopIntracommunitySerie: this.refs.ecommerce.value != 'P' ? null : this.refs.prestaShopIntracommunitySerie.value,
            prestaShopInteriorSerie: this.refs.ecommerce.value != 'P' ? null : this.refs.prestaShopInteriorSerie.value,
            prestashopStatusPaymentAccepted: this.refs.ecommerce.value != 'P' ? 0 : parseInt(this.refs.prestashopStatusPaymentAccepted.value),
            prestashopStatusShipped: this.refs.ecommerce.value != 'P' ? 0 : parseInt(this.refs.prestashopStatusShipped.value),
            woocommerceUrl: this.refs.ecommerce.value != 'W' ? '' : this.refs.woocommerceUrl.value,
            woocommerceConsumerKey: this.refs.ecommerce.value != 'W' ? '' : this.refs.woocommerceConsumerKey.value,
            woocommerceConsumerSecret: this.refs.ecommerce.value != 'W' ? '' : this.refs.woocommerceConsumerSecret.value,
            wooCommerceExportSerie: this.refs.ecommerce.value != 'W' ? null : this.refs.wooCommerceExportSerie.value,
            wooCommerceIntracommunitySerie: this.refs.ecommerce.value != 'W' ? null : this.refs.wooCommerceIntracommunitySerie.value,
            wooCommerceInteriorSerie: this.refs.ecommerce.value != 'W' ? null : this.refs.wooCommerceInteriorSerie.value,
            wooCommerceDefaultPaymentMethod: this.refs.ecommerce.value != 'W' ? null :
                (this.refs.wooCommerceDefaultPaymentMethod.value == "" || this.refs.wooCommerceDefaultPaymentMethod.value == "0" ?
                    null : parseInt(this.refs.wooCommerceDefaultPaymentMethod.value)),
            shopifyUrl: this.refs.ecommerce.value != 'S' ? '' : this.refs.shopifyUrl.value,
            shopifyToken: this.refs.ecommerce.value != 'S' ? '' : this.refs.shopifyToken.value,
            shopifyExportSerie: this.refs.ecommerce.value != 'S' ? null : this.refs.shopifyExportSerie.value,
            shopifyIntracommunitySerie: this.refs.ecommerce.value != 'S' ? null : this.refs.shopifyIntracommunitySerie.value,
            shopifyInteriorSerie: this.refs.ecommerce.value != 'S' ? null : this.refs.shopifyInteriorSerie.value,
            shopifyDefaultPaymentMethod: this.refs.ecommerce.value != 'S' ? null :
                (this.refs.shopifyDefaultPaymentMethod.value == "" || this.refs.shopifyDefaultPaymentMethod.value == "0" ?
                    null : parseInt(this.refs.shopifyDefaultPaymentMethod.value)),
            shopifyShopLocationId: this.refs.ecommerce.value != 'S' ? null : parseInt(this.refs.shopifyShopLocationId.value),
        });
    }

    render() {
        return <div>
            <label>{i18next.t('ecommerce-platform')}</label>
            <select class="form-control" defaultValue={this.settings.ecommerce} ref="ecommerce" onClick={() => {
                this.settings.ecommerce = this.refs.ecommerce.value;
                this.forceUpdate();
            }}>
                <option value="_">{i18next.t('no-ecommerce-connected')}</option>
                <option value="P">PrestaShop</option>
                <option value="M">Magento Open Source</option>
                <option value="W">WooCommerce</option>
                <option value="S">Shopify</option>
            </select>
            {this.settings.ecommerce != 'P' ? null : <div>
                <label>PrestaShop API URL</label>
                <input type="text" class="form-control" ref="prestaShopUrl" defaultValue={this.settings.prestaShopUrl} />
                <label>PrestaShop API KEY</label>
                <input type="text" class="form-control" ref="prestaShopApiKey" defaultValue={this.settings.prestaShopApiKey} />
                <label>{i18next.t('prestashop-language-id')}</label>
                <input type="number" class="form-control" min="0" ref="prestaShopLanguageId" defaultValue={this.settings.prestaShopLanguageId} />
                <label>{i18next.t('prestashop-export-serie-key')}</label>
                <input type="text" class="form-control" ref="prestaShopExportSerie" defaultValue={this.settings.prestaShopExportSerie} />
                <label>{i18next.t('prestashop-intracommunity-operations-serie')}</label>
                <input type="text" class="form-control" ref="prestaShopIntracommunitySerie" defaultValue={this.settings.prestaShopIntracommunitySerie} />
                <label>{i18next.t('prestashop-interior-operations-serie')}</label>
                <input type="text" class="form-control" ref="prestaShopInteriorSerie" defaultValue={this.settings.prestaShopInteriorSerie} />
                <div class="form-row">
                    <div class="col">
                        <label>{i18next.t('prestashop-status-payment-accepted-id')}</label>
                        <input type="number" class="form-control" min="0" ref="prestashopStatusPaymentAccepted"
                            defaultValue={this.settings.prestashopStatusPaymentAccepted} />
                    </div>
                    <div class="col">
                        <label>{i18next.t('prestashop-status-shipped-id')}</label>
                        <input type="number" class="form-control" min="0" ref="prestashopStatusShipped"
                            defaultValue={this.settings.prestashopStatusShipped} />
                    </div>
                </div>
            </div>}
            {this.settings.ecommerce != 'W' ? null : <div>
                <label>WooCommerce API URL</label>
                <input type="text" class="form-control" ref="woocommerceUrl" defaultValue={this.settings.woocommerceUrl} />
                <label>WooCommerce consumer key</label>
                <input type="text" class="form-control" ref="woocommerceConsumerKey" defaultValue={this.settings.woocommerceConsumerKey} />
                <label>WooCommerce consumer secret</label>
                <input type="text" class="form-control" ref="woocommerceConsumerSecret" defaultValue={this.settings.woocommerceConsumerSecret} />
                <label>{i18next.t('woocommerce-export-serie-key')}</label>
                <input type="text" class="form-control" ref="wooCommerceExportSerie" defaultValue={this.settings.wooCommerceExportSerie} />
                <label>{i18next.t('woocommerce-intracommunity-operations-serie')}</label>
                <input type="text" class="form-control" ref="wooCommerceIntracommunitySerie" defaultValue={this.settings.wooCommerceIntracommunitySerie} />
                <label>{i18next.t('woocommerce-interior-operations-serie')}</label>
                <input type="text" class="form-control" ref="wooCommerceInteriorSerie" defaultValue={this.settings.wooCommerceInteriorSerie} />
                <label>{i18next.t('woocommerce-default-payment-method')}</label>
                <input type="number" class="form-control" ref="wooCommerceDefaultPaymentMethod" defaultValue={this.settings.wooCommerceDefaultPaymentMethod} />
            </div>}
            {this.settings.ecommerce != 'S' ? null : <div>
                <label>Shopify API URL</label>
                <input type="text" class="form-control" ref="shopifyUrl" defaultValue={this.settings.shopifyUrl} />
                <label>Shopify token</label>
                <input type="text" class="form-control" ref="shopifyToken" defaultValue={this.settings.shopifyToken} />
                <label>{i18next.t('shopify-export-serie-key')}</label>
                <input type="text" class="form-control" ref="shopifyExportSerie" defaultValue={this.settings.shopifyExportSerie} />
                <label>{i18next.t('shopify-intracommunity-operations-serie')}</label>
                <input type="text" class="form-control" ref="shopifyIntracommunitySerie" defaultValue={this.settings.shopifyIntracommunitySerie} />
                <label>{i18next.t('shopify-interior-operations-serie')}</label>
                <input type="text" class="form-control" ref="shopifyInteriorSerie" defaultValue={this.settings.shopifyInteriorSerie} />
                <label>{i18next.t('shopify-default-payment-method')}</label>
                <input type="number" class="form-control" ref="shopifyDefaultPaymentMethod" defaultValue={this.settings.shopifyDefaultPaymentMethod} />
                <label>Shopify shop location ID</label>
                <input type="number" class="form-control" ref="shopifyShopLocationId" defaultValue={this.settings.shopifyShopLocationId} />
            </div>}
        </div>
    }
}

class SettingsEmail extends Component {
    constructor({ settings, saveTab }) {
        super();

        this.settings = settings;
        this.saveTab = saveTab;
    }

    componentWillUnmount() {
        this.saveTab({
            email: this.refs.email.value,
            sendGridKey: this.refs.sendGridKey.value,
            emailFrom: this.refs.emailFrom.value,
            nameFrom: this.refs.nameFrom.value
        });
    }

    render() {
        return <div>
            <label>{i18next.t('email-platform')}</label>
            <select class="form-control" defaultValue={this.settings.email} ref="email">
                <option value="_">{i18next.t('no-email-configured')}</option>
                <option value="S">SendGrid</option>
                <option value="T">SMTP</option>
            </select>
            <label>{i18next.t('sendgrid-key')}</label>
            <input type="text" class="form-control" ref="sendGridKey" defaultValue={this.settings.sendGridKey} />
            <label>Email from</label>
            <input type="text" class="form-control" ref="emailFrom" defaultValue={this.settings.emailFrom} />
            <label>Name from</label>
            <input type="text" class="form-control" ref="nameFrom" defaultValue={this.settings.nameFrom} />
        </div>
    }
}

class SettingsCurrency extends Component {
    constructor({ settings, saveTab }) {
        super();

        this.settings = settings;
        this.saveTab = saveTab;
    }

    componentWillUnmount() {
        this.saveTab({
            currency: this.refs.currency.value,
            currencyECBurl: this.refs.currencyECBurl.value,
        });
    }

    render() {
        return <div>
            <label>{i18next.t('currency-exchange-sync')}</label>
            <select class="form-control" defaultValue={this.settings.currency} ref="currency">
                <option value="_">{i18next.t('no-sync-configured')}</option>
                <option value="E">European Central Bank</option>
            </select>
            <label>{i18next.t('currency-exchange-webservice-url')}</label>
            <input type="text" class="form-control" ref="currencyECBurl" defaultValue={this.settings.currencyECBurl} />
        </div>
    }
}

class SettingsCron extends Component {
    constructor({ settings, saveTab }) {
        super();

        this.settings = settings;
        this.saveTab = saveTab;
    }

    componentWillUnmount() {
        this.saveTab({
            cronCurrency: this.refs.cronCurrency.value,
            cronPrestaShop: this.refs.cronPrestaShop.value,
            cronClearLabels: this.refs.cronClearLabels.value,
        });
    }

    render() {
        return <div>
            <label>{i18next.t('currency-exchange-cron-settings')}</label>
            <input type="text" class="form-control" ref="cronCurrency" defaultValue={this.settings.cronCurrency} />
            <label>{i18next.t('ecommerce-cron-settings')}</label>
            <input type="text" class="form-control" ref="cronPrestaShop" defaultValue={this.settings.cronPrestaShop} />
            <label>{i18next.t('cron-delete-shipping-labels')}</label>
            <input type="text" class="form-control" ref="cronClearLabels" defaultValue={this.settings.cronClearLabels} />

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
            customerJournal: this.refs.customerJournal.value == "" ? null : parseInt(this.refs.customerJournal.value),
            salesJournal: this.refs.salesJournal.value == "" ? null : parseInt(this.refs.salesJournal.value),
            supplierJournal: this.refs.supplierJournal.value == "" ? null : parseInt(this.refs.supplierJournal.value),
            purchaseJournal: this.refs.purchaseJournal.value == "" ? null : parseInt(this.refs.purchaseJournal.value),
            limitAccountingDate:
                this.refs.limitAccountingDate.checked ? new Date(this.refs.limitAccountingDateDate.value + " " + this.refs.limitAccountingDateTime.value) : null
        });
    }

    add() {
        this.insertConfigAccountsVat({
            vatPercent: parseFloat(this.refs.vatPercent.value),
            journalSale: parseInt(this.refs.journalSale.value),
            accountSaleNumber: parseInt(this.refs.accountSaleNumber.value),
            journalPurchase: parseInt(this.refs.journalPurchase.value),
            accountPurchaseNumber: parseInt(this.refs.accountPurchaseNumber.value)
        }).then(() => {
            this.renderAccouts();
        });
    }

    render() {
        return <div>
            <div class="form-row">
                <div class="col">
                    <input class="form-check-input" type="checkbox" ref="limitAccountingDate" defaultChecked={this.settings.limitAccountingDate != null} />
                    <label className="checkbox-label">Limit accounting date</label>
                    <br />
                    <input type="date" class="form-control" ref="limitAccountingDateDate"
                        defaultValue={this.settings.limitAccountingDate == null ? '' : dateFormat(new Date(this.settings.limitAccountingDate), "yyyy-mm-dd")} />
                    <input type="time" class="form-control" ref="limitAccountingDateTime"
                        defaultValue={this.settings.limitAccountingDate == null ? '' : dateFormat(new Date(this.settings.limitAccountingDate), "hh:MM")} />
                </div>
            </div>
            <div class="form-row">
                <div class="col">
                    <label>{i18next.t('customer-journal')}</label>
                    <input type="number" class="form-control" ref="customerJournal" defaultValue={this.settings.customerJournal} />
                </div>
                <div class="col">
                    <label>{i18next.t('sales-journal')}</label>
                    <input type="number" class="form-control" ref="salesJournal" defaultValue={this.settings.salesJournal} />
                </div>
                <div class="col">
                    <label>{i18next.t('supplier-journal')}</label>
                    <input type="number" class="form-control" ref="supplierJournal" defaultValue={this.settings.supplierJournal} />
                </div>
                <div class="col">
                    <label>{i18next.t('purchase-journal')}</label>
                    <input type="number" class="form-control" ref="purchaseJournal" defaultValue={this.settings.purchaseJournal} />
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
                    <label>{i18next.t('vat-percent')}</label>
                    <input type="number" class="form-control" defaultValue="0" ref="vatPercent" />
                </div>
                <div class="col">
                    <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button>
                </div>
            </div>
            <div class="form-row">
                <div class="col">
                    <label>{i18next.t('journal-sale')}</label>
                    <input type="number" class="form-control" defaultValue="0" ref="journalSale" />
                </div>
                <div class="col">
                    <label>{i18next.t('account-number-sale')}</label>
                    <input type="number" class="form-control" defaultValue="0" ref="accountSaleNumber" />
                </div>
                <div class="col">
                    <label>{i18next.t('journal-purchase')}</label>
                    <input type="number" class="form-control" defaultValue="0" ref="journalPurchase" />
                </div>
                <div class="col">
                    <label>{i18next.t('account-number-purchase')}</label>
                    <input type="number" class="form-control" defaultValue="0" ref="accountPurchaseNumber" />
                </div>
            </div>
        </div>
    }
}

export default Settings;
