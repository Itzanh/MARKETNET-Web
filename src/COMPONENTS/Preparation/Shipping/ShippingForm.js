import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

import LocateAddress from "../../Masters/Addresses/LocateAddress";
import AutocompleteField from "../../AutocompleteField";
import LocateSalesOrder from "../../Sales/Orders/LocateSalesOrder";
import LocateSalesDeliveryNote from "../../Sales/DeliveryNotes/LocateSalesDeliveryNote";
import DocumentsTab from "../../Masters/Documents/DocumentsTab";
import AlertModal from "../../AlertModal";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TransactionLogViewModal from "../../VisualComponents/TransactionLogViewModal";

class ShippingForm extends Component {
    constructor({ shipping, addShipping, updateShipping, deleteShipping, locateAddress, defaultValueNameShippingAddress, findCarrierByName,
        defaultValueNameCarrier, locateSaleOrder, defaultValueNameSaleOrder, locateSaleDeliveryNote, defaultValueNameSaleDeliveryNote, tabShipping,
        getShippingPackaging, toggleShippingSent, documentFunctions, getIncoterms, getShippingTags, getRegisterTransactionalLogs }) {
        super();

        this.shipping = shipping;
        this.addShipping = addShipping;
        this.updateShipping = updateShipping;
        this.deleteShipping = deleteShipping;
        this.locateAddress = locateAddress;
        this.defaultValueNameShippingAddress = defaultValueNameShippingAddress;
        this.findCarrierByName = findCarrierByName;
        this.defaultValueNameCarrier = defaultValueNameCarrier;
        this.locateSaleOrder = locateSaleOrder;
        this.defaultValueNameSaleOrder = defaultValueNameSaleOrder;
        this.locateSaleDeliveryNote = locateSaleDeliveryNote;
        this.defaultValueNameSaleDeliveryNote = defaultValueNameSaleDeliveryNote;
        this.tabShipping = tabShipping;
        this.getShippingPackaging = getShippingPackaging;
        this.toggleShippingSent = toggleShippingSent;
        this.documentFunctions = documentFunctions;
        this.getIncoterms = getIncoterms;
        this.getShippingTags = getShippingTags;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;

        this.currentSelectedSaleOrder = shipping != null ? shipping.order : null;
        this.currentSelectedSaleDeliveryNote = shipping != null ? shipping.deliveryNote : null;
        this.currentSelectedShippingAddress = shipping != null ? shipping.deliveryAddress : null;
        this.currentSelectedCarrierId = shipping != null ? shipping.carrier : null;
        this.currentSelectedIncotermId = shipping != null ? shipping.incoterm : null;

        this.notes = shipping != null ? shipping.carrierNotes : '';
        this.description = shipping != null ? shipping.description : '';

        this.tab = 0;

        this.tabs = this.tabs.bind(this);
        this.tabPackages = this.tabPackages.bind(this);
        this.tabDescription = this.tabDescription.bind(this);
        this.locateSalesOrder = this.locateSalesOrder.bind(this);
        this.locateSalesDeliveryNote = this.locateSalesDeliveryNote.bind(this);
        this.locateDeliveryAddr = this.locateDeliveryAddr.bind(this);
        this.toggleSent = this.toggleSent.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.tabDocuments = this.tabDocuments.bind(this);
        this.printTags = this.printTags.bind(this);
        this.tabTags = this.tabTags.bind(this);
        this.transactionLog = this.transactionLog.bind(this);
    }

    componentDidMount() {
        this.tabs();
        this.tabPackages();
    }

    tabs() {
        ReactDOM.render(<AppBar position="static" style={{
            'backgroundColor': '#343a40'
        }}>
            <Tabs value={this.tab} onChange={(_, tab) => {
                this.tab = tab;
                switch (tab) {
                    case 0: {
                        this.tabPackages();
                        break;
                    }
                    case 1: {
                        this.tabDescription();
                        break;
                    }
                    case 2: {
                        this.tabDocuments();
                        break;
                    }
                    case 3: {
                        this.tabTags();
                        break;
                    }
                }
            }}>
                <Tab label={i18next.t('packages')} />
                <Tab label={i18next.t('description')} />
                <Tab label={i18next.t('documents')} />
                <Tab label={i18next.t('tags')} />
            </Tabs>
        </AppBar>, this.refs.tabs);
    }

