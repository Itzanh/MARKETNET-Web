import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';
import SalesOrderDetailsModal from "../../Sales/Orders/SalesOrderDetailsModal";

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



class ProductSalesDetailsPending extends Component {
    constructor({ productId, getProductSalesOrderPending, getNameProduct, getSalesOrdersFunctions }) {
        super();

        this.list = [];

        this.productId = productId;
        this.getProductSalesOrderPending = getProductSalesOrderPending;
        this.getNameProduct = getNameProduct;
        this.getSalesOrdersFunctions = getSalesOrdersFunctions;

        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        if (this.productId == null) {
            return;
        }

        this.getProductSalesOrderPending(this.productId).then(async (details) => {
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
                            this.getProductSalesOrderPending(this.productId).then(async (details) => {
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
                            this.getProductSalesOrderPending(this.productId).then(async (details) => {
                                this.list = details;
                                this.forceUpdate();
                            });
                        }
                    });
                    return promise;
                }}
                waiting={detail.quantityInvoiced === 0}
                defaultValueNameProduct={detail.product.name}
            />,
            document.getElementById('salesOrderDetailsModal'));
    }

    render() {
        return <div id="renderSalesDetailsPendingTab">
            <div id="salesOrderDetailsModal"></div>
            <div className="tableOverflowContainer">
                <div style={{ display: 'flex', height: '100%' }}>
                    <div style={{ flexGrow: 1 }}>
                        <DataGrid
                            ref="table"
                            autoHeight
                            rows={this.list}
                            columns={[
                                {
                                    field: 'productName', headerName: i18next.t('product'), flex: 1, valueGetter: (params) => {
                                        return params.row.product.name;
                                    }
                                },
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



export default ProductSalesDetailsPending;
