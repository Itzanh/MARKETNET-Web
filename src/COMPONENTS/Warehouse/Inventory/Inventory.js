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
import LocateProduct from "../../Masters/Products/LocateProduct";
import LocateProductFamily from "../../Masters/ProductFamilies/LocateProductFamily";
import ConfirmQuestion from "../../ConfirmQuestion";
import ConfirmDelete from "../../ConfirmDelete";
import { Button } from "@material-ui/core";
import AlertModal from "../../AlertModal";



class Inventory extends Component {
    constructor({ getInventories, insertInventory, deleteInventory, finishInventory, getInventoryProducts, insertUpdateDeleteInventoryProducts,
        getWarehouses, locateProduct, locateProductFamilies, insertProductFamilyInventoryProducts, insertAllProductsInventoryProducts,
        deleteAllProductsInventoryProducts, tabInventory, insertOrCountInventoryProductsByBarcode }) {
        super();

        this.getInventories = getInventories;
        this.insertInventory = insertInventory;
        this.deleteInventory = deleteInventory;
        this.finishInventory = finishInventory;
        this.getInventoryProducts = getInventoryProducts;
        this.insertUpdateDeleteInventoryProducts = insertUpdateDeleteInventoryProducts;
        this.getWarehouses = getWarehouses;
        this.locateProduct = locateProduct;
        this.locateProductFamilies = locateProductFamilies;
        this.insertProductFamilyInventoryProducts = insertProductFamilyInventoryProducts;
        this.insertAllProductsInventoryProducts = insertAllProductsInventoryProducts;
        this.deleteAllProductsInventoryProducts = deleteAllProductsInventoryProducts;
        this.tabInventory = tabInventory;
        this.insertOrCountInventoryProductsByBarcode = insertOrCountInventoryProductsByBarcode;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        this.renderInventories();
    }

    renderInventories() {
        this.getInventories().then((list) => {
            this.list = list;
            this.forceUpdate();
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(<InventoryAdd
            getWarehouses={this.getWarehouses}
            onDataInput={(name, warehouse) => {
                this.insertInventory({
                    name: name,
                    warehouseId: warehouse
                }).then((ok) => {
                    if (ok) {
                        this.renderInventories();
                    }
                });
            }}
        />, this.refs.render);
    }

    edit(row) {
        ReactDOM.render(<InventoryData
            inventory={row}
            finishInventory={this.finishInventory}
            getInventoryProducts={this.getInventoryProducts}
            insertUpdateDeleteInventoryProducts={this.insertUpdateDeleteInventoryProducts}
            locateProduct={this.locateProduct}
            locateProductFamilies={this.locateProductFamilies}
            insertProductFamilyInventoryProducts={this.insertProductFamilyInventoryProducts}
            insertAllProductsInventoryProducts={this.insertAllProductsInventoryProducts}
            deleteAllProductsInventoryProducts={this.deleteAllProductsInventoryProducts}
            tabInventory={this.tabInventory}
            insertOrCountInventoryProductsByBarcode={this.insertOrCountInventoryProductsByBarcode}
        />, document.getElementById("renderTab"));
    }

    delete(inventoryId) {
        this.deleteInventory(inventoryId).then((ok) => {
            if (ok.ok) {
                this.renderInventories();
            } else {
                ReactDOM.unmountComponentAtNode(this.refs.render);
                switch (ok.errorCode) {
                    case 1: {
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-DELETING')}
                            modalText={i18next.t("cant-delete-a-finished-inventory")}
                        />, this.refs.render);
                        break;
                    }
                    case 2: {
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-DELETING')}
                            modalText={i18next.t("cant-delete-a-inventory-that-has-details-delete-the-details-first")}
                        />, this.refs.render);
                        break;
                    }
                    default: // 0
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-DELETING')}
                            modalText={i18next.t('an-unknown-error-ocurred')}
                        />, this.refs.render);
                }
            }
        });
    }

    render() {
        return <div id="tabInventory" className="formRowRoot">
            <div ref="render"></div>
            <h4 className="ml-2">{i18next.t('inventory')}</h4>
            <div class="form-row">
                <div class="col">
                    <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add')}</button>
                </div>
                <div class="col">
                </div>
            </div>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'name', headerName: i18next.t('name'), flex: 1 },
                    {
                        field: "delete", headerName: i18next.t('delete'), width: 130, renderCell: (params) => (
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                style={{ marginLeft: 16 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    this.delete(params.row.id);
                                }}
                            >
                                {i18next.t('delete')}
                            </Button>
                        ),
                    },
                    {
                        field: 'warehouseName', headerName: i18next.t('warehouse'), width: 500, valueGetter: (params) => {
                            return params.row.warehouse.name;
                        }
                    },
                    {
                        field: 'dateCreated', headerName: i18next.t('date-created'), width: 200, valueGetter: (params) => {
                            return window.dateFormat(params.row.dateCreated)
                        }
                    },
                    {
                        field: 'dateFinished', headerName: i18next.t('date-finished'), width: 200, valueGetter: (params) => {
                            return params.row.dateFinished == null ? '' : window.dateFormat(params.row.dateFinished);
                        }
                    },
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}



