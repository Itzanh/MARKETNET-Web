import { Component } from "react";
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

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

class CustomerFormSaleOrders extends Component {
    constructor({ customerId, getCustomerSaleOrders }) {
        super();

        this.list = [];

        this.customerId = customerId;
        this.getCustomerSaleOrders = getCustomerSaleOrders;
    }

    componentDidMount() {
        if (this.customerId == null) {
            return;
        }

        this.getCustomerSaleOrders(this.customerId).then((orders) => {
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
                { field: 'reference', headerName: i18next.t('reference'), width: 150 },
                { field: 'customerName', headerName: i18next.t('customer'), flex: 1 },
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
        />
	}

}

export default CustomerFormSaleOrders;
