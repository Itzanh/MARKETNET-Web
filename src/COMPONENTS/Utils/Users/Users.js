import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

import './../../../CSS/user.css';

import keyIco from './../../../IMG/key.svg';
import offIco from './../../../IMG/off.svg';
import groupIco from './../../../IMG/group.svg';

class Users extends Component {
    constructor({ getUsers, addUser, updateUser, deleteUser, passwordUser, offUser, getUserGroups, insertUserGroup, deleteUserGroup }) {
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

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.pwd = this.pwd.bind(this);
        this.userGoups = this.userGoups.bind(this);
    }

    componentDidMount() {
        this.getUsers().then((users) => {
            ReactDOM.render(users.map((element, i) => {
                return <User key={i}
                    user={element}
                    edit={this.edit}
                    passwordUser={this.pwd}
                    offUser={this.offUser}
                    userGoups={this.userGoups}
                />
            }), this.refs.render);
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderUsersModal'));
        ReactDOM.render(
            <UserAddModal
                addUser={this.addUser}
            />,
            document.getElementById('renderUsersModal'));
    }

    edit(user) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderUsersModal'));
        ReactDOM.render(
            <UserModal
                user={user}
                updateUser={this.updateUser}
                deleteUser={this.deleteUser}
            />,
            document.getElementById('renderUsersModal'));
    }

    pwd(user) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderUsersModal'));
        ReactDOM.render(
            <UserPasswordModal
                passwordUser={(userPwd) => {
                    userPwd.id = user.id;
                    return this.passwordUser(userPwd);
                }}
            />,
            document.getElementById('renderUsersModal'));
    }

