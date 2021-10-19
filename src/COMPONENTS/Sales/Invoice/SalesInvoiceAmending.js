import { Component } from "react";
import i18next from 'i18next';

class SalesInvoiceAmending extends Component {
    constructor({ invoiceId, makeAmendingSaleInvoice }) {
        super();

        this.invoiceId = invoiceId;
        this.makeAmendingSaleInvoice = makeAmendingSaleInvoice;

        this.add = this.add.bind(this);
    }

    componentDidMount() {
        window.$('#amendingModal').modal({ show: true });
    }

    add() {
        this.makeAmendingSaleInvoice({
            invoiceId: this.invoiceId,
            quantity: parseFloat(this.refs.quantity.value),
            description: this.refs.name.value
        }).then((ok) => {
            if (ok) {
                window.$('#amendingModal').modal('hide');
            }
        });
    }

    render() {
        return <div class="modal fade" id="amendingModal" tabindex="-1" role="dialog" aria-labelledby="amendingModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="amendingModalLabel">{i18next.t('create-an-amending-invoice')}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>{i18next.t('description')}</label>
                            <input type="text" class="form-control" ref="name" />
                        </div>
                        <div class="form-group">
                            <label>{i18next.t('amount')}</label>
                            <input type="number" class="form-control" ref="quantity" defaultValue="0" min="0" />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                        {this.country == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default SalesInvoiceAmending;
