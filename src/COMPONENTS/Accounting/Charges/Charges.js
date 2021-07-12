import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
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

        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderCharges();
    }

    renderCharges() {
        this.getPendingColletionOperations().then((collectionOperations) => {
            ReactDOM.render(collectionOperations.map((element, i) => {
                return <tr key={i} onClick={() => {
                    this.edit(element);
                }}>
                    <th scope="row">{element.id}</th>
                    <td>{element.bankName}</td>
                    <td>{i18next.t(chagesStatus[element.status])}</td>
                    <td>{window.dateFormat(element.dateCreated)}</td>
                    <td>{window.dateFormat(element.dateExpiration)}</td>
                    <td>{element.total}</td>
                    <td>{element.paid}</td>
                    <td>{element.paymentMethodName}</td>
                </tr>
            }), this.refs.render)
        });
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
            <div className="menu">
                <h1>{i18next.t('charges')}</h1>
            </div>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">{i18next.t('bank')}</th>
                        <th scope="col">{i18next.t('status')}</th>
                        <th scope="col">{i18next.t('date-created')}</th>
                        <th scope="col">{i18next.t('date-expiration')}</th>
                        <th scope="col">{i18next.t('total')}</th>
                        <th scope="col">{i18next.t('paid')}</th>
                        <th scope="col">{i18next.t('payment-method')}</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

export default Charges;
