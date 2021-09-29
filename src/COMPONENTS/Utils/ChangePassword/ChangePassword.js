import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import SecureCloudEvaluation from "../Users/SecureCloudEvaluation";

class ChangePassword extends Component {
    constructor({ userAutoPassword, mustChangeUserPassword, evaluatePasswordSecureCloud }) {
        super();

        this.userAutoPassword = userAutoPassword;
        this.mustChangeUserPassword = mustChangeUserPassword;
        this.evaluatePasswordSecureCloud = evaluatePasswordSecureCloud;

        this.evaluateTimer = null;

        this.pwd = this.pwd.bind(this);
        this.evaluate = this.evaluate.bind(this);
        this.waitEvaluate = this.waitEvaluate.bind(this);
    }

    componentDidMount() {
        window.$('#pwdModal').modal({ show: true });

        ReactDOM.render(<SecureCloudEvaluation />, this.refs.renderSecureCloudResult);
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

    waitEvaluate() {
        this.refs.btnOk.disabled = true;
        if (this.evaluateTimer != null) {
            clearTimeout(this.evaluateTimer);
            this.evaluateTimer = null;
        }

        this.evaluateTimer = setTimeout(this.evaluate, 500);
    }

    evaluate() {
        this.evaluateTimer = null;

        this.evaluatePasswordSecureCloud(this.refs.pwd.value).then((result) => {
            ReactDOM.unmountComponentAtNode(this.refs.renderSecureCloudResult);
            ReactDOM.render(<SecureCloudEvaluation
                evaluation={result}
            />, this.refs.renderSecureCloudResult);

            if (result.passwordComplexity == true && result.passwordInBlacklist == false && result.passwordHashInBlacklist == false) {
                this.refs.btnOk.disabled = false;
            } else {
                this.refs.btnOk.disabled = true;
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
                        <input type="password" class="form-control" ref="pwd" onChange={this.waitEvaluate} />
                        <label>{i18next.t('repeat-password')}</label>
                        <input type="password" class="form-control" ref="pwd2" />
                        <div ref="renderSecureCloudResult">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <p className="errorMessage" ref="errorMessage"></p>
                        {this.mustChangeUserPassword ? null :
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>}
                        <button type="button" class="btn btn-success" onClick={this.pwd}
                            onClick={this.pwd} ref="btnOk" disabled={true}>{i18next.t('change-password')}</button>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default ChangePassword;
