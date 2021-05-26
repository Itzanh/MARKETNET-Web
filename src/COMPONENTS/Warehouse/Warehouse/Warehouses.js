import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import WarehouseModal from './WarehouseModal';
import WarehouseMovement from '../WarehouseMovements/WarehouseMovement';


class Warehouses extends Component {
    constructor({ getWarehouses, addWarehouses, updateWarehouses, deleteWarehouses, getWarehouseMovementsByWarehouse, getNameProduct, tabWarehouses }) {
        super();

        this.getWarehouses = getWarehouses;
        this.addWarehouses = addWarehouses;
        this.updateWarehouses = updateWarehouses;
        this.deleteWarehouses = deleteWarehouses;
        this.getWarehouseMovementsByWarehouse = getWarehouseMovementsByWarehouse;
        this.getNameProduct = getNameProduct;
        this.tabWarehouses = tabWarehouses;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.getWarehouses().then((warehouses) => {
            ReactDOM.render(warehouses.map((element, i) => {
                return <Warehouse key={i}
                    warehouse={element}
                    edit={this.edit}
                />
            }), this.refs.render);
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderWarehouseModal'));
        ReactDOM.render(
            <WarehouseModal
                addWarehouses={this.addWarehouses}
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
            />,
            document.getElementById('renderTab'));
    }

    render() {
        return <div id="tabWarehouses">
            <div id="renderWarehouseModal"></div>
            <h1>Warehouses</h1>
            <button type="button" class="btn btn-primary" onClick={this.add}>Add</button>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class Warehouse extends Component {
    constructor({ warehouse, edit }) {
        super();

        this.warehouse = warehouse;
        this.edit = edit;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.warehouse);
        }}>
            <th scope="row">{this.warehouse.id}</th>
            <td>{this.warehouse.name}</td>
        </tr>
    }
}

class WarehouseForm extends Component {
    constructor({ warehouse, updateWarehouses, deleteWarehouses, getWarehouseMovementsByWarehouse, getWarehouses, getNameProduct, tabWarehouses }) {
        super();

        this.productNameCache = {};

        this.warehouse = warehouse;
        this.updateWarehouses = updateWarehouses;
        this.deleteWarehouses = deleteWarehouses;
        this.getWarehouseMovementsByWarehouse = getWarehouseMovementsByWarehouse;
        this.getWarehouses = getWarehouses;
        this.getNameProduct = getNameProduct;
        this.tabWarehouses = tabWarehouses;

        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async componentDidMount() {
        const warehouseNames = {};
        const warehouses = await this.getWarehouses();
        for (let i = 0; i < warehouses.length; i++) {
            warehouseNames[warehouses[i].id] = warehouses[i].name;
        }

        this.getWarehouseMovementsByWarehouse(this.warehouse.id).then(async (movements) => {
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

    render() {
        return <div id="tabWarehouse" className="formRowRoot">
            <h2>Warehouse</h2>
            <div class="form-row">
                <div class="col">
                    <label>ID</label>
                    <input type="text" class="form-control" defaultValue={this.warehouse.id} disabled={true} />
                </div>
                <div class="col">
                    <label>Name</label>
                    <input type="text" class="form-control" defaultValue={this.warehouse.name} ref="name" />
                </div>
            </div>
            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <a class="nav-link active" href="#">Warehouse movements</a>
                </li>
            </ul>
            <div id="warehouseTab">
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

            <div id="buttomBottomForm">
                <button type="button" class="btn btn-danger" onClick={this.delete}>Delete</button>
                <button type="button" class="btn btn-success" onClick={this.update}>Update</button>
                <button type="button" class="btn btn-secondary" onClick={this.tabWarehouses}>Close</button>
            </div>
        </div>
    }
}

export default Warehouses;
