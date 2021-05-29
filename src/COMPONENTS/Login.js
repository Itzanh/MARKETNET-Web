import './../CSS/login.css';
import React, { Component } from 'react';

import logo from './../IMG/icon.png';
import iconRun from './../IMG/run.svg';

class Login extends Component {
    constructor({ login, handleMenu }) {
        super();
        this.login = login;
        this.handleMenu = handleMenu;

        this.connect = this.connect.bind(this);
    }

    componentDidMount() {
        window.$('#loginScreenModal').modal({ show: true });
    }

    connect() {
        this.login({
            'username': this.refs.username.value,
            'password': this.refs.password.value
        }).then((result) => {
            if (result.ok) {
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
                                        <p>Login</p>
                                    </div>
                                </div>
                            </h5>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="inputUsername">Username</label>
                                <input type="text" className="form-control" id="inputUsername" ref="username">
                                </input>
                            </div>
                            <div className="form-group">
                                <label htmlFor="inputPassword">Password</label>
                                <input type="password" className="form-control" id="inputPassword" ref="password">
                                </input>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <h6 ref="errorMessage">Failed to connect</h6>
                            <button type="button" className="btn btn-success" id="loginModalSubmit" onClick={this.connect}>
                                <img src={iconRun} alt="iconRun" />Connect</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>;
    }
};

export default Login;
