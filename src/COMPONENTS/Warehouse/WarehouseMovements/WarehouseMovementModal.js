import { Component } from "react";
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
import LocateProduct from "../../Masters/Products/LocateProduct";
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { DataGrid } from '@material-ui/data-grid';

import ProductForm from "../../Masters/Products/ProductForm";
import TransactionLogViewModal from "../../VisualComponents/TransactionLogViewModal";
import ManufacturingOrderModal from "../../Manufacturing/Orders/ManufacturingOrderModal";
import ComplexManufacturingOrderModal from "../../Manufacturing/ComplexOrders/ComplexManufacturingOrderModal";

// IMG
import HighlightIcon from '@material-ui/icons/Highlight';
import EditIcon from '@material-ui/icons/Edit';



class WarehouseMovementModal extends Component {
    constructor({ movement, findProductByName, defaultValueNameProduct, defaultValueNameWarehouse, addWarehouseMovements,
        deleteWarehouseMovements, defaultType, defaultWarehouse, locateProduct, defaultProductId, getRegisterTransactionalLogs, getProductFunctions,
        getWarehouses, getWarehouseMovementRelations, getManufacturingOrdersFunctions, getComplexManufacturingOrerFunctions }) {
        super();

        this.movement = movement;
        this.findProductByName = findProductByName;
        this.defaultValueNameProduct = defaultValueNameProduct;
        this.defaultValueNameWarehouse = defaultValueNameWarehouse;
        this.addWarehouseMovements = addWarehouseMovements;
        this.deleteWarehouseMovements = deleteWarehouseMovements;
        this.defaultType = defaultType;
        this.defaultWarehouse = defaultWarehouse;
        this.locateProduct = locateProduct;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;
        this.getProductFunctions = getProductFunctions;
        this.getWarehouses = getWarehouses;
        this.getWarehouseMovementRelations = getWarehouseMovementRelations;
        this.getManufacturingOrdersFunctions = getManufacturingOrdersFunctions;
        this.getComplexManufacturingOrerFunctions = getComplexManufacturingOrerFunctions;

        this.currentSelectedProductId = movement != null ? movement.product : defaultProductId;
        this.open = true;
        this.tab = 0;
        this.relations = {};

        this.add = this.add.bind(this);
        this.delete = this.delete.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.locateProducts = this.locateProducts.bind(this);
        this.calcTotalAmount = this.calcTotalAmount.bind(this);
        this.editProduct = this.editProduct.bind(this);
        this.transactionLog = this.transactionLog.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.editManufacturingOrder = this.editManufacturingOrder.bind(this);
        this.editComplexManufacturingOrders = this.editComplexManufacturingOrders.bind(this);
    }

    handleTabChange(_, tab) {
        this.tab = tab;
        this.forceUpdate();
    }

    async componentDidMount() {
        await this.renderWarehouses();
        if (this.movement != null) {
            this.relations = await this.getWarehouseMovementRelations(this.movement.id);
        }
    }

    renderWarehouses() {
        return new Promise((resolve) => {
            this.getWarehouses().then((warehouses) => {
                warehouses.unshift({ id: "", name: "." + i18next.t('none') });

                ReactDOM.render(warehouses.map((element, i) => {
                    return <option key={i} value={element.id}
                        selected={this.defaultWarehouse != null ? element.id == this.defaultWarehouse
                            : this.movement == null ? element.id = ""
                                : element.id == this.movement.warehouse
                        }> {element.name}</option >
                }), this.refs.warehouse);
                resolve();
            });
        });
    }

    getWarehouseMovementFromForm() {
        const movement = {};
        movement.warehouse = this.refs.warehouse.value;
        movement.product = parseInt(this.currentSelectedProductId);
        movement.quantity = parseInt(this.refs.quantity.value);
        movement.type = this.refs.type.value;
        movement.price = parseFloat(this.refs.price.value);
        movement.vatPercent = parseFloat(this.refs.vatPercent.value);
        if (movement.type === "O") {
            movement.quantity = -movement.quantity;
        }
        return movement;
    }

    isValid(movement) {
        this.refs.errorMessage.innerText = "";
        if (movement.product === 0 || isNaN(movement.product) || movement.product === null) {
            this.refs.errorMessage.innerText = i18next.t('must-product');
            return false;
        }
        if (movement.quantity === 0) {
            this.refs.errorMessage.innerText = i18next.t('quantity-0');
            return false;
        }
        if (movement.warehouse === null || movement.warehouse === "") {
            this.refs.errorMessage.innerText = i18next.t('no-warehouse');
            return false;
        }
        return true;
    }

