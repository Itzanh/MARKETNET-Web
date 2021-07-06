import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

import AutocompleteField from "../../AutocompleteField";

class Settings extends Component {
    constructor({ settings, findWarehouseByName, updateSettings }) {
        super();

        this.settings = settings;
        this.findWarehouseByName = findWarehouseByName;
        this.updateSettings = updateSettings;

        this.currentSelectedWarehouseId = settings.defaultWarehouse;
        this.tab = 0;

        this.tabGeneral = this.tabGeneral.bind(this);
        this.tabEnterprise = this.tabEnterprise.bind(this);
        this.tabEcommerce = this.tabEcommerce.bind(this);
        this.tabEmail = this.tabEmail.bind(this);
        this.tabCurrency = this.tabCurrency.bind(this);
        this.tabCron = this.tabCron.bind(this);
        this.saveTab = this.saveTab.bind(this);
        this.save = this.save.bind(this);
    }

    componentDidMount() {
        window.$('#settingsModal').modal({ show: true });
        this.tabs();
        this.tabGeneral();
    }

    tabs() {
        ReactDOM.render(<ul class="nav nav-tabs">
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 0 ? " active" : "")} href="#" onClick={this.tabGeneral}>General</a>
            </li>
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 1 ? " active" : "")} href="#" onClick={this.tabEnterprise}>{i18next.t('enterprise')}</a>
            </li>
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 2 ? " active" : "")} href="#" onClick={this.tabEcommerce}>E-Commerce</a>
            </li>
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 3 ? " active" : "")} href="#" onClick={this.tabEmail}>Email</a>
            </li>
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 4 ? " active" : "")} href="#" onClick={this.tabCurrency}>{i18next.t('currency')}</a>
            </li>
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 5 ? " active" : "")} href="#" onClick={this.tabCron}>Cron</a>
            </li>
        </ul>, this.refs.tabs);
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
            <div class="modal-dialog modal-lg" role="document">
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
                </div>
            </div>
            <label>{i18next.t('default-warehouse')}</label>
            <AutocompleteField findByName={this.findWarehouseByName}
                defaultValueId={this.settings.defaultWarehouse} defaultValueName={this.settings.defaultWarehouseName}
                valueChanged={(value) => {
                    this.currentSelectedWarehouseId = value;
                }} />
            <label>{i18next.t('barcode-prefix')}</label>
            <input type="number" class="form-control" ref="barcodePrefix" defaultValue={this.settings.barcodePrefix} />
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
            <label>{i18next.t('maximum-connections')}</label>
            <input type="number" class="form-control" ref="maxConnections" defaultValue={this.settings.maxConnections} min="0" />
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
            prestaShopUrl: this.refs.prestaShopUrl.value,
            prestaShopApiKey: this.refs.prestaShopApiKey.value,
            prestaShopLanguageId: parseInt(this.refs.prestaShopLanguageId.value),
            prestaShopExportSerie: this.refs.prestaShopExportSerie.value,
            prestaShopIntracommunitySerie: this.refs.prestaShopIntracommunitySerie.value,
            prestaShopInteriorSerie: this.refs.prestaShopInteriorSerie.value,
            prestashopStatusPaymentAccepted: parseInt(this.refs.prestashopStatusPaymentAccepted.value),
            prestashopStatusShipped: parseInt(this.refs.prestashopStatusShipped.value)
        });
    }

    render() {
        return <div>
            <label>{i18next.t('ecommerce-platform')}</label>
            <select class="form-control" defaultValue={this.settings.ecommerce} ref="ecommerce">
                <option value="_">{i18next.t('no-ecommerce-connected')}</option>
                <option value="P">PrestaShop</option>
                <option value="M">Magento Open Source</option>
            </select>
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
        });
    }

    render() {
        return <div>
            <label>{i18next.t('currency-exchange-cron-settings')}</label>
            <input type="text" class="form-control" ref="cronCurrency" defaultValue={this.settings.cronCurrency} />
            <label>{i18next.t('prestaShop-cron-settings')}</label>
            <input type="text" class="form-control" ref="cronPrestaShop" defaultValue={this.settings.cronPrestaShop} />

            <a href="https://pkg.go.dev/github.com/robfig/cron">{i18next.t('cron-documentation')}</a>
        </div>
    }
}

export default Settings;
