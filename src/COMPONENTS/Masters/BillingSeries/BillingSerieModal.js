import React, { Component } from 'react';
import i18next from 'i18next';


class BillingSerieModal extends Component {
    constructor({ serie, addBillingSerie, updateBillingSerie, deleteBillingSerie }) {
        super();

        this.serie = serie;
        this.addBillingSerie = addBillingSerie;
        this.updateBillingSerie = updateBillingSerie;
        this.deleteBillingSerie = deleteBillingSerie;

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        window.$('#billingSerieModal').modal({ show: true });
    }

    getSerieFromForm() {
        const serie = {}
        serie.id = this.refs.id.value;
        serie.name = this.refs.name.value;
        serie.billingType = this.refs.type.value;
        serie.year = parseInt(this.refs.year.value);
        return serie;
    }

    isValid(serie) {
        this.refs.errorMessage.innerText = "";
        if (serie.name.length === 0) {
            this.refs.errorMessage.innerText = i18next.t('name-0');
            return false;
        }
        if (serie.name.length > 50) {
            this.refs.errorMessage.innerText = i18next.t('name-50');
            return false;
        }
        if (serie.id.length === 0) {
            this.refs.errorMessage.innerText = i18next.t('id-0');
            return false;
        }
        if (serie.id.length > 3) {
            this.refs.errorMessage.innerText = i18next.t('id-3');
            return false;
        }
        return true;
    }

    add() {
        const serie = this.getSerieFromForm();
        if (!this.isValid(serie)) {
            return;
        }

        this.addBillingSerie(serie).then((ok) => {
            if (ok) {
                window.$('#billingSerieModal').modal('hide');
            }
        });
    }

    update() {
        const serie = this.getSerieFromForm();
        if (!this.isValid(serie)) {
            return;
        }

        this.updateBillingSerie(serie).then((ok) => {
            if (ok) {
                window.$('#billingSerieModal').modal('hide');
            }
        });
    }

    delete() {
        const serieId = this.refs.id.value;
        this.deleteBillingSerie(serieId).then((ok) => {
            if (ok) {
                window.$('#billingSerieModal').modal('hide');
            }
        });
    }

    render() {
        return <div class="modal fade" id="billingSerieModal" tabindex="-1" role="dialog" aria-labelledby="billingSerieModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="billingSerieModalLabel">{i18next.t('billing-serie')}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>ID</label>
                            <input type="text" class="form-control" ref="id" defaultValue={this.serie != null ? this.serie.id : ''} readOnly={this.serie != null} />
                        </div>
                        <div class="form-group">
                            <label>{i18next.t('name')}</label>
                            <input type="text" class="form-control" ref="name" defaultValue={this.serie != null ? this.serie.name : ''} />
                        </div>
                        <div class="form-row">
                            <div class="col">
                                <div class="form-group">
                                    <label>{i18next.t('billing-type')}</label>
                                    <select class="form-control" ref="type" defaultValue={this.serie != null ? this.serie.billingType : 'S'}>
                                        <option value="S">{i18next.t('sales')}</option>
                                        <option value="P">{i18next.t('purchases')}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col">
                                <div class="form-group">
                                    <label>{i18next.t('year')}</label>
                                    <input type="number" class="form-control" min="1970" defaultValue={this.serie != null ? this.serie.year : new Date().getYear() + 1900} ref="year" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <p className="errorMessage" ref="errorMessage"></p>
                        {this.serie != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                        {this.serie == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                        {this.serie != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default BillingSerieModal;
