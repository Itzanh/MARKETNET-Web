import { Component } from "react";
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

class SalesOrderRelations extends Component {
    constructor({ orderId, getSalesOrderRelations }) {
        super();

        this.relations = {
            invoices: [],
            deliveryNotes: [],
            manufacturingOrders: [],
            shippings: []
        };

        this.orderId = orderId;
        this.getSalesOrderRelations = getSalesOrderRelations;
    }

    componentDidMount() {
        if (this.orderId == null) {
            return;
        }

        this.getSalesOrderRelations(this.orderId).then((relations) => {
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
                    <h4>{i18next.t('invoices')}</h4>
                    <DataGrid
                        ref="table"
                        autoHeight
                        rows={this.relations.invoices}
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
                        rows={this.relations.deliveryNotes}
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
                    <h4>{i18next.t('manufacturing-orders')}</h4>
                    <DataGrid
                        ref="table"
                        autoHeight
                        rows={this.relations.manufacturingOrders}
                        columns={[
                            { field: 'id', headerName: '#', width: 90 },
                            {
                                field: 'dateCreated', headerName: i18next.t('date'), flex: 1, valueGetter: (params) => {
                                    return window.dateFormat(params.row.dateCreated)
                                }
                            },
                            { field: 'manufactured', headerName: i18next.t('done'), width: 150, type: 'boolean' }
                        ]}
                    />
                </div>
                <div class="col">
                    <h4>{i18next.t('shippings')}</h4>
                    <DataGrid
                        ref="table"
                        autoHeight
                        rows={this.relations.shippings}
                        columns={[
                            { field: 'id', headerName: '#', width: 90 },
                            {
                                field: 'dateCreated', headerName: i18next.t('date'), flex: 1, valueGetter: (params) => {
                                    return window.dateFormat(params.row.dateCreated)
                                }
                            },
                            { field: 'sent', headerName: i18next.t('sent'), width: 150, type: 'boolean' }
                        ]}
                    />
                </div>
            </div>
        </div>
    }
}

export default SalesOrderRelations;
