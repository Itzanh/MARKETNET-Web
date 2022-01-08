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
    constructor({ getPendingColletionOperations, searchCollectionOperations, insertCharges, getCharges, deleteCharges, getRegisterTransactionalLogs }) {
        super();

        this.getPendingColletionOperations = getPendingColletionOperations;
        this.searchCollectionOperations = searchCollectionOperations;
        this.insertCharges = insertCharges;
        this.getCharges = getCharges;
        this.deleteCharges = deleteCharges;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;

        this.list = [];

        this.edit = this.edit.bind(this);
        this.search = this.search.bind(this);
    }

    componentDidMount() {
        this.getPendingColletionOperations().then((collectionOperations) => {
            this.renderCharges(collectionOperations);
        });
    }

    search() {
        const query = {};
        query.mode = parseInt(this.refs.mode.value);
        query.search = this.refs.search.value;

        if (this.refs.startDate.value != "") {
            var dateTime = this.refs.startDate.value;

            if (this.refs.startTime.value != "") {
                dateTime += " " + this.refs.startTime.value;
            } else {
                dateTime += " 00:00";
            }

            query.startDate = new Date(dateTime);
        }

        if (this.refs.endDate.value != "") {
            var dateTime = this.refs.endDate.value;

            if (this.refs.endTime.value != "") {
                dateTime += " " + this.refs.endTime.value;
            } else {
                dateTime += " 23:59";
            }

            query.endDate = new Date(dateTime);
        }

        this.searchCollectionOperations(query).then((collectionOperations) => {
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
            getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
        />, this.refs.renderModal);
    }

    render() {
        return <div id="tabCharges" className="formRowRoot">
            <div ref="renderModal"></div>
            <div id="renderModalCharges2"></div>
            <h4 className="ml-2">{i18next.t('charges')}</h4>
            <div class="form-row mb-2 ml-2">
                <div class="col">
                    <label>{i18next.t('status')}</label>
                    <select class="form-control" ref="mode">
                        <option value="0">.{i18next.t('all')}</option>
                        <option value="1">{i18next.t('pending')}</option>
                        <option value="2">{i18next.t('paid')}</option>
                        <option value="3">{i18next.t('unpaid')}</option>
                    </select>
                </div>
                <div class="col">
                    <label>{i18next.t('start-date')}</label>
                    <div class="form-row">
                        <div class="col">
                            <input type="date" class="form-control" ref="startDate" />
                        </div>
                        <div class="col">
                            <input type="time" class="form-control" ref="startTime" />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <label>{i18next.t('end-date')}</label>
                    <div class="form-row">
                        <div class="col">
                            <input type="date" class="form-control" ref="endDate" />
                        </div>
                        <div class="col">
                            <input type="time" class="form-control" ref="endTime" />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <label>{i18next.t('customer')}</label>
                    <input type="text" class="form-control" ref="search" />
                </div>
                <div class="col">
                    <button type="button" class="btn btn-primary" onClick={this.search}>{i18next.t('search')}</button>
                </div>
            </div>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'bankName', headerName: i18next.t('bank'), width: 200 },
                    {
                        field: 'status', headerName: i18next.t('status'), width: 200, valueGetter: (params) => {
                            return i18next.t(chagesStatus[params.row.status])
                        }
                    },
                    { field: 'customerName', headerName: i18next.t('customer'), flex: 1 },
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
                    { field: 'total', headerName: i18next.t('total'), width: 200 },
                    { field: 'paid', headerName: i18next.t('paid'), width: 200 },
                    { field: 'paymentMethodName', headerName: i18next.t('payment-method'), width: 250 }
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

export default Charges;
