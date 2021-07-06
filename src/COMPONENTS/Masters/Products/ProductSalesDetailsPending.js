import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

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

class ProductSalesDetailsPending extends Component {
    constructor({ productId, getProductSalesOrderPending, getNameProduct }) {
        super();

        this.productId = productId;
        this.getProductSalesOrderPending = getProductSalesOrderPending;
        this.getNameProduct = getNameProduct;
    }

    componentDidMount() {
        if (this.productId == null) {
            return;
        }

        this.getProductSalesOrderPending(this.productId).then(async (details) => {
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
                        <th field="productName" scope="col">{i18next.t('product')}</th>
                        <th field="quantity" scope="col">{i18next.t('quantity')}</th>
                        <th field="price" scope="col">{i18next.t('unit-price')}</th>
                        <th field="vatPercent" scope="col">{i18next.t('%-vat')}</th>
                        <th field="totalAmount" scope="col">{i18next.t('total-amount')}</th>
                        <th field="status" scope="col">{i18next.t('status')}</th>
                        <th scope="col">{i18next.t('invoice')}/{i18next.t('delivery-note')}</th>
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
                {this.detail !== null ? (this.detail.quantityInvoiced === 0 ? 'Not invoiced' : (this.detail.quantityInvoiced === this.detail.quantity
                    ? 'Invoiced' : 'Partially invoiced')) : ''} / {this.detail !== null ? (this.detail.quantityDeliveryNote === 0 ? 'No delivery note' :
                        (this.detail.quantityDeliveryNote === this.detail.quantity ? 'Delivery note generated' : 'Partially delivered')) : ''}
            </td>
        </tr>
    }
}

export default ProductSalesDetailsPending;
