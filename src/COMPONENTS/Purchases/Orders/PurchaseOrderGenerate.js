import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

class PurchaseOrderGenerate extends Component {
    constructor({ orderId, getPurchaseOrderDetails, getNameProduct, invoiceAllPurchaseOrder, invoicePartiallyPurchaseOrder, deliveryNoteAllPurchaseOrder,
        deliveryNotePartiallyPurchaseOrder }) {
        super();

        this.orderId = orderId;
        this.getPurchaseOrderDetails = getPurchaseOrderDetails;
        this.getNameProduct = getNameProduct;
        this.invoiceAllPurchaseOrder = invoiceAllPurchaseOrder;
        this.invoicePartiallyPurchaseOrder = invoicePartiallyPurchaseOrder;
        this.deliveryNoteAllPurchaseOrder = deliveryNoteAllPurchaseOrder;
        this.deliveryNotePartiallyPurchaseOrder = deliveryNotePartiallyPurchaseOrder;

        this.list = [];

        this.invoiceAll = this.invoiceAll.bind(this);
        this.invoiceSelected = this.invoiceSelected.bind(this);
        this.deliveryNoteAll = this.deliveryNoteAll.bind(this);
        this.deliveryNoteSelected = this.deliveryNoteSelected.bind(this);
    }

    componentDidMount() {
        if (this.orderId == null) {
            return;
        }

        this.getPurchaseOrderDetails(this.orderId).then(async (details) => {
            details.forEach((element) => {
                element.quantitySelected = element.quantity - Math.max(element.quantityInvoiced, element.quantityDeliveryNote)
            });
            this.list = details;
            this.forceUpdate();
        });
    }

    invoiceAll() {
        this.invoiceAllPurchaseOrder(this.orderId);
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
        this.invoicePartiallyPurchaseOrder(request);
    }

    deliveryNoteAll() {
        this.deliveryNoteAllPurchaseOrder(this.orderId);
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
        this.deliveryNotePartiallyPurchaseOrder(request);
    }

    render() {
        return <div id="salesOrderGenerate">
            <div>
                <button type="button" class="btn btn-primary mb-1 ml-1" onClick={this.invoiceAll}>{i18next.t('invoice-all')}</button>
                <button type="button" class="btn btn-success mb-1 ml-1" onClick={this.invoiceSelected}>{i18next.t('invoice-selected')}</button>

                <button type="button" class="btn btn-primary mb-1 ml-4" onClick={this.deliveryNoteAll}>{i18next.t('delivery-note-all')}</button>
                <button type="button" class="btn btn-success mb-1 ml-1" onClick={this.deliveryNoteSelected}>{i18next.t('delivery-note-selected')}</button>
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

export default PurchaseOrderGenerate;
