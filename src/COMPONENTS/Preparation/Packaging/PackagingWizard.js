import { Component } from "react";
import ReactDOM from 'react-dom';
import SelectPackage from "./SelectPackage";

import './../../../CSS/packaging_wizard.css'

class PackagingWizard extends Component {
    constructor({ orderId, getSalesOrderDetails, getNameProduct, getPackages, getSalesOrderPackaging, addSalesOrderPackaging, addSalesOrderDetailPackaged,
        addSalesOrderDetailPackagedEan13, deleteSalesOrderDetailPackaged, deletePackaging, tabPackaging, generateShipping, getSalesOrderPallets, insertPallet,
        updatePallet, deletePallet }) {
        super();

        this.orderId = orderId;
        this.getSalesOrderDetails = getSalesOrderDetails;
        this.getNameProduct = getNameProduct;
        this.getPackages = getPackages;
        this.getSalesOrderPackaging = getSalesOrderPackaging;
        this.addSalesOrderPackaging = addSalesOrderPackaging;
        this.addSalesOrderDetailPackaged = addSalesOrderDetailPackaged;
        this.addSalesOrderDetailPackagedEan13 = addSalesOrderDetailPackagedEan13;
        this.deleteSalesOrderDetailPackaged = deleteSalesOrderDetailPackaged;
        this.deletePackaging = deletePackaging;
        this.tabPackaging = tabPackaging;
        this.generateShipping = generateShipping;
        this.getSalesOrderPallets = getSalesOrderPallets;
        this.insertPallet = insertPallet;
        this.updatePallet = updatePallet;
        this.deletePallet = deletePallet;

        this.productNameCache = {};
        this.selectedOrderDetail = -1;
        this.selectedPackage = -1;
        this.selectedDetailPackageOrderDetail = -1;
        this.selectedDetailPackagePackaging = -1;
        this.pallets = null;
        this.hasPallets = false;

        this.editDetails = this.editDetails.bind(this);
        this.editPackaged = this.editPackaged.bind(this);
        this.addPackage = this.addPackage.bind(this);
        this.selectPackage = this.selectPackage.bind(this);
        this.addToPackage = this.addToPackage.bind(this);
        this.editDetailPackaged = this.editDetailPackaged.bind(this);
        this.unpack = this.unpack.bind(this);
        this.deletePackage = this.deletePackage.bind(this);
        this.shipping = this.shipping.bind(this);
        this.barCode = this.barCode.bind(this);
        this.addPallet = this.addPallet.bind(this);
        this.editPallet = this.editPallet.bind(this);
        this.renderPackaged = this.renderPackaged.bind(this);
    }

    async componentDidMount() {
        await this.renderDetails();
        await this.renderPackaged();
        this.renderPallets();
    }

    renderDetails() {
        return new Promise((resolve) => {
            this.getSalesOrderDetails(this.orderId).then(async (details) => {
                ReactDOM.render(details.map((element, i) => {
                    element.productName = "...";
                    return <SalesOrderDetail key={i}
                        detail={element}
                        edit={this.editDetails}
                        pos={i}
                    />
                }), this.refs.renderDetails);

                for (let i = 0; i < details.length; i++) {
                    if (details[i].product != null) {
                        details[i].productName = await this.getProductName(details[i].product);
                    } else {
                        details[i].productName = "";
                    }
                }

                ReactDOM.unmountComponentAtNode(this.refs.renderDetails);
                ReactDOM.render(details.map((element, i) => {
                    return <SalesOrderDetail key={i}
                        detail={element}
                        edit={this.editDetails}
                        selected={element.id === this.selectedOrderDetail}
                    />
                }), this.refs.renderDetails);
                resolve();
            });
        });
    }

    getProductName(productId) {
        return new Promise(async (resolve) => {
            if (this.productNameCache[productId] != null) {
                resolve(this.productNameCache[productId]);
            } else {
                var productName = await this.getNameProduct(productId);
                this.productNameCache[productId] = productName;
                resolve(productName);
            }
        });
    }

