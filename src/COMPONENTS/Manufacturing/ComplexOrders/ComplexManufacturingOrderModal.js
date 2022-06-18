import React, { Component } from "react";
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
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Button } from "@material-ui/core";
import Grow from '@mui/material/Grow';

import { TextField, FormControl, NativeSelect } from "@material-ui/core";
import { InputLabel } from "@mui/material";

// IMG
import TransactionLogViewModal from "../../VisualComponents/TransactionLogViewModal";
import AlertModal from "../../AlertModal";
import WindowRequestData from "../../WindowRequestData";

import DATAMatrix from './../../../datamatrix.js';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Grow direction="up" ref={ref} {...props} />;
});



class ComplexManufacturingOrderModal extends Component {
    constructor({ order, insertComplexManufacturingOrder, insertMultipleComplexManufacturingOrders, getManufacturingOrderTypes,
        toggleManufactuedComplexManufacturingOrder, deleteComplexManufacturingOrder, getRegisterTransactionalLogs,
        getComplexManufacturingOrderManufacturingOrder, complexManufacturingOrderTagPrinted, getWarehouses }) {
        super();

        this.order = order;
        this.insertComplexManufacturingOrder = insertComplexManufacturingOrder;
        this.insertMultipleComplexManufacturingOrders = insertMultipleComplexManufacturingOrders;
        this.getManufacturingOrderTypes = getManufacturingOrderTypes;
        this.toggleManufactuedComplexManufacturingOrder = toggleManufactuedComplexManufacturingOrder;
        this.deleteComplexManufacturingOrder = deleteComplexManufacturingOrder;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;
        this.getComplexManufacturingOrderManufacturingOrder = getComplexManufacturingOrderManufacturingOrder;
        this.complexManufacturingOrderTagPrinted = complexManufacturingOrderTagPrinted;
        this.getWarehouses = getWarehouses;

        this.open = true;
        this.tab = 0;
        this.listInput = [];
        this.listOutput = [];

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.printTags = this.printTags.bind(this);
        this.printUUIDLabelWithCode128 = this.printUUIDLabelWithCode128.bind(this);
        this.printUUIDLabelWithDataMatrix = this.printUUIDLabelWithDataMatrix.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.renderOrderTypes = this.renderOrderTypes.bind(this);
        this.transactionLog = this.transactionLog.bind(this);
        this.transactionLogSubOrder = this.transactionLogSubOrder.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.addMultiple = this.addMultiple.bind(this);
    }

    componentDidMount() {
        this.getComponents();
        setTimeout(async () => {
            await this.renderOrderTypes();
            await this.renderWarehouses();
        }, 100);
    }

    getComponents() {
        if (this.order == null) {
            return;
        }

        this.getComplexManufacturingOrderManufacturingOrder(this.order.id).then((components) => {
            this.listInput = components.filter((element) => { return element.type == "I" });
            this.listOutput = components.filter((element) => { return element.type == "O" });
        });
    }

    renderOrderTypes() {
        return new Promise((resolve) => {
            if (this.order == null) {
                this.getManufacturingOrderTypes().then((types) => {
                    types = types.filter((element) => { return element.complex });
                    ReactDOM.render(types.map((element, i) => {
                        return <option key={i} value={element.id}>{element.name}</option>
                    }), document.getElementById("renderTypes"));
                    resolve();
                });
            } else {
                ReactDOM.render(<option value={this.order.type}>{this.order.type.name}</option>, document.getElementById("renderTypes"));
                resolve();
            }
        });
    }