    add() {
        const movement = this.getWarehouseMovementFromForm();
        if (!this.isValid(movement)) {
            return;
        }

        this.addWarehouseMovements(movement).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    delete() {
        this.deleteWarehouseMovements(this.movement.id).then((ok) => {
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

    locateProducts() {
        ReactDOM.unmountComponentAtNode(document.getElementById("warehouseMovementModal"));
        ReactDOM.render(<LocateProduct
            locateProduct={this.locateProduct}
            onSelect={(product) => {
                this.currentSelectedProductId = product.id;
                this.refs.productName.value = product.name;
            }}
        />, document.getElementById("warehouseMovementModal"));
    }

    transactionLog() {
        if (this.movement == null) {
            return;
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('warehouseMovementModal'));
        ReactDOM.render(<TransactionLogViewModal
            getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
            tableName={"warehouse_movement"}
            registerId={this.movement.id}
        />,
            document.getElementById('warehouseMovementModal'));
    }

    calcTotalAmount() {
        const price = parseFloat(this.refs.price.value);
        const quantity = parseInt(this.refs.quantity.value);
        const vatPercent = parseFloat(this.refs.vatPercent.value);

        this.refs.totalAmount.value = ((price * quantity) * (1 + (vatPercent / 100))).toFixed(6);
    }

    async editProduct() {
        if (this.currentSelectedProductId == null) {
            return;
        }

        const commonProps = this.getProductFunctions();
        const product = await commonProps.getProductRow(this.currentSelectedProductId);

        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(<Dialog aria-labelledby="customized-dialog-title" open={true} fullWidth={true} maxWidth={'xl'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitleProduct style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('product')}
            </this.DialogTitleProduct>
            <DialogContent>
                <ProductForm
                    {...commonProps}
                    tabProducts={() => {
                        ReactDOM.unmountComponentAtNode(this.refs.render);
                    }}
                    product={product}
                />
            </DialogContent>
        </Dialog>, this.refs.render);
    }

    async editManufacturingOrder(order) {
        const commonProps = this.getManufacturingOrdersFunctions();

        var productName = await commonProps.getNameProduct(order.product);

        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(
            <ManufacturingOrderModal
                {...commonProps}
                order={order}
                defaultValueNameProduct={productName}
                getManufacturingOrderTypes={commonProps.getManufacturingOrderTypes}
                getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
            />,
            this.refs.render);
    }

    async editComplexManufacturingOrders(order) {
        const commonProps = this.getComplexManufacturingOrerFunctions();

        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(
            <ComplexManufacturingOrderModal
                {...commonProps}
                order={order}
            />, this.refs.render);
    }

    render() {
        return (
            <div>
                <div ref="render"></div>
                <div id="warehouseMovementModal"></div>
                <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'md'}
                    PaperComponent={this.PaperComponent}>
                    <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                        {i18next.t('warehouse-movement')}
                    </this.DialogTitle>
                    <DialogContent>
                        {this.movement == null ? null :
                            <AppBar position="static" style={{
                                'backgroundColor': '#343a40'
                            }}>
                                <Tabs value={this.tab} onChange={this.handleTabChange}>
                                    <Tab label={i18next.t('details')} />
                                    <Tab label={i18next.t('relations')} />
                                </Tabs>
                            </AppBar>
                        }
                        {this.tab == 0 ? <div>
                            <label>{i18next.t('product')}</label>
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <button class="btn btn-outline-secondary" type="button" onClick={this.locateProducts}
                                        disabled={this.movement != undefined || this.currentSelectedProductId != null}><HighlightIcon /></button>
                                </div>
                                <div class="input-group-prepend">
                                    <button class="btn btn-outline-secondary" type="button" onClick={this.editProduct}
                                        disabled={this.getProductFunctions == null}><EditIcon /></button>
                                </div>
                                <input type="text" class="form-control" ref="productName" defaultValue={this.defaultValueNameProduct}
                                    readOnly={true} style={{ 'width': '70%' }} />
                            </div>
                            <div class="form-row">
                                <div class="col">
                                    <label>{i18next.t('quantity')}</label>
                                    <input type="number" class="form-control" ref="quantity" defaultValue={this.movement !== undefined ? this.movement.quantity : 0}
                                        disabled={this.movement != null} />
                                </div>
                                <div class="col">
                                    <label>{i18next.t('type')}</label>
                                    <select class="form-control" ref="type" disabled={this.movement !== undefined || this.defaultType !== undefined}
                                        defaultValue={this.movement != null ? this.movement.type : this.defaultType}>
                                        <option value="I" selected={this.defaultType === "I"}>{i18next.t('in')}</option>
                                        <option value="O" selected={this.defaultType === "O"}>{i18next.t('out')}</option>
                                        <option value="R" selected={this.defaultType === "R"}>{i18next.t('inventory-regularization')}</option>
                                    </select>
                                </div>
                                <div class="col">
                                    <label>{i18next.t('warehouse')}</label>
                                    <select id="warehouse" ref="warehouse" class="form-control"
                                        disabled={this.movement !== undefined || this.defaultType !== undefined}>
                                    </select>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="col">
                                    <label>{i18next.t('price')}</label>
                                    <input type="number" class="form-control" ref="price" defaultValue={this.movement != null ? this.movement.price : '0'}
                                        onChange={this.calcTotalAmount} readOnly={this.movement != null} />
                                </div>
                                <div class="col">
                                    <label>{i18next.t('vat-percent')}</label>
                                    <input type="number" class="form-control" ref="vatPercent"
                                        defaultValue={this.movement != null ? this.movement.vatPercent : window.config.defaultVatPercent}
                                        onChange={this.calcTotalAmount} readOnly={this.movement != null} />
                                </div>
                                <div class="col">
                                    <label>{i18next.t('total-amount')}</label>
                                    <input type="number" class="form-control" ref="totalAmount"
                                        defaultValue={this.movement != null ? this.movement.totalAmount : '0'}
                                        readOnly={true} />
                                </div>
                            </div>
                        </div> : null}
                        {this.tab == 1 ? <div>
                            <table class="table table-dark">
                                <tbody>
                                    {this.relations.purchaseDeliveryNoteName != null ? <tr>
                                        <td>{i18next.t('purchase-delivery-note')}</td>
                                        <td>{this.relations.purchaseDeliveryNoteName}</td>
                                    </tr> : null}
                                    {this.relations.purchaseOrderName != null ? <tr>
                                        <td>{i18next.t('purchase-order')}</td>
                                        <td>{this.relations.purchaseOrderName}</td>
                                    </tr> : null}
                                    {this.relations.saleDeliveryNoteName != null ? <tr>
                                        <td>{i18next.t('sales-delivery-note')}</td>
                                        <td>{this.relations.saleDeliveryNoteName}</td>
                                    </tr> : null}
                                    {this.relations.saleOrderName != null ? <tr>
                                        <td>{i18next.t('sale-order')}</td>
                                        <td>{this.relations.saleOrderName}</td>
                                    </tr> : null}
                                </tbody>
                            </table>
                            <h6>{i18next.t('manufacturing-orders')}</h6>
                            <DataGrid
                                ref="table"
                                autoHeight
                                rows={this.relations.manufacturingOrders}
                                columns={[
                                    { field: 'typeName', headerName: i18next.t('type'), flex: 1 },
                                    {
                                        field: 'dateCreated', headerName: i18next.t('date'), width: 160, valueGetter: (params) => {
                                            return window.dateFormat(params.row.dateCreated)
                                        }
                                    },
                                    { field: 'orderName', headerName: i18next.t('order-no'), width: 200 },
                                ]}
                                onRowClick={(data) => {
                                    this.editManufacturingOrder(data.row);
                                }}
                            />
                            <h6>{i18next.t('complex-manufacturing-orders')}</h6>
                            <DataGrid
                                ref="table"
                                autoHeight
                                rows={this.relations.complexManufacturingOrders}
                                columns={[
                                    { field: 'typeName', headerName: i18next.t('type'), flex: 1 },
                                    {
                                        field: 'dateCreated', headerName: i18next.t('date'), width: 160, valueGetter: (params) => {
                                            return window.dateFormat(params.row.dateCreated)
                                        }
                                    },
                                ]}
                                onRowClick={(data) => {
                                    this.editComplexManufacturingOrders(data.row);
                                }}
                            />
                        </div> : null}
                    </DialogContent>
                    <DialogActions>
                        <div class="btn-group dropup">
                            <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {i18next.t('options')}
                            </button>
                            <div class="dropdown-menu">
                                {this.movement != null ?
                                    <a class="dropdown-item" href="#" onClick={this.transactionLog}>{i18next.t('transactional-log')}</a> : null}
                            </div>
                        </div>
                        <p className="errorMessage" ref="errorMessage"></p>
                        {this.movement != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                        <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                        {this.movement == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default WarehouseMovementModal;
