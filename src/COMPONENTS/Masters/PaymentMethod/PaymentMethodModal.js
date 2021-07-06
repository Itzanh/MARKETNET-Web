import React, { Component } from 'react';
import i18next from 'i18next';


class PaymentMethodModal extends Component {
    constructor({ paymentMethod, addPaymentMehod, updatePaymentMethod, deletePaymentMethod }) {
        super();

        this.paymentMethod = paymentMethod;
        this.addPaymentMehod = addPaymentMehod;
        this.updatePaymentMethod = updatePaymentMethod;
        this.deletePaymentMethod = deletePaymentMethod;

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        window.$('#paymentMethodModal').modal({ show: true });
    }

    getPaymentMethodFromForm() {
        const paymentMethod = {};
        paymentMethod.name = this.refs.name.value;
        paymentMethod.paidInAdvance = this.refs.paidInAdvance.checked;
        paymentMethod.prestashopModuleName = this.refs.prestashopModuleName.value;
        return paymentMethod;
    }

    isValid(paymentMethod) {
        this.refs.errorMessage.innerText = "";
        if (paymentMethod.name.length === 0) {
            this.refs.errorMessage.innerText = i18next.t('name-0');
            return false;
        }
        if (paymentMethod.name.length > 100) {
            this.refs.errorMessage.innerText = i18next.t('name-100');
            return false;
        }
        return true;
    }

    add() {
        const paymentMethod = this.getPaymentMethodFromForm();
        if (!this.isValid(paymentMethod)) {
            return;
        }

        this.addPaymentMehod(paymentMethod).then((ok) => {
            if (ok) {
                window.$('#paymentMethodModal').modal('hide');
            }
        });
    }

    update() {
        const paymentMethod = this.getPaymentMethodFromForm();
        if (!this.isValid(paymentMethod)) {
            return;
        }
        paymentMethod.id = this.paymentMethod.id;

        this.updatePaymentMethod(paymentMethod).then((ok) => {
            if (ok) {
                window.$('#paymentMethodModal').modal('hide');
            }
        });
    }

    delete() {
        this.deletePaymentMethod(this.paymentMethod.id).then((ok) => {
            if (ok) {
                window.$('#paymentMethodModal').modal('hide');
            }
        });
    }

    render() {
        return <div class="modal fade" id="paymentMethodModal" tabindex="-1" role="dialog" aria-labelledby="paymentMethodLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="paymentMethodLabel">{i18next.t('payment-method')}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <label>{i18next.t('name')}</label>
                        <input type="text" class="form-control" ref="name" defaultValue={this.paymentMethod != null ? this.paymentMethod.name : ''} />
                        <input type="checkbox" defaultChecked={this.paymentMethod && this.paymentMethod.paidInAdvance} ref="paidInAdvance" />
                        <label>{i18next.t('paid-in-advance')}</label>
                        <br />
                        <label>{i18next.t('prestashop-module-name')}</label>
                        <input type="text" class="form-control" ref="prestashopModuleName"
                            defaultValue={this.paymentMethod != null ? this.paymentMethod.prestashopModuleName : ''} />
                    </div>
                    <div class="modal-footer">
                        <p className="errorMessage" ref="errorMessage"></p>
                        {this.paymentMethod != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                        {this.paymentMethod == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                        {this.paymentMethod != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default PaymentMethodModal;
