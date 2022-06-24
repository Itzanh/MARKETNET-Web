/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

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

import { TextField, FormControl, NativeSelect } from "@material-ui/core";
import { InputLabel } from "@mui/material";



class ApiKeys extends Component {
    constructor({ getApiKeys, insertApiKey, updateApiKey, deleteApiKey, offApiKey, getEmptyApiKeyPermissionsObject, getUsers }) {
        super();

        this.getApiKeys = getApiKeys;
        this.insertApiKey = insertApiKey;
        this.updateApiKey = updateApiKey;
        this.deleteApiKey = deleteApiKey;
        this.offApiKey = offApiKey;
        this.getEmptyApiKeyPermissionsObject = getEmptyApiKeyPermissionsObject;
        this.getUsers = getUsers;

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
            getEmptyApiKeyPermissionsObject={this.getEmptyApiKeyPermissionsObject}
            getUsers={this.getUsers}
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
            updateApiKey={(key) => {
                return new Promise((resolve) => {
                    this.updateApiKey(key).then((ok) => {
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
            <h4 className="ml-2">{i18next.t('api-keys')}</h4>
            <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add')}</button>

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
                    { field: 'userCreatedId', headerName: i18next.t('user-created'), width: 220 },
                    {
                        field: 'userCreatedName', headerName: i18next.t('user-created'), width: 220, valueGetter: (params) => {
                            return params.row.userCreated.username;
                        }
                    },
                    { field: 'off', headerName: i18next.t('off-'), width: 165, type: 'boolean' },
                    { field: 'userId', headerName: i18next.t('user'), width: 140 },
                    {
                        field: 'userName', headerName: i18next.t('username'), width: 250, valueGetter: (params) => {
                            return params.row.user.username;
                        }
                    },
                    {
                        field: 'token', headerName: 'Token', width: 320, valueGetter: (params) => {
                            if (params.row.auth == "P" || params.row.auth == "H" || params.row.auth == "R") {
                                return params.row.token;
                            } else {
                                return params.row.basicAuthUser + ":" + params.row.basicAuthPassword;
                            }
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

class ApiKey extends Component {
    constructor({ apiKey, insertApiKey, updateApiKey, deleteApiKey, offApiKey, getEmptyApiKeyPermissionsObject, getUsers }) {
        super();

        this.key = apiKey;
        this.insertApiKey = insertApiKey;
        this.updateApiKey = updateApiKey;
        this.deleteApiKey = deleteApiKey;
        this.offApiKey = offApiKey;
        this.getEmptyApiKeyPermissionsObject = getEmptyApiKeyPermissionsObject;
        this.getUsers = getUsers;

        this.permissionsDict = {};
        this.open = true;

        this.handleClose = this.handleClose.bind(this);
        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.off = this.off.bind(this);
        this.permissions = this.permissions.bind(this);
    }

    componentDidMount() {
        if (this.key == null) {
            this.getEmptyApiKeyPermissionsObject().then((emptyObject) => {
                this.permissionsDict = emptyObject;
                this.renderUsers();
            });
        } else {
            this.permissionsDict = this.key.permissions;
            this.renderUsers();
        }
    }

    renderUsers() {
        setTimeout(() => {
            if (this.key == null) {
                this.getUsers().then((users) => {
                    ReactDOM.unmountComponentAtNode(document.getElementById("renderUsers"));
                    ReactDOM.render(users.map((element, i) => {
                        return <option value={element.id} key={i}>{element.username}</option>;
                    }), document.getElementById("renderUsers"));
                });
            } else {
                ReactDOM.unmountComponentAtNode(document.getElementById("renderUsers"));
                ReactDOM.render(<option value={this.key.userId}>{this.key.user.username}</option>, document.getElementById("renderUsers"));
                document.getElementById("renderUsers").disabled = true;
            }
        }, 200);
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
            userId: parseInt(document.getElementById("renderUsers").value),
            auth: this.refs.auth.value,
            permissions: this.permissionsDict
        }).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    update() {
        if (this.key == null) {
            return;
        }

        this.updateApiKey({
            id: this.key.id,
            name: this.refs.name.value,
            permissions: this.permissionsDict
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

    permissions() {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(<ApiKeyPermissions
            permissions={this.permissionsDict}
        />, this.refs.renderModal);
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
                        <div ref="renderModal"></div>
                        <label>{i18next.t('name')}</label>
                        <input type="text" class="form-control" ref="name" defaultValue={this.key != null ? this.key.name : ''}
                            inputProps={{ maxLength: 140 }} />

                        <FormControl fullWidth>
                            <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('user')}</InputLabel>
                            <NativeSelect
                                style={{ 'marginTop': '0' }}
                                id="renderUsers"
                            >

                            </NativeSelect>
                        </FormControl>

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
                        <button type="button" class="btn btn-success" onClick={this.permissions}>{i18next.t('permissions')}</button>
                        {this.key != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                        {this.key != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
                        {this.key != null ? <button type="button" class="btn btn-warning" onClick={this.off}>{i18next.t('off')}</button> : null}
                        {this.key == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                        <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                    </this.DialogActions>
                </Dialog>
            </div>
        );
    }
}

class ApiKeyPermissions extends Component {
    constructor({ permissions }) {
        super();

        this.permissions = permissions;

        this.open = true;

        this.handleClose = this.handleClose.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.selectNone = this.selectNone.bind(this);
        this.componentPermissions = this.componentPermissions.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            ReactDOM.render(<this.componentPermissions />, this.refs.render);
        }, 50);
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

    async selectAll() {
        await Object.keys(this.permissions).forEach((element) => {
            Object.keys(this.permissions[element]).forEach((subElement) => {
                this.permissions[element][subElement] = true;
            });
        });

        await ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(<this.componentPermissions />, this.refs.render);
    }

    async selectNone() {
        await Object.keys(this.permissions).forEach((element) => {
            Object.keys(this.permissions[element]).forEach((subElement) => {
                this.permissions[element][subElement] = false;
            });
        });

        await ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(<this.componentPermissions />, this.refs.render);
    }

    render() {
        return (
            <div>
                <Dialog onClose={this.handleClose} aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'lg'}
                    PaperComponent={this.PaperComponent}>
                    <this.DialogTitle onClose={this.handleClose} style={{ cursor: 'move' }} id="draggable-dialog-title">
                        {i18next.t('api-key-permissions')}
                    </this.DialogTitle>
                    <this.DialogContent>
                        <div ref="render"></div>
                    </this.DialogContent>
                    <this.DialogActions>
                        <button type="button" class="btn btn-primary" onClick={this.selectAll}>{i18next.t('select-all')}</button>
                        <button type="button" class="btn btn-primary" onClick={this.selectNone}>{i18next.t('select-none')}</button>
                        <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                    </this.DialogActions>
                </Dialog>
            </div>
        );
    }

    componentPermissions() {
        return <div>
            {Object.keys(this.permissions).map((element, i) => {
                return <div>
                    <div class="form-row" key={i}>
                        <div class="col" style={{
                            'min-width': '33%'
                        }}>
                            {element}
                        </div>
                        <div class="col">
                            <div class="custom-control custom-switch" style={{ 'margin-top': '0' }}>
                                <input type="checkbox" class="custom-control-input" defaultChecked={this.permissions[element].get}
                                    id={"GET" + element} onChange={() => {
                                        this.permissions[element].get = !this.permissions[element].get;
                                    }} />
                                <label class="custom-control-label" htmlFor={"GET" + element}>GET</label>
                            </div>
                        </div>
                        <div class="col">
                            <div class="custom-control custom-switch" style={{ 'margin-top': '0' }}>
                                <input type="checkbox" class="custom-control-input" defaultChecked={this.permissions[element].post}
                                    id={"POST" + element} onChange={() => {
                                        this.permissions[element].post = !this.permissions[element].post;
                                    }} />
                                <label class="custom-control-label" htmlFor={"POST" + element}>POST</label>
                            </div>
                        </div>
                        <div class="col">
                            <div class="custom-control custom-switch" style={{ 'margin-top': '0' }}>
                                <input type="checkbox" class="custom-control-input" defaultChecked={this.permissions[element].put}
                                    id={"PUT" + element} onChange={() => {
                                        this.permissions[element].put = !this.permissions[element].put;
                                    }} />
                                <label class="custom-control-label" htmlFor={"PUT" + element}>PUT</label>
                            </div>
                        </div>
                        <div class="col">
                            <div class="custom-control custom-switch" style={{ 'margin-top': '0' }}>
                                <input type="checkbox" class="custom-control-input" defaultChecked={this.permissions[element].delete}
                                    id={"DELETE" + element} onChange={() => {
                                        this.permissions[element].delete = !this.permissions[element].delete;
                                    }} />
                                <label class="custom-control-label" htmlFor={"DELETE" + element}>DELETE</label>
                            </div>
                        </div>
                    </div>
                    <hr />
                </div>
            })}
        </div>
    }
}



export default ApiKeys;
