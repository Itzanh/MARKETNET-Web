import { Component } from "react";
import ReactDOM from 'react-dom';

import LocateAddress from "../../Masters/Addresses/LocateAddress";
import AutocompleteField from "../../AutocompleteField";
import LocateSalesOrder from "../../Sales/Orders/LocateSalesOrder";
import LocateSalesDeliveryNote from "../../Sales/DeliveryNotes/LocateSalesDeliveryNote";
import DocumentsTab from "../../Masters/Documents/DocumentsTab";

class ShippingForm extends Component {
    constructor({ shipping, addShipping, updateShipping, deleteShipping, locateAddress, defaultValueNameShippingAddress, findCarrierByName,
        defaultValueNameCarrier, locateSaleOrder, defaultValueNameSaleOrder, locateSaleDeliveryNote, defaultValueNameSaleDeliveryNote, tabShipping,
        getShippingPackaging, toggleShippingSent, documentFunctions }) {
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

        this.currentSelectedSaleOrder = shipping != null ? shipping.order : null;
        this.currentSelectedSaleDeliveryNote = shipping != null ? shipping.deliveryNote : null;
        this.currentSelectedShippingAddress = shipping != null ? shipping.deliveryAddress : null;

        this.tab = 0;

        this.tabs = this.tabs.bind(this);
        this.tabPackages = this.tabPackages.bind(this);
        this.locateSalesOrder = this.locateSalesOrder.bind(this);
        this.locateSalesDeliveryNote = this.locateSalesDeliveryNote.bind(this);
        this.locateDeliveryAddr = this.locateDeliveryAddr.bind(this);
        this.toggleSent = this.toggleSent.bind(this);
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
                <a class={"nav-link" + (this.tab === 0 ? " active" : "")} href="#" onClick={this.tabPackages}>Packages</a>
            </li>
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 1 ? " active" : "")} href="#">Description</a>
            </li>
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 2 ? " active" : "")} href="#" onClick={this.tabDocuments}>Documents</a>
            </li>
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 3 ? " active" : "")} href="#">Tags</a>
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

    tabDocuments() {
        this.tab =20;
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
        this.toggleShippingSent(this.shipping.id);
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
            <h2>Shipping {this.shipping == null ? "" : this.shipping.id}</h2>
            {this.shipping != null && this.shipping.sent ? <span class="badge badge-pill badge-primary">Sent</span> : null}
            {this.shipping != null && this.shipping.collected ? <span class="badge badge-pill badge-success">Collected</span> : null}
            {this.shipping != null && this.shipping.national ? <span class="badge badge-pill badge-danger">National</span> : null}
            <div class="form-row">
                <div class="col">
                    <label>Sale order</label>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateSalesOrder}>LOCATE</button>
                        </div>
                        <input type="text" class="form-control" ref="saleOrder" defaultValue={this.defaultValueNameSaleOrder}
                            readOnly={true} />
                    </div>
                </div>
                <div class="col">
                    <label>Delivery note</label>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateSalesDeliveryNote}>LOCATE</button>
                        </div>
                        <input type="text" class="form-control" ref="deliveryNote" defaultValue={this.defaultValueNameSaleDeliveryNote}
                            readOnly={true} />
                    </div>
                </div>
                <div class="col">
                    <label>Delivery address</label>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateDeliveryAddr}>LOCATE</button>
                        </div>
                        <input type="text" class="form-control" ref="shippingAddres" defaultValue={this.defaultValueNameShippingAddress}
                            readOnly={true} />
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="col">
                    <label>Shipping Number</label>
                    <input type="text" class="form-control" defaultValue={this.order != null ? this.order.shippingNumber : ''}
                        readOnly={true} />
                </div>
                <div class="col">
                    <label>Tracking Number</label>
                    <input type="text" class="form-control" defaultValue={this.order != null ? this.order.trackingNumber : ''}
                        readOnly={true} />
                </div>
                <div class="col">
                    <label>Carrier</label>
                    <AutocompleteField findByName={this.findCarrierByName} defaultValueId={this.shipping != null ? this.shipping.carrier : null}
                        defaultValueName={this.defaultValueNameCarrier} valueChanged={(value) => {
                            this.currentSelectedCarrierId = value;
                        }} />
                </div>
                <div class="col">
                    <label>Date created</label>
                    <input type="text" class="form-control" readOnly={true}
                        defaultValue={this.shipping != null ? window.dateFormat(new Date(this.shipping.dateCreated)) : ''} />
                </div>
                <div class="col">
                    <label>Date sent</label>
                    <input type="text" class="form-control" readOnly={true}
                        defaultValue={this.shipping != null && this.shipping.dateSent != null ? window.dateFormat(new Date(this.shipping.dateSent)) : ''} />
                </div>
            </div>

            <div ref="tabs"></div>

            <div ref="render"></div>

            <div id="buttomBottomForm">
                {this.shipping == null ? < button type="button" class="btn btn-primary" onClick={this.add}>Add</button> : null}
                {this.shipping != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>Delete</button> : null}
                {this.shipping != null ? <button type="button" class="btn btn-success" onClick={this.update}>Update</button> : null}
                <button type="button" class="btn btn-secondary" onClick={this.tabShipping}>Cancel</button>
                {this.shipping != null && !this.shipping.sent ? <button type="button" class="btn btn-info" onClick={this.toggleSent}>Generate tags</button> : null}
                {this.shipping != null && this.shipping.sent ? <button type="button" class="btn btn-warning">Print tags</button> : null}
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
                    <th scope="col">Package</th>
                    <th scope="col">Weight</th>
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

export default ShippingForm;
