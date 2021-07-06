import React, { Component } from 'react';
import i18next from 'i18next';


class WarehouseModal extends Component {
    constructor({ addWarehouses }) {
        super();

        this.addWarehouse = addWarehouses;

        this.add = this.add.bind(this);
    }

    componentDidMount() {
        window.$('#warehouseModal').modal({ show: true });
    }

    getWarehouseFromForm() {
        const warehouse = {};
        warehouse.id = this.refs.id.value;
        warehouse.name = this.refs.name.value;
        return warehouse;
    }

    isValid(country) {
        this.refs.errorMessage.innerText = "";
        if (country.name.length === 0) {
            this.refs.errorMessage.innerText = i18next.t('name-0');
            return false;
        }
        if (country.name.length > 50) {
            this.refs.errorMessage.innerText = i18next.t('name-50');
            return false;
        }
        if (country.id.length === 0) {
            this.refs.errorMessage.innerText = i18next.t('id-0');
            return false;
        }
        if (country.id.length > 2) {
            this.refs.errorMessage.innerText = i18next.t('id-2');
            return false;
        }
        return true;
    }

    add() {
        const warehouse = this.getWarehouseFromForm();
        if (!this.isValid(warehouse)) {
            return;
        }

        this.addWarehouse(warehouse).then((ok) => {
            if (ok) {
                window.$('#warehouseModal').modal('hide');
            }
        });
    }

    render() {
        return <div class="modal fade" id="warehouseModal" tabindex="-1" role="dialog" aria-labelledby="warehouseModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="warehouseModalLabel">{i18next.t('warehouse')}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-row">
                            <div class="col">
                                <label>ID</label>
                                <input type="text" class="form-control" ref="id" />
                            </div>
                            <div class="col">
                                <label>{i18next.t('name')}</label>
                                <input type="text" class="form-control" ref="name" />
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <p className="errorMessage" ref="errorMessage"></p>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                        <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default WarehouseModal;
