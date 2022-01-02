import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
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
}



class ProductWarehouseMovements extends Component {
    constructor({ productId, productName, getProductWarehouseMovements, getNameProduct, getWarehouses, getWarehouseMovementFunctions }) {
        super();

        this.list = [];
        this.loading = true;

        this.productId = productId;
        this.productName = productName;
        this.getProductWarehouseMovements = getProductWarehouseMovements;
        this.getNameProduct = getNameProduct;
        this.getWarehouses = getWarehouses;
        this.getWarehouseMovementFunctions = getWarehouseMovementFunctions;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    async componentDidMount() {
        this.getProductWarehouseMovements(this.productId).then(async (movements) => {
            this.loading = false;
            this.list = movements;
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
                            this.getProductWarehouseMovements(this.productId).then(async (movements) => {
                                this.loading = false;
                                this.list = movements;
                                this.forceUpdate();
                            });
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
                            this.getProductWarehouseMovements(this.productId).then(async (movements) => {
                                this.loading = false;
                                this.list = movements;
                                this.forceUpdate();
                            });
                        }
                    });
                    return promise;
                }}
                defaultValueNameProduct={movement.productName}
                defaultValueNameWarehouse={movement.warehouseName}
            />,
            document.getElementById('renderWarehouseMovementModal'));
    }

    render() {
        return <div id="renderSalesDetailsPendingTab">
            <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button>
            <div id="renderWarehouseMovementModal"></div>
            <div className="tableOverflowContainer">
                <div style={{ display: 'flex', height: '100%' }}>
                    <div style={{ flexGrow: 1 }}>
                        <DataGrid
                            ref="table"
                            autoHeight
                            rows={this.list}
                            columns={[
                                { field: 'id', headerName: '#', width: 90 },
                                { field: 'warehouseName', headerName: i18next.t('warehouse'), width: 300 },
                                { field: 'productName', headerName: i18next.t('product'), flex: 1 },
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
