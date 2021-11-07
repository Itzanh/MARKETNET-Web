import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import ShippingForm from "./ShippingForm";
import SearchField from "../../SearchField";



class Shippings extends Component {
    constructor({ getShippings, searchShippings, getShippingPackaging, addShipping, updateShipping, deleteShipping, locateAddress,
        defaultValueNameShippingAddress, findCarrierByName, defaultValueNameCarrier, locateSaleOrder, getNameAddress, locateSaleDeliveryNote,
        getNameSaleDeliveryNote, tabShipping, toggleShippingSent, documentFunctions, getIncoterms, getShippingTags }) {
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
        this.getShippingTags = getShippingTags;

        this.list = [];

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
        this.list = shippings;
        this.forceUpdate();
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
                getShippingTags={this.getShippingTags}

                defaultValueNameCarrier={shipping.carrierName}
                defaultValueNameSaleOrder={shipping.saleOrderName}
                defaultValueNameShippingAddress={defaultValueNameShippingAddress}
                defaultValueNameSaleDeliveryNote={defaultValueNameSaleDeliveryNote}
            />,
            document.getElementById('renderTab'));
    }

    render() {
        return <div id="tabShippings" className="formRowRoot">
            <h1>{i18next.t('shippings')}</h1>
            <div class="form-row">
                <div class="col">
                    <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add')}</button>
                </div>
                <div class="col">
                    <SearchField handleSearch={this.search} hasAdvancedSearch={false} />
                </div>
            </div>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'customerName', headerName: i18next.t('customer'), flex: 1 },
                    { field: 'saleOrderName', headerName: i18next.t('sale-order'), width: 200 },
                    { field: 'carrierName', headerName: i18next.t('carrier'), width: 250 },
                    { field: 'weight', headerName: i18next.t('weight'), width: 150 },
                    { field: 'packagesNumber', headerName: i18next.t('n-packages'), width: 175 },
                    { field: 'trackingNumber', headerName: 'Tracking', width: 250 },
                    { field: 'sent', headerName: i18next.t('sent'), width: 150, type: 'boolean' }
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

export default Shippings;
