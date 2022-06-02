import React, { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

// CSS
import './../../../CSS/user.css';

// IMG
import keyIco from './../../../IMG/key.svg';
import offIco from './../../../IMG/off.svg';
import groupIco from './../../../IMG/group.svg';
import googleAuthenticatorIco from './../../../IMG/google_authenticator.png';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

// COMPONENTS
import SecureCloudEvaluation from "./SecureCloudEvaluation";

// LIB
import QRCode from "qrcode.react";

// MATERIAL UI
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
import ConfirmDelete from "../../ConfirmDelete";
import { DataGrid } from "@material-ui/data-grid";

import { TextField, FormControl, NativeSelect } from "@material-ui/core";
import { InputLabel } from "@mui/material";

const ConnectionFilterType = {
    "I": "IP",
    "S": "schedule"
};



class Users extends Component {
    constructor({ getUsers, addUser, updateUser, deleteUser, passwordUser, offUser, getUserGroups, insertUserGroup, deleteUserGroup,
        evaluatePasswordSecureCloud, registerUserInGoogleAuthenticator, removeUserFromGoogleAuthenticator, getConnectionFilterUserByUser,
        getConnectionFilters, insertConnectionFilterUser, deleteConnectionFilterUser, deleteLoginTokensFromUser }) {
        super();

        this.getUsers = getUsers;
        this.addUser = addUser;
        this.updateUser = updateUser;
        this.deleteUser = deleteUser;
        this.passwordUser = passwordUser;
        this.offUser = offUser;
        this.getUserGroups = getUserGroups;
        this.insertUserGroup = insertUserGroup;
        this.deleteUserGroup = deleteUserGroup;
        this.evaluatePasswordSecureCloud = evaluatePasswordSecureCloud;
        this.registerUserInGoogleAuthenticator = registerUserInGoogleAuthenticator;
        this.removeUserFromGoogleAuthenticator = removeUserFromGoogleAuthenticator;
        this.getConnectionFilterUserByUser = getConnectionFilterUserByUser;
        this.getConnectionFilters = getConnectionFilters;
        this.insertConnectionFilterUser = insertConnectionFilterUser;
        this.deleteConnectionFilterUser = deleteConnectionFilterUser;
        this.deleteLoginTokensFromUser = deleteLoginTokensFromUser;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderUsers();
    }

    renderUsers() {
        this.getUsers().then((users) => {
            this.list = users;
            this.forceUpdate();
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderUsersModal'));
        ReactDOM.render(
            <UserAddModal
                addUser={(user) => {
                    const promise = this.addUser(user);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderUsers();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderUsersModal'));
    }

    edit(user) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderUsersModal'));
        ReactDOM.render(
            <UserModal
                user={user}
                updateUser={(user) => {
                    const promise = this.updateUser(user);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderUsers();
                        }
                    });
                    return promise;
                }}
                deleteUser={(userId) => {
                    const promise = this.deleteUser(userId);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderUsers();
                        }
                    });
                    return promise;
                }}
                passwordUser={(user) => {
                    const promise = this.passwordUser(user);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderUsers();
                        }
                    });
                    return promise;
                }}
                evaluatePasswordSecureCloud={this.evaluatePasswordSecureCloud}
                offUser={(user) => {
                    const promise = this.offUser(user);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderUsers();
                        }
                    });
                    return promise;
                }}
                getUserGroups={this.getUserGroups}
                insertUserGroup={this.insertUserGroup}
                deleteUserGroup={this.deleteUserGroup}
                registerUserInGoogleAuthenticator={(user) => {
                    const promise = this.registerUserInGoogleAuthenticator(user);
                    promise.then((result) => {
                        if (result.ok) {
                            this.renderUsers();
                        }
                    });
                    return promise;
                }}
                removeUserFromGoogleAuthenticator={(user) => {
                    const promise = this.removeUserFromGoogleAuthenticator(user);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderUsers();
                        }
                    });
                    return promise;
                }}
                getConnectionFilterUserByUser={this.getConnectionFilterUserByUser}
                getConnectionFilters={this.getConnectionFilters}
                insertConnectionFilterUser={this.insertConnectionFilterUser}
                deleteConnectionFilterUser={this.deleteConnectionFilterUser}
                deleteLoginTokensFromUser={this.deleteLoginTokensFromUser}
            />,
            document.getElementById('renderUsersModal'));
    }

    render() {
        return <div id="tabUsers">
            <div id="renderUsersModal"></div>
            <h4 className="ml-2">{i18next.t('users')}</h4>
            <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add')}</button>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'username', headerName: i18next.t('username'), width: 350 },
                    { field: 'fullName', headerName: i18next.t('full-name'), flex: 1 },
                    {
                        field: 'dateLastLogin', headerName: i18next.t('date-last-login'), width: 250, valueGetter: (params) => {
                            return window.dateFormat(params.row.dateLastLogin)
                        }
                    },
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
                getRowClassName={(params) =>
                    params.row.off ? 'btn-danger' : ''
                }
            />
        </div>
    }
}

