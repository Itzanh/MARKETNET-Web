import { Component } from "react";

const warehouseMovementType = {
    "O": "Out",
    "I": "In"
}

class WarehouseMovement extends Component {
    constructor({ movement, edit }) {
        super();

        this.movement = movement;
        this.edit = edit;
    }

    render() {
        return <tr onClick={() => {
            if (this.edit !== undefined) {
                this.edit(this.movement);
            }
        }}>
            <th scope="row">{this.movement.id}</th>
            <td>{this.movement.warehouseName}</td>
            <td>{this.movement.productName}</td>
            <td>{this.movement.quantity}</td>
            <td>{window.dateFormat(new Date(this.movement.dateCreated))}</td>
            <td>{warehouseMovementType[this.movement.type]}</td>
        </tr>
    }
}

export default WarehouseMovement;
