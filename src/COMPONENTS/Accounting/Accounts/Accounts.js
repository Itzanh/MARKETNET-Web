import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

class Accounts extends Component {
    constructor({ getAccounts, insertAccount, updateAccount, deleteAccount }) {
        super();

        this.getAccounts = getAccounts;
        this.insertAccount = insertAccount;
        this.updateAccount = updateAccount;
        this.deleteAccount = deleteAccount;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderAccounts();
    }

    renderAccounts() {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        this.getAccounts().then((accounts) => {
            ReactDOM.render(accounts.map((element, i) => {
                return <Account key={i}
                    account={element}
                    edit={this.edit}
                />
            }), this.refs.render);
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderAccountsModal'));
        ReactDOM.render(
            <AccountModal
                insertAccount={(account) => {
                    const promise = this.insertAccount(account);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderAccounts();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderAccountsModal'));
    }

    edit(account) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderAccountsModal'));
        ReactDOM.render(
            <AccountModal
                account={account}
                updateAccount={(account) => {
                    const promise = this.updateAccount(account);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderAccounts();
                        }
                    });
                    return promise;
                }}
                deleteAccount={(accountId) => {
                    const promise = this.deleteAccount(accountId);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderAccounts();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderAccountsModal'));
    }

    render() {
        return <div id="tabAccounts">
            <div id="renderAccountsModal"></div>
            <div className="menu">
                <h1>{i18next.t('accounts')}</h1>
                <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button>
            </div>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">{i18next.t('name')}</th>
                        <th scope="col">{i18next.t('credit')}</th>
                        <th scope="col">{i18next.t('debit')}</th>
                        <th scope="col">{i18next.t('balance')}</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class Account extends Component {
    constructor({ account, edit }) {
        super();

        this.account = account;
        this.edit = edit;
    }

    padLeadingZeros(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.account);
        }}>
            <th scope="row">{this.account.journal}.{this.padLeadingZeros(this.account.accountNumber, 6)}</th>
            <td>{this.account.name}</td>
            <td>{this.account.credit}</td>
            <td>{this.account.debit}</td>
            <td>{this.account.balance}</td>
        </tr>
    }
}

class AccountModal extends Component {
    constructor({ account, insertAccount, updateAccount, deleteAccount }) {
        super();

        this.account = account;
        this.insertAccount = insertAccount;
        this.updateAccount = updateAccount;
        this.deleteAccount = deleteAccount;

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }
    componentDidMount() {
        window.$('#accountModal').modal({ show: true });
    }

    getAccountFromForm() {
        const account = {};
        account.journal = parseInt(this.refs.journal.value);
        account.name = this.refs.name.value;
        account.accountNumber = parseInt(this.refs.accountNumber.value);
        return account;
    }

    add() {
        const account = this.getAccountFromForm();

        this.insertAccount(account).then((ok) => {
            if (ok) {
                window.$('#accountModal').modal('hide');
            }
        });
    }

    update() {
        const account = this.getAccountFromForm();
        account.id = this.account.id;

        this.updateAccount(account).then((ok) => {
            if (ok) {
                window.$('#accountModal').modal('hide');
            }
        });
    }

    delete() {
        this.deleteAccount(this.account.id).then((ok) => {
            if (ok) {
                window.$('#accountModal').modal('hide');
            }
        });
    }

    render() {
        return <div class="modal fade" id="accountModal" tabindex="-1" role="dialog" aria-labelledby="accountModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="accountModalLabel">{i18next.t('account')}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>{i18next.t('journal')}</label>
                            <input type="number" class="form-control" defaultValue={this.account != undefined ? this.account.journal : '0'} ref="journal" defa />
                        </div>
                        <div class="form-group">
                            <label>{i18next.t('account-number')}</label>
                            <input type="number" class="form-control" ref="accountNumber"
                                defaultValue={this.account != undefined ? this.account.accountNumber : '0'} />
                        </div>
                        <div class="form-group">
                            <label>{i18next.t('name')}</label>
                            <input type="text" class="form-control" ref="name" defaultValue={this.account != undefined ? this.account.name : ''} />
                        </div>
                    </div>
                    <div class="modal-footer">
                        {this.account != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                        {this.account == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                        {this.account != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default Accounts;
