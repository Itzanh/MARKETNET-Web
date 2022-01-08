import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import WarehouseMovementModal from "./WarehouseMovementModal";
import SearchField from "../../SearchField";

const warehouseMovementType = {
    "O": "out",
    "I": "in",
    "R": "inventory-regularization"
}

class WarehouseMovements extends Component {
    constructor({ getWarehouseMovements, addWarehouseMovements, deleteWarehouseMovements, findProductByName, getNameProduct, getNameWarehouse,
        getWarehouses, searchWarehouseMovements, locateProduct, getRegisterTransactionalLogs, getWarehouseMovementRelations,
        getManufacturingOrdersFunctions, getComplexManufacturingOrerFunctions }) {
        super();

        this.productNameCache = {};

        this.getWarehouseMovements = getWarehouseMovements;
        this.addWarehouseMovements = addWarehouseMovements;
        this.deleteWarehouseMovements = deleteWarehouseMovements;
        this.findProductByName = findProductByName;
        this.getNameProduct = getNameProduct;
        this.getNameWarehouse = getNameWarehouse;
        this.getWarehouses = getWarehouses;
        this.searchWarehouseMovements = searchWarehouseMovements;
        this.locateProduct = locateProduct;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;
        this.getWarehouseMovementRelations = getWarehouseMovementRelations;
        this.getManufacturingOrdersFunctions = getManufacturingOrdersFunctions;
        this.getComplexManufacturingOrerFunctions = getComplexManufacturingOrerFunctions;

        this.advancedSearchListener = null;
        this.list = null;
        this.sortField = "";
        this.sortAscending = true;

        this.list = [];
        this.loading = true;
        this.rows = 0;
        this.searchText = "";
        this.limit = 100;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.search = this.search.bind(this);
        this.advanced = this.advanced.bind(this);
    }

    componentDidMount() {
        this.printWarehouseMovements();
    }

    printWarehouseMovements() {
        this.getWarehouseMovements({
            offset: 0,
            limit: 100
        }).then((movements) => {
            this.renderWarehouseMovements(movements);
        });
    }

    async renderWarehouseMovements(movements) {
        this.loading = false;
        this.list = movements.movements;
        this.rows = movements.rows;
        this.forceUpdate();
    }

    async search(searchText) {
        this.searchText = searchText;
        this.loading = true;
        const search = {
            search: searchText,
            offset: 0,
            limit: 100
        };

        if (this.advancedSearchListener != null) {
            const s = this.advancedSearchListener();
            search.dateStart = s.dateStart;
            search.dateEnd = s.dateEnd;
        }

        const movements = await this.searchWarehouseMovements(search);
        this.renderWarehouseMovements(movements);
        this.list = movements;
    }

    advanced(advanced) {
        if (!advanced) {
            ReactDOM.unmountComponentAtNode(this.refs.advancedSearch);
            this.advancedSearchListener = null;
        } else {
            ReactDOM.render(
                <WarehouseMovementAdvancedSearch
                    subscribe={(listener) => {
                        this.advancedSearchListener = listener;
                    }}
                />, this.refs.advancedSearch);
        }
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

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderWarehouseMovementModal'));
        ReactDOM.render(
            <WarehouseMovementModal
                findProductByName={this.findProductByName}
                locateProduct={this.locateProduct}
                getWarehouses={this.getWarehouses}
                addWarehouseMovements={(movement) => {
                    const promise = this.addWarehouseMovements(movement);
                    promise.then((ok) => {
                        if (ok) {
                            this.printWarehouseMovements();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderWarehouseMovementModal'));
    }

    edit(movement) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderWarehouseMovementModal'));
        ReactDOM.render(
            <WarehouseMovementModal
                movement={movement}
                deleteWarehouseMovements={(movement) => {
                    const promise = this.deleteWarehouseMovements(movement);
                    promise.then((ok) => {
                        if (ok) {
                            this.printWarehouseMovements();
                        }
                    });
                    return promise;
                }}
                defaultValueNameProduct={movement.productName}
                defaultValueNameWarehouse={movement.warehouseName}
                getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
                getWarehouses={this.getWarehouses}
                getWarehouseMovementRelations={this.getWarehouseMovementRelations}
                getManufacturingOrdersFunctions={this.getManufacturingOrdersFunctions}
                getComplexManufacturingOrerFunctions={this.getComplexManufacturingOrerFunctions}
            />,
            document.getElementById('renderWarehouseMovementModal'));
    }

    render() {
        return <div id="tabWarehouseMovement" className="formRowRoot">
            <div id="renderWarehouseMovementModal"></div>
            <h4 className="ml-2">{i18next.t('warehouse-movements')}</h4>
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
                onPageChange={(data) => {
                    this.searchWarehouseMovements({
                        search: this.searchText,
                        offset: data * this.limit,
                        limit: this.limit
                    }).then(async (movements) => {
                        movements.movements = this.list.concat(movements.movements);
                        this.renderWarehouseMovements(movements);
                    });
                }}
                rowCount={this.rows}
            />
        </div>
    }
}

class WarehouseMovementAdvancedSearch extends Component {
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
        </div>
    }
}

export default WarehouseMovements;
