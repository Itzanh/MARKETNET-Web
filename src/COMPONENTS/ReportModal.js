/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';



class ReportModal extends Component {
    constructor({ resource, documentId, grantDocumentAccessToken }) {
        super();

        this.resource = resource;
        this.documentId = documentId;
        this.grantDocumentAccessToken = grantDocumentAccessToken;

        this.open = true;

        this.print = this.print.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    async getURL() {
        const token = (await this.grantDocumentAccessToken()).token;
        return window.location.protocol + "//" + window.location.hostname + ":" + window.global_config.report.port + "/"
            + window.global_config.report.path + "?report=" + this.resource + "&id=" + this.documentId + "&token=" + token
            + "&lang=" + this.refs.lang.value;
    }

    renderLanguages() {
        return new Promise((resolve) => {
            window.getLanguages().then((languages) => {
                var components = languages.map((element, i) => {
                    return <option value={element.id} key={i}>{element.name}</option>
                });
                components.unshift(<option value="0" key={-1}>.{i18next.t('none')}</option>);
                ReactDOM.render(components, this.refs.lang);
                resolve();
            });
        });
    }

    async componentDidMount() {
        await this.renderLanguages();
        this.renderReport();
    }

    async renderReport() {
        const url = await this.getURL();
        ReactDOM.unmountComponentAtNode(this.refs.body);
        ReactDOM.render(<iframe
            id="report"
            name="report"
            width="1100"
            height="740"
            src={url}>
        </iframe>, this.refs.body);
    }

    async print() {
        const url = await this.getURL();
        ReactDOM.unmountComponentAtNode(this.refs.body);
        ReactDOM.render(<iframe
            id="report"
            name="report"
            width="1100"
            height="740"
            src={url + "&force_print=1"}>
        </iframe>, this.refs.body);
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

    render() {
        return <Dialog onClose={this.handleClose} aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'lg'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitle onClose={this.handleClose} style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('report')}
            </this.DialogTitle>
            <this.DialogContent>
                <div ref="body">

                </div>
            </this.DialogContent>
            <DialogActions>
                <label>{i18next.t('language')}</label>
                <select class="form-control" ref="lang" onChange={() => {
                    this.renderReport();
                }}>
                </select>
                <button type="button" class="btn btn-primary" onClick={this.print}>{i18next.t('print')}</button>
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
            </DialogActions>
        </Dialog>
    }
}

export default ReportModal;
