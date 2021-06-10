import React, { Component } from 'react';


class CurrenciesModal extends Component {
    constructor({ currency, addCurrency, updateCurrency, deleteCurrency }) {
        super();

        this.currency = currency;
        this.addCurrency = addCurrency;
        this.updateCurrency = updateCurrency;
        this.deleteCurrency = deleteCurrency;

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        window.$('#currencyModal').modal({ show: true });
    }

    getCurrencyFromForm() {
        const currency = {};
        currency.name = this.refs.name.value;
        currency.sign = this.refs.sign.value;
        currency.isoCode = this.refs.isoCode.value;
        currency.isoNum = parseInt(this.refs.isoNum.value);
        currency.change = parseFloat(this.refs.change.value);
        return currency;
    }

    isValid(currency) {
        this.refs.errorMessage.innerText = "";
        if (currency.name.length === 0) {
            this.refs.errorMessage.innerText = "The name can't be empty.";
            return false;
        }
        if (currency.name.length > 75) {
            this.refs.errorMessage.innerText = "The name can't be longer than 75 characters.";
            return false;
        }
        if (currency.sign.length > 3) {
            this.refs.errorMessage.innerText = "The sign can't be longer than 3 characters.";
            return false;
        }
        if (currency.isoCode.length > 3) {
            this.refs.errorMessage.innerText = "The ISO code can't be longer than 3 characters.";
            return false;
        }
        if (currency.isoNum <= 0) {
            this.refs.errorMessage.innerText = "The numeric ISO code can't be 0.";
            return false;
        }
        if (currency.change === 0) {
            this.refs.errorMessage.innerText = "The currency exchange can't be 0.";
            return false;
        }
        return true;
    }

    add() {
        const currency = this.getCurrencyFromForm();
        if (!this.isValid(currency)) {
            return;
        }

        this.addCurrency(currency).then((ok) => {
            if (ok) {
                window.$('#currencyModal').modal('hide');
            }
        });
    }

    update() {
        const currency = this.getCurrencyFromForm();
        if (!this.isValid(currency)) {
            return;
        }
        currency.id = this.currency.id;

        this.updateCurrency(currency).then((ok) => {
            if (ok) {
                window.$('#currencyModal').modal('hide');
            }
        });
    }

    delete() {
        this.deleteCurrency(this.currency.id).then((ok) => {
            if (ok) {
                window.$('#currencyModal').modal('hide');
            }
        });
    }


    render() {
        return <div class="modal fade" id="currencyModal" tabindex="-1" role="dialog" aria-labelledby="currencyModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="currencyModalLabel">Currency</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" class="form-control" defaultValue={this.currency != null ? this.currency.name : ''} ref="name" />
                        </div>
                        <div class="form-row">
                            <div class="col">
                                <label>Sign</label>
                                <input type="text" class="form-control" defaultValue={this.currency != null ? this.currency.sign : ''} ref="sign" />
                            </div>
                            <div class="col">
                                <label>ISO Code</label>
                                <input type="text" class="form-control" defaultValue={this.currency != null ? this.currency.isoCode : ''} ref="isoCode" />
                            </div>
                            <div class="col">
                                <label>Numeric ISO Code</label>
                                <input type="number" class="form-control" min="0" defaultValue={this.currency != null ? this.currency.isoNum : '0'} ref="isoNum" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Change</label>
                            <input type="number" class="form-control" min="0" defaultValue={this.currency != null ? this.currency.change : '0'} ref="change" />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <p className="errorMessage" ref="errorMessage"></p>
                        {this.currency != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>Delete</button> : null}
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        {this.currency == null ? <button type="button" class="btn btn-primary" onClick={this.add}>Add</button> : null}
                        {this.currency != null ? <button type="button" class="btn btn-success" onClick={this.update}>Update</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default CurrenciesModal;
