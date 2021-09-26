import { Component } from "react";
import i18next from 'i18next';

class ChangePassword extends Component {
    constructor({ userAutoPassword, mustChangeUserPassword }) {
        super();

        this.userAutoPassword = userAutoPassword;
        this.mustChangeUserPassword = mustChangeUserPassword;

        this.pwd = this.pwd.bind(this);
    }

    componentDidMount() {
        window.$('#pwdModal').modal({ show: true });
    }

    pwd() {
        this.refs.errorMessage.innerText = "";
        if (this.refs.pwd.value.length < 8) {
            this.refs.errorMessage.innerText = i18next.t('password-must-have-8-characters-at-least');
            return;
        }
        if (this.refs.pwd.value != this.refs.pwd2.value) {
            this.refs.errorMessage.innerText = i18next.t('passwords-do-not-match');
            return;
        }
        if (this.refs.curr_pwd.value == this.refs.pwd.value) {
            this.refs.errorMessage.innerText = i18next.t('passwords-are-the-same');
            return;
        }

        this.userAutoPassword({
            currentPassword: this.refs.curr_pwd.value,
            newPassword: this.refs.pwd.value
        }).then((ok) => {
            if (ok) {
                window.$('#pwdModal').modal('hide');
            } else {
                this.refs.errorMessage.innerText = i18next.t('current-password-is-not-correct');
            }
        });
    }

    render() {
        return <div class="modal fade" id="pwdModal" tabindex="-1" role="dialog" aria-labelledby="pwdModallLabel" aria-hidden="true"
            data-backdrop={this.mustChangeUserPassword ? "static" : null}>
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="pwdModallLabel">{i18next.t('change-password')}</h5>
                        {this.mustChangeUserPassword ? null : <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>}
                    </div>
                    <div class="modal-body">
                        <label>{i18next.t('current-password')}</label>
                        <input type="password" class="form-control" ref="curr_pwd" />
                        <label>{i18next.t('password')}</label>
                        <input type="password" class="form-control" ref="pwd" />
                        <label>{i18next.t('repeat-password')}</label>
                        <input type="password" class="form-control" ref="pwd2" />
                    </div>
                    <div class="modal-footer">
                        <p className="errorMessage" ref="errorMessage"></p>
                        {this.mustChangeUserPassword ? null :
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>}
                        <button type="button" class="btn btn-success" onClick={this.pwd}>{i18next.t('change-password')}</button>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default ChangePassword;
