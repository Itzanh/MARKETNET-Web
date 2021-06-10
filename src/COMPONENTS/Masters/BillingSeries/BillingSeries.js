import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import BillingSerieModal from './BillingSerieModal';

const BillingSerieType = {
    "S": "Sales",
    "P": "Purchases"
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
            <h1>Billing Series</h1>
            <button type="button" class="btn btn-primary" onClick={this.add}>Add</button>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Billing Type</th>
                        <th scope="col">Year</th>
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
            <td>{BillingSerieType[this.serie.billingType]}</td>
            <td>{this.serie.year}</td>
        </tr>
    }
}

export default BillingSeries;
