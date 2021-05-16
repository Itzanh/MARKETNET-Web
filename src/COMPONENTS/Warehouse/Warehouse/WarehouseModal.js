import React, { Component } from 'react';


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

    add() {
        const warehouse = this.getWarehouseFromForm();

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
                        <h5 class="modal-title" id="warehouseModalLabel">Warehouse</h5>
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
                                <label>Name</label>
                                <input type="text" class="form-control" ref="name" />
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onClick={this.add}>Add</button>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default WarehouseModal;
