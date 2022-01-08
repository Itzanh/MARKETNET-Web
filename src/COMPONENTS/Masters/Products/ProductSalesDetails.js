import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';
import SalesOrderDetailsModal from "../../Sales/Orders/SalesOrderDetailsModal";

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
};



class ProductSalesDetails extends Component {
    constructor({ productId, getProductSalesOrder, getNameProduct, getSalesOrdersFunctions }) {
        super();

        this.list = [];

        this.productId = productId;
        this.getProductSalesOrder = getProductSalesOrder;
        this.getNameProduct = getNameProduct;
        this.getSalesOrdersFunctions = getSalesOrdersFunctions;

        this.edit = this.edit.bind(this);
        this.search = this.search.bind(this);
    }

    componentDidMount() {
        if (this.productId == null) {
            return;
        }

        this.getProductSalesOrder({
            productId: this.productId
        }).then(async (details) => {
            this.list = details;
            this.forceUpdate();
        });
    }

    search() {
        if (this.productId == null) {
            return;
        }

        this.getProductSalesOrder({
            productId: this.productId,
            startDate: new Date(this.refs.start.value),
            endDate: new Date(this.refs.end.value),
            status: this.refs.status.value
        }).then(async (details) => {
            this.list = details;
            this.forceUpdate();
        });
    }

    async edit(detail) {
        const commonProps = await this.getSalesOrdersFunctions();

        ReactDOM.unmountComponentAtNode(document.getElementById('salesOrderDetailsModal'));
        ReactDOM.render(
            <SalesOrderDetailsModal
                {...commonProps}
                detail={detail}
                orderId={this.orderId}
                updateSalesOrderDetail={(detail) => {
                    const promise = commonProps.updateSalesOrderDetail(detail);
                    promise.then((ok) => {
                        if (ok) {
                            // refresh
                            this.getProductSalesOrder(this.productId).then(async (details) => {
                                this.list = details;
                                this.forceUpdate();
                            });
                        }
                    });
                    return promise;
                }}
                deleteSalesOrderDetail={(detailId) => {
                    const promise = commonProps.deleteSalesOrderDetail(detailId);
                    promise.then((ok) => {
                        if (ok) {
                            // refresh
                            this.getProductSalesOrder(this.productId).then(async (details) => {
                                this.list = details;
                                this.forceUpdate();
                            });
                        }
                    });
                    return promise;
                }}
                waiting={detail.quantityInvoiced === 0}
                defaultValueNameProduct={detail.productName}
            />,
            document.getElementById('salesOrderDetailsModal'));
    }

    render() {
        return <div id="renderSalesDetailsPendingTab" className="formRowRoot">
            <div id="salesOrderDetailsModal"></div>
            <div class="form-row mb-2">
                <div class="col formInputTag">
                    <label for="start">{i18next.t('start-date')}:</label>
                </div>
                <div class="col mw-10">
                    <input type="date" class="form-control" ref="start" />
                </div>
                <div class="col formInputTag">
                    <label for="start">{i18next.t('end-date')}:</label>
                </div>
                <div class="col mw-10">
                    <input type="date" class="form-control" ref="end" />
                </div>
                <div class="col formInputTag">
                    <label>Status:</label>
                </div>
                <div class="col mw-15">
                    <select class="form-control" ref="status">
                        <option value="">.{i18next.t('all')}</option>
                        <option value="_">{i18next.t('waiting-for-payment')}</option>
                        <option value="A">{i18next.t('waiting-for-purchase-order')}</option>
                        <option value="B">{i18next.t('purchase-order-pending')}</option>
                        <option value="C">{i18next.t('waiting-for-manufacturing-orders')}</option>
                        <option value="D">{i18next.t('manufacturing-orders-pending')}</option>
                        <option value="E">{i18next.t('sent-to-preparation')}</option>
                        <option value="F">{i18next.t('awaiting-for-shipping')}</option>
                        <option value="G">{i18next.t('shipped')}</option>
                        <option value="H">{i18next.t('receiced-by-the-customer')}</option>
                    </select>
                </div>
                <div class="col">
                    <button type="button" class="btn btn-primary" onClick={this.search}>{i18next.t('search')}</button>
                </div>
            </div>
            <div className="tableOverflowContainer">
                <div style={{ display: 'flex', height: '100%' }}>
                    <div style={{ flexGrow: 1 }}>
                        <DataGrid
                            ref="table"
                            autoHeight
                            rows={this.list}
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



export default ProductSalesDetails;
