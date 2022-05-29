import React, { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from "i18next";
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
import Grow from '@mui/material/Grow';

import { TextField, FormControl, NativeSelect } from "@material-ui/core";
import { InputLabel } from "@mui/material";
import AlertModal from "../../AlertModal";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Grow direction="up" ref={ref} {...props} />;
});



class ProductWarehouseMinimumStock extends Component {
    constructor({ productId, getTransferBetweenWarehousesMinimumStock, insertTransferBetweenWarehousesMinimumStock,
        updateTransferBetweenWarehousesMinimumStock, deleteTransferBetweenWarehousesMinimumStock, getWarehouses }) {
        super();

        this.productId = productId;
        this.getTransferBetweenWarehousesMinimumStock = getTransferBetweenWarehousesMinimumStock;
        this.insertTransferBetweenWarehousesMinimumStock = insertTransferBetweenWarehousesMinimumStock;
        this.updateTransferBetweenWarehousesMinimumStock = updateTransferBetweenWarehousesMinimumStock;
        this.deleteTransferBetweenWarehousesMinimumStock = deleteTransferBetweenWarehousesMinimumStock;
        this.getWarehouses = getWarehouses;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.print();
    }

    print() {
        this.getTransferBetweenWarehousesMinimumStock(this.productId).then((list) => {
            this.list = list;
            this.forceUpdate();
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(<ProductWarehouseMinimumStockModal
            productId={this.productId}
            insertTransferBetweenWarehousesMinimumStock={(minimumStock) => {
                const promise = this.insertTransferBetweenWarehousesMinimumStock(minimumStock);
                promise.then(() => {
                    this.print();
                });
                return promise;
            }}
            getWarehouses={this.getWarehouses}
        />, this.refs.renderModal);
    }

    edit(minimumStock) {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(<ProductWarehouseMinimumStockModal
            minimumStock={minimumStock}
            productId={this.productId}
            updateTransferBetweenWarehousesMinimumStock={(minimumStock) => {
                const promise = this.updateTransferBetweenWarehousesMinimumStock(minimumStock);
                promise.then(() => {
                    this.print();
                });
                return promise;
            }}
            deleteTransferBetweenWarehousesMinimumStock={(minimumStockId) => {
                const promise = this.deleteTransferBetweenWarehousesMinimumStock(minimumStockId);
                promise.then(() => {
                    this.print();
                });
                return promise;
            }}
            getWarehouses={this.getWarehouses}
        />, this.refs.renderModal);
    }

    render() {
        return <div>
            <div ref="renderModal"></div>
            <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button>
            <br />
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    {
                        field: 'warehouseOriginName', headerName: i18next.t('warehouse-from'), flex: 1, valueGetter: (params) => {
                            return params.row.warehouseDestination.name;
                        }
                    },
                    { field: 'quantity', headerName: i18next.t('quantity'), width: 300 },
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
};



class ProductWarehouseMinimumStockModal extends Component {
    constructor({ minimumStock, productId, insertTransferBetweenWarehousesMinimumStock, updateTransferBetweenWarehousesMinimumStock,
        deleteTransferBetweenWarehousesMinimumStock, getWarehouses }) {
        super();

        this.minimumStock = minimumStock;
        this.productId = productId;
        this.insertTransferBetweenWarehousesMinimumStock = insertTransferBetweenWarehousesMinimumStock;
        this.updateTransferBetweenWarehousesMinimumStock = updateTransferBetweenWarehousesMinimumStock;
        this.deleteTransferBetweenWarehousesMinimumStock = deleteTransferBetweenWarehousesMinimumStock;
        this.getWarehouses = getWarehouses;

        this.originWarehouseWithMoreStock = this.minimumStock != null ? this.minimumStock.originWarehouseWithMoreStock : false;
        this.useOtherWarehousesFallback =
            this.minimumStock != null && this.originWarehouseWithMoreStock == false ? this.minimumStock.useOtherWarehousesFallback : false;
        this.quantity = React.createRef();
        this.open = true;
        this.warehouses = [];

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    async componentDidMount() {
        this.warehouses = await this.getWarehouses();
        this.forceUpdate();
        if (this.minimumStock != null) {
            document.getElementById("warehouseDestination").value = this.minimumStock.warehouseDestinationId;
            if (document.getElementById("warehouseOrigin") != null) {
                document.getElementById("warehouseOrigin").value = this.minimumStock.warehouseOriginId;
            }
        }
    }

    getTransferBetweenWarehousesMinimumStockFromForm() {
        const minimumStock = {};
        minimumStock.productId = this.productId;
        minimumStock.warehouseDestinationId = document.getElementById("warehouseDestination").value;
        minimumStock.quantity = parseInt(this.quantity.current.value);
        minimumStock.originWarehouseWithMoreStock = this.originWarehouseWithMoreStock;
        if (!this.originWarehouseWithMoreStock) {
            minimumStock.warehouseOriginId = document.getElementById("warehouseOrigin").value;
            minimumStock.useOtherWarehousesFallback = this.useOtherWarehousesFallback;
        }
        return minimumStock;
    }

    isValid(minimumStock) {
        if (minimumStock.warehouseDestinationId.length === 0) {
            ReactDOM.unmountComponentAtNode(this.refs.render);
            ReactDOM.render(<AlertModal
                modalTitle={i18next.t('VALIDATION-ERROR')}
                modalText={i18next.t('you-must-select-a-destination-warehouse')}
            />, this.refs.render);
            return false;
        }
        if (!minimumStock.originWarehouseWithMoreStock) {
            if (minimumStock.warehouseOriginId.length === 0) {
                ReactDOM.unmountComponentAtNode(this.refs.render);
                ReactDOM.render(<AlertModal
                    modalTitle={i18next.t('VALIDATION-ERROR')}
                    modalText={i18next.t('you-must-select-an-origin-warehouse')}
                />, this.refs.render);
                return false;
            }
            if (minimumStock.warehouseOriginId === minimumStock.warehouseDestinationId) {
                ReactDOM.unmountComponentAtNode(this.refs.render);
                ReactDOM.render(<AlertModal
                    modalTitle={i18next.t('VALIDATION-ERROR')}
                    modalText={i18next.t('you-cant-transfer-to-the-same-warehouse')}
                />, this.refs.render);
                return false;
            }
        }
        return true;
    }

    add() {
        const minimumStock = this.getTransferBetweenWarehousesMinimumStockFromForm();
        if (!this.isValid(minimumStock)) {
            return false;
        }

        this.insertTransferBetweenWarehousesMinimumStock(minimumStock).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    update() {
        const minimumStock = this.getTransferBetweenWarehousesMinimumStockFromForm();
        if (!this.isValid(minimumStock)) {
            return false;
        }
        minimumStock.id = this.minimumStock.id;

        this.updateTransferBetweenWarehousesMinimumStock(minimumStock).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    delete() {
        this.deleteTransferBetweenWarehousesMinimumStock(this.minimumStock.id).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
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
                    ReactDOM.unmountComponentAtNode(this.refs.render);
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
        return (<div>
            <div ref="render"></div>
            <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'md'}
                PaperComponent={this.PaperComponent} TransitionComponent={Transition}>
                <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    {i18next.t('minimum-stock-of-a-product-in-a-warehouse')}
                </this.DialogTitle>
                <DialogContent>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('warehouse-to')}</InputLabel>
                        <NativeSelect
                            style={{ 'marginTop': '0' }}
                            id="warehouseDestination"
                        >
                            {this.warehouses.map((element, i) => {
                                return <option key={i} value={element.id}>{element.name}</option>
                            })}
                        </NativeSelect>
                    </FormControl>
                    <br />
                    <br />
                    <TextField id="quantity" inputRef={this.quantity} label={i18next.t('quantity')} variant="outlined" fullWidth size="small"
                        type="number" InputProps={{ inputProps: { min: 1 } }} defaultValue={this.minimumStock != null ? this.minimumStock.quantity : "1"} />
                    <br />
                    <br />
                    <div class="custom-control custom-switch">
                        <input class="form-check-input custom-control-input" type="checkbox" ref="originWarehouseWithMoreStock"
                            id="originWarehouseWithMoreStock" defaultChecked={this.originWarehouseWithMoreStock}
                            onChange={(e) => {
                                this.originWarehouseWithMoreStock = e.target.checked;
                                this.forceUpdate();
                            }} />
                        <label class="form-check-label custom-control-label" htmlFor="originWarehouseWithMoreStock">
                            {i18next.t('origin-warehouse-with-more-stock')}</label>
                    </div>
                    <br />
                    {this.originWarehouseWithMoreStock ? null :
                        <div>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('warehouse-from')}</InputLabel>
                                <NativeSelect
                                    style={{ 'marginTop': '0' }}
                                    id="warehouseOrigin"
                                >
                                    {this.warehouses.map((element, i) => {
                                        return <option key={i} value={element.id}>{element.name}</option>
                                    })}
                                </NativeSelect>
                            </FormControl>
                            <br />
                            <br />
                            <div class="custom-control custom-switch">
                                <input class="form-check-input custom-control-input" type="checkbox" ref="useOtherWarehousesFallback"
                                    onChange={(e) => {
                                        this.useOtherWarehousesFallback = e.target.checked;
                                    }} id="useOtherWarehousesFallback" defaultChecked={this.useOtherWarehousesFallback} />
                                <label class="form-check-label custom-control-label" htmlFor="useOtherWarehousesFallback">
                                    {i18next.t('use-other-warehouses-as-fallback')}</label>
                            </div>
                        </div>}
                </DialogContent>
                <DialogActions>
                    {this.minimumStock != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                    <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                    {this.minimumStock == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                    {this.minimumStock != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
                </DialogActions>
            </Dialog>
        </div>);
    }
}



export default ProductWarehouseMinimumStock;