class InventoryAdd extends Component {
    constructor({ getWarehouses, onDataInput }) {
        super();

        this.open = true;

        this.getWarehouses = getWarehouses;
        this.onDataInput = onDataInput;

        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        this.renderWarehouses();
    }

    renderWarehouses() {
        this.getWarehouses().then((warehouses) => {
            ReactDOM.render(warehouses.map((element, i) => {
                return <option key={i} value={element.id}>{element.name}</option >
            }), this.refs.warehouse);
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
                {i18next.t('create-inventory')}
            </this.DialogTitle>
            <DialogContent>
                <label>{i18next.t('enter-the-name-of-the-new-inventory')}:</label>
                <input type="text" class="form-control" placeholder={this.modalText} ref="data" inputProps={{ maxLength: 50 }} />
                <label>{i18next.t('warehouse')}</label>
                <select id="warehouse" ref="warehouse" class="form-control">
                </select>
            </DialogContent>
            <DialogActions>
                <button type="button" class="btn btn-primary" onClick={() => {
                    this.onDataInput(this.refs.data.value, this.refs.warehouse.value);
                    this.handleClose();
                }}>OK</button>
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
            </DialogActions>
        </Dialog>
    }
}



class InventoryData extends Component {
    constructor({ inventory, finishInventory, getInventoryProducts, insertUpdateDeleteInventoryProducts, locateProduct, locateProductFamilies,
        insertProductFamilyInventoryProducts, insertAllProductsInventoryProducts, deleteAllProductsInventoryProducts, tabInventory,
        insertOrCountInventoryProductsByBarcode }) {
        super();

        this.inventory = inventory;
        this.finishInventory = finishInventory;
        this.getInventoryProducts = getInventoryProducts;
        this.insertUpdateDeleteInventoryProducts = insertUpdateDeleteInventoryProducts;
        this.locateProduct = locateProduct;
        this.locateProductFamilies = locateProductFamilies;
        this.insertProductFamilyInventoryProducts = insertProductFamilyInventoryProducts;
        this.insertAllProductsInventoryProducts = insertAllProductsInventoryProducts;
        this.deleteAllProductsInventoryProducts = deleteAllProductsInventoryProducts;
        this.tabInventory = tabInventory;
        this.insertOrCountInventoryProductsByBarcode = insertOrCountInventoryProductsByBarcode;

        this.list = [];

        this.save = this.save.bind(this);
        this.addProduct = this.addProduct.bind(this);
        this.addFamily = this.addFamily.bind(this);
        this.addAll = this.addAll.bind(this);
        this.deleteAll = this.deleteAll.bind(this);
        this.finish = this.finish.bind(this);
        this.barCode = this.barCode.bind(this);
    }

    componentDidMount() {
        this.renderProducts();
    }

    renderProducts() {
        this.getInventoryProducts(this.inventory.id).then((list) => {
            for (let i = 0; i < list.length; i++) {
                list[i].id = i;
            }
            this.list = list;
            this.forceUpdate();
        });
    }

    save() {
        return new Promise((resolve) => {
            this.insertUpdateDeleteInventoryProducts({
                inventory: this.inventory.id,
                inventoryProducts: this.list,
            }).then((ok) => {
                resolve(ok);
            });
        });
    }

    addProduct() {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(<LocateProduct
            locateProduct={this.locateProduct}
            onSelect={(product) => {
                const list = this.list.map((element) => {
                    return element;
                });
                list.push({
                    id: this.list.length,
                    inventoryId: this.inventory.id,
                    productId: product.id,
                    quantity: 0,
                    productName: product.name,
                });
                this.list = list;
                this.forceUpdate();
            }}
        />, this.refs.render);
    }

    addFamily() {
        this.save().then((ok) => {
            if (ok) {
                ReactDOM.unmountComponentAtNode(this.refs.render);
                ReactDOM.render(<LocateProductFamily
                    locateProductFamilies={this.locateProductFamilies}
                    onSelect={(family) => {
                        this.insertProductFamilyInventoryProducts({
                            inventoryId: this.inventory.id,
                            familyId: family.id,
                        }).then((ok) => {
                            if (ok) {
                                this.renderProducts();
                            }
                        });
                        this.forceUpdate();
                    }}
                />, this.refs.render);
            }
        });
    }

    addAll() {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(<ConfirmQuestion
            modalTitle={i18next.t('are-you-sure')}
            modalText={i18next.t('this-will-add-all-the-existing-products')}
            modalButtonText={i18next.t('add')}
            onConfirm={() => {
                this.save().then((ok) => {
                    if (ok) {
                        this.insertAllProductsInventoryProducts({
                            inventoryId: this.inventory.id,
                        }).then((ok) => {
                            if (ok) {
                                this.renderProducts();
                            }
                        });
                    }
                });
            }}
        />, this.refs.render);
    }

    deleteAll() {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(<ConfirmDelete
            onDelete={() => {
                this.deleteAllProductsInventoryProducts({
                    inventoryId: this.inventory.id,
                }).then((ok) => {
                    if (ok) {
                        this.renderProducts();
                    }
                });
            }}
        />, this.refs.render);
    }

    finish() {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(<ConfirmQuestion
            modalTitle={i18next.t('are-you-sure')}
            modalText={i18next.t('you-are-going-to-create-an-inventory-warehouse-movement-for-every-product-below-with-the-specified-quantity-desc')}
            modalButtonText={i18next.t('continue')}
            onConfirm={() => {
                this.save().then((ok) => {
                    if (ok) {
                        this.finishInventory({
                            id: this.inventory.id
                        }).then((ok) => {
                            if (ok) {
                                this.tabInventory();
                            }
                        });
                    }
                });
            }}
        />, this.refs.render);
    }

    barCode() {
        const barCode = this.refs.barCode.value.padStart(13, "0");

        this.insertOrCountInventoryProductsByBarcode({
            inventory: this.inventory.id,
            barCode: barCode
        }).then((ok) => {
            this.refs.barCode.value = "";
            if (ok.ok) {
                this.renderProducts();
            } else {
                ReactDOM.unmountComponentAtNode(this.refs.render);
                ReactDOM.render(<AlertModal
                    modalTitle={i18next.t('barcode-error')}
                    modalText={i18next.t('the-barcode-is-not-recognized-because-the-product-is-not-registered-in-the-erp')}
                />, this.refs.render);
            }
        });
    }

    render() {
        return <div id="tabInventory" className="formRowRoot">
            <div ref="render"></div>
            <h4 className="ml-2">{i18next.t('inventory')} - {this.inventory.name}</h4>
            <div class="form-row">
                <div class="col">
                    {this.inventory.finished ? null :
                        <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.save}>{i18next.t('save')}</button>}
                    <button type="button" class="btn btn-secondary ml-2 mb-2" onClick={this.tabInventory}>{i18next.t('back')}</button>
                    {this.inventory.finished ? null :
                        <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.addProduct}>{i18next.t('add')}</button>}
                    {this.inventory.finished ? null :
                        <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.addFamily}>{i18next.t('add-family')}</button>}
                    {this.inventory.finished ? null :
                        <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.addAll}>{i18next.t('add-all')}</button>}
                    {this.inventory.finished ? null :
                        <button type="button" class="btn btn-danger ml-2 mb-2" onClick={this.deleteAll}>{i18next.t('delete-all')}</button>}
                    {this.inventory.finished ? null :
                        <button type="button" class="btn btn-success ml-2 mb-2" onClick={this.finish}>{i18next.t('finish-inventory')}</button>}
                </div>
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                        </div>
                        <div class="col">
                            <input type="text" class="form-control" ref="barCode" onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    this.barCode();
                                }
                            }} placeholder={i18next.t('bar-code')} autoFocus />
                        </div>
                    </div>
                </div>
            </div>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    {
                        field: 'productName', headerName: i18next.t('name'), flex: 1, valueGetter: (params) => {
                            return params.row.productName != null ? params.row.productName : params.row.product.name;
                        }
                    },
                    {
                        field: "delete", headerName: i18next.t('delete'), width: 130, renderCell: (params) => (
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                style={{ marginLeft: 16 }}
                                onClick={() => {
                                    this.list = this.list.filter((element) => element.id != params.row.id);
                                    this.forceUpdate();
                                }}
                            >
                                {i18next.t('delete')}
                            </Button>
                        ),
                    },
                    { field: 'quantity', headerName: i18next.t('quantity'), width: 350, editable: !this.inventory.finished, type: "number" },
                ]}
                onCellEditCommit={(data) => {
                    for (let i = 0; i < this.list.length; i++) {
                        if (this.list[i].id == data.id) {
                            this.list[i].quantity = data.value;
                            break;
                        }
                    }
                }}
            />
        </div>
    }
}



export default Inventory;
