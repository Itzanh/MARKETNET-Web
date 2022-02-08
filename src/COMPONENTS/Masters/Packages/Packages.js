import React, { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';
import AutocompleteField from "../../AutocompleteField";

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

import { TextField } from "@material-ui/core";



class Packages extends Component {
    constructor({ getPackages, addPackages, updatePackages, deletePackages, findProductByName, getNameProduct }) {
        super();

        this.getPackages = getPackages;
        this.addPackages = addPackages;
        this.updatePackages = updatePackages;
        this.deletePackages = deletePackages;
        this.findProductByName = findProductByName;
        this.getNameProduct = getNameProduct;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderPackages();
    }

    renderPackages() {
        this.getPackages().then((series) => {
            this.list = series;
            this.forceUpdate();
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderPackageModal'));
        ReactDOM.render(
            <PackageModal
                findProductByName={this.findProductByName}
                addPackages={(_package) => {
                    const promise = this.addPackages(_package);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderPackages();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderPackageModal'));
    }

    async edit(_package) {
        const defaultValueNameProduct = await this.getNameProduct(_package.product);

        ReactDOM.unmountComponentAtNode(document.getElementById('renderPackageModal'));
        ReactDOM.render(
            <PackageModal
                _package={_package}
                findProductByName={this.findProductByName}
                defaultValueNameProduct={defaultValueNameProduct}
                updatePackages={(_package) => {
                    const promise = this.updatePackages(_package);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderPackages();
                        }
                    });
                    return promise;
                }}
                deletePackages={(_packageId) => {
                    const promise = this.deletePackages(_packageId);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderPackages();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderPackageModal'));
    }

    render() {
        return <div id="tabPackages">
            <div id="renderPackageModal"></div>
            <h4 className="ml-2">{i18next.t('packages')}</h4>
            <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add')}</button>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'name', headerName: i18next.t('name'), flex: 1 },
                    { field: 'weight', headerName: i18next.t('weight'), width: 150 },
                    { field: 'width', headerName: i18next.t('width'), width: 150 },
                    { field: 'height', headerName: i18next.t('height'), width: 150 },
                    { field: 'depth', headerName: i18next.t('depth'), width: 150 }
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}



class PackageModal extends Component {
    constructor({ _package, addPackages, updatePackages, deletePackages, findProductByName, defaultValueNameProduct }) {
        super();

        this.package = _package;
        this.addPackages = addPackages;
        this.updatePackages = updatePackages;
        this.deletePackages = deletePackages;
        this.findProductByName = findProductByName;
        this.defaultValueNameProduct = defaultValueNameProduct;

        this.currentSelectedProductId = this.package == null ? null : this.package.product;
        this.open = true;

        this.name = React.createRef();
        this.weight = React.createRef();
        this.width = React.createRef();
        this.height = React.createRef();
        this.depth = React.createRef();

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    getPackageFromForm() {
        const _package = {};
        _package.name = this.refs.name.value;
        _package.weight = parseFloat(this.refs.weight.value);
        _package.width = parseFloat(this.refs.width.value);
        _package.height = parseFloat(this.refs.height.value);
        _package.depth = parseFloat(this.refs.depth.value);
        _package.product = parseInt(this.currentSelectedProductId);
        return _package;
    }

    isValid(_package) {
        this.refs.errorMessage.innerText = "";
        if (_package.name.length === 0) {
            this.refs.errorMessage.innerText = i18next.t('name-0');
            return false;
        }
        if (_package.name.length > 50) {
            this.refs.errorMessage.innerText = i18next.t('name-50');
            return false;
        }
        if (_package.width <= 0 || _package.height <= 0 || _package.depth <= 0) {
            this.refs.errorMessage.innerText = i18next.t('dim-0');
            return false;
        }
        return true;
    }

    add() {
        const _package = this.getPackageFromForm();
        if (!this.isValid(_package)) {
            return;
        }

        this.addPackages(_package).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    update() {
        const _package = this.getPackageFromForm();
        if (!this.isValid(_package)) {
            return;
        }
        _package.id = this.package.id;

        this.updatePackages(_package).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    delete() {
        this.deletePackages(this.package.id).then((ok) => {
            if (ok) {
                this.handleClose();
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
                {i18next.t('package')}
            </this.DialogTitle>
            <DialogContent>
                <div class="form-group">
                    <TextField label={i18next.t('name')} variant="outlined" fullWidth size="small" inputRef={this.name}
                        defaultValue={this.package != null ? this.package.name : ''} />
                </div>
                <div class="form-row">
                    <div class="col">
                        <TextField label={i18next.t('weight')} variant="outlined" fullWidth size="small" inputRef={this.weight} type="number"
                            defaultValue={this.package != null ? this.package.weight : '0'} InputProps={{ inputProps: { min: 0 } }} />
                    </div>
                    <div class="col">
                        <TextField label={i18next.t('width')} variant="outlined" fullWidth size="small" inputRef={this.width} type="number"
                            defaultValue={this.package != null ? this.package.width : '0'} InputProps={{ inputProps: { min: 0 } }} />
                    </div>
                    <div class="col">
                        <TextField label={i18next.t('height')} variant="outlined" fullWidth size="small" inputRef={this.height} type="number"
                            defaultValue={this.package != null ? this.package.height : '0'} InputProps={{ inputProps: { min: 0 } }} />
                    </div>
                    <div class="col">
                        <TextField label={i18next.t('depth')} variant="outlined" fullWidth size="small" inputRef={this.depth} type="number"
                            defaultValue={this.package != null ? this.package.depth : '0'} InputProps={{ inputProps: { min: 0 } }} />
                    </div>
                </div>
                <label>{i18next.t('product')}</label>
                <AutocompleteField findByName={this.findProductByName}
                    defaultValueId={this.package != null ? this.package.product : null}
                    defaultValueName={this.defaultValueNameProduct} valueChanged={(value) => {
                        this.currentSelectedProductId = value;
                    }} />
            </DialogContent>
            <DialogActions>
                <p className="errorMessage" ref="errorMessage"></p>
                {this.package != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                {this.package == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                {this.package != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
            </DialogActions>
        </Dialog>
    }
}

export default Packages;
