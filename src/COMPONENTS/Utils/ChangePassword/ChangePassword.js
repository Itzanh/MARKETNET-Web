/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import SecureCloudEvaluation from "../Users/SecureCloudEvaluation";

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



class ChangePassword extends Component {
    constructor({ userAutoPassword, mustChangeUserPassword, evaluatePasswordSecureCloud }) {
        super();

        this.userAutoPassword = userAutoPassword;
        this.mustChangeUserPassword = mustChangeUserPassword;
        this.evaluatePasswordSecureCloud = evaluatePasswordSecureCloud;

        this.evaluateTimer = null;
        this.open = true;

        this.pwd = this.pwd.bind(this);
        this.evaluate = this.evaluate.bind(this);
        this.waitEvaluate = this.waitEvaluate.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            ReactDOM.render(<SecureCloudEvaluation />, this.refs.renderSecureCloudResult);
        }, 50);
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
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
                this.handleClose();
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
                this.refs.btnOk.addEventListener("click", this.pwd);
            } else {
                this.refs.btnOk.disabled = true;
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
                {this.mustChangeUserPassword ? null : <IconButton aria-label="close" className={classes.closeButton} onClick={this.handleClose}>
                    <CloseIcon />
                </IconButton>}
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
                {i18next.t('change-password')}
            </this.DialogTitle>
            <DialogContent>
                <label>{i18next.t('current-password')}</label>
                <input type="password" class="form-control" ref="curr_pwd" />
                <label>{i18next.t('password')}</label>
                <input type="password" class="form-control" ref="pwd" onChange={this.waitEvaluate} />
                <label>{i18next.t('repeat-password')}</label>
                <input type="password" class="form-control" ref="pwd2" />
                <div ref="renderSecureCloudResult">
                </div>
            </DialogContent>
            <DialogActions>
                <p className="errorMessage" ref="errorMessage"></p>
                {this.mustChangeUserPassword ? null :
                    <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>}
                <button type="button" class="btn btn-success" onClick={this.pwd}
                    onClick={this.pwd} ref="btnOk" disabled={true}>{i18next.t('change-password')}</button>
            </DialogActions>
        </Dialog>
    }
}

export default ChangePassword;
