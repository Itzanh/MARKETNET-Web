import { Component } from "react";
import i18next from 'i18next';

import AutocompleteField from "../../AutocompleteField";

class WarehouseMovementModal extends Component {
    constructor({ movement, findProductByName, defaultValueNameProduct, findWarehouseByName, defaultValueNameWarehouse, addWarehouseMovements,
        deleteWarehouseMovements, defaultType }) {
        super();

        this.movement = movement;
        this.findProductByName = findProductByName;
        this.defaultValueNameProduct = defaultValueNameProduct;
        this.findWarehouseByName = findWarehouseByName;
        this.defaultValueNameWarehouse = defaultValueNameWarehouse;
        this.addWarehouseMovements = addWarehouseMovements;
        this.deleteWarehouseMovements = deleteWarehouseMovements;
        this.defaultType = defaultType;

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
        if (movement.type === "O") {
            movement.quantity = -movement.quantity;
        }
        return movement;
    }

    isValid(movement) {
        this.refs.errorMessage.innerText = "";
        if (movement.product === 0 || isNaN(movement.product) || movement.product === null) {
            this.refs.errorMessage.innerText = i18next.t('must-product"');
            return false;
        }
        if (movement.quantity === 0) {
            this.refs.errorMessage.innerText = i18next.t('quantity-0');
            return false;
        }
        if (movement.warehouse === null || movement.warehouse === "") {
            this.refs.errorMessage.innerText = i18next.t('no-warehouse');
            return false;
        }
        return true;
    }

    add() {
        const movement = this.getWarehouseMovementFromForm();
        if (!this.isValid(movement)) {
            return;
        }

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
                        <h5 class="modal-title" id="warehouseMovementModalLabel">{i18next.t('warehouse-movement')}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <label>{i18next.t('product')}</label>
                        <AutocompleteField findByName={this.findProductByName} defaultValueId={this.movement !== undefined ? this.movement.product : null}
                            defaultValueName={this.defaultValueNameProduct} valueChanged={(value) => {
                                this.currentSelectedProductId = value;
                            }} disabled={this.movement != null} />
                        <div class="form-row">
                            <div class="col">
                                <label>{i18next.t('quantity')}</label>
                                <input type="number" class="form-control" ref="quantity" defaultValue={this.movement !== undefined ? this.movement.quantity : 0}
                                    disabled={this.movement != null} />
                            </div>
                            <div class="col">
                                <label>{i18next.t('type')}</label>
                                <select class="form-control" ref="type" disabled={this.movement !== undefined || this.defaultType !== undefined}
                                    defaultValue={this.movement != null ? this.movement.type : this.defaultType}>
                                    <option value="I" selected={this.defaultType === "I"}>{i18next.t('in')}</option>
                                    <option value="O" selected={this.defaultType === "O"}>{i18next.t('out')}</option>
                                    <option value="R" selected={this.defaultType === "R"}>{i18next.t('inventory-regularization')}</option>
                                </select>
                            </div>
                            <div class="col">
                                <label>{i18next.t('warehouse')}</label>
                                <AutocompleteField findByName={this.findWarehouseByName} defaultValueId={this.movement != null ? this.movement.warehouse : null}
                                    defaultValueName={this.defaultValueNameWarehouse} valueChanged={(value) => {
                                        this.currentSelectedWarehouseId = value;
                                    }} disabled={this.movement !== undefined || this.defaultType !== undefined} />
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <p className="errorMessage" ref="errorMessage"></p>
                        {this.movement != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                        {this.movement == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default WarehouseMovementModal;