    tabPackages() {
        this.tab = 0;
        this.tabs();
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(
            <ShippingPackages
                shippingId={this.shipping != null ? this.shipping.id : null}
                getShippingPackaging={this.getShippingPackaging}
            />,
            this.refs.render);
    }

    tabDescription() {
        this.tab = 1;
        this.tabs();
        ReactDOM.render(<ShippingDescription
            notes={this.notes}
            description={this.description}
            incoterm={this.currentSelectedIncotermId}
            getIncoterms={this.getIncoterms}
            setNotes={(notes) => {
                this.notes = notes;
            }}
            setDescription={(description) => {
                this.description = description;
            }}
            setIncoterm={(incoterm) => {
                this.currentSelectedIncotermId = incoterm;
            }}
        />, this.refs.render);
    }

    tabDocuments() {
        this.tab = 2;
        this.tabs();
        ReactDOM.render(<DocumentsTab
            shippingId={this.shipping == null ? null : this.shipping.id}
            documentFunctions={this.documentFunctions}
        />, this.refs.render);
    }

    tabTags() {
        this.tab = 3;
        this.tabs();
        ReactDOM.render(<ShippingTags
            shippingId={this.shipping != null ? this.shipping.id : null}
            getShippingTags={this.getShippingTags}
        />, this.refs.render);
    }

