import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

class ManufacturingOrderTypes extends Component {
    constructor({ getManufacturingOrderTypes, addManufacturingOrderTypes, updateManufacturingOrderTypes, deleteManufacturingOrderTypes }) {
        super();

        this.getManufacturingOrderTypes = getManufacturingOrderTypes;
        this.addManufacturingOrderTypes = addManufacturingOrderTypes;
        this.updateManufacturingOrderTypes = updateManufacturingOrderTypes;
        this.deleteManufacturingOrderTypes = deleteManufacturingOrderTypes;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderManufacturingOrderTypes();
    }

    renderManufacturingOrderTypes() {
        this.getManufacturingOrderTypes().then((types) => {
            this.list = types;
            this.forceUpdate();
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderManufacturingOrderTypesModal'));
        ReactDOM.render(
            <ManufacturingOrderTypeModal
                addManufacturingOrderTypes={(type) => {
                    const promise = this.addManufacturingOrderTypes(type);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderManufacturingOrderTypes();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderManufacturingOrderTypesModal'));
    }

    edit(type) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderManufacturingOrderTypesModal'));
        ReactDOM.render(
            <ManufacturingOrderTypeModal
                type={type}
                updateManufacturingOrderTypes={(type) => {
                    const promise = this.updateManufacturingOrderTypes(type);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderManufacturingOrderTypes();
                        }
                    });
                    return promise;
                }}
                deleteManufacturingOrderTypes={(typeId) => {
                    const promise = this.deleteManufacturingOrderTypes(typeId);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderManufacturingOrderTypes();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderManufacturingOrderTypesModal'));
    }

    render() {
        return <div id="tabManufacturingOrderTypes">
            <div id="renderManufacturingOrderTypesModal"></div>
            <h1>{i18next.t('manufacturing-order-types')}</h1>
            <button type="button" class="btn btn-primary ml-2 m-2" onClick={this.add}>{i18next.t('add')}</button>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'id', headerName: '#', width: 90 },
                    { field: 'name', headerName: i18next.t('name'), flex: 1 }
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

class ManufacturingOrderTypeModal extends Component {
    constructor({ type, addManufacturingOrderTypes, updateManufacturingOrderTypes, deleteManufacturingOrderTypes }) {
        super();

        this.type = type;
        this.addManufacturingOrderTypes = addManufacturingOrderTypes;
        this.updateManufacturingOrderTypes = updateManufacturingOrderTypes;
        this.deleteManufacturingOrderTypes = deleteManufacturingOrderTypes;

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        window.$('#manufacturingOrderTypeModal').modal({ show: true });
    }

    getTypeFromForm() {
        const type = {}
        type.name = this.refs.name.value;
        return type;
    }

    isValid(type) {
        this.refs.errorMessage.innerText = "";
        if (type.name.length === 0) {
            this.refs.errorMessage.innerText = i18next.t('name-0');
            return false;
        }
        if (type.name.length > 100) {
            this.refs.errorMessage.innerText = i18next.t('name-100');
            return false;
        }
        return true;
    }

    add() {
        const type = this.getTypeFromForm();
        if (!this.isValid(type)) {
            return;
        }

        this.addManufacturingOrderTypes(type).then((ok) => {
            if (ok) {
                window.$('#manufacturingOrderTypeModal').modal('hide');
            }
        });
    }

    update() {
        const type = this.getTypeFromForm();
        if (!this.isValid(type)) {
            return;
        }
        type.id = this.type.id;

        this.updateManufacturingOrderTypes(type).then((ok) => {
            if (ok) {
                window.$('#manufacturingOrderTypeModal').modal('hide');
            }
        });
    }

    delete() {
        const typeId = this.type.id;
        this.deleteManufacturingOrderTypes(typeId).then((ok) => {
            if (ok) {
                window.$('#manufacturingOrderTypeModal').modal('hide');
            }
        });
    }

    render() {
        return <div class="modal fade" id="manufacturingOrderTypeModal" tabindex="-1" role="dialog" aria-labelledby="manufacturingOrderTypeModalLabel"
            aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="manufacturingOrderTypeModalLabel">{i18next.t('manufacturing-order-type')}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>{i18next.t('name')}</label>
                            <input type="text" class="form-control" ref="name" defaultValue={this.type != null ? this.type.name : ''} />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <p className="errorMessage" ref="errorMessage"></p>
                        {this.type != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                        {this.type == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                        {this.type != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default ManufacturingOrderTypes;
