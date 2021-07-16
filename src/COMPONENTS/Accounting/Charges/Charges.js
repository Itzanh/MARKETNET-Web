import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import ChangesModal from "../CollectionOperationModal";

const chagesStatus = {
    "P": "pending",
    "C": "paid",
    "U": "unpaid"
}

class Charges extends Component {
    constructor({ getPendingColletionOperations, insertCharges, getCharges, deleteCharges }) {
        super();

        this.getPendingColletionOperations = getPendingColletionOperations;
        this.insertCharges = insertCharges;
        this.getCharges = getCharges;
        this.deleteCharges = deleteCharges;

        this.list = [];

        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.getPendingColletionOperations().then((collectionOperations) => {
            this.renderCharges(collectionOperations);
        });
    }

    renderCharges(collectionOperations) {
        this.list = collectionOperations;
        this.forceUpdate();
    }

    edit(collectionOperation) {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(<ChangesModal
            collectionOperation={collectionOperation}
            insertCharges={this.insertCharges}
            getCharges={this.getCharges}
            deleteCharges={this.deleteCharges}
        />, this.refs.renderModal);
    }

    render() {
        return <div id="tabCharges">
            <div ref="renderModal"></div>
                <h1>{i18next.t('charges')}</h1>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'id', headerName: '#', width: 90 },
                    { field: 'bankName', headerName: i18next.t('bank'), width: 200 },
                    {
                        field: 'status', headerName: i18next.t('status'), flex: 1, valueGetter: (params) => {
                            return i18next.t(chagesStatus[params.row.status])
                        }
                    },
                    {
                        field: 'dateCreated', headerName: i18next.t('date-created'), width: 200, valueGetter: (params) => {
                            return window.dateFormat(params.row.dateCreated)
                        }
                    },
                    {
                        field: 'dateExpiration', headerName: i18next.t('date-expiration'), width: 200, valueGetter: (params) => {
                            return window.dateFormat(params.row.dateExpiration)
                        }
                    },
                    { field: 'total', headerName: i18next.t('total'), width: 250 },
                    { field: 'paid', headerName: i18next.t('paid'), width: 250 },
                    { field: 'paymentMethodName', headerName: i18next.t('payment-method'), width: 300 }
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

export default Charges;
