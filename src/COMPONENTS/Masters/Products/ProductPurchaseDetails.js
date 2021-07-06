import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';


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
                        <th field="productName" scope="col">{i18next.t('product')}</th>
                        <th field="quantity" scope="col">{i18next.t('quantity')}</th>
                        <th field="price" scope="col">{i18next.t('unit-price')}</th>
                        <th field="vatPercent" scope="col">{i18next.t('%-vat')}</th>
                        <th field="totalAmount" scope="col">{i18next.t('total-amount')}</th>
                        <th scope="col">{i18next.t('invoice')}/{i18next.t('delivery-note')}</th>
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
