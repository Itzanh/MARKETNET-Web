import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import TableContextMenu from "../../VisualComponents/TableContextMenu";
import SearchField from "../../SearchField";

class Accounts extends Component {
    constructor({ getAccounts, searchAccounts, insertAccount, updateAccount, deleteAccount }) {
        super();

        this.getAccounts = getAccounts;
        this.searchAccounts = searchAccounts;
        this.insertAccount = insertAccount;
        this.updateAccount = updateAccount;
        this.deleteAccount = deleteAccount;

        this.advancedSearchListener = null;
        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.search = this.search.bind(this);
        this.advanced = this.advanced.bind(this);
    }

    componentDidMount() {
        this.getAccounts().then((accounts) => {
            this.renderAccounts(accounts);
        });
    }

    async search(searchText) {
        const search = {
            search: searchText
        };

        if (this.advancedSearchListener != null) {
            const s = this.advancedSearchListener();
            search.journal = s.journal;
        }
        const accounts = await this.searchAccounts(search);
        this.renderAccounts(accounts);
        this.list = accounts;
    }

    renderAccounts(accounts) {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(accounts.map((element, i) => {
            return <Account key={i}
                account={element}
                edit={this.edit}
            />
        }), this.refs.render);
        this.list = accounts;
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

    advanced(advanced) {
        if (!advanced) {
            ReactDOM.unmountComponentAtNode(this.refs.advancedSearch);
            this.advancedSearchListener = null;
        } else {
            ReactDOM.render(
                <AccountAdvancedSearch
                    subscribe={(listener) => {
                        this.advancedSearchListener = listener;
                    }}
                />, this.refs.advancedSearch);
        }
    }

    render() {
        return <div id="tabAccounts" className="formRowRoot">
            <div id="renderAccountsModal"></div>
            <div className="menu">
                <h1>{i18next.t('accounts')}</h1>
                <div class="form-row">
                    <div class="col">
                        <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button>
                    </div>
                    <div class="col">
                        <SearchField handleSearch={this.search} hasAdvancedSearch={true} handleAdvanced={this.advanced} />
                        <div ref="advancedSearch" className="advancedSearch"></div>
                    </div>
                </div>
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
                        this.renderAccounts(this.list);
                    }}>
                        <th scope="col">#</th>
                        <th field="name" scope="col">{i18next.t('name')}</th>
                        <th field="credit" scope="col">{i18next.t('credit')}</th>
                        <th field="debit" scope="col">{i18next.t('debit')}</th>
                        <th field="balance" scope="col">{i18next.t('balance')}</th>
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
                                this.renderAccounts(list);
                            }}
                            pos={parseInt(e.target.parentNode.getAttribute("pos"))}
                            field={e.target.getAttribute("field")}
                            value={e.target.innerText}
                            fields={["journal", "accountNumber", "name", "credit", "debit", "balance"]}
                        />, document.getElementById("contextMenu"));
                    } else {
                        ReactDOM.unmountComponentAtNode(document.getElementById("contextMenu"));
                    }
                }}></tbody>
            </table>
        </div>
    }
}

class Account extends Component {
    constructor({ account, edit, pos }) {
        super();

        this.account = account;
        this.edit = edit;
        this.pos = pos;
    }

    padLeadingZeros(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.account);
        }} pos={this.pos}>
            <th scope="row">{this.account.journal}.{this.padLeadingZeros(this.account.accountNumber, 6)}</th>
            <td field="name">{this.account.name}</td>
            <td field="credit">{this.account.credit}</td>
            <td field="debit">{this.account.debit}</td>
            <td field="balance">{this.account.balance}</td>
        </tr>
    }
}

class AccountAdvancedSearch extends Component {
    constructor({ subscribe }) {
        super();

        this.getFormData = this.getFormData.bind(this);

        subscribe(this.getFormData);
    }

    getFormData() {
        const search = {};
        search.journal = parseInt(this.refs.journal.value);
        return search;
    }

    render() {
        return <div class="form-row">
            <div class="col pl-50">
                <label>{i18next.t('journal')}:</label>
                <br />
                <input type="number" class="form-control" ref="journal" min="0" defaultValue="0" />
            </div>
        </div>
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
