import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

class PurchaseDeliveryNotesRelations extends Component {
    constructor({ noteId, getPurchaseDeliveryNotesRelations }) {
        super();

        this.noteId = noteId;
        this.getPurchaseDeliveryNotesRelations = getPurchaseDeliveryNotesRelations;
    }

    componentDidMount() {
        if (this.noteId == null) {
            return;
        }

        this.getPurchaseDeliveryNotesRelations(this.noteId).then((relations) => {
            ReactDOM.render(relations.orders.map((element, i) => {
                return <PurchaseInvoiceRelationsOrder key={i}
                    order={element}
                />
            }), this.refs.renderOrders);
        });
    }

    render() {
        return <div className="formRowRoot">
            <div class="form-row">
                <div class="col">
                    <h4>{i18next.t('orders')}</h4>
                    <table class="table table-dark">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">{i18next.t('date')}</th>
                                <th scope="col">{i18next.t('total')}</th>
                            </tr>
                        </thead>
                        <tbody ref="renderOrders"></tbody>
                    </table>
                </div>
            </div>
        </div>
    }
}

class PurchaseInvoiceRelationsOrder extends Component {
    constructor({ order }) {
        super();

        this.order = order;
    }

    render() {
        return <tr>
            <th scope="row">{this.order.id}</th>
            <td>{window.dateFormat(new Date(this.order.dateCreated))}</td>
            <td>{this.order.totalAmount}</td>
        </tr>
    }
}

export default PurchaseDeliveryNotesRelations;
