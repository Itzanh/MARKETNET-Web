import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';

class ApiKeys extends Component {
    constructor({ getApiKeys, insertApiKey, deleteApiKey, offApiKey }) {
        super();

        this.getApiKeys = getApiKeys;
        this.insertApiKey = insertApiKey;
        this.deleteApiKey = deleteApiKey;
        this.offApiKey = offApiKey;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.getApiKeys().then((rows) => {
            this.list = rows;
            this.forceUpdate();
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById("renderModal"));
        ReactDOM.render(<ApiKey
            insertApiKey={(key) => {
                return new Promise((resolve) => {
                    this.insertApiKey(key).then((ok) => {
                        resolve(ok);
                        if (ok) {
                            this.getApiKeys().then((rows) => {
                                this.list = rows;
                                this.forceUpdate();
                            });
                        }
                    });
                });
            }}
        />, document.getElementById("renderModal"));
    }

    edit(apiKey) {
        ReactDOM.unmountComponentAtNode(document.getElementById("renderModal"));
        ReactDOM.render(<ApiKey
            apiKey={apiKey}
            deleteApiKey={(keyId) => {
                return new Promise((resolve) => {
                    return this.deleteApiKey(keyId).then((ok) => {
                        resolve(ok);
                        if (ok) {
                            this.getApiKeys().then((rows) => {
                                this.list = rows;
                                this.forceUpdate();
                            });
                        }
                    });
                });
            }}
            offApiKey={(keyId) => {
                return new Promise((resolve) => {
                    this.offApiKey(keyId).then((ok) => {
                        resolve(ok);
                        if (ok) {
                            this.getApiKeys().then((rows) => {
                                this.list = rows;
                                this.forceUpdate();
                            });
                        }
                    });
                });
            }}
        />, document.getElementById("renderModal"));
    }

    render() {
        return <div id="tabApiKeys" className="formRowRoot">
            <div id="renderModal"></div>
            <h1>{i18next.t('api-keys')}</h1>
            <button type="button" class="btn btn-primary ml-2" onClick={this.add}>{i18next.t('add')}</button>

            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'name', headerName: i18next.t('name'), flex: 1 },
                    {
                        field: 'dateCreated', headerName: i18next.t('date'), width: 160, valueGetter: (params) => {
                            return window.dateFormat(params.row.dateCreated)
                        }
                    },
                    { field: 'userCreated', headerName: i18next.t('user-created'), width: 220 },
                    { field: 'userCreatedName', headerName: i18next.t('user-created'), width: 220 },
                    { field: 'off', headerName: i18next.t('off-'), width: 165, type: 'boolean' },
                    { field: 'user', headerName: i18next.t('user'), width: 140 },
                    { field: 'userName', headerName: i18next.t('username'), width: 250 },
                    { field: 'token', headerName: 'Token', width: 320 },
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

class ApiKey extends Component {
    constructor({ apiKey, insertApiKey, deleteApiKey, offApiKey }) {
        super();

        this.key = apiKey;
        this.insertApiKey = insertApiKey;
        this.deleteApiKey = deleteApiKey;
        this.offApiKey = offApiKey;

        this.open = true;

        this.handleClose = this.handleClose.bind(this);
        this.add = this.add.bind(this);
        this.delete = this.delete.bind(this);
        this.off = this.off.bind(this);
    }

    PaperComponent(props) {
        return (
            <Draggable handle="#draggable-dialog-title" cancel={'[class*="DialogContent-root"]'}>
                <Paper {...props} />
            </Draggable>
        );
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
            <MuiDialogTitle disableTypography className={classes.root} {...other}>
                <Typography variant="h6">{children}</Typography>
                {onClose ? (
                    <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                ) : null}
            </MuiDialogTitle>
        );
    });

    DialogContent = withStyles((theme) => ({
        root: {
            padding: theme.spacing(2),
        },
    }))(MuiDialogContent);

    DialogActions = withStyles((theme) => ({
        root: {
            margin: 0,
            padding: theme.spacing(1),
        },
    }))(MuiDialogActions);

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    add() {
        this.insertApiKey({
            name: this.refs.name.value,
            user: parseInt(this.refs.user.value),
            auth: this.refs.auth.value
        }).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    delete() {
        this.deleteApiKey(this.key.id).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    off() {
        this.offApiKey(this.key.id).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    render() {
        return (
            <div>
                <Dialog onClose={this.handleClose} aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true}
                    PaperComponent={this.PaperComponent}>
                    <this.DialogTitle onClose={this.handleClose} style={{ cursor: 'move' }} id="draggable-dialog-title">
                        {i18next.t('api-keys')}
                    </this.DialogTitle>
                    <this.DialogContent>
                        <label>{i18next.t('name')}</label>
                        <input type="text" class="form-control" ref="name" defaultValue={this.key != null ? this.key.name : ''} readOnly={this.key != null} />

                        <label>{i18next.t('user')}</label>
                        <input type="number" class="form-control" ref="user" defaultValue={this.key != null ? this.key.user : '0'} readOnly={this.key != null} />

                        <label>Authentication method</label>
                        <select class="form-control" ref="auth" disabled={this.key != null} defaultValue={this.key != null ? this.key.auth : 'P'}>
                            <option value="P">Parameter</option>
                            <option value="H">Header</option>
                            <option value="B">Basic Auth</option>
                            <option value="R">Bearer token</option>
                        </select>

                        {this.key == null ? null : <div>
                            {this.key.auth == "P" || this.key.auth == "H" || this.key.auth == "R" ? <div>
                                <label>Token</label>
                                <input type="text" class="form-control" defaultValue={this.key != null ? this.key.token : ''} readOnly={true} />
                            </div> : null}
                            {this.key.auth == "B" ? <div>
                                <label>User</label>
                                <input type="text" class="form-control" defaultValue={this.key != null ? this.key.basicAuthUser : ''} readOnly={true} />
                                <label>Password</label>
                                <input type="text" class="form-control" defaultValue={this.key != null ? this.key.basicAuthPassword : ''} readOnly={true} />
                            </div> : null}
                        </div>}

                    </this.DialogContent>
                    <this.DialogActions>
                        {this.key != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                        {this.key != null ? <button type="button" class="btn btn-warning" onClick={this.off}>{i18next.t('off')}</button> : null}
                        {this.key == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                        <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                    </this.DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default ApiKeys;
