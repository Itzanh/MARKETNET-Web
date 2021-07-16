import { Component } from "react";
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

class PurchaseInvoiceRelations extends Component {
    constructor({ invoiceId, getPurchaseInvoiceRelations }) {
        super();

        this.relations = {
            orders: []
        };

        this.invoiceId = invoiceId;
        this.getPurchaseInvoiceRelations = getPurchaseInvoiceRelations;
    }

    componentDidMount() {
        if (this.invoiceId == null) {
            return;
        }

        this.getPurchaseInvoiceRelations(this.invoiceId).then((relations) => {
            this.relations = relations;
            this.forceUpdate();
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
            </div>
        </div>
    }
}

export default PurchaseInvoiceRelations;
