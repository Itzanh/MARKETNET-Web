import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import ChangesModal from "../CollectionOperationModal";
import TableContextMenu from "../../VisualComponents/TableContextMenu";

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
        ReactDOM.render(collectionOperations.map((element, i) => {
            return <tr key={i} onClick={() => {
                this.edit(element);
            }} pos={i}>
                <th field="id" scope="row">{element.id}</th>
                <td field="bankName">{element.bankName}</td>
                <td field="status">{i18next.t(chagesStatus[element.status])}</td>
                <td field="dateCreated">{window.dateFormat(element.dateCreated)}</td>
                <td field="dateExpiration">{window.dateFormat(element.dateExpiration)}</td>
                <td field="total">{element.total}</td>
                <td field="paid">{element.paid}</td>
                <td field="paymentMethodName">{element.paymentMethodName}</td>
            </tr>
        }), this.refs.render);
        this.list = collectionOperations;
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
                    <tr onClick={(e) => {
                        e.preventDefault();
                        const field = e.target.getAttribute("field");

                        if (this.sortField == field) {
                            this.sortAscending = !this.sortAscending;
                        }
                        this.sortField = field;

                        var greaterThan = 1;
                        var lessThan = -1;
                        if (!this.sortAscending) {
                            greaterThan = -1;
                            lessThan = -1;
                        }

                        this.list.sort((a, b) => {
                            if (a[field] > b[field]) {
                                return greaterThan;
                            } else if (a[field] < b[field]) {
                                return lessThan;
                            } else {
                                return 0;
                            }
                        });
                        this.renderCharges(this.list);
                    }}>
                        <th field="id" scope="col">#</th>
                        <th field="bankName" scope="col">{i18next.t('bank')}</th>
                        <th field="status" scope="col">{i18next.t('status')}</th>
                        <th field="dateCreated" scope="col">{i18next.t('date-created')}</th>
                        <th field="dateExpiration" scope="col">{i18next.t('date-expiration')}</th>
                        <th field="total" scope="col">{i18next.t('total')}</th>
                        <th field="paid" scope="col">{i18next.t('paid')}</th>
                        <th field="paymentMethodName" scope="col">{i18next.t('payment-method')}</th>
                    </tr>
                </thead>
                <tbody ref="render" onContextMenu={(e) => {
                    e.preventDefault();
                    const posX = e.pageX + "px";
                    const posY = e.pageY + "px";
                    if (document.getElementById("customContextMenu") === null) {
                        ReactDOM.render(<TableContextMenu
                            posX={posX}
                            posY={posY}
                            getList={() => {
                                return this.list;
                            }}
                            setList={(list) => {
                                this.renderCharges(list);
                            }}
                            pos={parseInt(e.target.parentNode.getAttribute("pos"))}
                            field={e.target.getAttribute("field")}
                            value={e.target.innerText}
                            fields={["id", "bankName", "status", "dateCreated", "dateExpiration", "total", "paid", "paymentMethodName"]}
                        />, document.getElementById("contextMenu"));
                    } else {
                        ReactDOM.unmountComponentAtNode(document.getElementById("contextMenu"));
                    }
                }}></tbody>
            </table>
        </div>
    }
}

export default Charges;
