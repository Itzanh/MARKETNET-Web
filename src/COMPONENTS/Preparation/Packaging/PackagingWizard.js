import { Component } from "react";
import ReactDOM from 'react-dom';
import SelectPackage from "./SelectPackage";

import './../../../CSS/packaging_wizard.css'

class PackagingWizard extends Component {
    constructor({ orderId, getSalesOrderDetails, getNameProduct, getPackages, getSalesOrderPackaging, addSalesOrderPackaging, addSalesOrderDetailPackaged,
        deleteSalesOrderDetailPackaged, deletePackaging, tabPackaging }) {
        super();

        this.orderId = orderId;
        this.getSalesOrderDetails = getSalesOrderDetails;
        this.getNameProduct = getNameProduct;
        this.getPackages = getPackages;
        this.getSalesOrderPackaging = getSalesOrderPackaging;
        this.addSalesOrderPackaging = addSalesOrderPackaging;
        this.addSalesOrderDetailPackaged = addSalesOrderDetailPackaged;
        this.deleteSalesOrderDetailPackaged = deleteSalesOrderDetailPackaged;
        this.deletePackaging = deletePackaging;
        this.tabPackaging = tabPackaging;

        this.productNameCache = {};
        this.selectedOrderDetail = -1;
        this.selectedPackage = -1;
        this.selectedDetailPackageOrderDetail = -1;
        this.selectedDetailPackagePackaging = -1;

        this.editDetails = this.editDetails.bind(this);
        this.editPackaged = this.editPackaged.bind(this);
        this.addPackage = this.addPackage.bind(this);
        this.selectPackage = this.selectPackage.bind(this);
        this.addToPackage = this.addToPackage.bind(this);
        this.editDetailPackaged = this.editDetailPackaged.bind(this);
        this.unpack = this.unpack.bind(this);
        this.deletePackage = this.deletePackage.bind(this);
    }

    async componentDidMount() {
        await this.renderDetails();
        this.renderPackaged();
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
                        selected={element.id == this.selectedOrderDetail}
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
        this.getSalesOrderPackaging(this.orderId).then((packages) => {
            ReactDOM.unmountComponentAtNode(this.refs.renderPackaged);
            const components = [];
            for (let i = 0; i < packages.length; i++) {
                components.push(<SalesOrderPackaged key={"i" + i}
                    _package={packages[i]}
                    edit={this.editPackaged}
                    selected={packages[i].id == this.selectedPackage}
                />);

                for (let j = 0; j < packages[i].detailsPackaged.length; j++) {
                    components.push(<SalesOrderPackagedDetail key={"j" + j}
                        packaged={packages[i].detailsPackaged[j]}
                        edit={this.editDetailPackaged}
                        selected={packages[i].detailsPackaged[j].orderDetail == this.selectedDetailPackageOrderDetail}
                    />);
                }
            }
            ReactDOM.render(components, this.refs.renderPackaged);
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

    selectPackage(_package) {
        this.addSalesOrderPackaging({
            "salesOrder": this.orderId,
            "package": _package.id
        }).then((ok) => {
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

    render() {
        return <div id="packagingWizard">
            <div id="packagingWizardModal"></div>
            <div class="form-row">
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <h4>Order details</h4>
                        </div>
                        <div class="col">
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
                            <button type="button" class="btn btn-primary" onClick={this.addPackage}>Add package</button>
                            <button type="button" class="btn btn-danger" onClick={this.deletePackage}>Delete package</button>
                            <button type="button" class="btn btn-warning" onClick={this.unpack}>Unpack detail</button>
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

export default PackagingWizard;
