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
import ManufacturingOrderType from "../OrderTypes/ManufacturingOrderType";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Button } from "@material-ui/core";

// IMG
import TransactionLogViewModal from "../../VisualComponents/TransactionLogViewModal";
import AlertModal from "../../AlertModal";



class ComplexManufacturingOrderModal extends Component {
    constructor({ order, insertComplexManufacturingOrder, getManufacturingOrderTypes, toggleManufactuedComplexManufacturingOrder,
        deleteComplexManufacturingOrder, getRegisterTransactionalLogs, getComplexManufacturingOrderManufacturingOrder,
        complexManufacturingOrderTagPrinted, getProductRow }) {
        super();

        this.order = order;
        this.insertComplexManufacturingOrder = insertComplexManufacturingOrder;
        this.getManufacturingOrderTypes = getManufacturingOrderTypes;
        this.toggleManufactuedComplexManufacturingOrder = toggleManufactuedComplexManufacturingOrder;
        this.deleteComplexManufacturingOrder = deleteComplexManufacturingOrder;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;
        this.getComplexManufacturingOrderManufacturingOrder = getComplexManufacturingOrderManufacturingOrder;
        this.complexManufacturingOrderTagPrinted = complexManufacturingOrderTagPrinted;
        this.getProductRow = getProductRow;

        this.open = true;
        this.tab = 0;
        this.listInput = [];
        this.listOutput = [];

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.printTags = this.printTags.bind(this);
        this.printTagManufacturing = this.printTagManufacturing.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.renderOrderTypes = this.renderOrderTypes.bind(this);
        this.transactionLog = this.transactionLog.bind(this);
        this.transactionLogSubOrder = this.transactionLogSubOrder.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
    }

    componentDidMount() {
        this.getComponents();
        setTimeout(this.renderOrderTypes, 100);
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
        if (this.order == null) {
            this.getManufacturingOrderTypes().then((types) => {
                types = types.filter((element) => { return element.complex });
                types.unshift({ id: 0, name: ".Any" });
                ReactDOM.render(types.map((element, i) => {
                    return <ManufacturingOrderType key={i}
                        type={element}
                    />
                }), this.refs.renderTypes);
            });
        } else {
            ReactDOM.render(<ManufacturingOrderType
                type={{ id: this.order.type, name: this.order.typeName }}
            />, this.refs.renderTypes);
        }
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    getComplexManufacturingOrderFromForm() {
        const order = {};
        order.type = parseInt(this.refs.renderTypes.value);
        return order;
    }

    isValid(order) {
        this.refs.errorMessage.innerText = "";
        if (order.type === 0) {
            this.refs.errorMessage.innerText = i18next.t('must-order-type');
            return false;
        }
        return true;
    }

    add() {
        const order = this.getComplexManufacturingOrderFromForm();
        if (!this.isValid(order)) {
            return;
        }

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
        const delay = ms => new Promise(res => setTimeout(res, ms));

        for (let i = 0; i < this.listOutput.length; i++) {
            const product = await this.getProductRow(this.listOutput[i].product);
            window.open("marketnettagprinter:\\\\copies=1&barcode=ean13&data=" + product.barCode.substring(0, 12));
            await delay(250);
        }

        this.complexManufacturingOrderTagPrinted(this.order.id);
    }

    printTagManufacturing() {
        window.open("marketnettagprinter:\\\\copies=1&barcode=datamatrix&data=" + this.order.uuid);
        this.complexManufacturingOrderTagPrinted(this.order.id);
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

    handleTabChange(_, tab) {
        this.tab = tab;
        this.forceUpdate();
    }

    render() {
        return <div>
            <div id="locateProductModal"></div>
            <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'xl'}
                PaperComponent={this.PaperComponent}>
                <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    {i18next.t('manufacturing-order')}
                </this.DialogTitle>
                <DialogContent>
                    <AppBar position="static" style={{
                        'backgroundColor': '#343a40'
                    }}>
                        <Tabs value={this.tab} onChange={this.handleTabChange}>
                            <Tab label={i18next.t('details')} />
                            <Tab label={i18next.t('input')} />
                            <Tab label={i18next.t('output')} />
                        </Tabs>
                    </AppBar>
                    {this.tab != 0 ? null : <div>
                        <div class="form-group">
                            <label>{i18next.t('type')}</label>
                            <select class="form-control" ref="renderTypes" disabled={this.order != null}>
                            </select>
                        </div>
                        <div class="form-row">
                            <div class="col">
                                <label>User created</label>
                                <input type="text" class="form-control" readOnly={true}
                                    defaultValue={this.order != null ? this.order.userCreatedName : null} />
                            </div>
                            <div class="col">
                                <label>User manufactured</label>
                                <input type="text" class="form-control" readOnly={true}
                                    defaultValue={this.order != null ? this.order.userManufacturedName : null} />
                            </div>
                            <div class="col">
                                <label>User that printed the tag</label>
                                <input type="text" class="form-control" readOnly={true}
                                    defaultValue={this.order != null ? this.order.userTagPrintedName : null} />
                            </div>
                        </div>
                    </div>}
                    {this.tab != 1 ? null : <div>
                        <DataGrid
                            ref="table"
                            autoHeight
                            rows={this.listInput}
                            columns={[
                                { field: 'productName', headerName: i18next.t('product'), flex: 1 },
                                { field: 'manufacturingOrder', headerName: i18next.t('manufacturing-order'), width: 210 },
                                { field: 'warehouseMovement', headerName: i18next.t('warehouse-movement'), width: 220 },
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
                                { field: 'productName', headerName: i18next.t('product'), flex: 1 },
                                { field: 'warehouseMovement', headerName: i18next.t('warehouse-movement'), width: 250 },
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
                    {this.order != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                    <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                    {this.order == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                    {this.order != null && !this.order.manufactured ?
                        <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('manufactured')}</button> : null}
                    {this.order != null && this.order.manufactured ?
                        <button type="button" class="btn btn-danger" onClick={this.update}>{i18next.t('undo-manufactured')}</button> : null}
                    {this.order != null && this.order.manufactured ?
                        <button type="button" class="btn btn-primary" onClick={this.printTags}>{i18next.t('print-barcode')}</button> : null}
                    {this.order != null && this.order.manufactured ?
                        <button type="button" class="btn btn-primary" onClick={this.printTagManufacturing}>{i18next.t('print-datamatrix')}</button> : null}
                </DialogActions>
            </Dialog>
        </div>
    }
}

export default ComplexManufacturingOrderModal;
