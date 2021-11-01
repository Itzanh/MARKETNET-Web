import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

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



class ManufacturingOrderTypes extends Component {
    constructor({ getManufacturingOrderTypes, addManufacturingOrderTypes, updateManufacturingOrderTypes, deleteManufacturingOrderTypes }) {
        super();

        this.getManufacturingOrderTypes = getManufacturingOrderTypes;
        this.addManufacturingOrderTypes = addManufacturingOrderTypes;
        this.updateManufacturingOrderTypes = updateManufacturingOrderTypes;
        this.deleteManufacturingOrderTypes = deleteManufacturingOrderTypes;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderManufacturingOrderTypes();
    }

    renderManufacturingOrderTypes() {
        this.getManufacturingOrderTypes().then((types) => {
            this.list = types;
            this.forceUpdate();
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderManufacturingOrderTypesModal'));
        ReactDOM.render(
            <ManufacturingOrderTypeModal
                addManufacturingOrderTypes={(type) => {
                    const promise = this.addManufacturingOrderTypes(type);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderManufacturingOrderTypes();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderManufacturingOrderTypesModal'));
    }

    edit(type) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderManufacturingOrderTypesModal'));
        ReactDOM.render(
            <ManufacturingOrderTypeModal
                type={type}
                updateManufacturingOrderTypes={(type) => {
                    const promise = this.updateManufacturingOrderTypes(type);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderManufacturingOrderTypes();
                        }
                    });
                    return promise;
                }}
                deleteManufacturingOrderTypes={(typeId) => {
                    const promise = this.deleteManufacturingOrderTypes(typeId);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderManufacturingOrderTypes();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderManufacturingOrderTypesModal'));
    }

    render() {
        return <div id="tabManufacturingOrderTypes">
            <div id="renderManufacturingOrderTypesModal"></div>
            <h1>{i18next.t('manufacturing-order-types')}</h1>
            <button type="button" class="btn btn-primary ml-2 m-2" onClick={this.add}>{i18next.t('add')}</button>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'id', headerName: '#', width: 90 },
                    { field: 'name', headerName: i18next.t('name'), flex: 1 }
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

class ManufacturingOrderTypeModal extends Component {
    constructor({ type, addManufacturingOrderTypes, updateManufacturingOrderTypes, deleteManufacturingOrderTypes }) {
        super();

        this.type = type;
        this.addManufacturingOrderTypes = addManufacturingOrderTypes;
        this.updateManufacturingOrderTypes = updateManufacturingOrderTypes;
        this.deleteManufacturingOrderTypes = deleteManufacturingOrderTypes;
        this.open = true;

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    getTypeFromForm() {
        const type = {}
        type.name = this.refs.name.value;
        return type;
    }

    isValid(type) {
        this.refs.errorMessage.innerText = "";
        if (type.name.length === 0) {
            this.refs.errorMessage.innerText = i18next.t('name-0');
            return false;
        }
        if (type.name.length > 100) {
            this.refs.errorMessage.innerText = i18next.t('name-100');
            return false;
        }
        return true;
    }

    add() {
        const type = this.getTypeFromForm();
        if (!this.isValid(type)) {
            return;
        }

        this.addManufacturingOrderTypes(type).then((ok) => {
            if (ok) {
                window.$('#manufacturingOrderTypeModal').modal('hide');
            }
        });
    }

    update() {
        const type = this.getTypeFromForm();
        if (!this.isValid(type)) {
            return;
        }
        type.id = this.type.id;

        this.updateManufacturingOrderTypes(type).then((ok) => {
            if (ok) {
                window.$('#manufacturingOrderTypeModal').modal('hide');
            }
        });
    }

    delete() {
        const typeId = this.type.id;
        this.deleteManufacturingOrderTypes(typeId).then((ok) => {
            if (ok) {
                window.$('#manufacturingOrderTypeModal').modal('hide');
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
                {i18next.t('manufacturing-order-type')}
            </this.DialogTitle>
            <DialogContent>
                <div class="form-group">
                    <label>{i18next.t('name')}</label>
                    <input type="text" class="form-control" ref="name" defaultValue={this.type != null ? this.type.name : ''} />
                </div>
            </DialogContent>
            <DialogActions>
                <p className="errorMessage" ref="errorMessage"></p>
                {this.type != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                {this.type == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                {this.type != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
            </DialogActions>
        </Dialog>
    }
}

export default ManufacturingOrderTypes;
