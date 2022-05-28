import React, { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import AlertModal from "../../AlertModal";

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

import { TextField, FormControl, NativeSelect } from "@material-ui/core";
import { InputLabel } from "@mui/material";



class DocumentModal extends Component {
    constructor({ document, addDocuments, deleteDocuments, uploadDocument, grantDocumentAccessToken, locateDocumentContainers, relations }) {
        super();

        this.document = document;
        this.addDocuments = addDocuments;
        this.deleteDocuments = deleteDocuments;
        this.uploadDocument = uploadDocument;
        this.grantDocumentAccessToken = grantDocumentAccessToken;
        this.locateDocumentContainers = locateDocumentContainers;
        this.relations = relations;

        this.open = true;

        this.name = React.createRef();
        this.size = React.createRef();
        this.description = React.createRef();

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.fileSelected = this.fileSelected.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.openDocument = this.openDocument.bind(this);
    }

    componentDidMount() {
        this.renderContainers();
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    async renderContainers() {
        if (this.document != null) {
            return;
        }

        const containers = await this.locateDocumentContainers();
        ReactDOM.render(containers.map((element, i) => {
            return <option key={i} value={element.id}>{element.name}</option>
        }), document.getElementById("containers"));
    }

    getDocumentFromForm() {
        const _document = {}
        _document.name = this.name.current.value;
        _document.size = this.refs.file.files[0].size;
        _document.description = this.description.current.value;
        _document.container = parseInt(document.getElementById("containers").value);

        if (this.relations !== undefined) {
            Object.keys(this.relations).forEach((key) => {
                _document[key] = this.relations[key];
            });
        }

        return _document;
    }

    isValid(document) {
        this.refs.errorMessage.innerText = "";
        if (document.name.length === 0) {
            this.refs.errorMessage.innerText = i18next.t('name-0');
            return false;
        }
        if (document.name.length > 250) {
            this.refs.errorMessage.innerText = i18next.t('name-250');
            return false;
        }
        return true;
    }

    async add() {
        if (this.refs.file.files.length === 0) {
            return;
        }

        const document = this.getDocumentFromForm();
        if (!this.isValid(document)) {
            return;
        }
        const uploadDocument = this.uploadDocument;
        const token = (await this.grantDocumentAccessToken()).token;

        this.addDocuments(document).then((ok) => {
            if (ok.ok) {
                uploadDocument(ok.extraData[0], token, this.refs.file.files[0]).then((response) => {
                    if (response.status == 200) {
                        this.handleClose();
                    } else {
                        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-UPLOADING-DOCUMENT')}
                            modalText={i18next.t('an-unknown-error-ocurred-status-code').replace("%1", response.status)}
                        />, this.refs.renderModal);
                    }
                });
            } else {
                switch (ok.errorCode) {
                    case 1: {
                        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-UPLOADING-DOCUMENT')}
                            modalText={i18next.t('there-is-not-enought-space-in-the-document-container-to-store-this-document')
                                .replace("%1", window.bytesToSize(ok.extraData[0])).replace("%2", window.bytesToSize(ok.extraData[1]))}
                        />, this.refs.renderModal);
                        break;
                    }
                    case 2: {
                        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-UPLOADING-DOCUMENT')}
                            modalText={i18next.t('the-file-exceeds-the-document-container-maximum-file-size')
                                .replace("%1", window.bytesToSize(ok.extraData[0]))}
                        />, this.refs.renderModal);
                        break;
                    }
                    case 3: {
                        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-UPLOADING-DOCUMENT')}
                            modalText={i18next.t('the-file-exceeds-the-servers-security-maximum-request-body-length-and-cannot-be-uploaded-desc')
                                .replace("%1", window.bytesToSize(ok.extraData[0]))}
                        />, this.refs.renderModal);
                        break;
                    }
                    default: // 0
                        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-UPLOADING-DOCUMENT')}
                            modalText={i18next.t('an-unknown-error-ocurred')}
                        />, this.refs.renderModal);
                }
            }
        });
    }

    async update() {
        if (this.refs.file.files.length === 0) {
            return;
        }

        const token = (await this.grantDocumentAccessToken()).token;

        this.uploadDocument(this.document.uuid, token, this.refs.file.files[0]).then((response) => {
            if (response.status == 200) {
                this.handleClose();
            } else {
                ReactDOM.unmountComponentAtNode(this.refs.renderModal);
                ReactDOM.render(<AlertModal
                    modalTitle={i18next.t('ERROR-UPLOADING-DOCUMENT')}
                    modalText={i18next.t('an-unknown-error-ocurred-status-code').replace("%1", response.status)}
                />, this.refs.renderModal);
            }
        });
    }

    delete() {
        const documentId = this.document.id;
        this.deleteDocuments(documentId).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    fileSelected() {
        if (this.refs.file.files.length === 0) {
            this.name.current.value = "";
            this.refs.fileLabel.innerText = i18next.t('choose-file');
            this.size.current.value = "0";
        } else {
            this.name.current.value = this.refs.file.files[0].name;
            this.refs.fileLabel.innerText = this.refs.file.files[0].name;
            this.size.current.value = window.bytesToSize(this.refs.file.files[0].size);
        }
    }

    async openDocument() {
        const token = (await this.grantDocumentAccessToken()).token;
        window.open(window.location.protocol + "//" + window.location.hostname + ":" + window.global_config.document.port
            + "/" + window.global_config.document.path + "?uuid=" + this.document.uuid + "&token=" + token, '_blank');
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
                {i18next.t('document')}
            </this.DialogTitle>
            <DialogContent>
                <div ref="renderModal"></div>
                {this.document != null ? null :
                    <FormControl fullWidth>
                        <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('document-container')}</InputLabel>
                        <NativeSelect
                            style={{ 'marginTop': '0' }}
                            id="containers">

                        </NativeSelect>
                    </FormControl>}
                <div class="form-group mt-3">
                    <TextField label={i18next.t('name')} variant="outlined" fullWidth size="small" inputRef={this.name} focused
                        defaultValue={this.document != null ? this.document.name : ''} InputProps={{ readOnly: this.document != null }}
                        inputProps={{ maxLength: 250 }} />
                </div>
                <div class="custom-file">
                    <input type="file" class="custom-file-input" ref="file" onChange={this.fileSelected} />
                    <label class="custom-file-label" ref="fileLabel">{i18next.t('choose-file')}</label>
                </div>
                <div class="form-group mt-3">
                    <TextField label={i18next.t('size')} variant="outlined" fullWidth size="small" inputRef={this.size}
                        defaultValue={this.document != null ? window.bytesToSize(this.document.size) : '0'} InputProps={{ readOnly: true }} />
                </div>
                <div class="form-group">
                    <TextField label={i18next.t('description')} variant="outlined" fullWidth size="small" inputRef={this.description}
                        defaultValue={this.document == null ? '' : this.document.description} multiline maxRows={8} minRows={5}
                        inputProps={{ maxLength: 3000 }} />
                </div>
            </DialogContent>
            <DialogActions>
                <p className="errorMessage" ref="errorMessage"></p>
                {this.document != null ? <button type="button" class="btn btn-primary" onClick={this.openDocument}>{i18next.t('open-document')}</button> : null}
                {this.document != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                {this.document == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                {this.document != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
            </DialogActions>
        </Dialog>
    }
}



export default DocumentModal;
