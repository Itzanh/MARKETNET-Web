import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

import ShippingForm from "./ShippingForm";
import SearchField from "../../SearchField";

class Shippings extends Component {
    constructor({ getShippings, searchShippings, getShippingPackaging, addShipping, updateShipping, deleteShipping, locateAddress, defaultValueNameShippingAddress,
        findCarrierByName, defaultValueNameCarrier, locateSaleOrder, getNameAddress, locateSaleDeliveryNote, getNameSaleDeliveryNote, tabShipping,
        toggleShippingSent, documentFunctions, getIncoterms }) {
        super();

        this.getShippings = getShippings;
        this.searchShippings = searchShippings;
        this.getShippingPackaging = getShippingPackaging;
        this.addShipping = addShipping;
        this.updateShipping = updateShipping;
        this.deleteShipping = deleteShipping;
        this.locateAddress = locateAddress;
        this.defaultValueNameShippingAddress = defaultValueNameShippingAddress;
        this.findCarrierByName = findCarrierByName;
        this.defaultValueNameCarrier = defaultValueNameCarrier;
        this.locateSaleOrder = locateSaleOrder;
        this.getNameAddress = getNameAddress;
        this.locateSaleDeliveryNote = locateSaleDeliveryNote;
        this.getNameSaleDeliveryNote = getNameSaleDeliveryNote;
        this.tabShipping = tabShipping;
        this.toggleShippingSent = toggleShippingSent;
        this.documentFunctions = documentFunctions;
        this.getIncoterms = getIncoterms;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.search = this.search.bind(this);
    }

    componentDidMount() {
        this.getShippings().then((shippings) => {
            this.renderShipping(shippings);
        });
    }

    async search(searchText) {
        const shippings = await this.searchShippings(searchText);
        this.renderShipping(shippings);
    }

    renderShipping(shippings) {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(shippings.map((element, i) => {
            return <Shipping key={i}
                shipping={element}
                edit={this.edit}
            />
        }), this.refs.render);
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <ShippingForm
                addShipping={this.addShipping}
                locateAddress={this.locateAddress}
                findCarrierByName={this.findCarrierByName}
                locateSaleOrder={this.locateSaleOrder}
                locateSaleDeliveryNote={this.locateSaleDeliveryNote}
                tabShipping={this.tabShipping}
                toggleShippingSent={this.toggleShippingSent}
                getIncoterms={this.getIncoterms}
            />,
            document.getElementById('renderTab'));
    }

    async edit(shipping) {
        var defaultValueNameShippingAddress;
        if (shipping.deliveryAddress != null)
            defaultValueNameShippingAddress = await this.getNameAddress(shipping.deliveryAddress);
        var defaultValueNameSaleDeliveryNote;
        if (shipping.deliveryNote != null)
            defaultValueNameSaleDeliveryNote = await this.getNameSaleDeliveryNote(shipping.deliveryNote);

        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <ShippingForm
                shipping={shipping}
                updateShipping={this.updateShipping}
                deleteShipping={this.deleteShipping}
                locateAddress={this.locateAddress}
                findCarrierByName={this.findCarrierByName}
                locateSaleOrder={this.locateSaleOrder}
                locateSaleDeliveryNote={this.locateSaleDeliveryNote}
                tabShipping={this.tabShipping}
                getShippingPackaging={this.getShippingPackaging}
                toggleShippingSent={this.toggleShippingSent}
                documentFunctions={this.documentFunctions}
                getIncoterms={this.getIncoterms}

                defaultValueNameCarrier={shipping.carrierName}
                defaultValueNameSaleOrder={shipping.saleOrderName}
                defaultValueNameShippingAddress={defaultValueNameShippingAddress}
                defaultValueNameSaleDeliveryNote={defaultValueNameSaleDeliveryNote}
            />,
            document.getElementById('renderTab'));
    }

    render() {
        return <div id="tabShippings" className="formRowRoot">
            <div className="menu">
                <h1>{i18next.t('shippings')}</h1>
                <div class="form-row">
                    <div class="col">
                        <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button>
                    </div>
                    <div class="col">
                        <SearchField handleSearch={this.search} hasAdvancedSearch={false} />
                    </div>
                </div>
            </div>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">{i18next.t('customer')}</th>
                        <th scope="col">{i18next.t('sale-order')}</th>
                        <th scope="col">{i18next.t('carrier')}</th>
                        <th scope="col">{i18next.t('weight')}</th>
                        <th scope="col">{i18next.t('n-packages')}</th>
                        <th scope="col">Tracking</th>
                        <th scope="col">{i18next.t('sent')}</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class Shipping extends Component {
    constructor({ shipping, edit }) {
        super();

        this.shipping = shipping;
        this.edit = edit;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.shipping);
        }}>
            <th scope="row">{this.shipping.id}</th>
            <td>{this.shipping.customerName}</td>
            <td>{this.shipping.saleOrderName}</td>
            <td>{this.shipping.carrierName}</td>
            <td>{this.shipping.weight}</td>
            <td>{this.shipping.packagesNumber}</td>
            <td>{this.shipping.trackingNumber}</td>
            <td>{this.shipping.sent ? i18next.t('yes') : i18next.t('no')}</td>
        </tr>
    }
}

export default Shippings;
