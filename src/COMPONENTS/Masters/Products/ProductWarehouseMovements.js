import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import { withStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import WarehouseMovementModal from "../../Warehouse/WarehouseMovements/WarehouseMovementModal";

const warehouseMovementType = {
    "O": "out",
    "I": "in",
    "R": "inventory-regularization"
};



class ProductWarehouseMovements extends Component {
    constructor({ productId, productName, getProductWarehouseMovements, getWarehouses, getWarehouseMovementFunctions }) {
        super();

        this.list = [];
        this.loading = true;

        this.productId = productId;
        this.productName = productName;
        this.getProductWarehouseMovements = getProductWarehouseMovements;
        this.getWarehouses = getWarehouses;
        this.getWarehouseMovementFunctions = getWarehouseMovementFunctions;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.search = this.search.bind(this);
    }

    async componentDidMount() {
        if (this.productId == null) {
            return;
        }

        this.getProductWarehouseMovements({
            productId: this.productId
        }).then(async (movements) => {
            this.loading = false;
            this.list = movements;
            this.forceUpdate();
        });
    }

    search() {
        if (this.productId == null) {
            return;
        }

        this.loading = true;
        this.getProductWarehouseMovements({
            productId: this.productId,
            startDate: new Date(this.refs.start.value),
            endDate: new Date(this.refs.end.value)
        }).then(async (details) => {
            this.loading = false;
            this.list = details;
            this.forceUpdate();
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

    async add() {
        if (this.productId == null || this.productId <= 0) {
            return;
        }

        const commonProps = await this.getWarehouseMovementFunctions();

        ReactDOM.unmountComponentAtNode(document.getElementById('renderWarehouseMovementModal'));
        ReactDOM.render(
            <WarehouseMovementModal
                {...commonProps}
                addWarehouseMovements={(movement) => {
                    const promise = commonProps.addWarehouseMovements(movement);
                    promise.then((ok) => {
                        if (ok) {
                            // refresh
                            this.search();
                        }
                    });
                    return promise;
                }}
                defaultProductId={this.productId}
                defaultValueNameProduct={this.productName}
            />,
            document.getElementById('renderWarehouseMovementModal'));
    }

    async edit(movement) {
        const commonProps = await this.getWarehouseMovementFunctions();

        ReactDOM.unmountComponentAtNode(document.getElementById('renderWarehouseMovementModal'));
        ReactDOM.render(
            <WarehouseMovementModal
                {...commonProps}
                movement={movement}
                deleteWarehouseMovements={(movement) => {
                    const promise = commonProps.deleteWarehouseMovements(movement);
                    promise.then((ok) => {
                        if (ok) {
                            // refresh
                            this.search();
                        }
                    });
                    return promise;
                }}
                defaultValueNameProduct={movement.product.name}
                defaultValueNameWarehouse={movement.warehouse.name}
            />,
            document.getElementById('renderWarehouseMovementModal'));
    }

    render() {
        return <div id="renderSalesDetailsPendingTab" className="formRowRoot">
            <div class="form-row mb-2">
                <div class="col formInputTag">
                    <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add')}</button>
                </div>
                <div class="col formInputTag">
                    <label for="start">{i18next.t('start-date')}:</label>
                </div>
                <div class="col mw-10">
                    <input type="date" class="form-control" ref="start" />
                </div>
                <div class="col formInputTag">
                    <label for="start">{i18next.t('end-date')}:</label>
                </div>
                <div class="col mw-10">
                    <input type="date" class="form-control" ref="end" />
                </div>
                <div class="col">
                    <button type="button" class="btn btn-primary" onClick={this.search}>{i18next.t('search')}</button>
                </div>
            </div>
            <div id="renderWarehouseMovementModal"></div>
            <div className="tableOverflowContainer">
                <div style={{ display: 'flex', height: '100%' }}>
                    <div style={{ flexGrow: 1 }}>
                        <DataGrid
                            ref="table"
                            autoHeight
                            rows={this.list}
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
                            onRowClick={(data) => {
                                this.edit(data.row);
                            }}
                            loading={this.loading}
                        />
                    </div>
                </div>
            </div>
        </div>
    }
}

export default ProductWarehouseMovements;
