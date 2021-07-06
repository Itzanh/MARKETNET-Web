import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

import LocateAddress from "../../Masters/Addresses/LocateAddress";
import AutocompleteField from "../../AutocompleteField";
import LocateSalesOrder from "../../Sales/Orders/LocateSalesOrder";
import LocateSalesDeliveryNote from "../../Sales/DeliveryNotes/LocateSalesDeliveryNote";
import DocumentsTab from "../../Masters/Documents/DocumentsTab";

class ShippingForm extends Component {
    constructor({ shipping, addShipping, updateShipping, deleteShipping, locateAddress, defaultValueNameShippingAddress, findCarrierByName,
        defaultValueNameCarrier, locateSaleOrder, defaultValueNameSaleOrder, locateSaleDeliveryNote, defaultValueNameSaleDeliveryNote, tabShipping,
        getShippingPackaging, toggleShippingSent, documentFunctions, getIncoterms }) {
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
    }

    componentDidMount() {
        this.tabs();
        this.tabPackages();
    }

    tabs() {
        ReactDOM.render(<ul class="nav nav-tabs">
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 0 ? " active" : "")} href="#" onClick={this.tabPackages}>{i18next.t('packages')}</a>
            </li>
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 1 ? " active" : "")} href="#" onClick={this.tabDescription}>{i18next.t('description')}</a>
            </li>
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 2 ? " active" : "")} href="#" onClick={this.tabDocuments}>{i18next.t('documents')}</a>
            </li>
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 3 ? " active" : "")} href="#">{i18next.t('tags')}</a>
            </li>
        </ul>, this.refs.tabs);
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

    locateSalesOrder() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderAddressModal'));
        ReactDOM.render(
            <LocateSalesOrder
                locateSaleOrder={this.locateSaleOrder}
                handleSelect={(orderId, addressName) => {
                    this.currentSelectedSaleOrder = orderId;
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
        this.toggleShippingSent(this.shipping.id).then((ok) => {
            if (ok) {
                this.tabShipping();
            }
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
                    {this.shipping == null ? < button type="button" class="btn btn-primary mt-1" onClick={this.add}>{i18next.t('add')}</button> : null}
                    {this.shipping != null ? <button type="button" class="btn btn-danger mt-1" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                    {this.shipping != null ? <button type="button" class="btn btn-success mt-1" onClick={this.update}>{i18next.t('update')}</button> : null}
                    <button type="button" class="btn btn-secondary mt-1" onClick={this.tabShipping}>{i18next.t('cancel')}</button>
                    {this.shipping != null && this.shipping.carrierWebService != "_" && !this.shipping.sent ?
                        <button type="button" class="btn btn-info mt-1" onClick={this.toggleSent}>{i18next.t('generate-tags')}</button> : null}
                    {this.shipping != null && this.shipping.carrierWebService != "_" && this.shipping.sent ?
                        <button type="button" class="btn btn-warning mt-1">{i18next.t('print-tags')}</button> : null}
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

export default ShippingForm;
