import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { DataGrid } from '@material-ui/data-grid';
import i18next from 'i18next';
import SearchField from '../../SearchField';

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

import { TextField, FormControl, NativeSelect } from "@material-ui/core";
import { InputLabel } from "@mui/material";

import LocateProduct from "../../Masters/Products/LocateProduct";
import AlertModal from "../../AlertModal";
import WindowRequestData from "../../WindowRequestData";
import ConfirmDelete from "../../ConfirmDelete";

const warehouseMovementType = {
    "O": "out",
    "I": "in",
    "R": "inventory-regularization"
}



class TransferBetweenWarehousesMenu extends Component {
    constructor({ searchTransferBetweenWarehouses, insertTransferBetweenWarehouses, deleteTransferBetweenWarehouses, getTransferBetweenWarehousesDetail,
        insertTransferBetweenWarehousesDetail, deleteTransferBetweenWarehousesDetail, transferBetweenWarehousesDetailBarCode,
        transferBetweenWarehousesDetailQuantity, getTransferBetweenWarehousesWarehouseMovements, getWarehouses, locateProduct, tabTransferBetweenWarehouses }) {
        super();

        this.searchTransferBetweenWarehouses = searchTransferBetweenWarehouses;
        this.insertTransferBetweenWarehouses = insertTransferBetweenWarehouses;
        this.deleteTransferBetweenWarehouses = deleteTransferBetweenWarehouses;
        this.getTransferBetweenWarehousesDetail = getTransferBetweenWarehousesDetail;
        this.insertTransferBetweenWarehousesDetail = insertTransferBetweenWarehousesDetail;
        this.deleteTransferBetweenWarehousesDetail = deleteTransferBetweenWarehousesDetail;
        this.transferBetweenWarehousesDetailBarCode = transferBetweenWarehousesDetailBarCode;
        this.transferBetweenWarehousesDetailQuantity = transferBetweenWarehousesDetailQuantity;
        this.getTransferBetweenWarehousesWarehouseMovements = getTransferBetweenWarehousesWarehouseMovements;
        this.getWarehouses = getWarehouses;
        this.locateProduct = locateProduct;
        this.tabTransferBetweenWarehouses = tabTransferBetweenWarehouses;

        this.advancedSearchListener = null;
        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.search = this.search.bind(this);
        this.advanced = this.advanced.bind(this);
    }

    componentDidMount() {
        this.searchTransferBetweenWarehouses({
            finished: false
        }).then((list) => {
            this.list = list;
            this.forceUpdate();
        });
    }

