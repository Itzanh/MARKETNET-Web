import { Component } from "react";
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

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

class ProductSalesDetailsPending extends Component {
    constructor({ productId, getProductSalesOrderPending, getNameProduct }) {
        super();

        this.list = [];

        this.productId = productId;
        this.getProductSalesOrderPending = getProductSalesOrderPending;
        this.getNameProduct = getNameProduct;
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

    render() {
        return <div id="renderSalesDetailsPendingTab">
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
            />
        </div>
    }
}

export default ProductSalesDetailsPending;
