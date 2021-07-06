import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

import PackagingWizard from "./PackagingWizard";

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

class PackagingMenu extends Component {
    constructor({ getSalesOrderPreparation, getSalesOrderAwaitingShipping, getCustomerName, getSalesOrderDetails, getNameProduct, getPackages,
        getSalesOrderPackaging, addSalesOrderPackaging, addSalesOrderDetailPackaged, addSalesOrderDetailPackagedEan13, deleteSalesOrderDetailPackaged,
        deletePackaging, tabPackaging, generateShipping, getSalesOrderPallets, insertPallet, updatePallet, deletePallet, getProductRow,
        grantDocumentAccessToken }) {
        super();

        this.getSalesOrderPreparation = getSalesOrderPreparation;
        this.getSalesOrderAwaitingShipping = getSalesOrderAwaitingShipping;
        this.getCustomerName = getCustomerName;
        this.getSalesOrderDetails = getSalesOrderDetails;
        this.getNameProduct = getNameProduct;
        this.getPackages = getPackages;
        this.getSalesOrderPackaging = getSalesOrderPackaging;
        this.addSalesOrderPackaging = addSalesOrderPackaging;
        this.addSalesOrderDetailPackaged = addSalesOrderDetailPackaged;
        this.addSalesOrderDetailPackagedEan13 = addSalesOrderDetailPackagedEan13;
        this.deleteSalesOrderDetailPackaged = deleteSalesOrderDetailPackaged;
        this.deletePackaging = deletePackaging;
        this.tabPackaging = tabPackaging;
        this.generateShipping = generateShipping;
        this.getSalesOrderPallets = getSalesOrderPallets;
        this.insertPallet = insertPallet;
        this.updatePallet = updatePallet;
        this.deletePallet = deletePallet;
        this.getProductRow = getProductRow;
        this.grantDocumentAccessToken = grantDocumentAccessToken;

        this.edit = this.edit.bind(this);
        this.loadOrders = this.loadOrders.bind(this);
        this.renderSalesOrder = this.renderSalesOrder.bind(this);
    }

    componentDidMount() {
        this.loadOrders();
    }

    loadOrders() {
        if (this.refs.statusPreparation.checked) {
            this.getSalesOrderPreparation().then(this.renderSalesOrder);
        } else {
            this.getSalesOrderAwaitingShipping().then(this.renderSalesOrder);
        }
    }

    async renderSalesOrder(salesOrders) {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(salesOrders.map((element, i) => {
            element.customerName = "...";
            return <SaleOrder key={i}
                saleOrder={element}
                edit={this.edit}
            />
        }), this.refs.render);

        for (let i = 0; i < salesOrders.length; i++) {
            salesOrders[i].customerName = await this.getCustomerName(salesOrders[i].customer);
        }

        ReactDOM.render(salesOrders.map((element, i) => {
            return <SaleOrder key={i}
                saleOrder={element}
                edit={this.edit}
            />
        }), this.refs.render);
    }

    edit(saleOrder) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <PackagingWizard
                orderId={saleOrder.id}
                getSalesOrderDetails={this.getSalesOrderDetails}
                getNameProduct={this.getNameProduct}
                getPackages={this.getPackages}
                getSalesOrderPackaging={this.getSalesOrderPackaging}
                addSalesOrderPackaging={this.addSalesOrderPackaging}
                addSalesOrderDetailPackaged={this.addSalesOrderDetailPackaged}
                addSalesOrderDetailPackagedEan13={this.addSalesOrderDetailPackagedEan13}
                deleteSalesOrderDetailPackaged={this.deleteSalesOrderDetailPackaged}
                deletePackaging={this.deletePackaging}
                tabPackaging={this.tabPackaging}
                generateShipping={this.generateShipping}
                getSalesOrderPallets={this.getSalesOrderPallets}
                insertPallet={this.insertPallet}
                updatePallet={this.updatePallet}
                deletePallet={this.deletePallet}
                getProductRow={this.getProductRow}
                grantDocumentAccessToken={this.grantDocumentAccessToken}
                noCarrier={saleOrder.carrier == null}
            />,
            document.getElementById('renderTab'));
    }

    render() {
        return <div id="tabPackaging" className="formRowRoot">
            <div className="menu">
                <div class="form-row">
                    <div class="col">
                        <h1>{i18next.t('packaging')}</h1>
                    </div>
                    <div class="col">
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="status" value="E" ref="statusPreparation"
                                defaultChecked={true} onClick={this.loadOrders} />
                            <label class="form-check-label">
                                {i18next.t('sent-to-preparation')}
                        </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="status" value="F" onClick={this.loadOrders} />
                            <label class="form-check-label">
                                {i18next.t('awaiting-for-shipping')}
                        </label>
                        </div>
                    </div>
                </div>
            </div>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th field="orderName" scope="col">{i18next.t('order-no')}</th>
                        <th field="customerName" scope="col">{i18next.t('customer')}</th>
                        <th field="dateCreated" scope="col">{i18next.t('date')}</th>
                        <th field="totalAmount" scope="col">{i18next.t('total-amount')}</th>
                        <th field="status" scope="col">{i18next.t('status')}</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class SaleOrder extends Component {
    constructor({ saleOrder, edit }) {
        super();

        this.saleOrder = saleOrder;
        this.edit = edit;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.saleOrder);
        }}>
            <th scope="row">{this.saleOrder.id}</th>
            <td>{this.saleOrder.orderName}</td>
            <td>{this.saleOrder.customerName}</td>
            <td>{window.dateFormat(new Date(this.saleOrder.dateCreated))}</td>
            <td>{this.saleOrder.totalAmount}</td>
            <td>{i18next.t(saleOrderStates[this.saleOrder.status])}</td>
        </tr>
    }
}

export default PackagingMenu;
