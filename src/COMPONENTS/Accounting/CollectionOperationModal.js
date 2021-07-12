import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from "i18next";

class ChangesModal extends Component {
    constructor({ collectionOperation, insertCharges, getCharges, deleteCharges }) {
        super();

        this.collectionOperation = collectionOperation;
        this.insertCharges = insertCharges;
        this.getCharges = getCharges;
        this.deleteCharges = deleteCharges;

        this.tab = 0;

        this.tabDetails = this.tabDetails.bind(this);
        this.tabCharges = this.tabCharges.bind(this);
    }

    componentDidMount() {
        window.$('#collectionOperationModal').modal({ show: true });
        this.tabs();
        this.tabDetails();
    }

    tabs() {
        ReactDOM.render(<ul class="nav nav-tabs">
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 0 ? " active" : "")} href="#" onClick={this.tabDetails}>{i18next.t('details')}</a>
            </li>
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 1 ? " active" : "")} href="#" onClick={this.tabCharges}>{i18next.t('charges')}</a>
            </li>
        </ul>, this.refs.tabs);
    }

    tabDetails() {
        this.tab = 0;
        this.tabs();
        ReactDOM.render(<ChangesModalDetails
            collectionOperation={this.collectionOperation}
        />, this.refs.render);
    }

    tabCharges() {
        this.tab = 1;
        this.tabs();
        ReactDOM.render(<ChangesModalCharges
            collectionOperation={this.collectionOperation}
            insertCharges={this.insertCharges}
            getCharges={this.getCharges}
            deleteCharges={this.deleteCharges}
        />, this.refs.render);
    }

    render() {
        return <div class="modal fade" id="collectionOperationModal" tabindex="-1" role="dialog"
            aria-labelledby="collectionOperationModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="collectionOperationModalLabel">{i18next.t('collection-operation')}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div ref="tabs">
                        </div>
                        <div ref="render">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                    </div>
                </div>
            </div>
        </div>
    }
}

class ChangesModalDetails extends Component {
    constructor({ collectionOperation }) {
        super();

        this.collectionOperation = collectionOperation;
    }

    render() {
        return <div>
            <div class="form-row">
                <div class="col">
                    <label>{i18next.t('date-created')}</label>
                    <input type="text" class="form-control" defaultValue={window.dateFormat(this.collectionOperation.dateCreated)} readOnly={true} />
                </div>
                <div class="col">
                    <label>{i18next.t('date-expiration')}</label>
                    <input type="text" class="form-control" defaultValue={window.dateFormat(this.collectionOperation.dateExpiration)}
                        readOnly={true} />
                </div>
            </div>
            <div class="form-row">
                <div class="col">
                    <label>{i18next.t('bank')}</label>
                    <input type="text" class="form-control" defaultValue={this.collectionOperation.bankName} readOnly={true} />
                </div>
                <div class="col">
                    <label>{i18next.t('payment-method')}</label>
                    <input type="text" class="form-control" defaultValue={this.collectionOperation.paymentMethodName} readOnly={true} />
                </div>
            </div>
            <div class="form-row">
                <div class="col">
                    <label>{i18next.t('total')}</label>
                    <input type="number" class="form-control" defaultValue={this.collectionOperation.total} readOnly={true} />
                </div>
                <div class="col">
                    <label>{i18next.t('paid')}</label>
                    <input type="number" class="form-control" defaultValue={this.collectionOperation.paid} readOnly={true} />
                </div>
                <div class="col">
                    <label>{i18next.t('pending')}</label>
                    <input type="number" class="form-control" defaultValue={this.collectionOperation.pending} readOnly={true} />
                </div>
            </div>
            <label>{i18next.t('document-name')}</label>
            <input type="text" class="form-control" defaultValue={this.collectionOperation.documentName} readOnly={true} />
            <label>{i18next.t('account-name')}</label>
            <input type="text" class="form-control" defaultValue={this.collectionOperation.accountName} readOnly={true} />
            <label>{i18next.t('status')}</label>
            <select class="form-control" defaultValue={this.collectionOperation.status} disabled={true}>
                <option value="P">{i18next.t('pending')}</option>
                <option value="C">{i18next.t('paid')}</option>
                <option value="U">{i18next.t('unpaid')}</option>
            </select>
        </div>
    }
}

class ChangesModalCharges extends Component {
    constructor({ collectionOperation, insertCharges, getCharges, deleteCharges }) {
        super();

        this.collectionOperation = collectionOperation;
        this.insertCharges = insertCharges;
        this.getCharges = getCharges;
        this.deleteCharges = deleteCharges;

        this.add = this.add.bind(this);
    }

    componentDidMount() {
        this.renderCharges();
    }

    renderCharges() {
        this.getCharges(this.collectionOperation.id).then((charges) => {
            ReactDOM.unmountComponentAtNode(this.refs.render);
            ReactDOM.render(charges.map((element, i) => {
                return <tr key={i}>
                    <th scope="row">{window.dateFormat(element.dateCreated)}</th>
                    <td>{element.amount}</td>
                    <td onClick={() => {
                        this.deleteCharges(element.id).then((ok) => {
                            if (ok) {
                                this.renderCharges();
                            }
                        });
                    }}>{i18next.t('delete')}</td>
                </tr>
            }), this.refs.render);
        });
    }

    add() {
        const charge = {
            concept: this.refs.concept.value,
            amount: parseFloat(this.refs.amount.value),
            collectionOperation: this.collectionOperation.id
        };

        this.insertCharges(charge).then((ok) => {
            if (ok) {
                this.renderCharges();
            }
        });
    }

    render() {
        return <div>
            <div class="form-row">
                <div class="col">
                    <label>{i18next.t('concept')}</label>
                    <input type="text" class="form-control" ref="concept" />
                </div>
                <div class="col">
                    <label>{i18next.t('amount')}</label>
                    <input type="number" class="form-control" defaultValue={this.collectionOperation.pending} ref="amount" />
                </div>
                <div class="col" style={{ 'max-width': '15%' }}>
                    <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button>
                </div>
            </div>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">{i18next.t('date')}</th>
                        <th scope="col">{i18next.t('amount')}</th>
                        <th scope="col">{i18next.t('delete')}</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

export default ChangesModal;