    locateSalesOrder() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(
            <LocateSalesOrder
                locateSaleOrder={this.locateSaleOrder}
                handleSelect={(orderId, addressName, customer) => {
                    this.currentSelectedSaleOrder = orderId;
                    this.currentSelectedCustomerId = customer;
                    this.refs.saleOrder.value = addressName;
                }}
            />,
            document.getElementById('renderAddressModal'));
    }

    locateSalesDeliveryNote() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(
            <LocateSalesDeliveryNote
                locateSaleDeliveryNote={() => {
                    return this.locateSaleDeliveryNote(this.currentSelectedSaleOrder);
                }}
                handleSelect={(orderId, addressName) => {
                    this.currentSelectedSaleDeliveryNote = orderId;
                    this.refs.deliveryNote.value = addressName;
                }}
            />,
            document.getElementById('renderAddressModal'));
    }

    locateDeliveryAddr() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(
            <LocateAddress
                locateAddress={() => {
                    return this.locateAddress(this.currentSelectedCustomerId);
                }}
                handleSelect={(addressId, addressName) => {
                    this.currentSelectedShippingAddress = addressId;
                    this.refs.shippingAddres.value = addressName;
                }}
            />,
            document.getElementById('renderAddressModal'));
    }

    toggleSent() {
        this.toggleShippingSent(this.shipping.id).then((response) => {
            if (response.ok) {
                this.printTags().then(() => {
                    this.tabShipping();
                });
            } else {
                ReactDOM.render(<AlertModal
                    modalTitle={"ERROR"}
                    modalText={response.errorMessage}
                />, document.getElementById("renderAddressModal"));
            }
        });
    }

    printTags() {
        return new Promise((resolve) => {
            this.getShippingTags(this.shipping.id).then((labels) => {
                if (labels.length > 0) {
                    window.open("marketnettagprinter:\\\\copies=1&barcode=label&data=" + labels[(labels.length - 1)].label);
                    resolve();
                }
            });
        });
    }

    getShippingFromForm() {
        return {
            order: this.currentSelectedSaleOrder,
            deliveryNote: this.currentSelectedSaleDeliveryNote,
            deliveryAddress: this.currentSelectedShippingAddress,
            carrier: this.currentSelectedCarrierId,
            incoterm: this.currentSelectedIncotermId,
            carrierNotes: this.notes,
            description: this.description,
            shippingNumber: this.refs.shippingNumber.value,
            trackingNumber: this.refs.trackingNumber.value
        }
    }

    update() {
        const shipping = this.getShippingFromForm();
        shipping.id = this.shipping.id;

        this.updateShipping(shipping).then((ok) => {
            if (ok) {
                this.tabShipping();
            }
        });
    }

    delete() {
        this.deleteShipping(this.shipping.id).then((ok) => {
            if (ok) {
                this.tabShipping();
            }
        });
    }

    transactionLog() {
        if (this.shipping == null) {
            return;
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(<TransactionLogViewModal
            getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
            tableName={"shipping"}
            registerId={this.shipping.id}
        />,
            document.getElementById('renderAddressModal'));
    }

    render() {
        return <div id="tabShipping" className="formRowRoot">
            <div id="renderAddressModal"></div>
            <h4>{i18next.t('shipping')} {this.shipping == null ? "" : this.shipping.id}</h4>
            {this.shipping != null && this.shipping.sent ? <span class="badge badge-pill badge-primary">Sent</span> : null}
            {this.shipping != null && this.shipping.collected ? <span class="badge badge-pill badge-success">Collected</span> : null}
            {this.shipping != null && this.shipping.national ? <span class="badge badge-pill badge-danger">National</span> : null}
            <div class="form-row">
                <div class="col">
                    <label>{i18next.t('sale-order')}</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateSalesOrder}>{i18next.t('LOCATE')}</button>
                        </div>
                        <input type="text" class="form-control" ref="saleOrder" defaultValue={this.defaultValueNameSaleOrder}
                            readOnly={true} />
                    </div>
                </div>
                <div class="col">
                    <label>{i18next.t('delivery-note')}</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateSalesDeliveryNote}>{i18next.t('LOCATE')}</button>
                        </div>
                        <input type="text" class="form-control" ref="deliveryNote" defaultValue={this.defaultValueNameSaleDeliveryNote}
                            readOnly={true} />
                    </div>
                </div>
                <div class="col">
                    <label>{i18next.t('shipping-address')}</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateDeliveryAddr}>{i18next.t('LOCATE')}</button>
                        </div>
                        <input type="text" class="form-control" ref="shippingAddres" defaultValue={this.defaultValueNameShippingAddress}
                            readOnly={true} />
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="col">
                    <label>{i18next.t('shipping-number')}</label>
                    <input type="text" class="form-control" defaultValue={this.shipping != null ? this.shipping.shippingNumber : ''} ref="shippingNumber"
                        readOnly={this.shipping == null || this.shipping.carrierWebService != "_"} />
                </div>
                <div class="col">
                    <label>{i18next.t('tracking-number')}</label>
                    <input type="text" class="form-control" defaultValue={this.shipping != null ? this.shipping.trackingNumber : ''} ref="trackingNumber"
                        readOnly={this.shipping == null || this.shipping.carrierWebService != "_"} />
                </div>
                <div class="col">
                    <label>{i18next.t('carrier')}</label>
                    <AutocompleteField findByName={this.findCarrierByName} defaultValueId={this.shipping != null ? this.shipping.carrier : null}
                        defaultValueName={this.defaultValueNameCarrier} valueChanged={(value) => {
                            this.currentSelectedCarrierId = value;
                        }} />
                </div>
                <div class="col">
                    <label>{i18next.t('date-created')}</label>
                    <input type="text" class="form-control" readOnly={true}
                        defaultValue={this.shipping != null ? window.dateFormat(new Date(this.shipping.dateCreated)) : ''} />
                </div>
                <div class="col">
                    <label>{i18next.t('date-sent')}</label>
                    <input type="text" class="form-control" readOnly={true}
                        defaultValue={this.shipping != null && this.shipping.dateSent != null ? window.dateFormat(new Date(this.shipping.dateSent)) : ''} />
                </div>
            </div>

            <div ref="tabs" className="mt-2"></div>

            <div ref="render" className="mt-2"></div>

            <div id="buttomBottomFormContainter">
                <div id="buttomBottomForm">
                    <div class="btn-group dropup">
                        <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {i18next.t('options')}
                        </button>
                        <div class="dropdown-menu">
                            {this.shipping != null ? <a class="dropdown-item" href="#" onClick={this.transactionLog}>{i18next.t('transactional-log')}</a> : null}
                        </div>
                    </div>

                    {this.shipping == null ? < button type="button" class="btn btn-primary mt-1" onClick={this.add}>{i18next.t('add')}</button> : null}
                    {this.shipping != null ? <button type="button" class="btn btn-danger mt-1" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                    {this.shipping != null ? <button type="button" class="btn btn-success mt-1" onClick={this.update}>{i18next.t('update')}</button> : null}
                    <button type="button" class="btn btn-secondary mt-1" onClick={this.tabShipping}>{i18next.t('cancel')}</button>
                    {this.shipping != null && this.shipping.carrierWebService != "_" && !this.shipping.sent ?
                        <button type="button" class="btn btn-info mt-1" onClick={this.toggleSent}>{i18next.t('generate-tags')}</button> : null}
                    {this.shipping != null && this.shipping.carrierWebService != "_" && this.shipping.sent ?
                        <button type="button" class="btn btn-warning mt-1" onClick={this.printTags}>{i18next.t('print-tags')}</button> : null}
                    {this.shipping != null && this.shipping.carrierWebService == "_" && !this.shipping.sent ?
                        <button type="button" class="btn btn-info mt-1" onClick={this.toggleSent}>{i18next.t('set-as-sent-manual-shipping')}</button> : null}
                    {this.shipping != null && this.shipping.carrierWebService == "_" && this.shipping.sent && !this.shipping.collected ?
                        <button type="button" class="btn btn-warning mt-1" onClick={this.toggleSent}>{i18next.t('set-as-not-sent-manual-shipping')}
                        </button> : null}
                </div>
            </div>

        </div>
    }
}

