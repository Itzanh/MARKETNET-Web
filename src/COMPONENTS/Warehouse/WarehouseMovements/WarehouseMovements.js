import { Component } from "react";
import ReactDOM from 'react-dom';
import WarehouseMovementModal from "./WarehouseMovementModal";
import WarehouseMovement from "./WarehouseMovement";

class WarehouseMovements extends Component {
    constructor({ getWarehouseMovements, addWarehouseMovements, deleteWarehouseMovements, findProductByName, getNameProduct,
        findWarehouseByName, getNameWarehouse, getWarehouses }) {
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

        this.list = null;
        this.sortField = "";
        this.sortAscending = true;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
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
            element.productName = "...";
            return <WarehouseMovement key={i}
                movement={element}
                edit={this.edit}
            />
        }), this.refs.render);

        for (let i = 0; i < movements.length; i++) {
            if (movements[i].product != null) {
                movements[i].productName = await this.getProductName(movements[i].product);
            } else {
                movements[i].productName = "";
            }
        }

        ReactDOM.render(movements.map((element, i) => {
            return <WarehouseMovement key={i}
                movement={element}
                edit={this.edit}
            />
        }), this.refs.render);
        this.list = movements;
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
                            this.renderWarehouseMovements();
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
                            this.renderWarehouseMovements();
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
        return <div id="tabWarehouseMovement">
            <div id="renderWarehouseMovementModal"></div>
            <h1>Warehouse Movements</h1>
            <button type="button" class="btn btn-primary" onClick={this.add}>Add</button>
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
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}



export default WarehouseMovements;
