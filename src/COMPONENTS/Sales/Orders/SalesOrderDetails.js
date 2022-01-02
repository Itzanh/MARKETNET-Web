import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import SalesOrderDetailsModal from "./SalesOrderDetailsModal";

const saleOrderStates = {
    '_': 'waiting-for-payment',
    'A': 'waiting-for-purchase-order',
    'B': 'purchase-order-pending',
    'C': 'waiting-for-manufacturing-orders',
    'D': 'manufacturing-orders-pending',
    'E': 'sent-to-preparation',
    'F': 'awaiting-for-shipping',
    'G': 'shipped',
    'H': 'receiced-by-the-customer',
    'Z': 'cancelled'
}



class SalesOrderDetails extends Component {
    constructor({ orderId, waiting, findProductByName, getOrderDetailsDefaults, getSalesOrderDetails, addSalesOrderDetail, updateSalesOrderDetail,
        getNameProduct, deleteSalesOrderDetail, locateProduct, cancelSalesOrderDetail, addNow, getRegisterTransactionalLogs,
        getPurchasesOrderDetailsFromSaleOrderDetail, getSalesOrderDetailDigitalProductData, insertSalesOrderDetailDigitalProductData,
        updateSalesOrderDetailDigitalProductData, deleteSalesOrderDetailDigitalProductData, setDigitalSalesOrderDetailAsSent, customerId, getCustomerRow,
        getProductFunctions }) {
        super();

        this.orderId = orderId;
        this.waiting = waiting;
        this.findProductByName = findProductByName;
        this.getNameProduct = getNameProduct;
        this.getOrderDetailsDefaults = getOrderDetailsDefaults;
        this.getSalesOrderDetails = getSalesOrderDetails;
        this.addSalesOrderDetail = addSalesOrderDetail;
        this.updateSalesOrderDetail = updateSalesOrderDetail;
        this.deleteSalesOrderDetail = deleteSalesOrderDetail;
        this.locateProduct = locateProduct;
        this.cancelSalesOrderDetail = cancelSalesOrderDetail;
        this.addNow = addNow;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;
        this.getPurchasesOrderDetailsFromSaleOrderDetail = getPurchasesOrderDetailsFromSaleOrderDetail;
        this.getSalesOrderDetailDigitalProductData = getSalesOrderDetailDigitalProductData;
        this.insertSalesOrderDetailDigitalProductData = insertSalesOrderDetailDigitalProductData;
        this.updateSalesOrderDetailDigitalProductData = updateSalesOrderDetailDigitalProductData;
        this.deleteSalesOrderDetailDigitalProductData = deleteSalesOrderDetailDigitalProductData;
        this.setDigitalSalesOrderDetailAsSent = setDigitalSalesOrderDetailAsSent;
        this.customerId = customerId;
        this.getCustomerRow = getCustomerRow;
        this.getProductFunctions = getProductFunctions;

        this.state = {
            list: []
        }

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        if (this.orderId == null) {
            return;
        }

        this.printSalesOrdeDetails();

        if (this.addNow == true) {
            this.add();
        }
    }

    printSalesOrdeDetails() {
        this.getSalesOrderDetails(this.orderId).then((details) => {
            this.renderSalesOrdeDetails(details);
        });
    }

    renderSalesOrdeDetails(details) {
        this.setState((prevState) => ({
            ...prevState,
            list: details,
        }));
    }

