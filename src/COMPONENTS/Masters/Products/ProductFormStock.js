import { Component } from "react";
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

class ProductFormStock extends Component {
    constructor({ productId, getStock, doneLoading }) {
        super();

        this.list = [];

        this.productId = productId;
        this.getStock = getStock;
        this.doneLoading = doneLoading;
    }

    componentDidMount() {
        if (this.productId === undefined) {
            this.doneLoading();
            return;
        }

        this.getStock(this.productId).then((stocks) => {
            stocks.forEach((element, i) => {
                element.id = i;
            });
            this.list = stocks;
            this.forceUpdate();
            this.doneLoading();
        });
    }

    render() {
        return <div className="tableOverflowContainer">
            <div style={{ display: 'flex', height: '100%' }}>
                <div style={{ flexGrow: 1 }}>
                    <DataGrid
                        ref="table"
                        autoHeight
                        rows={this.list}
                        columns={[
                            { field: 'warehouse', headerName: '#', width: 90 },
                            { field: 'warehouseName', headerName: i18next.t('warehouse'), flex: 1 },
                            { field: 'quantity', headerName: i18next.t('quantity'), width: 220 },
                            { field: 'quantityPendingReceived', headerName: i18next.t('qty-pnd-receiving'), width: 220 },
                            { field: 'quantityPendingServed', headerName: i18next.t('qty-pnd-serving'), width: 220 },
                            { field: 'quantityPendingManufacture', headerName: i18next.t('qty-pnd-manufacture'), width: 220 },
                            { field: 'quantityAvaialbe', headerName: i18next.t('qty-available'), width: 220 },
                        ]}
                    />
                </div>
            </div>
        </div>
    }
}

export default ProductFormStock;