    search(searchText) {
        const search = {};
        search.search = searchText;
        if (this.advancedSearchListener != null) {
            const s = this.advancedSearchListener();
            search.dateStart = s.dateStart;
            search.dateEnd = s.dateEnd;
            search.finished = s.finished;
        }
        this.searchTransferBetweenWarehouses(search).then((list) => {
            this.list = list;
            this.forceUpdate();
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(<TransferBetweenWarehousesAddModal
            insertTransferBetweenWarehouses={this.insertTransferBetweenWarehouses}
            getWarehouses={this.getWarehouses}
        />, this.refs.render);
    }

    edit(transfer) {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(<TransferBetweenWarehouses
            transfer={transfer}
            deleteTransferBetweenWarehouses={this.deleteTransferBetweenWarehouses}
            getTransferBetweenWarehousesDetail={this.getTransferBetweenWarehousesDetail}
            insertTransferBetweenWarehousesDetail={this.insertTransferBetweenWarehousesDetail}
            deleteTransferBetweenWarehousesDetail={this.deleteTransferBetweenWarehousesDetail}
            transferBetweenWarehousesDetailBarCode={this.transferBetweenWarehousesDetailBarCode}
            transferBetweenWarehousesDetailQuantity={this.transferBetweenWarehousesDetailQuantity}
            getTransferBetweenWarehousesWarehouseMovements={this.getTransferBetweenWarehousesWarehouseMovements}
            locateProduct={this.locateProduct}
            tabTransferBetweenWarehouses={this.tabTransferBetweenWarehouses}
        />, document.getElementById('renderTab'));
    }

    advanced(advanced) {
        if (!advanced) {
            ReactDOM.unmountComponentAtNode(this.refs.advancedSearch);
            this.advancedSearchListener = null;
        } else {
            ReactDOM.render(
                <TransferBetweenWarehousesAdvancedSearch
                    subscribe={(listener) => {
                        this.advancedSearchListener = listener;
                    }}
                />, this.refs.advancedSearch);
        }
    }

    render() {
        return <div id="tabTransferBetweenWarehousesMenu" className="formRowRoot">
            <h4 className="ml-2">{i18next.t('transfer-between-warehouses')}</h4>
            <div ref="render"></div>
            <div class="form-row">
                <div class="col">
                    <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add')}</button>
                </div>
                <div class="col">
                    <SearchField handleSearch={this.search} hasAdvancedSearch={true} handleAdvanced={this.advanced} />
                    <div ref="advancedSearch" className="advancedSearch"></div>
                </div>
            </div>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    {
                        field: 'dateCreated', headerName: i18next.t('date-created'), width: 160, valueGetter: (params) => {
                            return window.dateFormat(params.row.dateCreated)
                        }
                    },
                    {
                        field: 'dateFinished', headerName: i18next.t('date-finished'), width: 180, valueGetter: (params) => {
                            return params.row.dateFinished == null ? "" : window.dateFormat(params.row.dateFinished);
                        }
                    },
                    { field: 'name', headerName: i18next.t('name'), width: 300 },
                    {
                        field: 'warehouseOriginName', headerName: i18next.t('warehouse-from'), flex: 1, valueGetter: (params) => {
                            return params.row.warehouseOrigin.name;
                        }
                    },
                    {
                        field: 'warehouseDestinationName', headerName: i18next.t('warehouse-to'), flex: 1, valueGetter: (params) => {
                            return params.row.warehouseDestination.name;
                        }
                    },
                    { field: 'linesTotal', headerName: i18next.t('lines-total'), width: 160 },
                    { field: 'linesTransfered', headerName: i18next.t('lines-transfered'), width: 180 },
                    { field: 'finished', headerName: i18next.t('finished'), width: 150, type: "boolean" },
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
};



class TransferBetweenWarehousesAdvancedSearch extends Component {
    constructor({ subscribe }) {
        super();

        this.getFormData = this.getFormData.bind(this);

        subscribe(this.getFormData);
    }

    getFormData() {
        const search = {};
        if (this.refs.start.value !== "") {
            search.dateStart = new Date(this.refs.start.value);
        }
        if (this.refs.end.value !== "") {
            search.dateEnd = new Date(this.refs.end.value);
        }
        search.finished = this.refs.finished.checked;
        return search;
    }

    render() {
        return <div class="form-row">
            <div class="col">
                <label for="start">{i18next.t('start-date')}:</label>
                <br />
                <input type="date" class="form-control" ref="start" />
            </div>
            <div class="col">
                <label for="start">{i18next.t('end-date')}:</label>
                <br />
                <input type="date" class="form-control" ref="end" />
            </div>
            <div class="col">
                <input type="checkbox" class="form-check-input" ref="finished" />
                <label class="form-check-label">{i18next.t('finished')}</label>
            </div>
        </div>
    }
};



class TransferBetweenWarehousesAddModal extends Component {
    constructor({ insertTransferBetweenWarehouses, getWarehouses }) {
        super();

        this.insertTransferBetweenWarehouses = insertTransferBetweenWarehouses;
        this.getWarehouses = getWarehouses;

        this.open = true;

        this.name = React.createRef();

        this.handleClose = this.handleClose.bind(this);
        this.add = this.add.bind(this);
    }

    componentDidMount() {
        this.getWarehouses().then((warehouses) => {
            ReactDOM.render(warehouses.map((element, i) => {
                return <option key={i} value={element.id}>{element.name}</option>
            }), document.getElementById("warehouseOrigin"));

            ReactDOM.render(warehouses.map((element, i) => {
                return <option key={i} value={element.id}>{element.name}</option>
            }), document.getElementById("warehouseDestination"));
        });
    }

    add() {
        const transfer = this.getTransferBetweenWarehousesFromForm();
        if (!this.isValid(transfer)) {
            return false;
        }

        this.insertTransferBetweenWarehouses(transfer).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    getTransferBetweenWarehousesFromForm() {
        const transfer = {};
        transfer.name = this.name.current.value;
        transfer.warehouseOriginId = document.getElementById("warehouseOrigin").value;
        transfer.warehouseDestinationId = document.getElementById("warehouseDestination").value;
        return transfer;
    }

    isValid(transfer) {
        if (transfer.name.length === 0) {
            ReactDOM.unmountComponentAtNode(this.refs.render);
            ReactDOM.render(<AlertModal
                modalTitle={i18next.t('VALIDATION-ERROR')}
                modalText={i18next.t('name-cant-be-empty')}
            />, this.refs.render);
            return false;
        }
        if (transfer.name.length > 100) {
            ReactDOM.unmountComponentAtNode(this.refs.render);
            ReactDOM.render(<AlertModal
                modalTitle={i18next.t('VALIDATION-ERROR')}
                modalText={i18next.t('name-cant-be-longer-than-100-characters')}
            />, this.refs.render);
            return false;
        }
        if (transfer.warehouseOriginId.length === 0) {
            ReactDOM.unmountComponentAtNode(this.refs.render);
            ReactDOM.render(<AlertModal
                modalTitle={i18next.t('VALIDATION-ERROR')}
                modalText={i18next.t('you-must-select-an-origin-warehouse')}
            />, this.refs.render);
            return false;
        }
        if (transfer.warehouseDestinationId.length === 0) {
            ReactDOM.unmountComponentAtNode(this.refs.render);
            ReactDOM.render(<AlertModal
                modalTitle={i18next.t('VALIDATION-ERROR')}
                modalText={i18next.t('you-must-select-a-destination-warehouse')}
            />, this.refs.render);
            return false;
        }
        if (transfer.warehouseOriginId === transfer.warehouseDestinationId) {
            ReactDOM.unmountComponentAtNode(this.refs.render);
            ReactDOM.render(<AlertModal
                modalTitle={i18next.t('VALIDATION-ERROR')}
                modalText={i18next.t('you-cant-transfer-to-the-same-warehouse')}
            />, this.refs.render);
            return false;
        }
        return true;
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
            <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'sm'}
                PaperComponent={this.PaperComponent}>
                <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    {i18next.t('transfer-between-warehouses')}
                </this.DialogTitle>
                <DialogContent>
                    <TextField id="name" inputRef={this.name} label={i18next.t('name')} variant="outlined" fullWidth size="small"
                        inputProps={{ maxLength: 100 }} />
                    <br />
                    <br />
                    <FormControl fullWidth>
                        <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('warehouse-from')}</InputLabel>
                        <NativeSelect
                            style={{ 'marginTop': '0' }}
                            id="warehouseOrigin"
                        >

                        </NativeSelect>
                    </FormControl>
                    <br />
                    <br />
                    <FormControl fullWidth>
                        <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('warehouse-to')}</InputLabel>
                        <NativeSelect
                            style={{ 'marginTop': '0' }}
                            id="warehouseDestination"
                        >

                        </NativeSelect>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                    <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button>
                </DialogActions>
            </Dialog>
        </div>);
    }
};