    add() {
        if (this.orderId == null) {
            this.addSalesOrderDetail();
            return;
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('salesOrderDetailsModal'));
        ReactDOM.render(
            <SalesOrderDetailsModal
                orderId={this.orderId}
                findProductByName={this.findProductByName}
                getOrderDetailsDefaults={this.getOrderDetailsDefaults}
                locateProduct={this.locateProduct}
                getProductFunctions={this.getProductFunctions}
                addSalesOrderDetail={(detail) => {
                    const promise = this.addSalesOrderDetail(detail);
                    promise.then((ok) => {
                        if (ok) {
                            this.printSalesOrdeDetails();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('salesOrderDetailsModal'));
    }

    async edit(detail) {
        ReactDOM.unmountComponentAtNode(document.getElementById('salesOrderDetailsModal'));
        ReactDOM.render(
            <SalesOrderDetailsModal
                detail={detail}
                orderId={this.orderId}
                findProductByName={this.findProductByName}
                getOrderDetailsDefaults={this.getOrderDetailsDefaults}
                defaultValueNameProduct={detail.productName}
                locateProduct={this.locateProduct}
                cancelSalesOrderDetail={this.cancelSalesOrderDetail}
                getPurchasesOrderDetailsFromSaleOrderDetail={this.getPurchasesOrderDetailsFromSaleOrderDetail}
                getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
                getSalesOrderDetailDigitalProductData={this.getSalesOrderDetailDigitalProductData}
                insertSalesOrderDetailDigitalProductData={this.insertSalesOrderDetailDigitalProductData}
                updateSalesOrderDetailDigitalProductData={this.updateSalesOrderDetailDigitalProductData}
                deleteSalesOrderDetailDigitalProductData={this.deleteSalesOrderDetailDigitalProductData}
                setDigitalSalesOrderDetailAsSent={this.setDigitalSalesOrderDetailAsSent}
                customerId={this.customerId}
                getCustomerRow={this.getCustomerRow}
                getProductFunctions={this.getProductFunctions}
                updateSalesOrderDetail={(detail) => {
                    const promise = this.updateSalesOrderDetail(detail);
                    promise.then((ok) => {
                        if (ok) {
                            this.printSalesOrdeDetails();
                        }
                    });
                    return promise;
                }}
                deleteSalesOrderDetail={(detailId) => {
                    const promise = this.deleteSalesOrderDetail(detailId);
                    promise.then((ok) => {
                        if (ok) {
                            this.printSalesOrdeDetails();
                        }
                    });
                    return promise;
                }}
                waiting={detail.quantityInvoiced === 0}
            />,
            document.getElementById('salesOrderDetailsModal'));
    }

    render() {
        return <div id="salesOrderDetails">
            <div id="salesOrderDetailsModal"></div>
            <div id="salesOrderDetailsModal2"></div>
            <button type="button" class="btn btn-primary mb-1 ml-2" onClick={this.add}>{i18next.t('add')}</button>
            <div className="tableOverflowContainer">
                <div style={{ display: 'flex', height: '100%' }}>
                    <div style={{ flexGrow: 1 }}>
                        <DataGrid
                            ref="table"
                            autoHeight
                            rows={this.state.list}
                            columns={[
                                { field: 'productName', headerName: i18next.t('product'), flex: 1 },
                                { field: 'price', headerName: i18next.t('price'), width: 150 },
                                { field: 'quantity', headerName: i18next.t('quantity'), width: 150 },
                                { field: 'vatPercent', headerName: i18next.t('%-vat'), width: 150 },
                                { field: 'totalAmount', headerName: i18next.t('total-amount'), width: 200 },
                                {
                                    field: 'status', headerName: i18next.t('status'), width: 250, valueGetter: (params) => {
                                        return i18next.t(saleOrderStates[params.row.status])
                                    }
                                },
                                {
                                    field: '', headerName: i18next.t('invoice') + "/" + i18next.t('delivery-note'), width: 300,
                                    valueGetter: (params) => {
                                        return (params.row.quantityInvoiced === 0 ? i18next.t('not-invoiced') :
                                            (params.row.quantityInvoiced === params.row.quantity
                                                ? i18next.t('invoiced') : i18next.t('partially-invoiced')))
                                            + "/" +
                                            i18next.t(params.row.quantityDeliveryNote === 0 ? i18next.t('no-delivery-note') :
                                                (params.row.quantityDeliveryNote === params.row.quantity ?
                                                    i18next.t('delivery-note-generated') : i18next.t('partially-delivered')))
                                    }
                                }
                            ]}
                            onRowClick={(data) => {
                                this.edit(data.row);
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    }
}



export default SalesOrderDetails;
