import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import PackagingWizard from "./PackagingWizard";
import TransferBetweenWarehousesRequest from "./TransferBetweenWarehousesRequest";

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
};



class PackagingMenu extends Component {
    constructor({ getSalesOrderPreparation, getSalesOrderAwaitingShipping, getCustomerName, getSalesOrderDetails, getPackages,
        getSalesOrderPackaging, addSalesOrderPackaging, addSalesOrderDetailPackaged, addSalesOrderDetailPackagedEan13, deleteSalesOrderDetailPackaged,
        deletePackaging, tabPackaging, generateShipping, getSalesOrderPallets, insertPallet, updatePallet, deletePallet, getProductRow,
        grantDocumentAccessToken, transferBetweenWarehousesToSentToPreparationOrders, getWarehouses }) {
        super();

        this.getSalesOrderPreparation = getSalesOrderPreparation;
        this.getSalesOrderAwaitingShipping = getSalesOrderAwaitingShipping;
        this.getCustomerName = getCustomerName;
        this.getSalesOrderDetails = getSalesOrderDetails;
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
        this.transferBetweenWarehousesToSentToPreparationOrders = transferBetweenWarehousesToSentToPreparationOrders;
        this.getWarehouses = getWarehouses;

        this.list = [];

        this.edit = this.edit.bind(this);
        this.loadOrders = this.loadOrders.bind(this);
        this.renderSalesOrder = this.renderSalesOrder.bind(this);
        this.requestTransfer = this.requestTransfer.bind(this);
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
        this.list = salesOrders;
        this.forceUpdate();
    }

    edit(saleOrder) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <PackagingWizard
                orderId={saleOrder.id}
                orderName={saleOrder.orderName}
                getSalesOrderDetails={this.getSalesOrderDetails}
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

    requestTransfer() {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(<TransferBetweenWarehousesRequest
            transferBetweenWarehousesToSentToPreparationOrders={this.transferBetweenWarehousesToSentToPreparationOrders}
            getWarehouses={this.getWarehouses}
        />, this.refs.renderModal);
    }

    render() {
        return <div id="tabPackaging" className="formRowRoot">
            <div ref="renderModal"></div>
            <div class="form-row">
                <div class="col">
                    <h4 className="ml-2">{i18next.t('packaging')}</h4>
                </div>
                <div class="col">
                    <button type="button" class="btn btn-primary" onClick={this.requestTransfer}>{i18next.t('transfer-between-warehouses')}</button>
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
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'orderName', headerName: i18next.t('order-no'), width: 160 },
                    { field: 'reference', headerName: i18next.t('reference'), width: 150 },
                    {
                        field: 'customerName', headerName: i18next.t('customer'), flex: 1, valueGetter: (params) => {
                            return params.row.customer.name;
                        }
                    },
                    {
                        field: 'dateCreated', headerName: i18next.t('date'), width: 160, valueGetter: (params) => {
                            return window.dateFormat(params.row.dateCreated)
                        }
                    },
                    { field: 'totalProducts', headerName: i18next.t('total-products'), width: 180 },
                    { field: 'totalAmount', headerName: i18next.t('total-amount'), width: 170 },
                    {
                        field: 'status', headerName: i18next.t('status'), width: 250, valueGetter: (params) => {
                            return i18next.t(saleOrderStates[params.row.status])
                        }
                    },
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
};



export default PackagingMenu;
