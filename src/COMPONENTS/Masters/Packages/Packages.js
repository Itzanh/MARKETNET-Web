import { Component } from "react";
import ReactDOM from 'react-dom';
import AutocompleteField from "../../AutocompleteField";

class Packages extends Component {
    constructor({ getPackages, addPackages, updatePackages, deletePackages, findProductByName, getNameProduct }) {
        super();

        this.getPackages = getPackages;
        this.addPackages = addPackages;
        this.updatePackages = updatePackages;
        this.deletePackages = deletePackages;
        this.findProductByName = findProductByName;
        this.getNameProduct = getNameProduct;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderPackages();
    }

    renderPackages() {
        ReactDOM.unmountComponentAtNode(this.refs.render);
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
                findProductByName={this.findProductByName}
                addPackages={(_package) => {
                    const promise = this.addPackages(_package);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderPackages();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderPackageModal'));
    }

    async edit(_package) {
        const defaultValueNameProduct = await this.getNameProduct(_package.product);

        ReactDOM.unmountComponentAtNode(document.getElementById('renderPackageModal'));
        ReactDOM.render(
            <PackageModal
                _package={_package}
                findProductByName={this.findProductByName}
                defaultValueNameProduct={defaultValueNameProduct}
                updatePackages={(_package) => {
                    const promise = this.updatePackages(_package);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderPackages();
                        }
                    });
                    return promise;
                }}
                deletePackages={(_packageId) => {
                    const promise = this.deletePackages(_packageId);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderPackages();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderPackageModal'));
    }

    render() {
        return <div id="tabPackages">
            <div id="renderPackageModal"></div>
            <div className="menu">
                <h1>Packages</h1>
                <button type="button" class="btn btn-primary" onClick={this.add}>Add</button>
            </div>
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
    constructor({ _package, addPackages, updatePackages, deletePackages, findProductByName, defaultValueNameProduct }) {
        super();

        this.package = _package;
        this.addPackages = addPackages;
        this.updatePackages = updatePackages;
        this.deletePackages = deletePackages;
        this.findProductByName = findProductByName;
        this.defaultValueNameProduct = defaultValueNameProduct;

        this.currentSelectedProductId = this.package == null ? null : this.package.product;

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
        _package.product = parseInt(this.currentSelectedProductId);
        return _package;
    }

    isValid(_package) {
        this.refs.errorMessage.innerText = "";
        if (_package.name.length === 0) {
            this.refs.errorMessage.innerText = "The name can't be empty.";
            return false;
        }
        if (_package.name.length > 50) {
            this.refs.errorMessage.innerText = "The name can't be longer than 50 characters.";
            return false;
        }
        if (_package.width <= 0 || _package.height <= 0 || _package.depth <= 0) {
            this.refs.errorMessage.innerText = "You must specify the dimensions.";
            return false;
        }
        return true;
    }

    add() {
        const _package = this.getPackageFromForm();
        if (!this.isValid(_package)) {
            return;
        }

        this.addPackages(_package).then((ok) => {
            if (ok) {
                window.$('#packageModal').modal('hide');
            }
        });
    }

    update() {
        const _package = this.getPackageFromForm();
        if (!this.isValid(_package)) {
            return;
        }
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
                                <input type="number" class="form-control" min="0" ref="weight" defaultValue={this.package != null ? this.package.weight : '0'} />
                            </div>
                            <div class="col">
                                <label>Width</label>
                                <input type="number" class="form-control" min="0" ref="width" defaultValue={this.package != null ? this.package.width : '0'} />
                            </div>
                            <div class="col">
                                <label>Height</label>
                                <input type="number" class="form-control" min="0" ref="height" defaultValue={this.package != null ? this.package.height : '0'} />
                            </div>
                            <div class="col">
                                <label>Depth</label>
                                <input type="number" class="form-control" min="0" ref="depth" defaultValue={this.package != null ? this.package.depth : '0'} />
                            </div>
                        </div>
                        <label>Product</label>
                        <AutocompleteField findByName={this.findProductByName}
                            defaultValueId={this.package != null ? this.package.product : null}
                            defaultValueName={this.defaultValueNameProduct} valueChanged={(value) => {
                                this.currentSelectedProductId = value;
                            }} />
                    </div>
                    <div class="modal-footer">
                        <p className="errorMessage" ref="errorMessage"></p>
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
