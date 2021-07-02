import { Component } from "react";
import ReactDOM from 'react-dom';

const saleOrderStates = {
    '_': "Waiting for payment",
    'A': "Waiting for purchase order",
    'B': "Purchase order pending",
    'C': "Waiting for manufacturing orders",
    'D': "Manufacturing orders pending",
    'E': "Sent to preparation",
    'F': "Awaiting for shipping",
    'G': "Shipped",
    'H': "Receiced by the customer"
}

class ProductSalesDetails extends Component {
    constructor({ productId, getProductSalesOrder, getNameProduct }) {
        super();

        this.productId = productId;
        this.getProductSalesOrder = getProductSalesOrder;
        this.getNameProduct = getNameProduct;
    }

    componentDidMount() {
        if (this.productId == null) {
            return;
        }

        this.getProductSalesOrder(this.productId).then(async (details) => {
            ReactDOM.render(details.map((element, i) => {
                return <SalesOrderDetail key={i}
                    detail={element}
                    edit={this.edit}
                    pos={i}
                />
            }), this.refs.render);
        });
    }

    render() {
        return <div id="renderSalesDetailsPendingTab">
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Product</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Unit price</th>
                        <th scope="col">% VAT</th>
                        <th scope="col">Total amount</th>
                        <th scope="col">Status</th>
                        <th scope="col">Invoice/Delivery Note</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class SalesOrderDetail extends Component {
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
            <td>{saleOrderStates[this.detail.status]}</td>
            <td>
                {this.detail !== undefined ? (this.detail.quantityInvoiced === 0 ? 'Not invoiced' : (this.detail.quantityInvoiced === this.detail.quantity
                    ? 'Invoiced' : 'Partially invoiced')) : ''} / {this.detail !== undefined ? (this.detail.quantityDeliveryNote === 0 ? 'No delivery note' :
                        (this.detail.quantityDeliveryNote === this.detail.quantity ? 'Delivery note generated' : 'Partially delivered')) : ''}
            </td>
        </tr>
    }
}

export default ProductSalesDetails;
