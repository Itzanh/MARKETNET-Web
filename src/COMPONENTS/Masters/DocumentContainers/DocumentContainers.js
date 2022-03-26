import React, { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';
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

import { TextField, LinearProgress } from "@material-ui/core";



class DocumentContainers extends Component {
    constructor({ getDocumentContainers, addDocumentContainers, updateDocumentContainers, deleteDocumentContainers }) {
        super();

        this.getDocumentContainers = getDocumentContainers;
        this.addDocumentContainers = addDocumentContainers;
        this.updateDocumentContainers = updateDocumentContainers;
        this.deleteDocumentContainers = deleteDocumentContainers;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderDocumentContainers();
    }

    renderDocumentContainers() {
        this.getDocumentContainers().then((container) => {
            this.list = container;
            this.forceUpdate();
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderocumentContainersModal'));
        ReactDOM.render(
            <DocumentContainersModal
                addDocumentContainers={(container) => {
                    const promise = this.addDocumentContainers(container);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderDocumentContainers();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderocumentContainersModal'));
    }

    edit(container) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderocumentContainersModal'));
        ReactDOM.render(
            <DocumentContainersModal
                container={container}
                updateDocumentContainers={(container) => {
                    const promise = this.updateDocumentContainers(container);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderDocumentContainers();
                        }
                    });
                    return promise;
                }}
                deleteDocumentContainers={(containerId) => {
                    const promise = this.deleteDocumentContainers(containerId);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderDocumentContainers();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderocumentContainersModal'));
    }

    render() {
        return <div id="tabDocumentContainers" className="formRowRoot">
            <div id="renderocumentContainersModal"></div>
            <h4 className="ml-2">{i18next.t('document-containers')}</h4>
            <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add')}</button>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'name', headerName: i18next.t('name'), flex: 1 },
                    { field: 'path', headerName: i18next.t('path'), width: 500 },
                    {
                        field: 'maxFileSize', headerName: i18next.t('max-file-size'), width: 300, valueGetter: (params) => {
                            return (params.row.maxFileSize / 1000000) + " Mb";
                        }
                    }
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

class DocumentContainersModal extends Component {
    constructor({ container, addDocumentContainers, updateDocumentContainers, deleteDocumentContainers }) {
        super();

        this.container = container;
        this.addDocumentContainers = addDocumentContainers;
        this.updateDocumentContainers = updateDocumentContainers;
        this.deleteDocumentContainers = deleteDocumentContainers;

        this.open = true;

        this.name = React.createRef();
        this.path = React.createRef();
        this.maxFileSize = React.createRef();
        this.disallowedMimeTypes = React.createRef();
        this.allowedMimeTypes = React.createRef();

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    getContainerFromForm() {
        const containter = {};
        containter.name = this.name.current.value;
        containter.path = this.path.current.value;
        containter.maxFileSize = parseInt(this.maxFileSize.current.value) * 1000000;
        containter.disallowedMimeTypes = this.disallowedMimeTypes.current.value;
        containter.allowedMimeTypes = this.allowedMimeTypes.current.value;
        return containter;
    }

    isValid(containter) {
        this.refs.errorMessage.innerText = "";
        if (containter.name.length === 0) {
            this.refs.errorMessage.innerText = i18next.t('name-0');
            return false;
        }
        if (containter.name.length > 50) {
            this.refs.errorMessage.innerText = i18next.t('name-50');
            return false;
        }
        if (containter.path.length === 0) {
            this.refs.errorMessage.innerText = i18next.t('path-0');
            return false;
        }
        if (containter.path.length > 520) {
            this.refs.errorMessage.innerText = i18next.t('path-250');
            return false;
        }
        if (containter.maxFileSize <= 0) {
            this.refs.errorMessage.innerText = i18next.t('filesize-0');
            return false;
        }
        if (containter.disallowedMimeTypes.length > 250) {
            this.refs.errorMessage.innerText = i18next.t('disallow-mime-250');
            return false;
        }
        if (containter.allowedMimeTypes.length > 250) {
            this.refs.errorMessage.innerText = i18next.t('allow-mime-250');
            return false;
        }
        return true;
    }

    add() {
        const container = this.getContainerFromForm();
        if (!this.isValid(container)) {
            return;
        }

        this.addDocumentContainers(container).then((ok) => {
            if (ok) {
                this.handleClose();
            } else {
                ReactDOM.unmountComponentAtNode(this.refs.renderModal);
                ReactDOM.render(<AlertModal
                    modalTitle={i18next.t('ERROR-CREATING')}
                    modalText={i18next.t('if-you-are-using-the-saas-version-of-the-software-in-the-cloud-you-are-not-allowed-to-create-or-delete-document-containters')}
                />, this.refs.renderModal);
            }
        });
    }

    update() {
        const container = this.getContainerFromForm();
        if (!this.isValid(container)) {
            return;
        }
        container.id = this.container.id;

        this.updateDocumentContainers(container).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    delete() {
        this.deleteDocumentContainers(this.container.id).then((ok) => {
            if (ok) {
                this.handleClose();
            } else {
                ReactDOM.unmountComponentAtNode(this.refs.renderModal);
                ReactDOM.render(<AlertModal
                    modalTitle={i18next.t('ERROR-DELETING')}
                    modalText={i18next.t('if-you-are-using-the-saas-version-of-the-software-in-the-cloud-you-are-not-allowed-to-create-or-delete-document-containters')}
                />, this.refs.renderModal);
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
                {i18next.t('document-container')}
            </this.DialogTitle>
            <DialogContent>
                <div ref="renderModal"></div>
                {this.container != null && this.container.maxStorage != 0 ?
                    <LinearProgress variant="determinate" value={(this.container.usedStorage / this.container.maxStorage) * 100} />
                    : null}
                <br />
                <div class="form-group">
                    <TextField label={i18next.t('name')} variant="outlined" fullWidth size="small" inputRef={this.name}
                        defaultValue={this.container != null ? this.container.name : ''} />
                </div>
                <div class="form-group">
                    <TextField label={i18next.t('date-created')} variant="outlined" fullWidth size="small"
                        defaultValue={this.container != null ? window.dateFormat(this.container.dateCreated) : ''} InputProps={{ readOnly: true }} />
                </div>
                <div class="form-group">
                    <TextField label={i18next.t('path')} variant="outlined" fullWidth size="small" inputRef={this.path}
                        defaultValue={this.container != null ? this.container.path : ''} />
                </div>
                <div class="form-group">
                    <TextField label={i18next.t('max-file-size') + ' (Mb)'} variant="outlined" fullWidth size="small" inputRef={this.maxFileSize} type="number"
                        defaultValue={this.container != null ? this.container.maxFileSize / 1000000 : ''} InputProps={{ inputProps: { min: 0 } }} />
                </div>
                <div class="form-group">
                    <TextField label={i18next.t('disallowed-mime-types')} variant="outlined" fullWidth size="small" inputRef={this.disallowedMimeTypes}
                        defaultValue={this.container != null ? this.container.disallowedMimeTypes : ''} />
                </div>
                <div class="form-group">
                    <TextField label={i18next.t('allowed-mime-types')} variant="outlined" fullWidth size="small" inputRef={this.allowedMimeTypes}
                        defaultValue={this.container != null ? this.container.allowedMimeTypes : ''} />
                </div>
                <div class="form-row">
                    <div class="col">
                        <TextField label={i18next.t('used-storage')} variant="outlined" fullWidth size="small"
                            defaultValue={this.container != null ? window.bytesToSize(this.container.usedStorage) : ''} disabled={true} />
                    </div>
                    <div class="col">
                        <TextField label={i18next.t('maximum-storage')} variant="outlined" fullWidth size="small"
                            defaultValue={this.container != null ? window.bytesToSize(this.container.maxStorage) : ''} disabled={true} />
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <p className="errorMessage" ref="errorMessage"></p>
                {this.container != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                {this.container == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                {this.container != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
            </DialogActions>
        </Dialog>
    }
}

export default DocumentContainers;
