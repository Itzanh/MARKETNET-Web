/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import './../CSS/login.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import logo from './../IMG/icon.png';
import iconRun from './../IMG/run.svg';
import i18next from 'i18next';

class Login extends Component {
    constructor({ login, loginGoogleAuth, handleMenu }) {
        super();

        this.login = login;
        this.loginGoogleAuth = loginGoogleAuth;
        this.handleMenu = handleMenu;
        this.defaultEnterprise = this.getCookie('enterprise');

        this.connect = this.connect.bind(this);
    }

    componentDidMount() {
        window.$('#loginScreenModal').modal({ show: true });
    }

    componentWillUnmount() {
        window.$('#loginScreenModal').modal('hide');
    }

    getCookie(key) {
        const cookies = document.cookie.split("; ");
        for (let i = 0; i < cookies.length; i++) {
            const data = cookies[i].split("=");
            if (data[0] === key) {
                return data[1];
            }
        }
    }

    connect() {
        document.cookie = "enterprise=" + this.refs.enterprise.value;

        this.login({
            'enterprise': this.refs.enterprise.value,
            'username': this.refs.username.value,
            'password': this.refs.password.value
        }).then((result) => {
            if (result.ok) {
                if (result.googleAuthenticator) {
                    window.$('#loginScreenModal').modal('hide');
                    ReactDOM.render(<LoginGoogleAuthenticator
                        loginGoogleAuth={this.loginGoogleAuth}
                        handleMenu={this.handleMenu}
                    />, document.getElementById('root'));

                    return;
                }
                window.$('#loginScreenModal').modal('hide');
                document.cookie = "token=" + result.token;
                this.handleMenu();
            } else {
                this.refs.errorMessage.style.visibility = 'visible';
            }
        });
    }

    render() {
        return <div id="loginScreen" style={{ 'background': "rgb(42, 44, 50)" }}>

            <div className="modal fade" id="loginScreenModal" data-backdrop="static" data-keyboard="false" tabIndex="-1" role="dialog"
                aria-labelledby="loginScreenModal" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="loginScreenModalLabel">
                                <div className="row">
                                    <div className="col">
                                        <img src={logo} alt="logo" />
                                    </div>
                                    <div className="col">
                                        <p>{i18next.t('login')}</p>
                                    </div>
                                </div>
                            </h5>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="inputEnterprise">{i18next.t('enterprise')}</label>
                                <input type="text" className="form-control" id="inputEnterprise" ref="enterprise" defaultValue={this.defaultEnterprise}>
                                </input>
                            </div>
                            <div className="form-group">
                                <label htmlFor="inputUsername">{i18next.t('username')}</label>
                                <input type="text" className="form-control" id="inputUsername" ref="username">
                                </input>
                            </div>
                            <div className="form-group">
                                <label htmlFor="inputPassword">{i18next.t('password')}</label>
                                <input type="password" className="form-control" id="inputPassword" ref="password">
                                </input>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <h6 ref="errorMessage">{i18next.t('failed-to-connect')}</h6>
                            <button type="button" className="btn btn-success" id="loginModalSubmit" onClick={this.connect}>
                                <img src={iconRun} alt="iconRun" />{i18next.t('connect')}</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>;
    }
};

class LoginGoogleAuthenticator extends Component {
    constructor({ loginGoogleAuth, handleMenu }) {
        super();

        this.loginGoogleAuth = loginGoogleAuth;
        this.handleMenu = handleMenu;

        this.connect = this.connect.bind(this);
    }

    componentDidMount() {
        window.$('#loginScreenModal').modal({ show: true });
        setTimeout(() => {
            this.refs.token.focus();
        }, 450);
    }

    connect() {
        const token = this.refs.token.value;

        if (token.length != 6) {
            return;
        }

        this.loginGoogleAuth(token).then((result) => {
            if (result.ok) {
                window.$('#loginScreenModal').modal('hide');
                document.cookie = "token=" + result.token;
                this.handleMenu();
            } else {
                window.$('#loginScreenModal').modal('hide');
            }
        });
    }

    render() {
        return <div id="loginScreen" style={{ 'background': "rgb(42, 44, 50)" }}>

            <div className="modal fade" id="loginScreenModal" data-backdrop="static" data-keyboard="false" tabIndex="-1" role="dialog"
                aria-labelledby="loginScreenModal" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="loginScreenModalLabel">
                                <div className="row">
                                    <div className="col">
                                        <img src={logo} alt="logo" />
                                    </div>
                                    <div className="col">
                                        <p>{i18next.t('login')}</p>
                                    </div>
                                </div>
                            </h5>
                        </div>
                        <div className="modal-body">
                            <label htmlFor="inputEnterprise">{i18next.t('google-authenticator-code')}</label>
                            <input type="text" className="form-control" ref="token" onChange={this.connect} autofocus />
                        </div>
                        <div className="modal-footer">

                        </div>
                    </div>
                </div>
            </div>

        </div>;
    }
}



export default Login;
