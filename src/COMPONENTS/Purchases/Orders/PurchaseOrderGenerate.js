import { Component } from "react";
import ReactDOM from 'react-dom';

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

        this.getSelected = [];

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
            ReactDOM.render(details.map((element, i) => {
                element.productName = "...";
                return <PurchaseOrderGenerateDetail key={i}
                    detail={element}
                    edit={this.edit}
                />
            }), this.refs.render);

            for (let i = 0; i < details.length; i++) {
                if (details[i].product != null) {
                    details[i].productName = await this.getNameProduct(details[i].product);
                } else {
                    details[i].productName = "";
                }
            }

            ReactDOM.unmountComponentAtNode(this.refs.render);
            ReactDOM.render(details.map((element, i) => {
                return <PurchaseOrderGenerateDetail key={i}
                    detail={element}
                    edit={this.edit}
                    selected={(getSelected) => {
                        this.getSelected[i] = getSelected;
                    }}
                />
            }), this.refs.render);
        });
    }

    invoiceAll() {
        this.invoiceAllPurchaseOrder(this.orderId);
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
        this.invoicePartiallyPurchaseOrder(request);
    }

    deliveryNoteAll() {
        this.deliveryNoteAllPurchaseOrder(this.orderId);
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
        this.deliveryNotePartiallyPurchaseOrder(request);
    }

    render() {
        return <div id="salesOrderGenerate">
            <div>
                <button type="button" class="btn btn-primary" onClick={this.invoiceAll}>Invoice all</button>
                <button type="button" class="btn btn-success" onClick={this.invoiceSelected}>Invoice selected</button>

                <button type="button" class="btn btn-primary" onClick={this.deliveryNoteAll}>Delivery note all</button>
                <button type="button" class="btn btn-success" onClick={this.deliveryNoteSelected}>Delivery note selected</button>
            </div>

            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Product</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Quantity invoiced</th>
                        <th scope="col">Quantity in delivery note</th>
                        <th scope="col">Quantity selected</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class PurchaseOrderGenerateDetail extends Component {
    constructor({ detail, selected }) {
        super();

        this.detail = detail;
        this.selected = selected;

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
            <th scope="row">{this.detail.id}</th>
            <td>{this.detail.productName}</td>
            <td>{this.detail.quantity}</td>
            <td>{this.detail.quantityInvoiced}</td>
            <td>{this.detail.quantityDeliveryNote}</td>
            <td><input type="number" class="form-control" min="0" max={this.detail.quantity} ref="quantity"
                defaultValue={this.detail.quantity - Math.max(this.detail.quantityInvoiced, this.detail.quantityDeliveryNote)} /></td>
        </tr>
    }
}

export default PurchaseOrderGenerate;
