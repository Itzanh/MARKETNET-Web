import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

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

        this.getSelected = [];

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
            ReactDOM.unmountComponentAtNode(this.refs.render);
            ReactDOM.render(details.map((element, i) => {
                return <SalesOrderGenerateDetail key={i}
                    detail={element}
                    edit={this.edit}
                    pos={i}
                />
            }), this.refs.render);
        });
    }

    invoiceAll() {
        this.invoiceAllSaleOrder(this.orderId);
    }

    invoiceSelected() {
        const details = [];

        for (let i = 0; i < this.getSelected.length; i++) {
            const selection = this.getSelected[i]();
            if (selection.quantity > 0) {
                details.push(selection);
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

        for (let i = 0; i < this.getSelected.length; i++) {
            const selection = this.getSelected[i]();
            if (selection.quantity > 0) {
                details.push(selection);
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

        for (let i = 0; i < this.getSelected.length; i++) {
            const selection = this.getSelected[i]();
            if (selection.quantity > 0) {
                details.push(selection);
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
                <table class="table table-dark">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">{i18next.t('product')}</th>
                            <th scope="col">{i18next.t('quantity')}</th>
                            <th scope="col">{i18next.t('quantity-invoiced')}</th>
                            <th scope="col">{i18next.t('quantity-in-delivery-note')}</th>
                            <th scope="col">{i18next.t('quantity-selected')}</th>
                        </tr>
                    </thead>
                    <tbody ref="render"></tbody>
                </table>
            </div>
        </div>
    }
}

class SalesOrderGenerateDetail extends Component {
    constructor({ detail, selected, pos }) {
        super();

        this.detail = detail;
        this.selected = selected;
        this.pos = pos;

        this.getSelected = this.getSelected.bind(this);
    }

    componentDidMount() {
        if (this.selected != null) {
            this.selected(this.getSelected);
        }
    }

    getSelected() {
        return {
            "id": this.detail.id,
            "quantity": parseInt(this.refs.quantity.value)
        };
    }

    render() {
        return <tr>
            <th scope="row">{this.pos + 1}</th>
            <td>{this.detail.productName}</td>
            <td>{this.detail.quantity}</td>
            <td>{this.detail.quantityInvoiced}</td>
            <td>{this.detail.quantityDeliveryNote}</td>
            <td className="pt-0 pb-0"><input type="number" class="form-control" min="0" max={this.detail.quantity} ref="quantity"
                defaultValue={this.detail.quantity - Math.max(this.detail.quantityInvoiced, this.detail.quantityDeliveryNote)} /></td>
        </tr>
    }
}

export default SalesOrderGenerate;