    renderPackaged() {
        return new Promise((resolve) => {
            this.getSalesOrderPackaging(this.orderId).then((packages) => {
                ReactDOM.unmountComponentAtNode(this.refs.renderPackaged);
                const components = [];
                for (let i = 0; i < packages.length; i++) {
                    if (this.hasPallets && packages[i].pallet != this.refs.renderPallets.value) {
                        continue;
                    }

                    components.push(<SalesOrderPackaged key={"i" + i}
                        _package={packages[i]}
                        edit={this.editPackaged}
                        selected={packages[i].id === this.selectedPackage}
                    />);

                    for (let j = 0; j < packages[i].detailsPackaged.length; j++) {
                        components.push(<SalesOrderPackagedDetail key={"j" + j}
                            packaged={packages[i].detailsPackaged[j]}
                            edit={this.editDetailPackaged}
                            selected={packages[i].detailsPackaged[j].orderDetail === this.selectedDetailPackageOrderDetail}
                        />);
                    }
                }
                ReactDOM.render(components, this.refs.renderPackaged);
                resolve();
            });
        });
    }

    editDetails(pos) {
        this.selectedOrderDetail = pos;
        this.renderDetails();
    }

    editPackaged(pos) {
        this.selectedPackage = pos;
        this.selectedDetailPackageOrderDetail = -1;
        this.selectedDetailPackagePackaging = -1;
        this.renderPackaged();
    }

    editDetailPackaged(orderDetail, packaging) {
        this.selectedDetailPackageOrderDetail = orderDetail;
        this.selectedDetailPackagePackaging = packaging;
        this.selectedPackage = -1;
        this.renderPackaged();
    }

    addPackage() {
        ReactDOM.unmountComponentAtNode(document.getElementById('packagingWizardModal'));
        this.getPackages().then((packages) => {
            ReactDOM.render(
                <SelectPackage
                    packages={packages}
                    handleSelect={this.selectPackage}
                />,
                document.getElementById('packagingWizardModal'));
        });
    }

    selectPackage(__package) {
        const _package = {
            "salesOrder": this.orderId,
            "package": __package.id
        };

        if (this.hasPallets && this.refs.renderPallets.value == "") {
            return;
        }

        if (this.hasPallets) {
            _package.pallet = parseInt(this.refs.renderPallets.value);
        }

        this.addSalesOrderPackaging(_package).then((ok) => {
            if (ok) {
                this.refresh();
            }
        });
    }

    addToPackage() {
        if (this.selectedOrderDetail < 0 || this.selectedPackage < 0) {
            return;
        }

        this.addSalesOrderDetailPackaged({
            "orderDetail": this.selectedOrderDetail,
            "packaging": this.selectedPackage,
            "quantity": parseInt(this.refs.quantity.value)
        }).then((ok) => {
            if (ok) {
                this.refresh();
            }
        });
    }

    unpack() {
        if (this.selectedDetailPackageOrderDetail < 0 || this.selectedDetailPackagePackaging < 0) {
            return;
        }

        this.deleteSalesOrderDetailPackaged({
            "orderDetail": this.selectedDetailPackageOrderDetail,
            "packaging": this.selectedDetailPackagePackaging
        }).then((ok) => {
            if (ok) {
                this.refresh();
            }
        });
    }

    deletePackage() {
        this.deletePackaging(this.selectedPackage).then((ok) => {
            if (ok) {
                this.refresh();
            }
        });
    }

    async refresh() {
        this.selectedOrderDetail = -1;
        this.selectedPackage = -1;
        this.selectedDetailPackageOrderDetail = -1;
        this.selectedDetailPackagePackaging = -1;

        await this.renderDetails();
        this.renderPackaged();
    }

    shipping() {
        this.generateShipping(this.orderId).then((ok) => {
            if (ok) {
                this.refresh();
            }
        });
    }

    barCode() {
        if (this.refs.barCode.value.length === 13) {
            this.addSalesOrderDetailPackagedEan13({
                "salesOrder": this.orderId,
                "ean13": this.refs.barCode.value,
                "packaging": this.selectedPackage,
                "quantity": parseInt(this.refs.quantity.value)
            }).then((ok) => {
                if (ok) {
                    this.refresh();
                    this.refs.barCode.value = "";
                }
            });
        }
    }

