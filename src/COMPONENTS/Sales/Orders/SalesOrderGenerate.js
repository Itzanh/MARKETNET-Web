import React, { Component } from "react";
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

class SalesOrderGenerate extends Component {
    constructor({ orderId, getSalesOrderDetails, getNameProduct, invoiceAllSaleOrder, invoiceSelectionSaleOrder, manufacturingOrderAllSaleOrder,
        manufacturingOrderPartiallySaleOrder, deliveryNoteAllSaleOrder, deliveryNotePartiallySaleOrder }) {
        super();

        this.orderId = orderId;
        this.getSalesOrderDetails = getSalesOrderDetails;
        this.getNameProduct = getNameProduct;
        this.invoiceAllSaleOrder = invoiceAllSaleOrder;
        this.invoiceSelectionSaleOrder = invoiceSelectionSaleOrder;
        this.manufacturingOrderAllSaleOrder = manufacturingOrderAllSaleOrder;
        this.manufacturingOrderPartiallySaleOrder = manufacturingOrderPartiallySaleOrder;
        this.deliveryNoteAllSaleOrder = deliveryNoteAllSaleOrder;
        this.deliveryNotePartiallySaleOrder = deliveryNotePartiallySaleOrder;

        this.list = [];

        this.invoiceAll = this.invoiceAll.bind(this);
        this.invoiceSelected = this.invoiceSelected.bind(this);
        this.deliveryNoteAll = this.deliveryNoteAll.bind(this);
        this.deliveryNoteSelected = this.deliveryNoteSelected.bind(this);
        this.manufacturingAll = this.manufacturingAll.bind(this);
        this.manufacturingOrderSelected = this.manufacturingOrderSelected.bind(this);
    }

    componentDidMount() {
        if (this.orderId == null) {
            return;
        }

        this.getSalesOrderDetails(this.orderId).then(async (details) => {
            details.forEach((element) => {
                element.quantitySelected = element.quantity - Math.max(element.quantityInvoiced, element.quantityDeliveryNote)
            });
            this.list = details;
            this.forceUpdate();
        });
    }

    invoiceAll() {
        this.invoiceAllSaleOrder(this.orderId);
    }

    invoiceSelected() {
        const details = [];

        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].quantitySelected > 0) {
                details.push({
                    id: this.list[i].id,
                    quantity: this.list[i].quantitySelected
                });
            }
        }

        if (details.length === 0) {
            return;
        }
        const request = {
            orderId: this.orderId,
            selection: details
        };
        this.invoiceSelectionSaleOrder(request);
    }

    deliveryNoteAll() {
        this.deliveryNoteAllSaleOrder(this.orderId);
    }

    deliveryNoteSelected() {
        const details = [];

        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].quantitySelected > 0) {
                details.push({
                    id: this.list[i].id,
                    quantity: this.list[i].quantitySelected
                });
            }
        }

        if (details.length === 0) {
            return;
        }
        const request = {
            orderId: this.orderId,
            selection: details
        };
        this.deliveryNotePartiallySaleOrder(request);
    }

    manufacturingAll() {
        this.manufacturingOrderAllSaleOrder(this.orderId);
    }

    manufacturingOrderSelected() {
        const details = [];

        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].quantitySelected > 0) {
                details.push({
                    id: this.list[i].id,
                    quantity: this.list[i].quantitySelected
                });
            }
        }

        if (details.length === 0) {
            return;
        }
        const request = {
            orderId: this.orderId,
            selection: details
        };
        this.manufacturingOrderPartiallySaleOrder(request);
    }

    render() {
        return <div id="salesOrderGenerate">
            <div>
                <button type="button" class="btn btn-primary mb-1 ml-1" onClick={this.invoiceAll}>{i18next.t('invoice-all')}</button>
                <button type="button" class="btn btn-success mb-1 ml-1" onClick={this.invoiceSelected}>{i18next.t('invoice-selected')}</button>

                <button type="button" class="btn btn-primary mb-1 ml-4" onClick={this.deliveryNoteAll}>{i18next.t('delivery-note-all')}</button>
                <button type="button" class="btn btn-success mb-1 ml-1" onClick={this.deliveryNoteSelected}>{i18next.t('delivery-note-selected')}</button>

                <button type="button" class="btn btn-primary mb-1 ml-4" onClick={this.manufacturingAll}>{i18next.t('manufacturing-order-all')}</button>
                <button type="button" class="btn btn-success mb-1 ml-1" onClick={this.manufacturingOrderSelected}>{i18next.t('manufacturing-order-selected')}</button>
            </div>

            <div className="tableOverflowContainer">
                <div style={{ display: 'flex', height: '100%' }}>
                    <div style={{ flexGrow: 1 }}>
                        <DataGrid
                            ref="table"
                            autoHeight
                            rows={this.list}
                            columns={[
                                { field: 'id', headerName: '#', width: 90 },
                                { field: 'productName', headerName: i18next.t('product'), flex: 1 },
                                { field: 'quantity', headerName: i18next.t('quantity'), width: 200 },
                                { field: 'quantityInvoiced', headerName: i18next.t('quantity-invoiced'), width: 200 },
                                { field: 'quantityDeliveryNote', headerName: i18next.t('quantity-in-delivery-note'), width: 200 },
                                {
                                    field: 'quantitySelected', headerName: i18next.t('quantity-selected'), width: 250, type: 'number', editable: true
                                }
                            ]}
                        />
                    </div>
                </div>
            </div>
        </div>
    }
}

export default SalesOrderGenerate;