class TransferBetweenWarehouses extends Component {
    constructor({ transfer, deleteTransferBetweenWarehouses, getTransferBetweenWarehousesDetail,
        insertTransferBetweenWarehousesDetail, deleteTransferBetweenWarehousesDetail, transferBetweenWarehousesDetailBarCode,
        transferBetweenWarehousesDetailQuantity, getTransferBetweenWarehousesWarehouseMovements, locateProduct, tabTransferBetweenWarehouses }) {
        super();

        this.transfer = transfer;
        this.deleteTransferBetweenWarehouses = deleteTransferBetweenWarehouses;
        this.getTransferBetweenWarehousesDetail = getTransferBetweenWarehousesDetail;
        this.insertTransferBetweenWarehousesDetail = insertTransferBetweenWarehousesDetail;
        this.deleteTransferBetweenWarehousesDetail = deleteTransferBetweenWarehousesDetail;
        this.transferBetweenWarehousesDetailBarCode = transferBetweenWarehousesDetailBarCode;
        this.transferBetweenWarehousesDetailQuantity = transferBetweenWarehousesDetailQuantity;
        this.getTransferBetweenWarehousesWarehouseMovements = getTransferBetweenWarehousesWarehouseMovements;
        this.locateProduct = locateProduct;
        this.tabTransferBetweenWarehouses = tabTransferBetweenWarehouses;

        this.tab = 0;

        this.listInput = [];
        this.listOutput = [];
        this.listMovements = [];

        this.handleTabChange = this.handleTabChange.bind(this);
        this.add = this.add.bind(this);
        this.delete = this.delete.bind(this);
        this.barCode = this.barCode.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.renderItems();
        }, 100);
    }

    renderItems() {
        this.getTransferBetweenWarehousesDetail(this.transfer.id).then((list) => {
            this.listInput = list.filter((element) => !element.finished);
            this.listOutput = list.filter((element) => element.finished);
            this.forceUpdate();
            this.refs.barCode.focus();
        });
    }

    renderMovements() {
        this.getTransferBetweenWarehousesWarehouseMovements(this.transfer.id).then((list) => {
            this.listMovements = list;
            this.forceUpdate();
        });
    }

    handleTabChange(_, tab) {
        this.tab = tab;
        if (tab == 1) {
            this.renderMovements();
        }
        this.forceUpdate();
    }

    add() {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(<LocateProduct
            locateProduct={this.locateProduct}
            onSelect={(product) => {
                ReactDOM.render(<WindowRequestData
                    modalTitle={i18next.t('quantity')}
                    modalText={i18next.t('enter-the-quantity-to-move-between-warehouses')}
                    dataType="number"
                    min="1"
                    defaultValue="1"
                    onDataInput={(quantity) => {
                        this.insertTransferBetweenWarehousesDetail({
                            transferBetweenWarehousesId: this.transfer.id,
                            productId: product.id,
                            quantity: parseInt(quantity)
                        }).then((ok) => {
                            if (ok) {
                                this.renderItems();
                            }
                        });
                    }}
                />, this.refs.render);
            }}
        />, this.refs.render);
    }

    delete() {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(
            <ConfirmDelete
                onDelete={() => {
                    this.deleteTransferBetweenWarehouses(this.transfer.id).then((ok) => {
                        if (ok) {
                            this.tabTransferBetweenWarehouses();
                        }
                    });
                }}
            />, this.refs.render);
    }

    barCode() {
        this.transferBetweenWarehousesDetailBarCode({
            transferBetweenWarehousesId: this.transfer.id,
            barCode: this.refs.barCode.value.padStart(13, "0")
        }).then((ok) => {
            this.refs.barCode.value = "";
            if (ok) {
                this.renderItems();
            } else {
                ReactDOM.unmountComponentAtNode(this.refs.render);
                ReactDOM.render(<AlertModal
                    modalTitle={i18next.t('barcode-error')}
                    modalText={i18next.t('the-product-scanned-is-not-present-in-this-transfer-between-warehouses')}
                />, this.refs.render);
            }
        });
    }

    render() {
        return <div id="tabTransferBetweenWarehousesMenu" className="formRowRoot">
            <h4 className="ml-2">{i18next.t('transfer-between-warehouses')}</h4>
            <div ref="render"></div>

            <AppBar position="static" style={{ 'backgroundColor': '#1976d2' }}>
                <Tabs value={this.tab} onChange={this.handleTabChange}>
                    <Tab label={i18next.t('items')} />
                    <Tab label={i18next.t('warehouse-movements')} />
                </Tabs>
            </AppBar>

            {this.tab != 0 ? null :
                <div className="formRowRoot">
                    <div class="form-row mt-2">
                        <div class="col">
                            <button type="button" class="btn btn-secondary ml-2 mb-2" onClick={this.tabTransferBetweenWarehouses}>{i18next.t('back')}</button>
                            <button type="button" class="btn btn-danger ml-2 mb-2" onClick={this.delete}>{i18next.t('delete')}</button>
                            <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add-product')}</button>
                        </div>
                        <div class="col">
                            <input type="text" class="form-control" ref="barCode" onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    this.barCode();
                                }
                            }} placeholder={i18next.t('bar-code')} autoFocus />
                        </div>
                    </div>
                    <h4>{i18next.t('items-pending')}</h4>
                    <div style={{ 'maxHeight': '40%' }}>
                        <DataGrid
                            ref="table"
                            autoHeight
                            rows={this.listInput}
                            columns={[
                                {
                                    field: 'productReference', headerName: i18next.t('product'), flex: 1, valueGetter: (params) => {
                                        return params.row.product.reference;
                                    }
                                },
                                {
                                    field: 'productName', headerName: i18next.t('product'), flex: 1, valueGetter: (params) => {
                                        return params.row.product.name;
                                    }
                                },
                                { field: 'quantity', headerName: i18next.t('quantity'), width: 200 },
                                { field: 'quantityTransferred', headerName: i18next.t('quantity-transfered'), width: 200 },
                                {
                                    field: "add", headerName: i18next.t('add'), width: 130, renderCell: (params) => (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            style={{ marginLeft: 16 }}
                                            onClick={() => {
                                                ReactDOM.unmountComponentAtNode(this.refs.render);
                                                ReactDOM.render(<WindowRequestData
                                                    modalTitle={i18next.t('quantity')}
                                                    modalText={i18next.t('enter-the-quantity-to-move-between-warehouses')}
                                                    dataType="number"
                                                    min="1"
                                                    defaultValue="1"
                                                    onDataInput={(quantity) => {
                                                        this.transferBetweenWarehousesDetailQuantity({
                                                            transferBetweenWarehousesDetailId: params.row.id,
                                                            quantity: parseInt(quantity)
                                                        }).then((ok) => {
                                                            if (ok) {
                                                                this.renderItems();
                                                            }
                                                        });
                                                    }}
                                                />, this.refs.render);
                                            }}
                                        >
                                            {i18next.t('add')}
                                        </Button>
                                    ),
                                },
                                {
                                    field: "delete", headerName: i18next.t('delete'), width: 130, renderCell: (params) => (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            style={{ marginLeft: 16 }}
                                            onClick={() => {
                                                ReactDOM.unmountComponentAtNode(this.refs.render);
                                                ReactDOM.render(
                                                    <ConfirmDelete
                                                        onDelete={() => {
                                                            this.deleteTransferBetweenWarehousesDetail(params.row.id).then((ok) => {
                                                                if (ok) {
                                                                    this.renderItems();
                                                                }
                                                            });
                                                        }}
                                                    />, this.refs.render);
                                            }}
                                        >
                                            {i18next.t('delete')}
                                        </Button>
                                    ),
                                }
                            ]}
                        />
                    </div>
                    <br />
                    <h4>{i18next.t('items-transfered')}</h4>
                    <div style={{ 'maxHeight': '40%' }}>
                        <DataGrid
                            ref="table"
                            autoHeight
                            rows={this.listOutput}
                            columns={[
                                {
                                    field: 'productReference', headerName: i18next.t('product'), flex: 1, valueGetter: (params) => {
                                        return params.row.product.reference;
                                    }
                                },
                                {
                                    field: 'productName', headerName: i18next.t('product'), flex: 1, valueGetter: (params) => {
                                        return params.row.product.name;
                                    }
                                },
                                { field: 'quantity', headerName: i18next.t('quantity'), width: 200 },
                                { field: 'quantityTransferred', headerName: i18next.t('quantity-transfered'), width: 200 },
                            ]}
                        />
                    </div>
                </div>}

            {this.tab != 1 ? null :
                <div>
                    <DataGrid
                        ref="table"
                        autoHeight
                        rows={this.listMovements}
                        columns={[
                            {
                                field: 'warehouseName', headerName: i18next.t('warehouse'), width: 300, valueGetter: (params) => {
                                    return params.row.warehouse.name;
                                }
                            },
                            {
                                field: 'productName', headerName: i18next.t('product'), flex: 1, valueGetter: (params) => {
                                    return params.row.product.name;
                                }
                            },
                            { field: 'quantity', headerName: i18next.t('quantity'), width: 150 },
                            {
                                field: 'dateCreated', headerName: i18next.t('date-created'), width: 200, valueGetter: (params) => {
                                    return window.dateFormat(params.row.dateCreated)
                                }
                            },
                            {
                                field: 'type', headerName: i18next.t('type'), width: 200, valueGetter: (params) => {
                                    return i18next.t(warehouseMovementType[params.row.type])
                                }
                            }
                        ]}
                    />
                </div>}

        </div>
    }
};



export default TransferBetweenWarehousesMenu;
