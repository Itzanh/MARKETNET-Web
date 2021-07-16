import { Component } from "react";
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

class SupplierFormPurchaseOrders extends Component {
    constructor({ supplierId, getSupplierPurchaseOrders }) {
        super();

        this.list = [];

        this.supplierId = supplierId;
        this.getSupplierPurchaseOrders = getSupplierPurchaseOrders;
    }

    componentDidMount() {
        if (this.supplierId == null) {
            return;
        }

        this.getSupplierPurchaseOrders(this.supplierId).then((orders) => {
            this.list = orders;
            this.forceUpdate();
        });
    }

    render() {
        return <DataGrid
            ref="table"
            autoHeight
            rows={this.list}
            columns={[
                { field: 'id', headerName: '#', width: 90 },
                { field: 'orderName', headerName: i18next.t('order-no'), width: 160 },
                { field: 'supplierReference', headerName: i18next.t('supplier-reference'), width: 240 },
                { field: 'supplierName', headerName: i18next.t('supplier'), flex: 1 },
                {
                    field: 'dateCreated', headerName: i18next.t('date'), width: 160, valueGetter: (params) => {
                        return window.dateFormat(params.row.dateCreated)
                    }
                },
                { field: 'totalProducts', headerName: i18next.t('total-products'), width: 180 },
                { field: 'totalAmount', headerName: i18next.t('total-amount'), width: 170 }
            ]}
        />
	}

}

export default SupplierFormPurchaseOrders;
