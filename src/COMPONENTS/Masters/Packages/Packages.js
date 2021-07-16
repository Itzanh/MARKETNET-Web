import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

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

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderPackages();
    }

    renderPackages() {
        this.getPackages().then((series) => {
            this.list = series;
            this.forceUpdate();
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
            <h1>{i18next.t('packages')}</h1>
            <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add')}</button>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'id', headerName: '#', width: 90 },
                    { field: 'name', headerName: i18next.t('name'), flex: 1 },
                    { field: 'weight', headerName: i18next.t('weight'), width: 150 },
                    { field: 'width', headerName: i18next.t('width'), width: 150 },
                    { field: 'height', headerName: i18next.t('height'), width: 150 },
                    { field: 'depth', headerName: i18next.t('depth'), width: 150 }
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
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
            this.refs.errorMessage.innerText = i18next.t('name-0');
            return false;
        }
        if (_package.name.length > 50) {
            this.refs.errorMessage.innerText = i18next.t('name-50');
            return false;
        }
        if (_package.width <= 0 || _package.height <= 0 || _package.depth <= 0) {
            this.refs.errorMessage.innerText = i18next.t('dim-0');
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
                        <h5 class="modal-title" id="packageModalLabel">{i18next.t('package')}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>{i18next.t('name')}</label>
                            <input type="text" class="form-control" ref="name" defaultValue={this.package != null ? this.package.name : ''} />
                        </div>
                        <div class="form-row">
                            <div class="col">
                                <label>{i18next.t('weight')}</label>
                                <input type="number" class="form-control" min="0" ref="weight" defaultValue={this.package != null ? this.package.weight : '0'} />
                            </div>
                            <div class="col">
                                <label>{i18next.t('width')}</label>
                                <input type="number" class="form-control" min="0" ref="width" defaultValue={this.package != null ? this.package.width : '0'} />
                            </div>
                            <div class="col">
                                <label>{i18next.t('height')}</label>
                                <input type="number" class="form-control" min="0" ref="height" defaultValue={this.package != null ? this.package.height : '0'} />
                            </div>
                            <div class="col">
                                <label>{i18next.t('depth')}</label>
                                <input type="number" class="form-control" min="0" ref="depth" defaultValue={this.package != null ? this.package.depth : '0'} />
                            </div>
                        </div>
                        <label>{i18next.t('product')}</label>
                        <AutocompleteField findByName={this.findProductByName}
                            defaultValueId={this.package != null ? this.package.product : null}
                            defaultValueName={this.defaultValueNameProduct} valueChanged={(value) => {
                                this.currentSelectedProductId = value;
                            }} />
                    </div>
                    <div class="modal-footer">
                        <p className="errorMessage" ref="errorMessage"></p>
                        {this.package != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                        {this.package == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                        {this.package != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default Packages;
