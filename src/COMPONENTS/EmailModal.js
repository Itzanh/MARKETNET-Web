/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';

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



class EmailModal extends Component {
    constructor({ sendEmail, destinationAddress, destinationAddressName, subject, reportId, reportDataId, languageId }) {
        super();

        this.sendEmail = sendEmail;
        this.destinationAddress = destinationAddress;
        this.destinationAddressName = destinationAddressName;
        this.subject = subject;
        this.reportId = reportId;
        this.reportDataId = reportDataId;
        this.languageId = languageId;

        this.open = true;

        this.send = this.send.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    async componentDidMount() {
        await this.renderLanguages();
    }

    renderLanguages() {
        return new Promise((resolve) => {
            window.getLanguages().then((languages) => {
                var components = languages.map((element, i) => {
                    return <option value={element.id} key={i}>{element.name}</option>
                });
                components.unshift(<option value="0" key={-1}>.{i18next.t('none')}</option>);
                ReactDOM.render(components, this.refs.lang);

                if (this.languageId != 0 && this.languageId != null) {
                    this.refs.lang.value = this.languageId;
                }

                resolve();
            });
        });
    }

    send() {
        this.sendEmail({
            destinationAddress: this.refs.destinationAddress.value,
            destinationAddressName: this.refs.destinationAddressName.value,
            subject: this.refs.subject.value,
            reportId: this.reportId,
            reportDataId: this.reportDataId,
            language: parseInt(this.refs.lang.value)
        });
        this.handleClose();
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
                    this.handleClose();
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
        return <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'sm'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                Email
            </this.DialogTitle>
            <DialogContent>
                <div class="form-group">
                    <label>Email</label>
                    <input type="text" class="form-control" ref="destinationAddress" defaultValue={this.destinationAddress} />
                </div>
                <div class="form-group">
                    <label>Name to</label>
                    <input type="text" class="form-control" ref="destinationAddressName" defaultValue={this.destinationAddressName} />
                </div>
                <div class="form-group">
                    <label>{i18next.t('subject')}</label>
                    <input type="text" class="form-control" ref="subject" defaultValue={this.subject} />
                </div>
                <label>{i18next.t('language')}</label>
                <select class="form-control" ref="lang">
                </select>
            </DialogContent>
            <DialogActions>
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                <button type="button" class="btn btn-primary" onClick={this.send}>{i18next.t('send')}</button>
            </DialogActions>
        </Dialog>
    }
}

export default EmailModal;
