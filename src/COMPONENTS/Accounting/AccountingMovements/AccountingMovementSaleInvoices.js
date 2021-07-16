import { Component } from "react";
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

class AccountingMovementSaleInvoices extends Component {
    constructor({ movementId, getAccountingMovementSaleInvoices }) {
        super();

        this.list = [];

        this.movementId = movementId;
        this.getAccountingMovementSaleInvoices = getAccountingMovementSaleInvoices;
    }

    componentDidMount() {
        this.getAccountingMovementSaleInvoices(this.movementId).then((invoices) => {
            this.renderInvoices(invoices);
        });
    }

    async renderInvoices(invoices) {
        this.list = invoices;
        this.forceUpdate();
    }

    render() {
        return <DataGrid
            ref="table"
            autoHeight
            rows={this.list}
            columns={[
                { field: 'id', headerName: '#', width: 90 },
                { field: 'invoiceName', headerName: i18next.t('invoice-no'), width: 175 },
                { field: 'customerName', headerName: i18next.t('customer'), flex: 1 },
                {
                    field: 'dateCreated', headerName: i18next.t('date'), width: 160, valueGetter: (params) => {
                        return window.dateFormat(params.row.dateCreated)
                    }
                },
                { field: 'totalProducts', headerName: i18next.t('total-products'), width: 180 },
                { field: 'totalAmount', headerName: i18next.t('total-amount'), width: 170 }
            ]}
            onRowClick={(data) => {
                this.edit(data.row);
            }}
        />
    }
}

export default AccountingMovementSaleInvoices;
