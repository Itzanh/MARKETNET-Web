import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

const saleOrderStates = {
    '_': 'waiting-for-payment',
    'A': 'waiting-for-purchase-order',
    'B': 'purchase-order-pending',
    'C': 'waiting-for-manufacturing-orders',
    'D': 'manufacturing-orders-pending',
    'E': 'sent-to-preparation',
    'F': 'awaiting-for-shipping',
    'G': 'shipped',
    'H': 'receiced-by-the-customer'
}

class SupplierFormSaleOrders extends Component {
    constructor({ supplierId, getSupplierPurchaseOrders }) {
        super();

        this.supplierId = supplierId;
        this.getSupplierPurchaseOrders = getSupplierPurchaseOrders;
    }

    componentDidMount() {
        if (this.supplierId == null) {
            return;
        }

        this.getSupplierPurchaseOrders(this.supplierId).then((orders) => {
            ReactDOM.render(orders.map((element, i) => {
                element.dateCreated = new Date(element.dateCreated);
                return <PurchaseOrder key={i}
                    order={element}
                    edit={this.edit}
                    pos={i}
                />
            }), this.refs.render);
        });
    }

    render() {
        return <table class="table table-dark">
            <thead>
                <tr>
                    <th field="id" scope="col">#</th>
                    <th field="orderName" scope="col">{i18next.t('order-no')}</th>
                    <th field="supplierReference" scope="col">{i18next.t('supplier-reference')}</th>
                    <th field="supplierName" scope="col">{i18next.t('supplier')}</th>
                    <th field="dateCreated" scope="col">{i18next.t('date')}</th>
                    <th field="totalProducts" scope="col">{i18next.t('total-products')}</th>
                    <th field="totalAmount" scope="col">{i18next.t('total-amount')}</th>
                </tr>
            </thead>
            <tbody ref="render"></tbody>
        </table>
	}

}

class PurchaseOrder extends Component {
    constructor({ order, edit, pos }) {
        super();

        this.order = order;
        this.edit = edit;
        this.pos = pos;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.order);
        }} pos={this.pos}>
            <th field="id" scope="row">{this.order.id}</th>
            <td field="orderName">{this.order.orderName}</td>
            <td field="supplierReference">{this.order.supplierReference}</td>
            <td field="supplierName">{this.order.supplierName}</td>
            <td field="dateCreated">{window.dateFormat(this.order.dateCreated)}</td>
            <td field="totalProducts">{this.order.totalProducts}</td>
            <td field="totalAmount">{this.order.totalAmount}</td>
        </tr>
    }
}

export default SupplierFormSaleOrders;