    renderWarehouses() {
        return new Promise((resolve) => {
            this.getWarehouses().then((warehouses) => {
                warehouses.unshift({ id: "", name: "." + i18next.t('default') });
                ReactDOM.render(warehouses.map((element, i) => {
                    return <option value={element.id} key={i}>{element.name}</option>
                }), document.getElementById("warehouses"));

                if (this.order != null) {
                    document.getElementById("warehouses").value = this.order.warehouseId;
                    document.getElementById("warehouses").disabled = true;
                }
                resolve();
            });
        });
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    getComplexManufacturingOrderFromForm() {
        const order = {};
        order.typeId = parseInt(document.getElementById("renderTypes").value);
        order.warehouseId = document.getElementById("warehouses").value;
        return order;
    }

    add() {
        const order = this.getComplexManufacturingOrderFromForm();

        this.insertComplexManufacturingOrder(order).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    update() {
        this.toggleManufactuedComplexManufacturingOrder(this.order.id).then((ok) => {
            if (ok) {
                this.handleClose();
            } else if (this.order.manufactured && !ok) {
                ReactDOM.render(<AlertModal
                    modalTitle={i18next.t('cant-undo')}
                    modalText={i18next.t('undoing-this-manufacturing-order-is-not-permitted')}
                />, document.getElementById("locateProductModal"));
            }
        });
    }

    delete() {
        this.deleteComplexManufacturingOrder(this.order.id).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    async printTags() {
        ReactDOM.unmountComponentAtNode(this.refs.renderBarCodes);
        const components = [];

        for (let i = 0; i < this.listOutput.length; i++) {
            components.push(<div style={{
                "display": "block",
                "width": window.config.labelPrinterProfileEAN13.productBarCodeLabelWidth + "px",
                "height": window.config.labelPrinterProfileEAN13.productBarCodeLabelHeight + "px"
            }}>
                <p style={{
                    "fontFamily": "'Libre Barcode EAN13 Text'",
                    "font-size": window.config.labelPrinterProfileEAN13.productBarCodeLabelSize + "px",
                    "marginTop": window.config.labelPrinterProfileEAN13.productBarCodeLabelMarginTop + "px",
                    "marginBottom": window.config.labelPrinterProfileEAN13.productBarCodeLabelMarginBottom + "px",
                    "marginLeft": window.config.labelPrinterProfileEAN13.productBarCodeLabelMarginLeft + "px",
                    "marginRight": window.config.labelPrinterProfileEAN13.productBarCodeLabelMarginRight + "px"
                }}
                >{this.listOutput[i].product.barCode}</p>
            </div>);
        }

        ReactDOM.render(components, this.refs.renderBarCodes);

        document.getElementById("renderBarCodes").style.display = "";
        window.$("#renderBarCodes").printElement();
        document.getElementById("renderBarCodes").style.display = "none";

        this.complexManufacturingOrderTagPrinted(this.order.id);
    }

    async printUUIDLabelWithCode128() {
        // compress the barcode
        const binary = this.order.uuid.match(/\w{2}/g).map(function (a) { return String.fromCharCode(parseInt(a, 16)); }).join("");
        const base64 = btoa(binary);

        // print the barcode
        ReactDOM.unmountComponentAtNode(this.refs.renderBarCodes);

        if (window.config.labelPrinterProfileCode128 == null) {
            ReactDOM.unmountComponentAtNode(document.getElementById("locateProductModal"));
            ReactDOM.render(<AlertModal
                modalTitle={i18next.t('label-printer-not-set-up')}
                modalText={i18next.t('there-is-no-label-printer-profile-for-this-type-of-barcode-set-up-in-the-system-settings')}
            />, document.getElementById("locateProductModal"));
            return;
        }

        const components = [];
        for (let i = 0; i < this.order.quantityManufactured; i++) {
            components.push(<div style={{
                "display": "block",
                "width": window.config.labelPrinterProfileCode128.productBarCodeLabelWidth + "px",
                "height": window.config.labelPrinterProfileCode128.productBarCodeLabelHeight + "px"
            }}>
                <p style={{
                    "fontFamily": "'Libre Barcode 128'",
                    "font-size": window.config.labelPrinterProfileCode128.productBarCodeLabelSize + "px",
                    "marginTop": window.config.labelPrinterProfileCode128.productBarCodeLabelMarginTop + "px",
                    "marginBottom": window.config.labelPrinterProfileCode128.productBarCodeLabelMarginBottom + "px",
                    "marginLeft": window.config.labelPrinterProfileCode128.productBarCodeLabelMarginLeft + "px",
                    "marginRight": window.config.labelPrinterProfileCode128.productBarCodeLabelMarginRight + "px"
                }}
                >{base64}</p>
            </div>);
        }

        ReactDOM.render(components, this.refs.renderBarCodes);

        document.getElementById("renderBarCodes").style.display = "";
        window.$("#renderBarCodes").printElement();
        document.getElementById("renderBarCodes").style.display = "none";

        this.manufacturingOrderTagPrinted(this.order.id);
    }

    async printUUIDLabelWithDataMatrix() {
        ReactDOM.unmountComponentAtNode(this.refs.renderBarCodes);

        if (window.config.labelPrinterProfileDataMatrix == null) {
            ReactDOM.unmountComponentAtNode(document.getElementById("locateProductModal"));
            ReactDOM.render(<AlertModal
                modalTitle={i18next.t('label-printer-not-set-up')}
                modalText={i18next.t('there-is-no-label-printer-profile-for-this-type-of-barcode-set-up-in-the-system-settings')}
            />, document.getElementById("locateProductModal"));
            return;
        }

        var svgNode = DATAMatrix({
            msg: this.order.uuid,
            dim: window.config.labelPrinterProfileDataMatrix.productBarCodeLabelSize, // default: 256
            pad: window.config.labelPrinterProfileDataMatrix.productBarCodeLabelMarginTop, // 1
            pal: ["#000000", "#ffffff"],
            vrb: 1
        });

        const components = [];
        for (let i = 0; i < this.order.quantityManufactured; i++) {
            components.push(<div style={{
                "display": "block",
                "width": window.config.labelPrinterProfileDataMatrix.productBarCodeLabelWidth + "px",
                "height": window.config.labelPrinterProfileDataMatrix.productBarCodeLabelHeight + "px"
            }}

                dangerouslySetInnerHTML={{ __html: svgNode.outerHTML }}>

            </div>);
        }

        ReactDOM.render(components, this.refs.renderBarCodes);

        document.getElementById("renderBarCodes").style.display = "";
        window.$("#renderBarCodes").printElement();
        document.getElementById("renderBarCodes").style.display = "none";

        this.manufacturingOrderTagPrinted(this.order.id);
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

    transactionLog() {
        if (this.order == null) {
            return;
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('locateProductModal'));
        ReactDOM.render(<TransactionLogViewModal
            getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
            tableName={"complex_manufacturing_order"}
            registerId={this.order.id}
        />,
            document.getElementById('locateProductModal'));
    }

    transactionLogSubOrder(suborderId) {
        if (this.order == null) {
            return;
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('locateProductModal'));
        ReactDOM.render(<TransactionLogViewModal
            getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
            tableName={"complex_manufacturing_order_manufacturing_order"}
            registerId={suborderId}
        />,
            document.getElementById('locateProductModal'));
    }

    async handleTabChange(_, tab) {
        this.tab = tab;
        await this.forceUpdate();
        if (tab == 0) {
            ReactDOM.render(<option value={this.order.type}>{this.order.type.name}</option>, document.getElementById("renderTypes"));
            this.renderWarehouses();
        }
    }

    addMultiple() {
        const manufaturingOrder = this.getComplexManufacturingOrderFromForm();
        if (!this.isValid(manufaturingOrder)) {
            return;
        }
        const order = {};
        order.order = manufaturingOrder;

        ReactDOM.unmountComponentAtNode(document.getElementById("locateProductModal"));
        ReactDOM.render(<WindowRequestData
            modalTitle={i18next.t('input-quantity')}
            modalText={i18next.t('input-the-quantity-of-manufacturing-orders-to-generate')}
            dataType="number"
            min="1"
            max="10000"
            defaultValue="1"
            onDataInput={(quantity) => {
                order.quantity = parseInt(quantity);
                this.insertMultipleComplexManufacturingOrders(order).then((ok) => {
                    if (ok) {
                        this.handleClose();
                    }
                });
            }}
        />, document.getElementById("locateProductModal"));
    }

    render() {
        return <div>

            <div ref="renderBarCodes" id="renderBarCodes" style={{ "height": "0px", "width": "0px", "display": "none" }}>
            </div>

            <div id="locateProductModal"></div>
            <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'xl'}
                PaperComponent={this.PaperComponent} TransitionComponent={Transition}>
                <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    {i18next.t('manufacturing-order')}
                </this.DialogTitle>
                <DialogContent>
                    <AppBar position="static" style={{ 'backgroundColor': '#1976d2' }}>
                        <Tabs value={this.tab} onChange={this.handleTabChange}>
                            <Tab label={i18next.t('details')} />
                            <Tab label={i18next.t('input')} />
                            <Tab label={i18next.t('output')} />
                        </Tabs>
                    </AppBar>
                    {this.tab != 0 ? null : <div>
                        <br />
                        <FormControl fullWidth>
                            <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('type')}</InputLabel>
                            <NativeSelect
                                style={{ 'marginTop': '0' }}
                                id="renderTypes"
                                disabled={this.order != null}>

                            </NativeSelect>
                        </FormControl>

                        <div class="form-group mt-3">
                            <FormControl fullWidth>
                                <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('warehouse')}</InputLabel>
                                <NativeSelect
                                    style={{ 'marginTop': '0' }}
                                    id="warehouses"
                                    disabled={this.order != null}>

                                </NativeSelect>
                            </FormControl>
                        </div>

                        <div class="form-row mt-3">
                            <div class="col">
                                <TextField label={i18next.t('user-created')} variant="outlined" fullWidth size="small"
                                    defaultValue={this.order != null ? this.order.userCreated.username : null} InputProps={{ readOnly: true }} />
                            </div>
                            <div class="col">
                                <TextField label={i18next.t('user-manufactured')} variant="outlined" fullWidth size="small"
                                    defaultValue={this.order != null && this.order.userManufactured != null ? this.order.userManufactured.username : null}
                                    InputProps={{ readOnly: true }} />
                            </div>
                            <div class="col">
                                <TextField label={i18next.t('user-that-printed-the-tag')} variant="outlined" fullWidth size="small"
                                    defaultValue={this.order != null && this.order.userTagPrinted != null ? this.order.userTagPrinted.username : null}
                                    InputProps={{ readOnly: true }} />
                            </div>
                        </div>

                        <div class="form-row mt-3 mb-5">
                            <div class="col">
                                <TextField label={i18next.t('date-created')} variant="outlined" fullWidth size="small"
                                    defaultValue={this.order != null ? window.dateFormat(this.order.dateCreated) : null}
                                    InputProps={{ readOnly: true }} />
                            </div>
                            <div class="col">
                                <TextField label={i18next.t('date-manufactured')} variant="outlined" fullWidth size="small"
                                    defaultValue={this.order != null && this.order.dateManufactured != null ? window.dateFormat(this.order.dateManufactured) : null}
                                    InputProps={{ readOnly: true }} />
                            </div>
                            <div class="col">
                                <TextField label={i18next.t('label-printing-date')} variant="outlined" fullWidth size="small"
                                    defaultValue={this.order != null && this.order.dateTagPrinted != null ? window.dateFormat(this.order.dateTagPrinted) : null}
                                    InputProps={{ readOnly: true }} />
                            </div>
                        </div>
                    </div>}
                    {this.tab != 1 ? null : <div>
                        <DataGrid
                            ref="table"
                            autoHeight
                            rows={this.listInput}
                            columns={[
                                {
                                    field: 'productName', headerName: i18next.t('product'), flex: 1, valueGetter: (params) => {
                                        return params.row.product.name;
                                    }
                                },
                                { field: 'manufacturingOrderId', headerName: i18next.t('manufacturing-order'), width: 210 },
                                { field: 'warehouseMovementId', headerName: i18next.t('warehouse-movement'), width: 220 },
                                { field: 'purchaseOrderName', headerName: i18next.t('purchase-order'), width: 200 },
                                { field: 'manufactured', headerName: i18next.t('manufactured'), width: 180, type: 'boolean' },
                                {
                                    field: "log", headerName: "Log", width: 100, renderCell: (params) => (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            style={{ marginLeft: 16 }}
                                            onClick={() => {
                                                this.transactionLogSubOrder(params.row.id);
                                            }}
                                        >
                                            Log
                                        </Button>
                                    ),
                                },
                            ]}
                        />
                    </div>}
                    {this.tab != 2 ? null : <div>
                        <DataGrid
                            ref="table"
                            autoHeight
                            rows={this.listOutput}
                            columns={[
                                {
                                    field: 'productName', headerName: i18next.t('product'), flex: 1, valueGetter: (params) => {
                                        return params.row.product.name;
                                    }
                                },
                                { field: 'warehouseMovementId', headerName: i18next.t('warehouse-movement'), width: 250 },
                                { field: 'saleOrderName', headerName: i18next.t('sale-order'), width: 250 },
                                { field: 'manufactured', headerName: i18next.t('manufactured'), width: 180, type: 'boolean' },
                                {
                                    field: "log", headerName: "Log", width: 100, renderCell: (params) => (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            style={{ marginLeft: 16 }}
                                            onClick={() => {
                                                this.transactionLogSubOrder(params.row.id);
                                            }}
                                        >
                                            Log
                                        </Button>
                                    ),
                                },
                            ]}
                        />
                    </div>}
                </DialogContent>
                <DialogActions>
                    <div class="btn-group dropup">
                        <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {i18next.t('options')}
                        </button>
                        <div class="dropdown-menu">
                            {this.order != null ? <a class="dropdown-item" href="#" onClick={this.transactionLog}>{i18next.t('transactional-log')}</a> : null}
                        </div>
                    </div>

                    <p className="errorMessage" ref="errorMessage"></p>
                    {this.order != null && this.order.manufactured == false && !window.getPermission("CANT_DELETE_MANUFACTURING_ORDERS") ?
                        <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                    <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                    {this.order == null ? <div class="btn-group" role="group" aria-label="Button group with nested dropdown">
                        <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button>
                        <div class="btn-group" role="group">
                            <button id="btnGroupDrop1" type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown"
                                aria-haspopup="true" aria-expanded="false">
                            </button>
                            <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                                <a class="dropdown-item" href="#" onClick={this.addMultiple}>{i18next.t('add-multiple')}</a>
                            </div>
                        </div>
                    </div> : null}
                    {this.order != null && !this.order.manufactured ?
                        <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('manufactured')}</button> : null}
                    {this.order != null && this.order.manufactured ?
                        <button type="button" class="btn btn-danger" onClick={this.update}>{i18next.t('undo-manufactured')}</button> : null}
                    {this.order != null && this.order.manufactured ?
                        <button type="button" class="btn btn-primary" onClick={this.printTags}>{i18next.t('print-barcode')}</button> : null}
                    {this.order != null && this.order.manufactured ?
                        <button type="button" class="btn btn-primary" onClick={this.printUUIDLabelWithCode128}>{i18next.t('print-code-128')}</button> : null}
                    {this.order != null && this.order.manufactured ?
                        <button type="button" class="btn btn-primary"
                            onClick={this.printUUIDLabelWithDataMatrix}>{i18next.t('print-datamatrix')}</button> : null}
                </DialogActions>
            </Dialog>
        </div>
    }
}

export default ComplexManufacturingOrderModal;