class UserAddModal extends Component {
    constructor({ addUser }) {
        super();

        this.addUser = addUser;

        this.open = true;

        this.username = React.createRef();
        this.fullName = React.createRef();
        this.password = React.createRef();
        this.password2 = React.createRef();

        this.add = this.add.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    getUserFromForm() {
        const user = {}
        user.username = this.username.current.value;
        user.fullName = this.fullName.current.value;
        user.password = this.password.current.value;
        user.language = document.getElementById("language").value;
        return user;
    }

    add() {
        if (this.password.current.value !== this.password2.current.value) {
            return;
        }
        const user = this.getUserFromForm();

        this.addUser(user).then((ok) => {
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
                {i18next.t('add-user')}
            </this.DialogTitle>
            <DialogContent>
                <div class="form-group">
                    <TextField label={i18next.t('username')} variant="outlined" fullWidth size="small" inputRef={this.username}
                        inputProps={{ maxLength: 40 }} />
                </div>
                <div class="form-group">
                    <TextField label={i18next.t('full-name')} variant="outlined" fullWidth size="small" inputRef={this.fullName}
                        inputProps={{ maxLength: 150 }} />
                </div>
                <div class="form-group">
                    <TextField label={i18next.t('password')} variant="outlined" fullWidth size="small" inputRef={this.password} type="password" />
                </div>
                <div class="form-group">
                    <TextField label={i18next.t('repeat-password')} variant="outlined" fullWidth size="small" inputRef={this.password2} type="password" />
                </div>
                <div class="form-group">
                    <FormControl fullWidth>
                        <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('language')}</InputLabel>
                        <NativeSelect
                            style={{ 'marginTop': '0' }}
                            id="language">
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                        </NativeSelect>
                    </FormControl>
                </div>
            </DialogContent>
            <DialogActions>
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button>
            </DialogActions>
        </Dialog>
    }
}

class UserModal extends Component {
    constructor({ user, updateUser, deleteUser, passwordUser, evaluatePasswordSecureCloud, offUser, getUserGroups, insertUserGroup, deleteUserGroup,
        registerUserInGoogleAuthenticator, removeUserFromGoogleAuthenticator, getConnectionFilterUserByUser, getConnectionFilters, insertConnectionFilterUser,
        deleteConnectionFilterUser, deleteLoginTokensFromUser }) {
        super();

        this.user = user;
        this.updateUser = updateUser;
        this.deleteUser = deleteUser;
        this.passwordUser = passwordUser;
        this.evaluatePasswordSecureCloud = evaluatePasswordSecureCloud;
        this.offUser = offUser;
        this.getUserGroups = getUserGroups;
        this.insertUserGroup = insertUserGroup;
        this.deleteUserGroup = deleteUserGroup;
        this.registerUserInGoogleAuthenticator = registerUserInGoogleAuthenticator;
        this.removeUserFromGoogleAuthenticator = removeUserFromGoogleAuthenticator;
        this.getConnectionFilterUserByUser = getConnectionFilterUserByUser;
        this.getConnectionFilters = getConnectionFilters;
        this.insertConnectionFilterUser = insertConnectionFilterUser;
        this.deleteConnectionFilterUser = deleteConnectionFilterUser;
        this.deleteLoginTokensFromUser = deleteLoginTokensFromUser;

        this.open = true;

        this.username = React.createRef();
        this.fullName = React.createRef();
        this.email = React.createRef();
        this.description = React.createRef();

        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.pwd = this.pwd.bind(this);
        this.userGoups = this.userGoups.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.googleAuthenticator = this.googleAuthenticator.bind(this);
        this.userConnectionFilters = this.userConnectionFilters.bind(this);
        this.logOut = this.logOut.bind(this);
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    getUserFromForm() {
        const user = {}
        user.username = this.username.current.value;
        user.fullName = this.fullName.current.value;
        user.email = this.email.current.value;
        user.description = this.description.current.value;
        user.language = document.getElementById("language").value;
        return user;
    }

    update() {
        const user = this.getUserFromForm();
        user.id = this.user.id;

        this.updateUser(user).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    delete() {
        this.deleteUser(this.user.id).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    pwd() {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(
            <UserPasswordModal
                userId={this.user.id}
                passwordUser={this.passwordUser}
                evaluatePasswordSecureCloud={this.evaluatePasswordSecureCloud}
            />,
            this.refs.render);
    }

    userGoups(userId) {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(
            <UserGroupsModal
                userId={userId}
                getUserGroups={this.getUserGroups}
                insertUserGroup={this.insertUserGroup}
                deleteUserGroup={this.deleteUserGroup}
            />,
            this.refs.render);
    }

    googleAuthenticator() {
        if (this.user.usesGoogleAuthenticator) {
            ReactDOM.unmountComponentAtNode(this.refs.render);
            ReactDOM.render(
                <ConfirmDelete
                    onDelete={() => {
                        this.removeUserFromGoogleAuthenticator(this.user.id);
                        this.user.usesGoogleAuthenticator = false;
                        this.refs.gauth.checked = false;
                    }}
                />, this.refs.render);
        } else {
            this.registerUserInGoogleAuthenticator(this.user.id).then((result) => {
                if (result.ok) {
                    ReactDOM.unmountComponentAtNode(this.refs.render);
                    ReactDOM.render(
                        <UserGoogleAuthenticatorRegister
                            authLink={result.authLink}
                        />,
                        this.refs.render);
                    this.user.usesGoogleAuthenticator = true;
                    this.refs.gauth.checked = true;
                }
            });
        }
    }

    userConnectionFilters() {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(
            <UserConnectionFilters
                userId={this.user.id}
                getConnectionFilterUserByUser={this.getConnectionFilterUserByUser}
                getConnectionFilters={this.getConnectionFilters}
                insertConnectionFilterUser={this.insertConnectionFilterUser}
                deleteConnectionFilterUser={this.deleteConnectionFilterUser}
            />,
            this.refs.render);
    }

    logOut() {
        this.deleteLoginTokensFromUser(this.user.id).then((ok) => {
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
        return <div>
            <div ref="render"></div>
            <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'lg'}
                PaperComponent={this.PaperComponent}>
                <this.DialogTitle style={{ cursor: 'move', 'background-color': this.user.off ? '#dc3545' : '' }} id="draggable-dialog-title">
                    {i18next.t('user')}
                </this.DialogTitle>
                <DialogContent>
                    <div class="form-group">
                        <TextField label={i18next.t('username')} variant="outlined" fullWidth size="small" inputRef={this.username}
                            defaultValue={this.user.username} inputProps={{ maxLength: 40 }} />
                    </div>
                    <div class="form-group">
                        <TextField label={i18next.t('full-name')} variant="outlined" fullWidth size="small" inputRef={this.fullName}
                            defaultValue={this.user.fullName} inputProps={{ maxLength: 150 }} />
                    </div>
                    <div class="form-group">
                        <TextField label='Email' variant="outlined" fullWidth size="small" inputRef={this.email}
                            defaultValue={this.user.email} inputProps={{ maxLength: 100 }} />
                    </div>
                    <div class="form-group">
                        <div class="form-row">
                            <div class="col">
                                <TextField label={i18next.t('date-created')} variant="outlined" fullWidth InputProps={{ readOnly: true }} size="small"
                                    defaultValue={window.dateFormat(this.user.dateCreated)} />
                            </div>
                            <div class="col">
                                <TextField label={i18next.t('date-last-password')} variant="outlined" fullWidth InputProps={{ readOnly: true }} size="small"
                                    defaultValue={window.dateFormat(this.user.dateLastPwd)} />
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="form-row">
                            <div class="col">
                                <TextField label={i18next.t('iterations')} variant="outlined" fullWidth InputProps={{ readOnly: true }} size="small"
                                    defaultValue={this.user.iterations} />
                            </div>
                            <div class="col">
                                <TextField label={i18next.t('date-last-login')} variant="outlined" fullWidth InputProps={{ readOnly: true }} size="small"
                                    defaultValue={window.dateFormat(this.user.dateLastLogin)} />
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <FormControl fullWidth>
                            <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('language')}</InputLabel>
                            <NativeSelect
                                style={{ 'marginTop': '0' }}
                                id="language"
                                defaultValue={this.user.language}>
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                            </NativeSelect>
                        </FormControl>
                    </div>
                    <div class="form-group">
                        <TextField label={i18next.t('description')} variant="outlined" fullWidth size="small" defaultValue={this.user.description}
                            multiline maxRows={5} minRows={5} inputRef={this.description} inputProps={{ maxLength: 3000 }} />
                    </div>
                    <div class="custom-control custom-switch">
                        <input class="form-check-input custom-control-input" ref="gauth"
                            type="checkbox" defaultChecked={this.user.usesGoogleAuthenticator} disabled={true} />
                        <label class="form-check-label custom-control-label">Google Authenticator</label>
                    </div>
                </DialogContent>
                <DialogActions>
                    <div id="userModalFooter">
                        <button type="button" class="btn btn-info" onClick={(e) => {
                            e.stopPropagation();
                            this.googleAuthenticator();
                        }}><img src={googleAuthenticatorIco} alt="groups" />Google Authenticator</button>
                        <button type="button" class="btn btn-info" onClick={(e) => {
                            e.stopPropagation();
                            this.userGoups(this.user.id);
                        }}><img src={groupIco} alt="groups" />{i18next.t('add-or-remove-groups')}</button>
                        <button type="button" class="btn btn-info" onClick={(e) => {
                            e.stopPropagation();
                            this.userConnectionFilters();
                        }}><FilterAltIcon />{i18next.t('connection-filters')}</button>
                        <button type="button" class="btn btn-info" onClick={this.logOut}>{i18next.t('log-out-user')}</button>
                        <br />
                        <br />
                        <button type="button" class="btn btn-info" onClick={(e) => {
                            e.stopPropagation();
                            this.offUser(this.user.id).then((ok) => {
                                if (ok) {
                                    this.handleClose();
                                }
                            });
                        }} ><img src={offIco} alt="on/off" />On/Off</button>
                        <button type="button" class="btn btn-info" onClick={this.pwd}>
                            <img src={keyIco} alt="change password" />{i18next.t('change-password')}
                        </button>
                        <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button>
                        <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                        <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button>
                    </div>
                </DialogActions>
            </Dialog>
        </div>
    }
}

class UserPasswordModal extends Component {
    constructor({ userId, passwordUser, evaluatePasswordSecureCloud }) {
        super();

        this.userId = userId;
        this.passwordUser = passwordUser;
        this.evaluatePasswordSecureCloud = evaluatePasswordSecureCloud;

        this.evaluateTimer = null;
        this.open = true;

        this.password = React.createRef();
        this.password2 = React.createRef();

        this.pwd = this.pwd.bind(this);
        this.evaluate = this.evaluate.bind(this);
        this.waitEvaluate = this.waitEvaluate.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            ReactDOM.render(<SecureCloudEvaluation />, this.refs.renderSecureCloudResult);
        }, 10);
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    getUserPwdFromForm() {
        const userPwd = {};
        userPwd.id = this.userId;
        userPwd.password = this.password.current.value;
        userPwd.pwdNextLogin = this.refs.pwdNextLogin.checked;
        return userPwd;
    }

    pwd() {
        if (this.password.current.value !== this.password2.current.value) {
            return;
        }
        const userPwd = this.getUserPwdFromForm();

        this.passwordUser(userPwd).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    waitEvaluate() {
        if (this.evaluateTimer != null) {
            clearTimeout(this.evaluateTimer);
            this.evaluateTimer = null;
        }

        this.evaluateTimer = setTimeout(this.evaluate, 500);
    }

    evaluate() {
        this.evaluateTimer = null;

        this.evaluatePasswordSecureCloud(this.password.current.value).then((result) => {
            ReactDOM.unmountComponentAtNode(this.refs.renderSecureCloudResult);
            ReactDOM.render(<SecureCloudEvaluation
                evaluation={result}
            />, this.refs.renderSecureCloudResult);
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
                {i18next.t('change-user-password')}
            </this.DialogTitle>
            <DialogContent>
                <div class="form-group">
                    <TextField label={i18next.t('password')} variant="outlined" fullWidth size="small" inputRef={this.password} type="password"
                        onChange={this.waitEvaluate} />
                </div>
                <div class="form-group">
                    <TextField label={i18next.t('repeat-password')} variant="outlined" fullWidth size="small" inputRef={this.password2} type="password" />
                </div>
                <div class="form-group">
                    <input class="form-check-input" type="checkbox" ref="pwdNextLogin" defaultChecked={true} />
                    <label class="form-check-label">{i18next.t('the-user-must-change-the-password-on-the-next-login')}</label>
                </div>
                <div ref="renderSecureCloudResult">
                </div>
            </DialogContent>
            <DialogActions>
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                <button type="button" class="btn btn-primary" onClick={this.pwd}>{i18next.t('change-password')}</button>
            </DialogActions>
        </Dialog>
    }
}

class UserGroupsModal extends Component {
    constructor({ userId, getUserGroups, insertUserGroup, deleteUserGroup }) {
        super();

        this.userId = userId;
        this.getUserGroups = getUserGroups;
        this.insertUserGroup = insertUserGroup;
        this.deleteUserGroup = deleteUserGroup;

        this.currentlySelectedGroupInId = 0;
        this.currentlySelectedGroupOutId = 0;
        this.open = true;

        this.selectIn = this.selectIn.bind(this);
        this.selectOut = this.selectOut.bind(this);
        this.addToGroup = this.addToGroup.bind(this);
        this.removeFromGroup = this.removeFromGroup.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.renderGroups = this.renderGroups.bind(this);
    }

    componentDidMount() {
        setTimeout(this.renderGroups, 10);
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    renderGroups() {
        this.getUserGroups(this.userId).then((userGroups) => {
            ReactDOM.unmountComponentAtNode(this.refs.renderIn);
            ReactDOM.render(userGroups.groupsIn.map((element, i) => {
                return <UserGroup key={i}
                    group={element}
                    select={this.selectIn}
                    selected={element.id === this.currentlySelectedGroupInId}
                />
            }), this.refs.renderIn);

            ReactDOM.unmountComponentAtNode(this.refs.renderOut);
            ReactDOM.render(userGroups.groupsOut.map((element, i) => {
                return <UserGroup key={i}
                    group={element}
                    select={this.selectOut}
                    selected={element.id === this.currentlySelectedGroupOutId}
                />
            }), this.refs.renderOut);
        });
    }

    selectIn(groupId) {
        this.currentlySelectedGroupInId = groupId;
        this.renderGroups();
    }

    selectOut(groupId) {
        this.currentlySelectedGroupOutId = groupId;
        this.renderGroups();
    }

    addToGroup() {
        this.insertUserGroup({
            userId: this.userId,
            groupId: this.currentlySelectedGroupOutId
        }).then((ok) => {
            if (ok) {
                this.currentlySelectedGroupOutId = 0;
                this.renderGroups();
            }
        });
    }

    removeFromGroup() {
        this.deleteUserGroup({
            userId: this.userId,
            groupId: this.currentlySelectedGroupInId
        }).then((ok) => {
            if (ok) {
                this.currentlySelectedGroupInId = 0;
                this.renderGroups();
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
        return <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'md'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('add-or-remove-groups')}
            </this.DialogTitle>
            <DialogContent>
                <div class="form-row">
                    <div class="col">
                        <button type="button" class="btn btn-danger mb-1 ml-1" onClick={this.removeFromGroup}>{i18next.t('remove-from-group')}</button>
                        <table class="table table-dark">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">{i18next.t('name')}</th>
                                </tr>
                            </thead>
                            <tbody ref="renderIn"></tbody>
                        </table>
                    </div>
                    <div class="col">
                        <button type="button" class="btn btn-primary mb-1 ml-1" onClick={this.addToGroup}>{i18next.t('add-to-group')}</button>
                        <table class="table table-dark">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">{i18next.t('name')}</th>
                                </tr>
                            </thead>
                            <tbody ref="renderOut"></tbody>
                        </table>
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>OK</button>
            </DialogActions>
        </Dialog>
    }
}

class UserGroup extends Component {
    constructor({ group, select, selected }) {
        super();

        this.group = group;
        this.select = select;
        this.selected = selected;
    }

    render() {
        return <tr className={this.selected ? 'bg-primary' : ''} onClick={() => {
            this.select(this.group.id);
        }}>
            <th scope="row">{this.group.id}</th>
            <td>{this.group.name}</td>
        </tr>
    }
}

class UserGoogleAuthenticatorRegister extends Component {
    constructor({ authLink }) {
        super();

        this.authLink = authLink;
        this.open = true;

        this.handleClose = this.handleClose.bind(this);
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

    PaperComponent(props) {
        return (
            <Draggable handle="#draggable-dialog-title" cancel={'[class*="DialogContent-root"]'}>
                <Paper {...props} />
            </Draggable>
        );
    }

    render() {
        return <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'xs'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                Google Authenticator QR Code
            </this.DialogTitle>
            <DialogContent>
                <QRCode value={this.authLink} />
            </DialogContent>
            <DialogActions>
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
            </DialogActions>
        </Dialog>
    }
}

class UserConnectionFilters extends Component {
    constructor({ userId, getConnectionFilterUserByUser, getConnectionFilters, insertConnectionFilterUser, deleteConnectionFilterUser }) {
        super();

        this.userId = userId;
        this.getConnectionFilterUserByUser = getConnectionFilterUserByUser;
        this.getConnectionFilters = getConnectionFilters;
        this.insertConnectionFilterUser = insertConnectionFilterUser;
        this.deleteConnectionFilterUser = deleteConnectionFilterUser;

        this.list = [];
        this.open = true;

        this.handleClose = this.handleClose.bind(this);
        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.printUserConnectionFilters();
    }

    printUserConnectionFilters() {
        this.getConnectionFilterUserByUser(this.userId).then((list) => {
            for (let i = 0; i < list.length; i++) {
                list[i].id = i;
            }
            this.list = list;
            this.forceUpdate();
        });
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    async add() {
        const connectionFilters = await this.getConnectionFilters();
        const unusedConnectionFilters = [];

        for (let i = 0; i < connectionFilters.length; i++) {
            var ok = false;
            for (let j = 0; j < this.list.length; j++) {
                if (this.list[i].connectionFilterId == connectionFilters[i].id) {
                    ok = true;
                    break;
                }
            }
            if (!ok) {
                unusedConnectionFilters.push(connectionFilters[i]);
            }
        }

        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(<UserConnectionFiltersAdd
            list={unusedConnectionFilters}
            add={(connectionFilter) => {
                this.insertConnectionFilterUser({
                    connectionFilterId: connectionFilter.id,
                    userId: this.userId
                }).then((ok) => {
                    if (ok) {
                        this.printUserConnectionFilters();
                    }
                });
            }}
        />, this.refs.render);
    }

    edit(userFilter) {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(
            <ConfirmDelete
                onDelete={() => {
                    this.deleteConnectionFilterUser(userFilter).then((ok) => {
                        if (ok) {
                            this.printUserConnectionFilters();
                        }
                    });
                }}
            />, this.refs.render);
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
        return <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'md'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('connection-filters')}
            </this.DialogTitle>
            <DialogContent>
                <div ref="render"></div>
                <DataGrid
                    ref="table"
                    autoHeight
                    rows={this.list}
                    columns={[
                        {
                            field: 'name', headerName: i18next.t('name'), flex: 1, valueGetter: (params) => {
                                return params.row.connectionFilter.name;
                            }
                        },
                        {
                            field: 'type', headerName: i18next.t('type'), width: 160, valueGetter: (params) => {
                                return i18next.t(ConnectionFilterType[params.row.connectionFilter.type])
                            }
                        },
                        {
                            field: '', headerName: i18next.t('data'), width: 160, valueGetter: (params) => {
                                var timeStart;
                                var timeEnd;
                                if (params.row.connectionFilter.type == "S") {
                                    timeStart = new Date(params.row.connectionFilter.timeStart);
                                    timeEnd = new Date(params.row.connectionFilter.timeEnd);
                                }

                                return params.row.connectionFilter.type == "I" ? params.row.connectionFilter.ipAddress :
                                    window.timeHourMinuteFormat(timeStart) + " - " + window.timeHourMinuteFormat(timeEnd);
                            }
                        },
                    ]}
                    onRowClick={(data) => {
                        this.edit(data.row);
                    }}
                />
            </DialogContent>
            <DialogActions>
                <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add-filter')}</button>
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
            </DialogActions>
        </Dialog>
    }

};

class UserConnectionFiltersAdd extends Component {
    constructor({ userId, list, add }) {
        super();

        this.userId = userId;
        this.list = list;
        this.add = add;

        this.open = true;

        this.handleClose = this.handleClose.bind(this);
        this.edit = this.edit.bind(this);
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    edit(connectionFilter) {
        this.handleClose();
        this.add(connectionFilter);
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
        return <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'md'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('connection-filters')}
            </this.DialogTitle>
            <DialogContent>
                <DataGrid
                    ref="table"
                    autoHeight
                    rows={this.list}
                    columns={[
                        { field: 'name', headerName: i18next.t('name'), flex: 1 },
                        {
                            field: 'type', headerName: i18next.t('type'), width: 160, valueGetter: (params) => {
                                return i18next.t(ConnectionFilterType[params.row.type])
                            }
                        },
                        {
                            field: '', headerName: i18next.t('data'), width: 160, valueGetter: (params) => {
                                var timeStart;
                                var timeEnd;
                                if (params.row.type == "S") {
                                    timeStart = new Date(params.row.timeStart);
                                    timeEnd = new Date(params.row.timeEnd);
                                }

                                return params.row.type == "I" ? params.row.ipAddress :
                                    window.timeHourMinuteFormat(timeStart) + " - " + window.timeHourMinuteFormat(timeEnd);
                            }
                        },
                    ]}
                    onRowClick={(data) => {
                        this.edit(data.row);
                    }}
                />
            </DialogContent>
            <DialogActions>
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
            </DialogActions>
        </Dialog>
    }
};



export default Users;
