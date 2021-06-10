import React, { Component } from 'react';


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
        return paymentMethod;
    }

    isValid(paymentMethod) {
        this.refs.errorMessage.innerText = "";
        if (paymentMethod.name.length === 0) {
            this.refs.errorMessage.innerText = "The name can't be empty.";
            return false;
        }
        if (paymentMethod.name.length > 100) {
            this.refs.errorMessage.innerText = "The name can't be longer than 100 characters.";
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
                        <h5 class="modal-title" id="paymentMethodLabel">Payment Method</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-row">
                            <div class="col">
                                <label>Name</label>
                                <input type="text" class="form-control" ref="name" defaultValue={this.paymentMethod != null ? this.paymentMethod.name : ''} />
                            </div>
                            <div class="col">
                                <input type="checkbox" defaultChecked={this.paymentMethod && this.paymentMethod.paidInAdvance} ref="paidInAdvance" />
                                <label>Paid in advance</label>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <p className="errorMessage" ref="errorMessage"></p>
                        {this.paymentMethod != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>Delete</button> : null}
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        {this.paymentMethod == null ? <button type="button" class="btn btn-primary" onClick={this.add}>Add</button> : null}
                        {this.paymentMethod != null ? <button type="button" class="btn btn-success" onClick={this.update}>Update</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default PaymentMethodModal;
