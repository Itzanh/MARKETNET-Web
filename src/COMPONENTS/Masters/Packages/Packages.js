import { Component } from "react";
import ReactDOM from 'react-dom';

class Packages extends Component {
    constructor({ getPackages, addPackages, updatePackages, deletePackages }) {
        super();

        this.getPackages = getPackages;
        this.addPackages = addPackages;
        this.updatePackages = updatePackages;
        this.deletePackages = deletePackages;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.getPackages().then((series) => {
            ReactDOM.render(series.map((element, i) => {
                return <Package key={i}
                    _package={element}
                    edit={this.edit}
                />
            }), this.refs.render);
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderPackageModal'));
        ReactDOM.render(
            <PackageModal
                addPackages={this.addPackages}
            />,
            document.getElementById('renderPackageModal'));
    }

    edit(_package) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderPackageModal'));
        ReactDOM.render(
            <PackageModal
                _package={_package}
                updatePackages={this.updatePackages}
                deletePackages={this.deletePackages}
            />,
            document.getElementById('renderPackageModal'));
    }

    render() {
        return <div id="tabPackages">
            <div id="renderPackageModal"></div>
            <h1>Packages</h1>
            <button type="button" class="btn btn-primary" onClick={this.add}>Add</button>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Weight</th>
                        <th scope="col">Width</th>
                        <th scope="col">Height</th>
                        <th scope="col">Depth</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class Package extends Component {
    constructor({ _package, edit }) {
        super();

        this.package = _package;
        this.edit = edit;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.package);
        }}>
            <th scope="row">{this.package.id}</th>
            <td>{this.package.name}</td>
            <td>{this.package.weight}</td>
            <td>{this.package.width}</td>
            <td>{this.package.height}</td>
            <td>{this.package.depth}</td>
        </tr>
    }
}

class PackageModal extends Component {
    constructor({ _package, addPackages, updatePackages, deletePackages }) {
        super();

        this.package = _package;
        this.addPackages = addPackages;
        this.updatePackages = updatePackages;
        this.deletePackages = deletePackages;

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        window.$('#packageModal').modal({ show: true });
    }

    getPackageFromForm() {
        const _package = {};
        _package.name = this.refs.name.value;
        _package.weight = parseFloat(this.refs.weight.value);
        _package.width = parseFloat(this.refs.width.value);
        _package.height = parseFloat(this.refs.height.value);
        _package.depth = parseFloat(this.refs.depth.value);
        return _package;
    }

    add() {
        const _package = this.getPackageFromForm();

        this.addPackages(_package).then((ok) => {
            if (ok) {
                window.$('#packageModal').modal('hide');
            }
        });
    }

    update() {
        const _package = this.getPackageFromForm();
        _package.id = this.package.id;

        this.updatePackages(_package).then((ok) => {
            if (ok) {
                window.$('#packageModal').modal('hide');
            }
        });
    }

    delete() {
        this.deletePackages(this.package.id).then((ok) => {
            if (ok) {
                window.$('#packageModal').modal('hide');
            }
        });
    }

    render() {
        return <div class="modal fade" id="packageModal" tabindex="-1" role="dialog" aria-labelledby="packageModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="packageModalLabel">Package</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" class="form-control" ref="name" defaultValue={this.package != null ? this.package.name : ''} />
                        </div>
                        <div class="form-row">
                            <div class="col">
                                <label>Weight</label>
                                <input type="number" class="form-control" ref="weight" defaultValue={this.package != null ? this.package.weight : '0'} />
                            </div>
                            <div class="col">
                                <label>Width</label>
                                <input type="number" class="form-control" ref="width" defaultValue={this.package != null ? this.package.width : '0'} />
                            </div>
                            <div class="col">
                                <label>Height</label>
                                <input type="number" class="form-control" ref="height" defaultValue={this.package != null ? this.package.height : '0'} />
                            </div>
                            <div class="col">
                                <label>Depth</label>
                                <input type="number" class="form-control" ref="depth" defaultValue={this.package != null ? this.package.depth : '0'} />
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        {this.package != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>Delete</button> : null}
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        {this.package == null ? <button type="button" class="btn btn-primary" onClick={this.add}>Add</button> : null}
                        {this.package != null ? <button type="button" class="btn btn-success" onClick={this.update}>Update</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default Packages;