    renderPallets() {
        this.getSalesOrderPallets(this.orderId).then((pallets) => {
            if (!pallets.hasPallets) {
                return;
            }

            this.refs.palletToolbar.style.visibility = "visible";
            this.pallets = pallets.pallets;
            this.hasPallets = true;
            ReactDOM.render(pallets.pallets.map((element, i) => {
                return <option key={i} value={element.id}>{element.name}</option>
            }), this.refs.renderPallets);
        });
    }

    addPallet() {
        ReactDOM.unmountComponentAtNode(document.getElementById("packagingWizardModal"));
        ReactDOM.render(<SalesOrderPalletModal
            orderId={this.orderId}
            palletsLength={this.pallets.length}
            insertPallet={(pallet) => {
                return new Promise((resolve) => {
                    this.insertPallet(pallet).then((result) => {
                        resolve(result);
                        this.renderPallets();
                    });
                });
            }}
        />, document.getElementById("packagingWizardModal"));
    }

    editPallet() {
        for (let i = 0; i < this.pallets.length; i++) {
            if (this.refs.renderPallets.value == this.pallets[i].id) {
                ReactDOM.unmountComponentAtNode(document.getElementById("packagingWizardModal"));
                ReactDOM.render(<SalesOrderPalletModal
                    pallet={this.pallets[i]}
                    orderId={this.orderId}
                    updatePallet={(pallet) => {
                        return new Promise((resolve) => {
                            this.updatePallet(pallet).then((result) => {
                                resolve(result);
                                this.renderPallets();
                            });
                        });
                    }}
                    deletePallet={(pallet) => {
                        return new Promise((resolve) => {
                            this.deletePallet(pallet).then((result) => {
                                resolve(result);
                                this.renderPallets();
                            });
                        });
                    }}
                />, document.getElementById("packagingWizardModal"));
            }
        }
    }

    render() {
        return <div id="packagingWizard" className="formRowRoot">
            <div id="packagingWizardModal"></div>
            <div class="form-row">
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <h4>Order details</h4>
                        </div>
                        <div class="col">
                            <input type="text" class="form-control" ref="barCode" onChange={this.barCode} />
                            <input type="number" class="form-control" ref="quantity" defaultValue="1" />
                            <button type="button" class="btn btn-success" onClick={this.addToPackage}>Add to package</button>
                            <button type="button" class="btn btn-secondary" onClick={this.tabPackaging}>Back</button>
                        </div>
                    </div>
                    <table class="table table-dark">
                        <thead>
                            <tr>
                                <th scope="col">Product</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Quantity pending</th>
                            </tr>
                        </thead>
                        <tbody ref="renderDetails"></tbody>
                    </table>
                </div>
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <h4>Packaged</h4>
                        </div>
                        <div class="col">
                            <div className="palletToolbar" ref="palletToolbar" style={{ visibility: "hidden" }}>
                                <select class="form-control" ref="renderPallets" onChange={this.renderPackaged}>
                                </select>
                                <button type="button" class="btn btn-primary" onClick={this.addPallet}>+</button>
                                <button type="button" class="btn btn-warning" onClick={this.editPallet}>*</button>
                            </div>
                            <button type="button" class="btn btn-primary" onClick={this.addPackage}>Add package</button>
                            <button type="button" class="btn btn-danger" onClick={this.deletePackage}>Delete package</button>
                            <button type="button" class="btn btn-warning" onClick={this.unpack}>Unpack detail</button>
                            <button type="button" class="btn btn-info" onClick={this.shipping}>Generate shipping</button>
                        </div>
                    </div>
                    <table class="table table-dark">
                        <thead>
                            <tr>
                                <th scope="col">Package</th>
                                <th scope="col">Weight</th>
                            </tr>
                        </thead>
                        <tbody ref="renderPackaged"></tbody>
                    </table>
                </div>
            </div>
        </div>
    }
}

