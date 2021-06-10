import { Component } from "react";
import ReactDOM from 'react-dom';

class ProductPurchaseDetails extends Component {
    constructor({ productId, getProductPurchaseOrder, getNameProduct }) {
        super();

        this.productId = productId;
        this.getProductPurchaseOrder = getProductPurchaseOrder;
        this.getNameProduct = getNameProduct;
    }

    componentDidMount() {
        if (this.productId == null) {
            return;
        }

        this.getProductPurchaseOrder(this.productId).then(async (details) => {
            ReactDOM.render(details.map((element, i) => {
                element.productName = "...";
                return <PurchaseOrderDetail key={i}
                    detail={element}
                    edit={this.edit}
                    pos={i}
                />
            }), this.refs.render);

            for (let i = 0; i < details.length; i++) {
                if (details[i].product != null) {
                    details[i].productName = await this.getNameProduct(details[i].product);
                } else {
                    details[i].productName = "";
                }
            }

            ReactDOM.render(details.map((element, i) => {
                return <PurchaseOrderDetail key={i}
                    detail={element}
                    edit={this.edit}
                    pos={i}
                />
            }), this.refs.render);
        });
    }

    render() {
        return <div id="renderPurchaseDetailsPendingTab">
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Product</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Unit price</th>
                        <th scope="col">% VAT</th>
                        <th scope="col">Total amount</th>
                        <th scope="col">Invoice/Delivery Note</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class PurchaseOrderDetail extends Component {
    constructor({ detail, edit, pos }) {
        super();

        this.detail = detail;
        this.edit = edit;
        this.pos = pos;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.detail);
        }}>
            <th scope="row">{this.pos + 1}</th>
            <td>{this.detail.productName}</td>
            <td>{this.detail.quantity}</td>
            <td>{this.detail.price}</td>
            <td>{this.detail.vatPercent}</td>
            <td>{this.detail.totalAmount}</td>
            <td>
                {this.detail !== null ? (this.detail.quantityInvoiced === 0 ? 'Not invoiced' : (this.detail.quantityInvoiced === this.detail.quantity
                    ? 'Invoiced' : 'Partially invoiced')) : ''} / {this.detail !== null ? (this.detail.quantityDeliveryNote === 0 ? 'No delivery note' :
                        (this.detail.quantityDeliveryNote === this.detail.quantity ? 'Delivery note generated' : 'Partially delivered')) : ''}
            </td>
        </tr>
    }
}

export default ProductPurchaseDetails;
