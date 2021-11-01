import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';
import PurchaseOrderDetailsModal from "../../Purchases/Orders/PurchaseOrderDetailsModal";


class ProductPurchaseDetails extends Component {
    constructor({ productId, getProductPurchaseOrder, getNameProduct, getPurchaseOrdersFunctions }) {
        super();

        this.list = [];

        this.productId = productId;
        this.getProductPurchaseOrder = getProductPurchaseOrder;
        this.getNameProduct = getNameProduct;
        this.getPurchaseOrdersFunctions = getPurchaseOrdersFunctions;

        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        if (this.productId == null) {
            return;
        }

        this.getProductPurchaseOrder(this.productId).then(async (details) => {
            this.list = details;
            this.forceUpdate();
        });
    }
    
    async edit(detail) {
        const commonProps = await this.getPurchaseOrdersFunctions();

        ReactDOM.unmountComponentAtNode(document.getElementById('purchaseOrderDetailsModal'));
        ReactDOM.render(
            <PurchaseOrderDetailsModal
                {...commonProps}
                detail={detail}
                orderId={this.orderId}
                deletePurchaseOrderDetail={(detailId) => {
                    const promise = commonProps.deletePurchaseOrderDetail(detailId);
                    promise.then((ok) => {
                        if (ok) {
                            // refresh
                            this.getProductPurchaseOrderPending(this.productId).then(async (details) => {
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
            document.getElementById('purchaseOrderDetailsModal'));
    }

    render() {
        return <div id="renderPurchaseDetailsPendingTab">
            <div id="purchaseOrderDetailsModal"></div>
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
                    }
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

export default ProductPurchaseDetails;