class SalesOrderDetail extends Component {
    constructor({ detail, edit, selected }) {
        super();

        this.detail = detail;
        this.edit = edit;
        this.selected = selected;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.detail.id);
        }} className={this.selected ? 'bg-primary' : ''}>
            <td>{this.detail.productName}</td>
            <td>{this.detail.quantity}</td>
            <td>{this.detail.quantityPendingPackaging}</td>
        </tr>
    }
}

class SalesOrderPackaged extends Component {
    constructor({ _package, edit, selected }) {
        super();

        this._package = _package;
        this.edit = edit;
        this.selected = selected;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this._package.id);
        }} className={this.selected ? 'bg-primary' : ''}>
            <td>{this._package.packageName}</td>
            <td>{this._package.weight}</td>
        </tr>
    }
}

class SalesOrderPackagedDetail extends Component {
    constructor({ packaged, edit, selected }) {
        super();

        this.packaged = packaged;
        this.edit = edit;
        this.selected = selected;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.packaged.orderDetail, this.packaged.packaging);
        }} className={this.selected ? 'detailPackage bg-primary' : 'detailPackage'}>
            <td>Detail: {this.packaged.productName}</td>
            <td>Quantity: {this.packaged.quantity}</td>
        </tr>
    }
}

class SalesOrderPalletModal extends Component {
    constructor({ orderId, pallet, palletsLength, insertPallet, updatePallet, deletePallet }) {
        super();

        this.orderId = orderId;
        this.pallet = pallet;
        this.palletsLength = palletsLength;
        this.insertPallet = insertPallet;
        this.updatePallet = updatePallet;
        this.deletePallet = deletePallet;

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        window.$('#palletModal').modal({ show: true });
    }

    add() {
        const pallet = {
            salesOrder: this.orderId,
            name: this.refs.name.value
        };

        this.insertPallet(pallet).then((ok) => {
            if (ok) {
                window.$('#palletModal').modal('hide');
            }
        });
    }

    update() {
        const pallet = {
            id: this.pallet.id,
            name: this.refs.name.value,
            weight: parseFloat(this.refs.weight.value),
            width: parseFloat(this.refs.width.value),
            height: parseFloat(this.refs.height.value),
            depth: parseFloat(this.refs.depth.value)
        }

        this.updatePallet(pallet).then((ok) => {
            if (ok) {
                window.$('#palletModal').modal('hide');
            }
        });
    }

    delete() {
        this.deletePallet(this.pallet.id).then((ok) => {
            if (ok) {
                window.$('#palletModal').modal('hide');
            }
        });
    }

    render() {
        return <div class="modal fade" id="palletModal" tabindex="-1" role="dialog" aria-labelledby="palletModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="palletModalLabel">Pallet</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" class="form-control" ref="name" defaultValue={this.pallet != null ? this.pallet.name : 'Pallet ' + (this.palletsLength + 1)} />
                        </div>
                        {this.pallet == null ? null :
                            <div class="form-row">
                                <div class="col">
                                    <label>Weight</label>
                                    <input type="number" class="form-control" min="0" ref="weight" defaultValue={this.pallet.weight} />
                                </div>
                                <div class="col">
                                    <label>Width</label>
                                    <input type="number" class="form-control" min="0" ref="width" defaultValue={this.pallet.width} />
                                </div>
                                <div class="col">
                                    <label>Height</label>
                                    <input type="number" class="form-control" min="0" ref="height" defaultValue={this.pallet.height} />
                                </div>
                                <div class="col">
                                    <label>Depth</label>
                                    <input type="number" class="form-control" min="0" ref="depth" defaultValue={this.pallet.depth} />
                                </div>
                            </div>}
                    </div>
                    <div class="modal-footer">
                        {this.pallet != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>Delete</button> : null}
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        {this.pallet == null ? <button type="button" class="btn btn-primary" onClick={this.add}>Add</button> : null}
                        {this.pallet != null ? <button type="button" class="btn btn-success" onClick={this.update}>Update</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default PackagingWizard;
