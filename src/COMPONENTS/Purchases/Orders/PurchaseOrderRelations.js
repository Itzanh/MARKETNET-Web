import { Component } from "react";
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

class PurchaseOrderRelations extends Component {
    constructor({ orderId, getPurchaseOrderRelations }) {
        super();

        this.relations = {
            invoices: [],
            deliveryNotes: []
        };

        this.orderId = orderId;
        this.getPurchaseOrderRelations = getPurchaseOrderRelations;
    }

    componentDidMount() {
        if (this.orderId == null) {
            return;
        }

        this.getPurchaseOrderRelations(this.orderId).then((relations) => {
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
            </div>
        </div>
    }
}

export default PurchaseOrderRelations;
