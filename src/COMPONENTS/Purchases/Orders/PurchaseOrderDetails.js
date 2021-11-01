import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';
import PurchaseOrderDetailsModal from "./PurchaseOrderDetailsModal";



class PurchaseOrderDetails extends Component {
    constructor({ orderId, waiting, findProductByName, getOrderDetailsDefaults, getPurchaseOrderDetails, addPurchaseOrderDetail,
        getNameProduct, deletePurchaseOrderDetail, locateProduct, addNow, getSalesOrderDetailsFromPurchaseOrderDetail, getProductFunctions }) {
        super();

        this.orderId = orderId;
        this.waiting = waiting;
        this.findProductByName = findProductByName;
        this.getNameProduct = getNameProduct;
        this.getOrderDetailsDefaults = getOrderDetailsDefaults;
        this.getPurchaseOrderDetails = getPurchaseOrderDetails;
        this.addPurchaseOrderDetail = addPurchaseOrderDetail;
        this.deletePurchaseOrderDetail = deletePurchaseOrderDetail;
        this.locateProduct = locateProduct;
        this.addNow = addNow;
        this.getSalesOrderDetailsFromPurchaseOrderDetail = getSalesOrderDetailsFromPurchaseOrderDetail;
        this.getProductFunctions = getProductFunctions;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        if (this.orderId == null) {
            return;
        }

        this.printPurchaseOrderDetails();

        if (this.addNow == true) {
            this.add();
        }
    }

    printPurchaseOrderDetails() {
        this.getPurchaseOrderDetails(this.orderId).then((details) => {
            this.renderPurchaseOrderDetails(details);
        });
    }

    async renderPurchaseOrderDetails(details) {
        this.list = details;
        this.forceUpdate();
    }

    add() {
        if (this.orderId == null) {
            this.addPurchaseOrderDetail();
            return;
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('purchaseOrderDetailsModal'));
        ReactDOM.render(
            <PurchaseOrderDetailsModal
                orderId={this.orderId}
                findProductByName={this.findProductByName}
                getOrderDetailsDefaults={this.getOrderDetailsDefaults}
                locateProduct={this.locateProduct}
                getSalesOrderDetailsFromPurchaseOrderDetail={this.getSalesOrderDetailsFromPurchaseOrderDetail}
                getProductFunctions={this.getProductFunctions}
                addPurchaseOrderDetail={(detail) => {
                    const promise = this.addPurchaseOrderDetail(detail);
                    promise.then((ok) => {
                        if (ok) {
                            this.printPurchaseOrderDetails();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('purchaseOrderDetailsModal'));
    }

    async edit(detail) {
        ReactDOM.unmountComponentAtNode(document.getElementById('purchaseOrderDetailsModal'));
        ReactDOM.render(
            <PurchaseOrderDetailsModal
                detail={detail}
                orderId={this.orderId}
                findProductByName={this.findProductByName}
                getOrderDetailsDefaults={this.getOrderDetailsDefaults}
                locateProduct={this.locateProduct}
                getSalesOrderDetailsFromPurchaseOrderDetail={this.getSalesOrderDetailsFromPurchaseOrderDetail}
                getProductFunctions={this.getProductFunctions}
                defaultValueNameProduct={detail.productName}
                deletePurchaseOrderDetail={(detailId) => {
                    const promise = this.deletePurchaseOrderDetail(detailId);
                    promise.then((ok) => {
                        if (ok) {
                            this.printPurchaseOrderDetails();
                        }
                    });
                    return promise;
                }}
                waiting={this.waiting}
            />,
            document.getElementById('purchaseOrderDetailsModal'));
    }

    render() {
        return <div id="purchaseOrderDetails">
            <div id="purchaseOrderDetailsModal"></div>
            <div id="purchaseOrderDetailsModal2"></div>
            <button type="button" class="btn btn-primary mb-1 ml-1" onClick={this.add}>{i18next.t('add')}</button>
            <div className="tableOverflowContainer">
                <DataGrid
                    ref="table"
                    autoHeight
                    rows={this.list}
                    columns={[
                        { field: 'id', headerName: '#', width: 90 },
                        { field: 'productName', headerName: i18next.t('product'), flex: 1 },
                        { field: 'price', headerName: i18next.t('price'), width: 150 },
                        { field: 'quantity', headerName: i18next.t('quantity'), width: 150 },
                        { field: 'vatPercent', headerName: i18next.t('%-vat'), width: 150 },
                        { field: 'totalAmount', headerName: i18next.t('total-amount'), width: 200 },
                        {
                            field: 'quantityInvoiced', headerName: i18next.t('invoice') + "/" + i18next.t('delivery-note'), width: 300,
                            valueGetter: (params) => {
                                return (params.row.quantityInvoiced === 0 ? i18next.t('not-invoiced') :
                                    (params.row.quantityInvoiced === params.row.quantity
                                        ? i18next.t('invoiced') : i18next.t('partially-invoiced')))
                                    + "/" +
                                    i18next.t(params.row.quantityDeliveryNote === 0 ? i18next.t('no-delivery-note') :
                                        (params.row.quantityDeliveryNote === params.row.quantity ?
                                            i18next.t('delivery-note-generated') : i18next.t('partially-delivered')))
                            }
                        },
                        { field: 'quantityAssignedSale', headerName: i18next.t('quantity-assigned-sale'), width: 200 },
                    ]}
                    onRowClick={(data) => {
                        this.edit(data.row);
                    }}
                />
            </div>
        </div>
    }
}



export default PurchaseOrderDetails;
