import { Component } from "react";
import ReactDOM from 'react-dom';

class ManufacturingOrderTypes extends Component {
    constructor({ getManufacturingOrderTypes, addManufacturingOrderTypes, updateManufacturingOrderTypes, deleteManufacturingOrderTypes }) {
        super();

        this.getManufacturingOrderTypes = getManufacturingOrderTypes;
        this.addManufacturingOrderTypes = addManufacturingOrderTypes;
        this.updateManufacturingOrderTypes = updateManufacturingOrderTypes;
        this.deleteManufacturingOrderTypes = deleteManufacturingOrderTypes;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.getManufacturingOrderTypes().then((types) => {
            ReactDOM.render(types.map((element, i) => {
                return <ManufacturingOrderType key={i}
                    type={element}
                    edit={this.edit}
                />
            }), this.refs.render);
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderManufacturingOrderTypesModal'));
        ReactDOM.render(
            <ManufacturingOrderTypeModal
                addManufacturingOrderTypes={this.addManufacturingOrderTypes}
            />,
            document.getElementById('renderManufacturingOrderTypesModal'));
    }

    edit(type) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderManufacturingOrderTypesModal'));
        ReactDOM.render(
            <ManufacturingOrderTypeModal
                type={type}
                updateManufacturingOrderTypes={this.updateManufacturingOrderTypes}
                deleteManufacturingOrderTypes={this.deleteManufacturingOrderTypes}
            />,
            document.getElementById('renderManufacturingOrderTypesModal'));
    }

    render() {
        return <div id="tabManufacturingOrderTypes">
            <div id="renderManufacturingOrderTypesModal"></div>
            <h1>Manufacturing order types</h1>
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

class ManufacturingOrderType extends Component {
    constructor({ type, edit }) {
        super();

        this.type = type;
        this.edit = edit;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.type);
        }}>
            <th scope="row">{this.type.id}</th>
            <td>{this.type.name}</td>
        </tr>
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

    add() {
        const type = this.getTypeFromForm();

        this.addManufacturingOrderTypes(type).then((ok) => {
            if (ok) {
                window.$('#manufacturingOrderTypeModal').modal('hide');
            }
        });
    }

    update() {
        const type = this.getTypeFromForm();
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
                        <h5 class="modal-title" id="manufacturingOrderTypeModalLabel">Manufacturing order type</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" class="form-control" ref="name" defaultValue={this.type != null ? this.type.name : ''} />
                        </div>
                    </div>
                    <div class="modal-footer">
                        {this.type != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>Delete</button> : null}
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        {this.type == null ? <button type="button" class="btn btn-primary" onClick={this.add}>Add</button> : null}
                        {this.type != null ? <button type="button" class="btn btn-success" onClick={this.update}>Update</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default ManufacturingOrderTypes;
