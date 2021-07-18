import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import WarehouseModal from './WarehouseModal';

const warehouseMovementType = {
    "O": "out",
    "I": "in",
    "R": "inventory-regularization"
}


class Warehouses extends Component {
    constructor({ getWarehouses, addWarehouses, updateWarehouses, deleteWarehouses, getWarehouseMovementsByWarehouse, getNameProduct, tabWarehouses,
        regenerateDraggedStock, regenerateProductStock }) {
        super();

        this.getWarehouses = getWarehouses;
        this.addWarehouses = addWarehouses;
        this.updateWarehouses = updateWarehouses;
        this.deleteWarehouses = deleteWarehouses;
        this.getWarehouseMovementsByWarehouse = getWarehouseMovementsByWarehouse;
        this.getNameProduct = getNameProduct;
        this.tabWarehouses = tabWarehouses;
        this.regenerateDraggedStock = regenerateDraggedStock;
        this.regenerateProductStock = regenerateProductStock;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderWarehouses();
    }

    renderWarehouses() {
        this.getWarehouses().then((warehouses) => {
            this.list = warehouses;
            this.forceUpdate();
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderWarehouseModal'));
        ReactDOM.render(
            <WarehouseModal
                addWarehouses={(warehouse) => {
                    const promise = this.addWarehouses(warehouse);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderWarehouses();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderWarehouseModal'));
    }

    edit(warehouse) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <WarehouseForm
                warehouse={warehouse}
                updateWarehouses={this.updateWarehouses}
                deleteWarehouses={this.deleteWarehouses}
                getWarehouseMovementsByWarehouse={this.getWarehouseMovementsByWarehouse}
                getWarehouses={this.getWarehouses}
                getNameProduct={this.getNameProduct}
                tabWarehouses={this.tabWarehouses}
                regenerateDraggedStock={this.regenerateDraggedStock}
                regenerateProductStock={this.regenerateProductStock}
            />,
            document.getElementById('renderTab'));
    }

    render() {
        return <div id="tabWarehouses">
            <div id="renderWarehouseModal"></div>
            <h1>{i18next.t('warehouses')}</h1>
            <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add')}</button>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'id', headerName: '#', width: 90 },
                    { field: 'name', headerName: i18next.t('name'), flex: 1 }
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

class WarehouseForm extends Component {
    constructor({ warehouse, updateWarehouses, deleteWarehouses, getWarehouseMovementsByWarehouse, getWarehouses, getNameProduct, tabWarehouses,
        regenerateDraggedStock, regenerateProductStock }) {
        super();

        this.productNameCache = {};

        this.warehouse = warehouse;
        this.updateWarehouses = updateWarehouses;
        this.deleteWarehouses = deleteWarehouses;
        this.getWarehouseMovementsByWarehouse = getWarehouseMovementsByWarehouse;
        this.getWarehouses = getWarehouses;
        this.getNameProduct = getNameProduct;
        this.tabWarehouses = tabWarehouses;
        this.regenerateDraggedStock = regenerateDraggedStock;
        this.regenerateProductStock = regenerateProductStock;

        this.list = [];
        this.loading = true;
        this.rows = 0;

        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.regenerateDrgStk = this.regenerateDrgStk.bind(this);
        this.regeneratePrdStk = this.regeneratePrdStk.bind(this);
    }

    async componentDidMount() {
        const warehouseNames = {};
        const warehouses = await this.getWarehouses();
        for (let i = 0; i < warehouses.length; i++) {
            warehouseNames[warehouses[i].id] = warehouses[i].name;
        }

        this.getWarehouseMovementsByWarehouse({
            warehouseId: this.warehouse.id,
            offset: 0,
            limit: 100
        }).then(async (movements) => {
            this.list = movements.movements;
            this.rows = movements.rows;
            this.loading = false;
            this.forceUpdate();
        });
    }

    async getProductName(productId) {
        if (this.productNameCache[productId] != null) {
            return this.productNameCache[productId];
        } else {
            const productName = await this.getNameProduct(productId);
            this.productNameCache[productId] = productName;
            return productName;
        }
    }

    getWarehouseFromForm() {
        const warehouse = {};
        warehouse.id = this.warehouse.id;
        warehouse.name = this.refs.name.value;
        return warehouse;
    }

    update() {
        this.updateWarehouses(this.getWarehouseFromForm()).then((ok) => {
            if (ok) {
                this.tabWarehouses();
            }
        });
    }

    delete() {
        this.deleteWarehouses(this.warehouse.id).then((ok) => {
            if (ok) {
                this.tabWarehouses();
            }
        });
    }

    regenerateDrgStk() {
        this.regenerateDraggedStock(this.warehouse.id);
    }

    regeneratePrdStk() {
        this.regenerateProductStock();
    }

    render() {
        return <div id="tabWarehouse" className="formRowRoot">
            <h2>{i18next.t('warehouse')}</h2>
            <div class="form-row">
                <div class="col">
                    <label>ID</label>
                    <input type="text" class="form-control" defaultValue={this.warehouse.id} disabled={true} />
                </div>
                <div class="col">
                    <label>{i18next.t('name')}</label>
                    <input type="text" class="form-control" defaultValue={this.warehouse.name} ref="name" />
                </div>
            </div>
            <ul class="nav nav-tabs mt-2">
                <li class="nav-item">
                    <a class="nav-link active" href="#">{i18next.t('warehouse-movements')}</a>
                </li>
            </ul>
            <div id="warehouseTab" className="mt-2">
                <div className="tableOverflowContainer tableOverflowContainer3">
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
                        onPageChange={(data) => {
                            this.getWarehouseMovementsByWarehouse({
                                warehouseId: this.warehouse.id,
                                offset: data.pageSize * data.page,
                                limit: data.pageSize
                            }).then(async (movements) => {
                                movements.movements = this.list.concat(movements.movements);
                                this.list = movements.movements;
                                this.rows = movements.rows;
                                this.forceUpdate();
                            });
                        }}
                        rowCount={this.rows}
                    />
                </div>
            </div>

            <div id="buttomBottomFormContainter">
                <div id="buttomBottomForm">
                    <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button>
                    <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button>
                    <button type="button" class="btn btn-secondary" onClick={this.tabWarehouses}>{i18next.t('close')}</button>
                    <div class="btn-group dropup">
                        <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {i18next.t('options')}
                        </button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="#" onClick={this.regenerateDrgStk}>{i18next.t('regenerate-dragged-stock')}</a>
                            <a class="dropdown-item" href="#" onClick={this.regeneratePrdStk}>{i18next.t('regenerate-product-stock')}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default Warehouses;
