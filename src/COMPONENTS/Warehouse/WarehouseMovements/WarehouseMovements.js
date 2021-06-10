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

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderWarehouseMovements();
    }

    async renderWarehouseMovements() {
        const warehouseNames = {};
        const warehouses = await this.getWarehouses();
        for (let i = 0; i < warehouses.length; i++) {
            warehouseNames[warehouses[i].id] = warehouses[i].name;
        }

        ReactDOM.unmountComponentAtNode(this.refs.render);
        this.getWarehouseMovements().then(async (movements) => {
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
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Warehouse</th>
                        <th scope="col">Product</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Date created</th>
                        <th scope="col">Type</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}



export default WarehouseMovements;
