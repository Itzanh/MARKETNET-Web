import { Component } from "react";
import AutocompleteField from "../../AutocompleteField";

class WarehouseMovementModal extends Component {
    constructor({ movement, findProductByName, defaultValueNameProduct, findWarehouseByName, defaultValueNameWarehouse, addWarehouseMovements,
        deleteWarehouseMovements }) {
        super();

        this.movement = movement;
        this.findProductByName = findProductByName;
        this.defaultValueNameProduct = defaultValueNameProduct;
        this.findWarehouseByName = findWarehouseByName;
        this.defaultValueNameWarehouse = defaultValueNameWarehouse;
        this.addWarehouseMovements = addWarehouseMovements;
        this.deleteWarehouseMovements = deleteWarehouseMovements;

        this.currentSelectedProductId = movement != null ? movement.product : 0;
        this.currentSelectedWarehouseId = movement != null ? movement.warehouse : 0;

        this.add = this.add.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        window.$('#warehouseMovementModal').modal({ show: true });
    }

    getWarehouseMovementFromForm() {
        const movement = {};
        movement.warehouse = this.currentSelectedWarehouseId;
        movement.product = parseInt(this.currentSelectedProductId);
        movement.quantity = parseInt(this.refs.quantity.value);
        movement.type = this.refs.type.value;
        if (movement.type == "O") {
            movement.quantity = -movement.quantity;
        }
        return movement;
    }

    add() {
        const movement = this.getWarehouseMovementFromForm();

        this.addWarehouseMovements(movement).then((ok) => {
            if (ok) {
                window.$('#warehouseMovementModal').modal('hide');
            }
        });
    }

    delete() {
        this.deleteWarehouseMovements(this.movement.id).then((ok) => {
            if (ok) {
                window.$('#warehouseMovementModal').modal('hide');
            }
        });
    }

    render() {
        return <div class="modal fade" id="warehouseMovementModal" tabindex="-1" role="dialog" aria-labelledby="warehouseMovementModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="warehouseMovementModalLabel">Warehouse Movement</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <label>Product</label>
                        <AutocompleteField findByName={this.findProductByName} defaultValueId={this.movement != null ? this.movement.product : null}
                            defaultValueName={this.defaultValueNameProduct} valueChanged={(value) => {
                                this.currentSelectedProductId = value;
                            }} disabled={this.movement != null} />
                        <div class="form-row">
                            <div class="col">
                                <label>Quantity</label>
                                <input type="number" class="form-control" ref="quantity" defaultValue="0" disabled={this.movement != null} />
                            </div>
                            <div class="col">
                                <label>Type</label>
                                <select class="form-control" ref="type" disabled={this.movement != null}>
                                    <option value="I">In</option>
                                    <option value="O" selected>Out</option>
                                </select>
                            </div>
                            <div class="col">
                                <label>Warehouse</label>
                                <AutocompleteField findByName={this.findWarehouseByName} defaultValueId={this.movement != null ? this.movement.warehouse : null}
                                    defaultValueName={this.defaultValueNameWarehouse} valueChanged={(value) => {
                                        this.currentSelectedWarehouseId = value;
                                    }} disabled={this.movement != null} />
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        {this.movement != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>Delete</button> : null}
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        {this.movement == null ? <button type="button" class="btn btn-primary" onClick={this.add}>Add</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default WarehouseMovementModal;