    userGoups(userId) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderUsersModal'));
        ReactDOM.render(
            <UserGroupsModal
                userId={userId}
                getUserGroups={this.getUserGroups}
                insertUserGroup={this.insertUserGroup}
                deleteUserGroup={this.deleteUserGroup}
            />,
            document.getElementById('renderUsersModal'));
    }

    render() {
        return <div id="tabUsers">
            <div id="renderUsersModal"></div>
            <h1>{i18next.t('users')}</h1>
            <button type="button" class="btn btn-primary mt-1 ml-1 mb-1" onClick={this.add}>{i18next.t('add')}</button>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">{i18next.t('username')}</th>
                        <th scope="col">{i18next.t('full-name')}</th>
                        <th scope="col">{i18next.t('date-last-login')}</th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class User extends Component {
    constructor({ user, edit, passwordUser, offUser, userGoups }) {
        super();

        this.user = user;
        this.edit = edit;
        this.passwordUser = passwordUser;
        this.offUser = offUser;
        this.userGoups = userGoups;
    }

    render() {
        return <tr className={this.user.off ? 'off' : ''} onClick={() => {
            this.edit(this.user);
        }}>
            <th scope="row">{this.user.id}</th>
            <td>{this.user.username}</td>
            <td>{this.user.fullName}</td>
            <td>{window.dateFormat(this.user.dateLastLogin)}</td>
            <td className="tableIcon"><img onClick={(e) => {
                e.stopPropagation();
                this.passwordUser(this.user);
            }} src={keyIco} alt="change password" /></td>
            <td className="tableIcon"><img onClick={(e) => {
                e.stopPropagation();
                this.offUser(this.user.id);
            }} src={offIco} alt="on/off" /></td>
            <td className="tableIcon"><img onClick={(e) => {
                e.stopPropagation();
                this.userGoups(this.user.id);
            }} src={groupIco} alt="groups" /></td>
        </tr>
    }
}

class UserAddModal extends Component {
    constructor({ addUser }) {
        super();

        this.addUser = addUser;

        this.add = this.add.bind(this);
    }

    componentDidMount() {
        window.$('#userAddModal').modal({ show: true });
    }

    getUserFromForm() {
        const user = {}
        user.username = this.refs.username.value;
        user.fullName = this.refs.fullName.value;
        user.password = this.refs.password.value;
        user.language = this.refs.language.value;
        return user;
    }

    add() {
        if (this.refs.password.value !== this.refs.password2.value) {
            return;
        }
        const user = this.getUserFromForm();

        this.addUser(user).then((ok) => {
            if (ok) {
                window.$('#userAddModal').modal('hide');
            }
        });
    }

    render() {
        return <div class="modal fade" id="userAddModal" tabindex="-1" role="dialog" aria-labelledby="userAddModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="userAddModalLabel">{i18next.t('add-user')}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>{i18next.t('username')}</label>
                            <input type="text" class="form-control" ref="username" />
                        </div>
                        <div class="form-group">
                            <label>{i18next.t('full-name')}</label>
                            <input type="text" class="form-control" ref="fullName" />
                        </div>
                        <div class="form-group">
                            <label>{i18next.t('password')}</label>
                            <input type="password" class="form-control" ref="password" />
                        </div>
                        <div class="form-group">
                            <label>{i18next.t('repeat-password')}</label>
                            <input type="password" class="form-control" ref="password2" />
                        </div>
                        <div class="form-group">
                            <label>{i18next.t('language')}</label>
                            <select class="form-control" ref="language">
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                        <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button>
                    </div>
                </div>
            </div>
        </div>
    }
}

class UserModal extends Component {
    constructor({ user, updateUser, deleteUser }) {
        super();

        this.user = user;
        this.updateUser = updateUser;
        this.deleteUser = deleteUser;

        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        window.$('#userModal').modal({ show: true });
    }

    getUserFromForm() {
        const user = {}
        user.username = this.refs.username.value;
        user.fullName = this.refs.fullName.value;
        user.email = this.refs.email.value;
        user.description = this.refs.dsc.value;
        user.language = this.refs.language.value;
        return user;
    }

    update() {
        const user = this.getUserFromForm();
        user.id = this.user.id;

        this.updateUser(user).then((ok) => {
            if (ok) {
                window.$('#userModal').modal('hide');
            }
        });
    }

    delete() {
        this.deleteUser(this.user.id).then((ok) => {
            if (ok) {
                window.$('#userModal').modal('hide');
            }
        });
    }

    render() {
        return <div class="modal fade" id="userModal" tabindex="-1" role="dialog" aria-labelledby="userModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="userModalLabel">{i18next.t('user')}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>{i18next.t('username')}</label>
                            <input type="text" class="form-control" ref="username" defaultValue={this.user.username} />
                        </div>
                        <div class="form-group">
                            <label>{i18next.t('full-name')}</label>
                            <input type="text" class="form-control" ref="fullName" defaultValue={this.user.fullName} />
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="text" class="form-control" ref="email" defaultValue={this.user.email} />
                        </div>
                        <div class="form-row">
                            <div class="col">
                                <label>{i18next.t('date-created')}</label>
                                <input type="text" class="form-control" defaultValue={window.dateFormat(this.user.dateCreated)} readOnly={true} />
                            </div>
                            <div class="col">
                                <label>{i18next.t('date-last-password')}</label>
                                <input type="text" class="form-control" defaultValue={window.dateFormat(this.user.dateLastPwd)} readOnly={true} />
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="col">
                                <label>{i18next.t('iterations')}</label>
                                <input type="number" class="form-control" defaultValue={this.user.iterations} readOnly={true} />
                            </div>
                            <div class="col">
                                <label>{i18next.t('date-last-login')}</label>
                                <input type="text" class="form-control" defaultValue={window.dateFormat(this.user.dateLastLogin)} readOnly={true} />
                            </div>
                        </div>
                        <label>{i18next.t('language')}</label>
                        <select class="form-control" defaultValue={this.user.language} ref="language">
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                        </select>
                        <label>{i18next.t('description')}</label>
                        <textarea class="form-control" rows="5" ref="dsc"></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                        <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button>
                    </div>
                </div>
            </div>
        </div>
    }
}

class UserPasswordModal extends Component {
    constructor({ passwordUser }) {
        super();

        this.passwordUser = passwordUser;

        this.pwd = this.pwd.bind(this);
    }

    componentDidMount() {
        window.$('#userPwdModal').modal({ show: true });
    }

    getUserPwdFromForm() {
        const userPwd = {}
        userPwd.password = this.refs.password.value;
        userPwd.pwdNextLogin = this.refs.pwdNextLogin.checked;
        return userPwd;
    }

    pwd() {
        if (this.refs.password.value !== this.refs.password2.value) {
            return;
        }
        const userPwd = this.getUserPwdFromForm();

        this.passwordUser(userPwd).then((ok) => {
            if (ok) {
                window.$('#userPwdModal').modal('hide');
            }
        });
    }

    render() {
        return <div class="modal fade" id="userPwdModal" tabindex="-1" role="dialog" aria-labelledby="userPwdModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="userPwdModalLabel">{i18next.t('change-user-password')}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>{i18next.t('password')}</label>
                            <input type="password" class="form-control" ref="password" />
                        </div>
                        <div class="form-group">
                            <label>{i18next.t('repeat-password')}</label>
                            <input type="password" class="form-control" ref="password2" />
                        </div>
                        <div class="form-group">
                            <input class="form-check-input" type="checkbox" ref="pwdNextLogin" defaultChecked={true} />
                            <label class="form-check-label">{i18next.t('the-user-must-change-the-password-on-the-next-login')}</label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                        <button type="button" class="btn btn-primary" onClick={this.pwd}>{i18next.t('change-password')}</button>
                    </div>
                </div>
            </div>
        </div>
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

        this.selectIn = this.selectIn.bind(this);
        this.selectOut = this.selectOut.bind(this);
        this.addToGroup = this.addToGroup.bind(this);
        this.removeFromGroup = this.removeFromGroup.bind(this);
    }

    componentDidMount() {
        window.$('#userGroupModal').modal({ show: true });

        this.renderGroups();
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
            user: this.userId,
            group: this.currentlySelectedGroupOutId
        }).then((ok) => {
            if (ok) {
                this.currentlySelectedGroupOutId = 0;
                this.renderGroups();
            }
        });
    }

    removeFromGroup() {
        this.deleteUserGroup({
            user: this.userId,
            group: this.currentlySelectedGroupInId
        }).then((ok) => {
            if (ok) {
                this.currentlySelectedGroupInId = 0;
                this.renderGroups();
            }
        });
    }

    render() {
        return <div class="modal fade" id="userGroupModal" tabindex="-1" role="dialog" aria-labelledby="userGroupModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="userGroupModalLabel">{i18next.t('add-or-remove-groups')}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
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
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">OK</button>
                    </div>
                </div>
            </div>
        </div>
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

export default Users;
