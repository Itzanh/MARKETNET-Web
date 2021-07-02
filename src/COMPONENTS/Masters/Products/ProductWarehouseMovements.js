import { Component } from "react";
import ReactDOM from 'react-dom';
import WarehouseMovement from "../../Warehouse/WarehouseMovements/WarehouseMovement";

class ProductWarehouseMovements extends Component {
    constructor({ productId, getProductWarehouseMovements, getNameProduct, getWarehouses }) {
        super();

        this.productId = productId;
        this.getProductWarehouseMovements = getProductWarehouseMovements;
        this.getNameProduct = getNameProduct;
        this.getWarehouses = getWarehouses;
    }

    async componentDidMount() {
        const warehouseNames = {};
        const warehouses = await this.getWarehouses();
        for (let i = 0; i < warehouses.length; i++) {
            warehouseNames[warehouses[i].id] = warehouses[i].name;
        }

        this.getProductWarehouseMovements(this.productId).then(async (movements) => {
            ReactDOM.render(movements.map((element, i) => {
                element.warehouseName = warehouseNames[element.warehouse];
                return <WarehouseMovement key={i}
                    movement={element}
                    edit={this.edit}
                />
            }), this.refs.render);
        });
    }

    render() {
        return <div id="renderSalesDetailsPendingTab">
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

export default ProductWarehouseMovements;
