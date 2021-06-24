import { Component } from "react";
import ReactDOM from 'react-dom';
import PackagingWizard from "./PackagingWizard";

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
            />,
            document.getElementById('renderTab'));
    }

    render() {
        return <div id="tabPackaging" className="formRowRoot">
            <div class="form-row">
                <div class="col">
                    <h1>Packaging</h1>
                </div>
                <div class="col">
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="status" value="E" ref="statusPreparation"
                            defaultChecked={true} onClick={this.loadOrders} />
                        <label class="form-check-label">
                            Sent to preparation
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="status" value="F" onClick={this.loadOrders} />
                        <label class="form-check-label">
                            Awaiting for shipping
                        </label>
                    </div>
                </div>
            </div>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Order no.</th>
                        <th scope="col">Customer</th>
                        <th scope="col">Date</th>
                        <th scope="col">Total amount</th>
                        <th scope="col">Status</th>
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
            <td>{saleOrderStates[this.saleOrder.status]}</td>
        </tr>
    }
}

export default PackagingMenu;
