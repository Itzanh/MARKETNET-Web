import { Component } from "react";
import i18next from "i18next";
import { DataGrid } from '@material-ui/data-grid';
import ReactDOM from 'react-dom';

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



const accountType = {
    "S": "sales",
    "P": "purchases"
};

class ProductAccounts extends Component {
    constructor({ productId, getProductAccounts, insertProductAccount, updateProductAccount, deleteProductAccount, locateAccountForSales,
        locateAccountForPurchases }) {
        super();

        this.productId = productId;
        this.getProductAccounts = getProductAccounts;
        this.insertProductAccount = insertProductAccount;
        this.updateProductAccount = updateProductAccount;
        this.deleteProductAccount = deleteProductAccount;
        this.locateAccountForSales = locateAccountForSales;
        this.locateAccountForPurchases = locateAccountForPurchases;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderAccounts();
    }

    renderAccounts() {
        this.getProductAccounts(this.productId).then((list) => {
            this.list = list;
            this.forceUpdate();
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(<ProductAccountModel
            productId={this.productId}
            insertProductAccount={(productAccount) => {
                return new Promise((resolve) => {
                    this.insertProductAccount(productAccount).then((ok) => {
                        if (ok) {
                            this.renderAccounts();
                        }
                        resolve(ok);
                    });
                });
            }}
            locateAccountForSales={this.locateAccountForSales}
            locateAccountForPurchases={this.locateAccountForPurchases}
        />, this.refs.render);
    }

    edit(account) {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(<ProductAccountModel
            productId={this.productId}
            account={account}
            updateProductAccount={(productAccount) => {
                return new Promise((resolve) => {
                    this.updateProductAccount(productAccount).then((ok) => {
                        if (ok) {
                            this.renderAccounts();
                        }
                        resolve(ok);
                    });
                });
            }}
            deleteProductAccount={(productAccount) => {
                return new Promise((resolve) => {
                    this.deleteProductAccount(productAccount).then((ok) => {
                        if (ok) {
                            this.renderAccounts();
                        }
                        resolve(ok);
                    });
                });
            }}
            locateAccountForSales={this.locateAccountForSales}
            locateAccountForPurchases={this.locateAccountForPurchases}
        />, this.refs.render);
    }

    render() {
        return <div>
            <div ref="render"></div>
            <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add')}</button>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'journal', headerName: i18next.t('journal'), width: 150 },
                    {
                        field: 'accountNumber', headerName: i18next.t('account-number'), width: 200, valueGetter: (params) => {
                            return params.row.account.accountNumber;
                        }
                    },
                    {
                        field: 'accountName', headerName: i18next.t('name'), flex: 1, valueGetter: (params) => {
                            return params.row.account.name;
                        }
                    },
                    {
                        field: 'type', headerName: i18next.t('type'), width: 250, valueGetter: (params) => {
                            return i18next.t(accountType[params.row.type])
                        }
                    },
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

class ProductAccountModel extends Component {
    constructor({ productId, account, insertProductAccount, updateProductAccount, deleteProductAccount, locateAccountForSales, locateAccountForPurchases }) {
        super();

        this.productId = productId;
        this.account = account;
        this.insertProductAccount = insertProductAccount;
        this.updateProductAccount = updateProductAccount;
        this.deleteProductAccount = deleteProductAccount;
        this.locateAccountForSales = locateAccountForSales;
        this.locateAccountForPurchases = locateAccountForPurchases;

        this.list = [];
        this.open = true;

        this.handleClose = this.handleClose.bind(this);
        this.renderAccounts = this.renderAccounts.bind(this);
        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        this.renderAccounts();
    }

    async renderAccounts() {
        var accounts;

        if (this.refs.type == null || this.refs.type.value == "S") {
            accounts = await this.locateAccountForSales();
        } else if (this.refs.type.value == "P") {
            accounts = await this.locateAccountForPurchases();
        }

        const options = accounts.map((element, i) => {
            return <option key={i} value={element.id}>{element.name}</option>
        });
        ReactDOM.render(options, this.refs.accounts);
    }

    getProductAccountFromForm() {
        return {
            productId: this.productId,
            type: this.refs.type.value,
            accountId: parseInt(this.refs.accounts.value)
        };
    }

    add() {
        const produtAccount = this.getProductAccountFromForm();

        this.insertProductAccount(produtAccount).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    update() {
        const produtAccount = this.getProductAccountFromForm();
        produtAccount.id = this.account.id;

        this.updateProductAccount(produtAccount).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    delete() {
        this.deleteProductAccount(this.account.id).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
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

    DialogTitleProduct = withStyles(this.styles)((props) => {
        const { children, classes, onClose, ...other } = props;
        return (
            <DialogTitle disableTypography className={classes.root} {...other}>
                <Typography variant="h6">{children}</Typography>
                <IconButton aria-label="close" className={classes.closeButton} onClick={() => {
                    ReactDOM.unmountComponentAtNode(this.refs.render);
                }}>
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
        return (<div>
            <div ref="render"></div>
            <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'md'}
                PaperComponent={this.PaperComponent}>
                <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    {i18next.t('account')}
                </this.DialogTitle>
                <DialogContent>
                    <label>{i18next.t('type')}</label>
                    <select class="form-control" ref="type" onChange={this.renderAccounts}>
                        <option value="S">{i18next.t('sales')}</option>
                        <option value="P">{i18next.t('purchases')}</option>
                    </select>
                    <label>{i18next.t('account')}</label>
                    <select class="form-control" ref="accounts">
                    </select>
                </DialogContent>
                <DialogActions>
                    {this.account != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                    <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                    {this.account == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                    {this.account != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
                </DialogActions>
            </Dialog>
        </div>);
    }
}



export default ProductAccounts;
