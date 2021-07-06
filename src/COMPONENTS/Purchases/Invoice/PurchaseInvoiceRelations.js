import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

class PurchaseInvoiceRelations extends Component {
    constructor({ invoiceId, getPurchaseInvoiceRelations }) {
        super();

        this.invoiceId = invoiceId;
        this.getPurchaseInvoiceRelations = getPurchaseInvoiceRelations;
    }

    componentDidMount() {
        if (this.invoiceId == null) {
            return;
        }

        this.getPurchaseInvoiceRelations(this.invoiceId).then((relations) => {
            console.log(relations)
            ReactDOM.render(relations.orders.map((element, i) => {
                return <PurchaseInvoiceRelationsOrder key={i}
                    invoice={element}
                    edit={this.edit}
                />
            }), this.refs.render);
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
                        <tbody ref="render"></tbody>
                    </table>
                </div>
            </div>
        </div>
    }
}

class PurchaseInvoiceRelationsOrder extends Component {
    constructor({ invoice }) {
        super();

        this.invoice = invoice;
    }

    render() {
        return <tr>
            <th scope="row">{this.invoice.id}</th>
            <td>{window.dateFormat(new Date(this.invoice.dateCreated))}</td>
            <td>{this.invoice.totalAmount}</td>
        </tr>
    }
}

export default PurchaseInvoiceRelations;
