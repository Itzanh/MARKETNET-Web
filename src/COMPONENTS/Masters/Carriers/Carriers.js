import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

class Carriers extends Component {
    constructor({ getCarriers, addCarrier, updateCarrier, deleteCarrier }) {
        super();

        this.getCarriers = getCarriers;
        this.addCarrier = addCarrier;
        this.updateCarrier = updateCarrier;
        this.deleteCarrier = deleteCarrier;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderCarriers();
    }

    renderCarriers() {
        this.getCarriers().then((carriers) => {
            this.list = carriers;
            this.forceUpdate();
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderCarrierModal'));
        ReactDOM.render(
            <CarriersModal
                addCarrier={(carrier) => {
                    const promise = this.addCarrier(carrier);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderCarriers();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderCarrierModal'));
    }

    edit(carrier) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderCarrierModal'));
        ReactDOM.render(
            <CarriersModal
                carrier={carrier}
                updateCarrier={(carrier) => {
                    const promise = this.updateCarrier(carrier);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderCarriers();
                        }
                    });
                    return promise;
                }}
                deleteCarrier={(carrierId) => {
                    const promise = this.deleteCarrier(carrierId);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderCarriers();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderCarrierModal'));
    }

    render() {
        return <div id="tabCarriers">
            <div id="renderCarrierModal"></div>
            <h1>{i18next.t('carriers')}</h1>
            <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add')}</button>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'id', headerName: '#', width: 90 },
                    { field: 'name', headerName: i18next.t('name'), flex: 1 },
                    { field: 'email', headerName: 'Email', width: 300 },
                    { field: 'web', headerName: 'Web', width: 300 }
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

class CarriersModal extends Component {
    constructor({ carrier, addCarrier, updateCarrier, deleteCarrier }) {
        super();

        this.carrier = carrier;
        this.addCarrier = addCarrier;
        this.updateCarrier = updateCarrier;
        this.deleteCarrier = deleteCarrier;

        this.tab = 0;

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.saveTab = this.saveTab.bind(this);
        this.generalTab = this.generalTab.bind(this);
        this.webserviceTab = this.webserviceTab.bind(this);
    }

    componentDidMount() {
        window.$('#carrierModal').modal({ show: true });

        this.tabs();
        this.generalTab();
    }

    tabs() {
        ReactDOM.render(<AppBar position="static" style={{
            'backgroundColor': '#343a40'
        }}>
            <Tabs value={this.tab} onChange={(_, tab) => {
                this.tab = tab;
                switch (tab) {
                    case 0: {
                        this.generalTab();
                        break;
                    }
                    case 1: {
                        this.webserviceTab();
                        break;
                    }
                }
            }}>
                <Tab label="General" />
                <Tab label="WebService" />
            </Tabs>
        </AppBar>, this.refs.tabs);
    }

    generalTab() {
        this.tab = 0;
        this.tabs();
        ReactDOM.render(<CarriersModalGeneral
            carrier={this.carrier}
            saveTab={this.saveTab}
        />, this.refs.render);
    }

    webserviceTab() {
        this.tab = 1;
        this.tabs();
        ReactDOM.render(<CarriersModalWebService
            carrier={this.carrier}
            saveTab={this.saveTab}
        />, this.refs.render);
    }

    saveTab(changes) {
        if (this.carrier == null) {
            this.carrier = {
                webservice: "_"
            };
        }
        Object.keys(changes).forEach((key) => {
            this.carrier[key] = changes[key];
        });
    }

    getCarrierFromForm() {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        return this.carrier;
    }

    isValid(country) {
        this.refs.errorMessage.innerText = "";
        if (country.name.length === 0) {
            this.refs.errorMessage.innerText = i18next.t('name-0');
            return false;
        }
        if (country.name.length > 50) {
            this.refs.errorMessage.innerText = i18next.t('name-50');
            return false;
        }
        if (country.phone.length > 15) {
            this.refs.errorMessage.innerText = i18next.t('phone-15');
            return false;
        }
        if (country.email.length > 100) {
            this.refs.errorMessage.innerText = i18next.t('email-100');
            return false;
        }
        if (country.web.length > 100) {
            this.refs.errorMessage.innerText = i18next.t('web-100');
            return false;
        }
        return true;
    }

    add() {
        const carrier = this.getCarrierFromForm();
        if (!this.isValid(carrier)) {
            return;
        }

        this.addCarrier(carrier).then((ok) => {
            if (ok) {
                window.$('#carrierModal').modal('hide');
            }
        });
    }

    update() {
        const carrier = this.getCarrierFromForm();
        if (!this.isValid(carrier)) {
            return;
        }
        carrier.id = this.carrier.id;

        this.updateCarrier(carrier).then((ok) => {
            if (ok) {
                window.$('#carrierModal').modal('hide');
            }
        });
    }

    delete() {
        this.deleteCarrier(this.carrier.id).then((ok) => {
            if (ok) {
                window.$('#carrierModal').modal('hide');
            }
        });
    }

    render() {
        return <div class="modal fade" id="carrierModal" tabindex="-1" role="dialog" aria-labelledby="carrierModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="carrierModalLabel">{i18next.t('carrier')}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div ref="tabs"></div>

                        <div ref="render"></div>

                    </div>
                    <div class="modal-footer">
                        <p className="errorMessage" ref="errorMessage"></p>
                        {this.carrier != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                        {this.carrier == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                        {this.carrier != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

class CarriersModalGeneral extends Component {
    constructor({ carrier, saveTab }) {
        super();

        this.carrier = carrier;
        this.saveTab = saveTab;
    }

    componentWillUnmount() {
        this.saveTab(this.getCarrierFromForm());
    }

    getCarrierFromForm() {
        const carrier = {};
        carrier.name = this.refs.name.value;
        carrier.maxWeight = parseFloat(this.refs.maxWeight.value);
        carrier.maxWidth = parseFloat(this.refs.maxWidth.value);
        carrier.maxHeight = parseFloat(this.refs.maxHeight.value);
        carrier.maxDepth = parseFloat(this.refs.maxDepth.value);
        carrier.maxPackages = parseInt(this.refs.maxPackages.value);
        carrier.phone = this.refs.phone.value;
        carrier.email = this.refs.email.value;
        carrier.web = this.refs.web.value;
        carrier.pallets = this.refs.pallets.checked;
        return carrier;
    }

    render() {
        return <div>
            <div class="form-group">
                <label>{i18next.t('name')}</label>
                <input type="text" class="form-control" ref="name" defaultValue={this.carrier != null ? this.carrier.name : ''} />
            </div>
            <div class="form-row">
                <div class="col">
                    <label>{i18next.t('max-weight')}</label>
                    <input type="number" class="form-control" min="0" ref="maxWeight"
                        defaultValue={this.carrier != null ? this.carrier.maxWeight : '0'} />
                </div>
                <div class="col">
                    <label>{i18next.t('max-width')}</label>
                    <input type="number" class="form-control" min="0" ref="maxWidth"
                        defaultValue={this.carrier != null ? this.carrier.maxWidth : '0'} />
                </div>
                <div class="col">
                    <label>{i18next.t('max-height')}</label>
                    <input type="number" class="form-control" min="0" ref="maxHeight"
                        defaultValue={this.carrier != null ? this.carrier.maxHeight : '0'} />
                </div>
                <div class="col">
                    <label>{i18next.t('max-depth')}</label>
                    <input type="number" class="form-control" min="0" ref="maxDepth"
                        defaultValue={this.carrier != null ? this.carrier.maxDepth : '0'} />
                </div>
                <div class="col">
                    <label>{i18next.t('max-packages')}</label>
                    <input type="number" class="form-control" min="0" ref="maxPackages"
                        defaultValue={this.carrier != null ? this.carrier.maxPackages : '0'} />
                </div>
            </div>
            <div class="form-group">
                <div class="form-row">
                    <div class="col">
                        <label>{i18next.t('phone')}</label>
                        <input type="text" class="form-control" ref="phone" defaultValue={this.carrier != null ? this.carrier.phone : ''} />
                    </div>
                    <div class="col">
                        <div class="custom-control custom-switch">
                            <input class="form-check-input custom-control-input" type="checkbox" ref="pallets" id="pallets"
                                defaultChecked={this.carrier !== undefined && this.carrier.pallets} />
                            <label class="form-check-label custom-control-label" htmlFor="pallets">{i18next.t('pallets')}</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label>{i18next.t('email')}</label>
                <input type="text" class="form-control" ref="email" defaultValue={this.carrier != null ? this.carrier.email : ''} />
            </div>
            <div class="form-group">
                <label>Web</label>
                <input type="text" class="form-control" ref="web" defaultValue={this.carrier != null ? this.carrier.web : ''} />
            </div>
        </div>
    }
}

class CarriersModalWebService extends Component {
    constructor({ carrier, saveTab }) {
        super();

        this.carrier = carrier;
        this.saveTab = saveTab;
    }

    componentWillUnmount() {
        this.saveTab(this.getCarrierFromForm());
    }

    getCarrierFromForm() {
        const carrier = {};
        carrier.webservice = this.refs.webservice.value;
        carrier.sendcloudUrl = this.refs.sendcloudUrl.value;
        carrier.sendcloudKey = this.refs.sendcloudKey.value;
        carrier.sendcloudSecret = this.refs.sendcloudSecret.value;
        carrier.sendcloudShippingMethod = parseInt(this.refs.sendcloudShippingMethod.value);
        carrier.sendcloudSenderAddress = parseInt(this.refs.sendcloudSenderAddress.value);
        return carrier;
    }

    render() {
        return <div>
            <div class="form-group">
                <label>{i18next.t('webservice-type')}</label>
                <select class="form-control" ref="webservice" defaultValue={this.carrier.webservice}>
                    <option value="_">{i18next.t('no-webservice')}</option>
                    <option value="S">SendCloud</option>
                </select>
                <label>Sendcloud URL</label>
                <input type="text" class="form-control" ref="sendcloudUrl" defaultValue={this.carrier != null ? this.carrier.sendcloudUrl : ''} />
                <label>Sendcloud Key</label>
                <input type="text" class="form-control" ref="sendcloudKey" defaultValue={this.carrier != null ? this.carrier.sendcloudKey : ''} />
                <label>Sendcloud Secret</label>
                <input type="text" class="form-control" ref="sendcloudSecret" defaultValue={this.carrier != null ? this.carrier.sendcloudSecret : ''} />
                <label>ID of shipping method</label>
                <input type="number" class="form-control" ref="sendcloudShippingMethod"
                    defaultValue={this.carrier != null ? this.carrier.sendcloudShippingMethod : '0'} />
                <label>Sendcloud sender address Id</label>
                <input type="number" class="form-control" ref="sendcloudSenderAddress"
                    defaultValue={this.carrier != null ? this.carrier.sendcloudSenderAddress : '0'} />
            </div>
        </div>
    }
}

export default Carriers;
