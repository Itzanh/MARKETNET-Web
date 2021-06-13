import { Component } from "react";
import ReactDOM from 'react-dom';

import AutocompleteField from "../../AutocompleteField";

class Settings extends Component {
    constructor({ settings, findWarehouseByName, updateSettings }) {
        super();

        this.settings = settings;
        this.findWarehouseByName = findWarehouseByName;
        this.updateSettings = updateSettings;

        this.currentSelectedWarehouseId = settings.defaultWarehouse;

        this.tabGeneral = this.tabGeneral.bind(this);
        this.tabEnterprise = this.tabEnterprise.bind(this);
        this.tabEcommerce = this.tabEcommerce.bind(this);
        this.tabEmail = this.tabEmail.bind(this);
        this.tabCurrency = this.tabCurrency.bind(this);
        this.saveTab = this.saveTab.bind(this);
        this.save = this.save.bind(this);
    }

    componentDidMount() {
        window.$('#settingsModal').modal({ show: true });
        this.tabGeneral();
    }

    saveTab(changes) {
        Object.keys(changes).forEach((key) => {
            this.settings[key] = changes[key];
        });
    }

    tabGeneral() {
        ReactDOM.render(<SettingsGeneral
            settings={this.settings}
            findWarehouseByName={this.findWarehouseByName}
            saveTab={this.saveTab}
        />, this.refs.render);
    }

    tabEnterprise() {
        ReactDOM.render(<SettingsEnterprise
            settings={this.settings}
            saveTab={this.saveTab}
        />, this.refs.render);
    }

    tabEcommerce() {
        ReactDOM.render(<SettingsEcommerce
            settings={this.settings}
            saveTab={this.saveTab}
        />, this.refs.render);
    }

    tabEmail() {
        ReactDOM.render(<SettingsEmail
            settings={this.settings}
            saveTab={this.saveTab}
        />, this.refs.render);
    }

    tabCurrency() {
        ReactDOM.render(<SettingsCurrency
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
                        <h5 class="modal-title" id="settingsModalLabel">Settings</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <ul class="nav nav-tabs">
                            <li class="nav-item">
                                <a class="nav-link active" href="#" onClick={this.tabGeneral}>General</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#" onClick={this.tabEnterprise}>Enterprise</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#" onClick={this.tabEcommerce}>E-Commerce</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#" onClick={this.tabEmail}>Email</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#" onClick={this.tabCurrency}>Currency</a>
                            </li>
                        </ul>

                        <div ref="render">
                        </div>

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onClick={this.save}>Save</button>
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
            barcodePrefix: this.refs.barcodePrefix.value
        });
    }

    render() {
        return <div>
            <div class="form-row">
                <div class="col">
                    <label>Default VAT percent</label>
                    <input type="number" class="form-control" ref="defaultVatPercent" defaultValue={this.settings.defaultVatPercent} />
                </div>
                <div class="col">
                    <label>Date format</label>
                    <input type="text" class="form-control" ref="dateFormat" defaultValue={this.settings.dateFormat} />
                </div>
            </div>
            <label>Default warehouse</label>
            <AutocompleteField findByName={this.findWarehouseByName}
                defaultValueId={this.settings.defaultWarehouse} defaultValueName={this.settings.defaultWarehouseName}
                valueChanged={(value) => {
                    this.currentSelectedWarehouseId = value;
                }} />
            <label>Barcode prefix</label>
            <input type="number" class="form-control" ref="barcodePrefix" defaultValue={this.settings.barcodePrefix} />
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
            <label>Enterprise name</label>
            <input type="text" class="form-control" ref="enterpriseName" defaultValue={this.settings.enterpriseName} />
            <label>Enterprise description</label>
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
            prestaShopInteriorSerie: this.refs.prestaShopInteriorSerie.value
        });
    }

    render() {
        return <div>
            <label>E-Commerce platform</label>
            <select class="form-control" defaultValue={this.settings.ecommerce} ref="ecommerce">
                <option value="_">No e-commerce connected</option>
                <option value="P">PrestaShop</option>
                <option value="M">Magento Open Source</option>
            </select>
            <label>PrestaShop API URL</label>
            <input type="text" class="form-control" ref="prestaShopUrl" defaultValue={this.settings.prestaShopUrl} />
            <label>PrestaShop API KEY</label>
            <input type="text" class="form-control" ref="prestaShopApiKey" defaultValue={this.settings.prestaShopApiKey} />
            <label>PrestaShop Language Id</label>
            <input type="number" class="form-control" min="0" ref="prestaShopLanguageId" defaultValue={this.settings.prestaShopLanguageId} />
            <label>PrestaShop Export serie key</label>
            <input type="text" class="form-control" ref="prestaShopExportSerie" defaultValue={this.settings.prestaShopExportSerie} />
            <label>PrestaShop Intracommunity operations serie</label>
            <input type="text" class="form-control" ref="prestaShopIntracommunitySerie" defaultValue={this.settings.prestaShopIntracommunitySerie} />
            <label>PrestaShop Interior operations serie</label>
            <input type="text" class="form-control" ref="prestaShopInteriorSerie" defaultValue={this.settings.prestaShopInteriorSerie} />
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
            email: this.refs.email.value
        });
    }

    render() {
        return <div>
            <label>EMail platform</label>
            <select class="form-control" defaultValue={this.settings.email} ref="email">
                <option value="_">No email configured</option>
                <option value="S">SendGrid</option>
                <option value="T">SMTP</option>
            </select>
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
            <label>Currency exchange sync</label>
            <select class="form-control" defaultValue={this.settings.currency} ref="currency">
                <option value="_">No sync configured</option>
                <option value="E">European Central Bank</option>
            </select>
            <label>Currency exchange webservice URL</label>
            <input type="text" class="form-control" ref="currencyECBurl" defaultValue={this.settings.currencyECBurl} />
        </div>
    }
}

export default Settings;
