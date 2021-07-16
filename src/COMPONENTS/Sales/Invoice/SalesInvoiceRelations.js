import { Component } from "react";
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

class SalesInvoiceRelations extends Component {
    constructor({ invoiceId, getSalesInvoiceRelations }) {
        super();

        this.relations = {
            orders: [],
            notes: []
        };

        this.invoiceId = invoiceId;
        this.getSalesInvoiceRelations = getSalesInvoiceRelations;
    }

    componentDidMount() {
        if (this.invoiceId == null) {
            return;
        }

        this.getSalesInvoiceRelations(this.invoiceId).then((relations) => {
            this.relations = relations;
            setTimeout(() => {
                this.forceUpdate();
            }, 0);
        });
    }

    render() {
        return <div className="formRowRoot">
            <div class="form-row">
                <div class="col">
                    <h4>{i18next.t('orders')}</h4>
                    <DataGrid
                        ref="table"
                        autoHeight
                        rows={this.relations.orders}
                        columns={[
                            { field: 'id', headerName: '#', width: 90 },
                            {
                                field: 'dateCreated', headerName: i18next.t('date'), flex: 1, valueGetter: (params) => {
                                    return window.dateFormat(params.row.dateCreated)
                                }
                            },
                            { field: 'totalAmount', headerName: i18next.t('total-amount'), width: 170 }
                        ]}
                    />
                </div>
                <div class="col">
                    <h4>{i18next.t('delivery-notes')}</h4>
                    <DataGrid
                        ref="table"
                        autoHeight
                        rows={this.relations.notes}
                        columns={[
                            { field: 'id', headerName: '#', width: 90 },
                            {
                                field: 'dateCreated', headerName: i18next.t('date'), flex: 1, valueGetter: (params) => {
                                    return window.dateFormat(params.row.dateCreated)
                                }
                            },
                            { field: 'totalAmount', headerName: i18next.t('total-amount'), width: 170 }
                        ]}
                    />
                </div>
            </div>
        </div>
    }
}

export default SalesInvoiceRelations;
