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

class CustomerFormSaleOrders extends Component {
    constructor({ customerId, getCustomerSaleOrders }) {
        super();

        this.customerId = customerId;
        this.getCustomerSaleOrders = getCustomerSaleOrders;
    }

    componentDidMount() {
        if (this.customerId == null) {
            return;
        }

        this.getCustomerSaleOrders(this.customerId).then((orders) => {
            ReactDOM.render(orders.map((element, i) => {
                element.dateCreated = new Date(element.dateCreated);
                return <SaleOrder key={i}
                    saleOrder={element}
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
                    <th scope="col">#</th>
                    <th scope="col">{i18next.t('order-no')}</th>
                    <th scope="col">{i18next.t('reference')}</th>
                    <th scope="col">{i18next.t('customer')}</th>
                    <th scope="col">{i18next.t('date')}</th>
                    <th  scope="col">{i18next.t('total-products')}</th>
                    <th scope="col">{i18next.t('total-amount')}</th>
                    <th scope="col">{i18next.t('status')}</th>
                </tr>
            </thead>
            <tbody ref="render"></tbody>
        </table>
	}

}

class SaleOrder extends Component {
    constructor({ saleOrder, edit, pos }) {
        super();

        this.saleOrder = saleOrder;
        this.edit = edit;
        this.pos = pos;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.saleOrder);
        }} pos={this.pos}>
            <th field="id" scope="row">{this.saleOrder.id}</th>
            <td field="orderName">{this.saleOrder.orderName}</td>
            <td field="reference">{this.saleOrder.reference}</td>
            <td field="customerName">{this.saleOrder.customerName}</td>
            <td field="dateCreated">{window.dateFormat(this.saleOrder.dateCreated)}</td>
            <td field="totalProducts">{this.saleOrder.totalProducts}</td>
            <td field="totalAmount">{this.saleOrder.totalAmount}</td>
            <td field="status">{i18next.t(saleOrderStates[this.saleOrder.status])}</td>
        </tr>
    }
}

export default CustomerFormSaleOrders;
