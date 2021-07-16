import { Component } from "react";
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

class SalesDeliveryNotesRelations extends Component {
    constructor({ noteId, getSalesDeliveryNotesRelations }) {
        super();

        this.relations = {
            orders: [],
            shippings: []
        };

        this.noteId = noteId;
        this.getSalesDeliveryNotesRelations = getSalesDeliveryNotesRelations;
    }

    componentDidMount() {
        if (this.noteId == null) {
            return;
        }

        this.getSalesDeliveryNotesRelations(this.noteId).then((relations) => {
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
                    <h4>{i18next.t('shipping')}</h4>
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

export default SalesDeliveryNotesRelations;
