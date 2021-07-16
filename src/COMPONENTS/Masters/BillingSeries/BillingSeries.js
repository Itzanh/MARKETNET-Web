import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import BillingSerieModal from './BillingSerieModal';

const BillingSerieType = {
    "S": "sales",
    "P": "purchases"
}


class BillingSeries extends Component {
    constructor({ getBillingSeries, addBillingSerie, updateBillingSerie, deleteBillingSerie }) {
        super();

        this.getBillingSeries = getBillingSeries;
        this.addBillingSerie = addBillingSerie;
        this.updateBillingSerie = updateBillingSerie;
        this.deleteBillingSerie = deleteBillingSerie;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderBillingSeries();
    }

    renderBillingSeries() {
        this.getBillingSeries().then((series) => {
            this.list = series;
            this.forceUpdate();
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderBillingSeriesModal'));
        ReactDOM.render(
            <BillingSerieModal
                addBillingSerie={(serie) => {
                    const promise = this.addBillingSerie(serie);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderBillingSeries();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderBillingSeriesModal'));
    }

    edit(serie) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderBillingSeriesModal'));
        ReactDOM.render(
            <BillingSerieModal
                serie={serie}
                updateBillingSerie={(serie) => {
                    const promise = this.updateBillingSerie(serie);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderBillingSeries();
                        }
                    });
                    return promise;
                }}
                deleteBillingSerie={(serieId) => {
                    const promise = this.deleteBillingSerie(serieId);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderBillingSeries();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderBillingSeriesModal'));
    }

    render() {
        return <div id="tabBillingSeries">
            <div id="renderBillingSeriesModal"></div>
            <h1>{i18next.t('billing-series')}</h1>
            <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add')}</button>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'id', headerName: '#', width: 90 },
                    { field: 'name', headerName: i18next.t('name'), flex: 1 },
                    {
                        field: 'billingType', headerName: i18next.t('billing-type'), width: 300, valueGetter: (params) => {
                            return i18next.t(BillingSerieType[params.row.billingType])
                        }
                    },
                    { field: 'year', headerName: i18next.t('year'), width: 300 }
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

export default BillingSeries;
