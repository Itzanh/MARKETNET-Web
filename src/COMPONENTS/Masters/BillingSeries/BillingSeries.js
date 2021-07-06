import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';

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

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderBillingSeries();
    }

    renderBillingSeries() {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        this.getBillingSeries().then((series) => {
            ReactDOM.render(series.map((element, i) => {
                return <BillingSerie key={i}
                    serie={element}
                    edit={this.edit}
                />
            }), this.refs.render);
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
            <div className="menu">
                <h1>{i18next.t('billing-series')}</h1>
                <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button>
            </div>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">{i18next.t('name')}</th>
                        <th scope="col">{i18next.t('billing-type')}</th>
                        <th scope="col">{i18next.t('year')}</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class BillingSerie extends Component {
    constructor({ serie, edit }) {
        super();

        this.serie = serie;
        this.edit = edit;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.serie);
        }}>
            <th scope="row">{this.serie.id}</th>
            <td>{this.serie.name}</td>
            <td>{i18next.t(BillingSerieType[this.serie.billingType])}</td>
            <td>{this.serie.year}</td>
        </tr>
    }
}

export default BillingSeries;
