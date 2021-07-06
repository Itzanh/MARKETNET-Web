import { Component } from "react";
import i18next from 'i18next';

const warehouseMovementType = {
    "O": "out",
    "I": "in",
    "R": "inventory-regularization"
}

class WarehouseMovement extends Component {
    constructor({ movement, edit, pos }) {
        super();

        this.movement = movement;
        this.edit = edit;
        this.pos = pos;
    }

    render() {
        return <tr onClick={() => {
            if (this.edit !== undefined) {
                this.edit(this.movement);
            }
        }} pos={this.pos}>
            <th field="id" scope="row">{this.movement.id}</th>
            <td field="warehouseName">{this.movement.warehouseName}</td>
            <td field="productName">{this.movement.productName}</td>
            <td field="quantity">{this.movement.quantity}</td>
            <td field="dateCreated">{window.dateFormat(new Date(this.movement.dateCreated))}</td>
            <td field="type">{i18next.t(warehouseMovementType[this.movement.type])}</td>
        </tr>
    }
}

export default WarehouseMovement;
