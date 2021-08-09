import { Component } from "react";
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

const warehouseMovementType = {
    "O": "out",
    "I": "in",
    "R": "inventory-regularization"
}



class ProductWarehouseMovements extends Component {
    constructor({ productId, getProductWarehouseMovements, getNameProduct, getWarehouses }) {
        super();

        this.list = [];
        this.loading = true;

        this.productId = productId;
        this.getProductWarehouseMovements = getProductWarehouseMovements;
        this.getNameProduct = getNameProduct;
        this.getWarehouses = getWarehouses;
    }

    async componentDidMount() {
        this.getProductWarehouseMovements(this.productId).then(async (movements) => {
            this.loading = false;
            this.list = movements;
            this.forceUpdate();
        });
    }

    render() {
        return <div id="renderSalesDetailsPendingTab">
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
                            loading={this.loading}
                        />
                    </div>
                </div>
            </div>
        </div>
    }
}

export default ProductWarehouseMovements;
