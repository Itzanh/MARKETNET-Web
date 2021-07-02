import { Component } from "react";
import ReactDOM from 'react-dom';
import WarehouseMovementModal from "./WarehouseMovementModal";
import WarehouseMovement from "./WarehouseMovement";
import SearchField from "../../SearchField";
import TableContextMenu from "../../VisualComponents/TableContextMenu";

class WarehouseMovements extends Component {
    constructor({ getWarehouseMovements, addWarehouseMovements, deleteWarehouseMovements, findProductByName, getNameProduct,
        findWarehouseByName, getNameWarehouse, getWarehouses, searchWarehouseMovements }) {
        super();

        this.productNameCache = {};

        this.getWarehouseMovements = getWarehouseMovements;
        this.addWarehouseMovements = addWarehouseMovements;
        this.deleteWarehouseMovements = deleteWarehouseMovements;
        this.findProductByName = findProductByName;
        this.getNameProduct = getNameProduct;
        this.findWarehouseByName = findWarehouseByName;
        this.getNameWarehouse = getNameWarehouse;
        this.getWarehouses = getWarehouses;
        this.searchWarehouseMovements = searchWarehouseMovements;

        this.advancedSearchListener = null;
        this.list = null;
        this.sortField = "";
        this.sortAscending = true;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.search = this.search.bind(this);
        this.advanced = this.advanced.bind(this);
    }

    componentDidMount() {
        this.printWarehouseMovements();
    }

    printWarehouseMovements() {
        this.getWarehouseMovements().then((movements) => {
            this.renderWarehouseMovements(movements);
        });
    }

    async renderWarehouseMovements(movements) {
        const warehouseNames = {};
        const warehouses = await this.getWarehouses();
        for (let i = 0; i < warehouses.length; i++) {
            warehouseNames[warehouses[i].id] = warehouses[i].name;
        }

        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(movements.map((element, i) => {
            element.warehouseName = warehouseNames[element.warehouse];

            return <WarehouseMovement key={i}
                movement={element}
                edit={this.edit}
                pos={i}
            />
        }), this.refs.render);

        ReactDOM.render(movements.map((element, i) => {
            return <WarehouseMovement key={i}
                movement={element}
                edit={this.edit}
                pos={i}
            />
        }), this.refs.render);
        this.list = movements;
    }

    async search(searchText) {
        const search = {
            search: searchText
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
                findWarehouseByName={this.findWarehouseByName}
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
            />,
            document.getElementById('renderWarehouseMovementModal'));
    }

    render() {
        return <div id="tabWarehouseMovement" className="formRowRoot">
            <div id="renderWarehouseMovementModal"></div>
            <div className="menu">
                <h1>Warehouse Movements</h1>
                <div class="form-row">
                    <div class="col">
                        <button type="button" class="btn btn-primary" onClick={this.add}>Add</button>
                    </div>
                    <div class="col">
                        <SearchField handleSearch={this.search} hasAdvancedSearch={true} handleAdvanced={this.advanced} />
                        <div ref="advancedSearch" className="advancedSearch"></div>
                    </div>
                </div>
            </div>
            <table class="table table-dark">
                <thead>
                    <tr onClick={(e) => {
                        e.preventDefault();
                        const field = e.target.getAttribute("field");

                        if (this.sortField == field) {
                            this.sortAscending = !this.sortAscending;
                        }
                        this.sortField = field;

                        var greaterThan = 1;
                        var lessThan = -1;
                        if (!this.sortAscending) {
                            greaterThan = -1;
                            lessThan = -1;
                        }

                        this.list.sort((a, b) => {
                            if (a[field] > b[field]) {
                                return greaterThan;
                            } else if (a[field] < b[field]) {
                                return lessThan;
                            } else {
                                return 0;
                            }
                        });
                        this.renderWarehouseMovements(this.list);
                    }}>
                        <th field="id" scope="col">#</th>
                        <th field="warehouseName" scope="col">Warehouse</th>
                        <th field="productName" scope="col">Product</th>
                        <th field="quantity" scope="col">Quantity</th>
                        <th field="dateCreated" scope="col">Date created</th>
                        <th field="type" scope="col">Type</th>
                    </tr>
                </thead>
                <tbody ref="render" onContextMenu={(e) => {
                    e.preventDefault();
                    const posX = e.pageX + "px";
                    const posY = e.pageY + "px";
                    if (document.getElementById("customContextMenu") === null) {
                        ReactDOM.render(<TableContextMenu
                            posX={posX}
                            posY={posY}
                            getList={() => {
                                return this.list;
                            }}
                            setList={(list) => {
                                this.renderWarehouseMovements(list);
                            }}
                            pos={parseInt(e.target.parentNode.getAttribute("pos"))}
                            field={e.target.getAttribute("field")}
                            value={e.target.innerText}
                            fields={["id", "warehouseName", "productName", "customerName", "quantity", "dateCreated", "type"]}
                        />, document.getElementById("contextMenu"));
                    } else {
                        ReactDOM.unmountComponentAtNode(document.getElementById("contextMenu"));
                    }
                }}></tbody>
            </table>
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
                <label for="start">Start date:</label>
                <br />
                <input type="date" class="form-control" ref="start" />
            </div>
            <div class="col">
                <label for="start">End date:</label>
                <br />
                <input type="date" class="form-control" ref="end" />
            </div>
        </div>
    }
}

export default WarehouseMovements;