class ShippingPackages extends Component {
    constructor({ shippingId, getShippingPackaging }) {
        super();

        this.shippingId = shippingId;
        this.getShippingPackaging = getShippingPackaging;
    }

    componentDidMount() {
        if (this.shippingId == null) {
            return;
        }

        this.getShippingPackaging(this.shippingId).then((packages) => {
            ReactDOM.render(packages.map((element, i) => {
                return <ShippingPackage key={i}
                    _package={element}
                    edit={this.edit}
                    pos={i}
                />
            }), this.refs.render);
        });
    }

    render() {
        return <table class="table table-dark">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">{i18next.t('package')}</th>
                    <th scope="col">{i18next.t('weight')}</th>
                </tr>
            </thead>
            <tbody ref="render"></tbody>
        </table>
    }
}

class ShippingPackage extends Component {
    constructor({ _package, edit, pos }) {
        super();

        this.package = _package;
        this.edit = edit;
        this.pos = pos;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.package);
        }}>
            <th scope="row">{this.pos + 1}</th>
            <td>{this.package.packageName}</td>
            <td>{this.package.weight}</td>
        </tr>
    }
}

class ShippingDescription extends Component {
    constructor({ notes, description, setNotes, setDescription, incoterm, getIncoterms, setIncoterm }) {
        super();

        this.notes = notes;
        this.description = description;
        this.setNotes = setNotes;
        this.setDescription = setDescription;
        this.incoterm = incoterm;
        this.getIncoterms = getIncoterms;
        this.setIncoterm = setIncoterm;
    }

    componentDidMount() {
        this.getIncoterms().then(async (incoterms) => {
            const components = incoterms.map((element, i) => {
                return <option value={element.id} key={i}>{element.key} ({element.name})</option>
            });
            components.unshift(<option value="0">.{i18next.t('none')}</option>);
            await ReactDOM.render(components, this.refs.render);

            this.refs.render.value = this.incoterm;
        });
    }

    render() {
        return <div>
            <label>Incoterm</label>
            <select class="form-control" ref="render" onChange={() => {
                const incoterm = parseInt(this.refs.render.value);
                this.setIncoterm(incoterm == 0 ? null : incoterm);
            }}>
            </select>
            <label>{i18next.t('carrier-notes')}</label>
            <input type="text" class="form-control" ref="notes" defaultValue={this.notes} onChange={() => {
                this.setNotes(this.refs.notes.value);
            }} />
            <label>{i18next.t('description')}</label>
            <textarea class="form-control" rows="10" ref="description" defaultValue={this.description} onChange={() => {
                this.setDescription(this.refs.description.value);
            }}></textarea>
        </div>
    }
}

class ShippingTags extends Component {
    constructor({ shippingId, getShippingTags }) {
        super();

        this.shippingId = shippingId;
        this.getShippingTags = getShippingTags;
    }

    componentDidMount() {
        if (this.shippingId == null) {
            return;
        }

        this.getShippingTags(this.shippingId).then((labels) => {
            ReactDOM.render(labels.map((element, i) => {
                return <tr key={i} onClick={() => {
                    this.edit(element);
                }}>
                    <th scope="row">{element.id}</th>
                    <td>{window.dateFormat(element.dateCreated)}</td>
                </tr>
            }), this.refs.render);
        });
    }

    edit(label) {
        window.open("marketnettagprinter:\\\\copies=1&barcode=label&data=" + label.label);
    }

    render() {
        return <table class="table table-dark">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">{i18next.t('date-created')}</th>
                </tr>
            </thead>
            <tbody ref="render"></tbody>
        </table>
    }
}

export default ShippingForm;
