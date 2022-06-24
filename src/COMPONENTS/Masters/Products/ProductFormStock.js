/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

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
                            {
                                field: 'warehouse', headerName: '#', width: 90, valueGetter: (params) => {
                                    return params.row.warehouse.id;
                                }
                            },
                            {
                                field: 'warehouseName', headerName: i18next.t('warehouse'), flex: 1, valueGetter: (params) => {
                                    return params.row.warehouse.name;
                                }
                            },
                            { field: 'quantity', headerName: i18next.t('quantity'), width: 220 },
                            { field: 'quantityPendingReceived', headerName: i18next.t('qty-pnd-receiving'), width: 220 },
                            { field: 'quantityPendingServed', headerName: i18next.t('qty-pnd-serving'), width: 220 },
                            { field: 'quantityPendingManufacture', headerName: i18next.t('qty-pnd-manufacture'), width: 220 },
                            { field: 'quantityAvaiable', headerName: i18next.t('qty-available'), width: 220 },
                        ]}
                    />
                </div>
            </div>
        </div>
    }
}

export default ProductFormStock;
