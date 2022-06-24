/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import React, { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';
import SearchField from "../../SearchField";

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';

import { TextField } from "@material-ui/core";



class Accounts extends Component {
    constructor({ getAccounts, searchAccounts, insertAccount, updateAccount, deleteAccount, getJournals }) {
        super();

        this.getAccounts = getAccounts;
        this.searchAccounts = searchAccounts;
        this.insertAccount = insertAccount;
        this.updateAccount = updateAccount;
        this.deleteAccount = deleteAccount;
        this.getJournals = getJournals;

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
        this.list = accounts;
        this.forceUpdate();
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderAccountsModal'));
        ReactDOM.render(
            <AccountModal
                insertAccount={(account) => {
                    const promise = this.insertAccount(account);
                    promise.then((ok) => {
                        if (ok) {
                            this.getAccounts().then((accounts) => {
                                this.renderAccounts(accounts);
                            });
                        }
                    });
                    return promise;
                }}
                getJournals={this.getJournals}
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
                            this.getAccounts().then((accounts) => {
                                this.renderAccounts(accounts);
                            });
                        }
                    });
                    return promise;
                }}
                deleteAccount={(accountId) => {
                    const promise = this.deleteAccount(accountId);
                    promise.then((ok) => {
                        if (ok) {
                            this.getAccounts().then((accounts) => {
                                this.renderAccounts(accounts);
                            });
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
                    getJournals={this.getJournals}
                />, this.refs.advancedSearch);
        }
    }

    padLeadingZeros(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }

    render() {
        return <div id="tabAccounts" className="formRowRoot">
            <div id="renderAccountsModal"></div>
            <h4 className="ml-2">{i18next.t('accounts')}</h4>
            <div class="form-row">
                <div class="col">
                    <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add')}</button>
                </div>
                <div class="col">
                    <SearchField handleSearch={this.search} hasAdvancedSearch={true} handleAdvanced={this.advanced} />
                    <div ref="advancedSearch" className="advancedSearch"></div>
                </div>
            </div>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    {
                        field: '', headerName: '#', width: 200, valueGetter: (params) => {
                            return params.row.accountName;
                        }
                    },
                    { field: 'name', headerName: i18next.t('name'), flex: 1 },
                    { field: 'credit', headerName: i18next.t('credit'), width: 200 },
                    { field: 'debit', headerName: i18next.t('debit'), width: 200 },
                    { field: 'balance', headerName: i18next.t('balance'), width: 200 }
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}



class AccountAdvancedSearch extends Component {
    constructor({ subscribe, getJournals }) {
        super();

        this.getJournals = getJournals;

        this.getFormData = this.getFormData.bind(this);

        subscribe(this.getFormData);
    }

    componentDidMount() {
        this.renderJournals();
    }

    renderJournals() {
        this.getJournals().then((journals) => {
            ReactDOM.unmountComponentAtNode(this.refs.journal);
            ReactDOM.render(journals.map((element, i) => {
                return <option value={element.id} key={i}>{element.id + " - " + element.name}</option>
            }), this.refs.journal);
        });
    }

    getFormData() {
        const search = {};
        search.journal = parseInt(this.refs.journal.value);
        return search;
    }

    render() {
        return <div class="form-row">
            <div class="col pl-50">
                <label>{i18next.t('journal')}</label>
                <select id="journal" class="form-control" ref="journal">

                </select>
            </div>
        </div>
    }
};



class AccountModal extends Component {
    constructor({ account, insertAccount, updateAccount, deleteAccount, getJournals }) {
        super();

        this.account = account;
        this.insertAccount = insertAccount;
        this.updateAccount = updateAccount;
        this.deleteAccount = deleteAccount;
        this.getJournals = getJournals;

        this.open = true;

        this.journal = React.createRef();
        this.accountNumber = React.createRef();
        this.name = React.createRef();

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.renderJournals();
        }, 200);
    }

    renderJournals() {
        if (this.account == null) {
            this.getJournals().then((journals) => {
                ReactDOM.unmountComponentAtNode(this.refs.journal);
                ReactDOM.render(journals.map((element, i) => {
                    return <option value={element.id} key={i}>{element.id + " - " + element.name}</option>
                }), this.refs.journal);
            });
        } else {
            ReactDOM.unmountComponentAtNode(this.refs.journal);
            ReactDOM.render(<option value={this.account.journalId} key="0">
                {this.account.journalId + " - " + this.account.journal.name}</option>, this.refs.journal);
            this.refs.journal.disabled = true;
        }
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    getAccountFromForm() {
        const account = {};
        account.journalId = parseInt(this.refs.journal.value);
        account.name = this.name.current.value;
        account.accountNumber = parseInt(this.accountNumber.current.value);
        return account;
    }

    add() {
        const account = this.getAccountFromForm();

        this.insertAccount(account).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    update() {
        const account = this.getAccountFromForm();
        account.id = this.account.id;

        this.updateAccount(account).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    delete() {
        this.deleteAccount(this.account.id).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    styles = (theme) => ({
        root: {
            margin: 0,
            padding: theme.spacing(2),
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
    });

    DialogTitle = withStyles(this.styles)((props) => {
        const { children, classes, onClose, ...other } = props;
        return (
            <DialogTitle disableTypography className={classes.root} {...other}>
                <Typography variant="h6">{children}</Typography>
                <IconButton aria-label="close" className={classes.closeButton} onClick={this.handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
        );
    });

    PaperComponent(props) {
        return (
            <Draggable handle="#draggable-dialog-title" cancel={'[class*="DialogContent-root"]'}>
                <Paper {...props} />
            </Draggable>
        );
    }

    render() {
        return <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'sm'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('account')}
            </this.DialogTitle>
            <DialogContent>
                <div class="form-group">
                    <label>{i18next.t('journal')}</label>
                    <select id="journal" class="form-control" ref="journal">

                    </select>
                </div>
                <div class="form-group">
                    <TextField label={i18next.t('account-number')} variant="outlined" fullWidth size="small" inputRef={this.accountNumber} type="number"
                        defaultValue={this.account != undefined ? this.account.accountNumber : '0'} InputProps={{ inputProps: { min: 0 } }} />
                </div>
                <div class="form-group">
                    <TextField label={i18next.t('name')} variant="outlined" fullWidth size="small" inputRef={this.name}
                        defaultValue={this.account != undefined ? this.account.name : ''} inputProps={{ maxLength: 150 }} />
                </div>
            </DialogContent>
            <DialogActions>
                {this.account != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                {this.account == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                {this.account != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
            </DialogActions>
        </Dialog>
    }
};



export default Accounts;
