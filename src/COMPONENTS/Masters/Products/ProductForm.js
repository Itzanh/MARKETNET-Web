import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import AutocompleteField from '../../AutocompleteField';
import ProductFormStock from './ProductFormStock';
import ProductSalesDetailsPending from './ProductSalesDetailsPending';
import ProductPurchaseDetailsPending from './ProductPurchaseDetailsPending';
import ProductSalesDetails from './ProductSalesDetails';
import ProductPurchaseDetails from './ProductPurchaseDetails';
import ProductWarehouseMovements from './ProductWarehouseMovements';

class ProductForm extends Component {
    constructor({ product, addProduct, updateProduct, deleteProduct, findColorByName, findProductFamilyByName, defaultValueNameColor, defaultValueNameFamily,
        tabProducts, getStock, getManufacturingOrderTypes, findSupplierByName, defaultValueNameSupplier, getProductSalesOrderPending, getNameProduct,
        getProductPurchaseOrderPending, getProductSalesOrder, getProductPurchaseOrder, getProductWarehouseMovements, getWarehouses, productGenerateBarcode }) {
        super();

        this.product = product;
        this.addProduct = addProduct;
        this.updateProduct = updateProduct;
        this.deleteProduct = deleteProduct;

        this.findColorByName = findColorByName;
        this.findProductFamilyByName = findProductFamilyByName;
        this.defaultValueNameColor = defaultValueNameColor;
        this.defaultValueNameFamily = defaultValueNameFamily;
        this.tabProducts = tabProducts;
        this.getStock = getStock;
        this.getManufacturingOrderTypes = getManufacturingOrderTypes;
        this.findSupplierByName = findSupplierByName;
        this.defaultValueNameSupplier = defaultValueNameSupplier;
        this.getProductSalesOrderPending = getProductSalesOrderPending;
        this.getNameProduct = getNameProduct;
        this.getProductPurchaseOrderPending = getProductPurchaseOrderPending;
        this.getProductSalesOrder = getProductSalesOrder;
        this.getProductPurchaseOrder = getProductPurchaseOrder;
        this.getProductWarehouseMovements = getProductWarehouseMovements;
        this.getWarehouses = getWarehouses;
        this.productGenerateBarcode = productGenerateBarcode;

        this.currentSelectedColorId = product != null ? product.color : "";
        this.currentSelectedFamilyId = product != null ? product.family : "";
        this.currentSelectedSupplierId = product != null ? product.supplier : null;

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.loadManufacturingOrderTypes = this.loadManufacturingOrderTypes.bind(this);
        this.tabStock = this.tabStock.bind(this);
        this.tabSalesDetailsPending = this.tabSalesDetailsPending.bind(this);
        this.tabPurchaseDetailsPending = this.tabPurchaseDetailsPending.bind(this);
        this.tabSalesDetails = this.tabSalesDetails.bind(this);
        this.tabPurchaseDetails = this.tabPurchaseDetails.bind(this);
        this.tabWarehouseMovements = this.tabWarehouseMovements.bind(this);
        this.printTags = this.printTags.bind(this);
        this.generateBarcode = this.generateBarcode.bind(this);
    }

    componentDidMount() {
        this.tabStock();
    }

    tabStock() {
        ReactDOM.render(<ProductFormStock
            productId={this.product != null ? this.product.id : null}
            getStock={this.getStock}
            doneLoading={this.loadManufacturingOrderTypes}
        />, this.refs.render);
    }

    tabSalesDetailsPending() {
        ReactDOM.render(<ProductSalesDetailsPending
            productId={this.product != null ? this.product.id : null}
            getProductSalesOrderPending={this.getProductSalesOrderPending}
            getNameProduct={this.getNameProduct}
        />, this.refs.render);
    }

    tabPurchaseDetailsPending() {
        ReactDOM.render(<ProductPurchaseDetailsPending
            productId={this.product != null ? this.product.id : null}
            getProductPurchaseOrderPending={this.getProductPurchaseOrderPending}
            getNameProduct={this.getNameProduct}
        />, this.refs.render);
    }

    tabSalesDetails() {
        ReactDOM.render(<ProductSalesDetails
            productId={this.product != null ? this.product.id : null}
            getProductSalesOrder={this.getProductSalesOrder}
            getNameProduct={this.getNameProduct}
        />, this.refs.render);
    }

    tabPurchaseDetails() {
        ReactDOM.render(<ProductPurchaseDetails
            productId={this.product != null ? this.product.id : null}
            getProductPurchaseOrder={this.getProductPurchaseOrder}
            getNameProduct={this.getNameProduct}
        />, this.refs.render);
    }

    tabWarehouseMovements() {
        ReactDOM.render(<ProductWarehouseMovements
            productId={this.product != null ? this.product.id : null}
            getProductWarehouseMovements={this.getProductWarehouseMovements}
            getNameProduct={this.getNameProduct}
            getWarehouses={this.getWarehouses}
        />, this.refs.render);
    }

    loadManufacturingOrderTypes() {
        if (this.product != null && this.product.manufacturing) {
            this.getManufacturingOrderTypes().then((types) => {
                ReactDOM.render(types.map((element, i) => {
                    return <ManufacturingOrderType key={i}
                        type={element}
                        selected={element.id == this.product.manufacturingOrderType}
                    />
                }), this.refs.renderTypes);
            });
        }
    }

    getProductFromForm() {
        const product = {};
        product.name = this.refs.name.value;
        product.reference = this.refs.reference.value;
        product.barCode = this.refs.barCode.value;
        product.color = parseInt(this.currentSelectedColorId);
        product.family = parseInt(this.currentSelectedFamilyId);
        product.weight = parseFloat(this.refs.weight.value);
        product.width = parseFloat(this.refs.width.value);
        product.height = parseFloat(this.refs.height.value);
        product.depth = parseFloat(this.refs.depth.value);
        product.controlStock = this.refs.controlStock.checked;
        product.vatPercent = parseFloat(this.refs.vatPercent.value);
        product.price = parseFloat(this.refs.price.value);
        product.manufacturing = this.refs.manufacturing.checked;
        if (product.manufacturing) {
            product.manufacturingOrderType = parseInt(this.refs.renderTypes.value);
        } else {
            product.supplier = parseInt(this.currentSelectedSupplierId);
        }
        return product;
    }

    add() {
        const product = this.getProductFromForm();

        this.addProduct(product).then((ok) => {
            if (ok) {
                this.tabProducts();
            }
        });
    }

    update() {
        const product = this.getProductFromForm();
        product.id = this.product.id;

        this.updateProduct(product).then((ok) => {
            if (ok) {
                this.tabProducts();
            }
        });
    }

    delete() {
        const productId = this.product.id;
        this.deleteProduct(productId).then((ok) => {
            if (ok) {
                this.tabProducts();
            }
        });
    }

    printTags() {
        ReactDOM.render(<PrintTagsModal
            barCode={this.product.barCode.substring(0, 12)}
        />, this.refs.renderModal);
    }

    generateBarcode() {
        this.productGenerateBarcode(this.product.id);
    }

    render() {
        return <div id="tabProduct" className="formRowRoot">
            <div ref="renderModal"></div>
            <h2>Product</h2>
            <div class="form-row">
                <div class="col">
                    <label>Name</label>
                    <input type="text" class="form-control" ref="name" defaultValue={this.product != null ? this.product.name : ''} />
                    <div class="form-row">
                        <div class="col">
                            <label>Reference</label>
                            <input type="text" class="form-control" ref="reference" defaultValue={this.product != null ? this.product.reference : ''} />
                        </div>
                        <div class="col">
                            <label>Bar Code</label>
                            <div class="input-group mb-3">
                                <input type="text" class="form-control" ref="barCode" defaultValue={this.product != null ? this.product.barCode : ''} />
                                <div class="input-group-append">
                                    <button class="btn btn-outline-secondary" type="button" onClick={this.generateBarcode}
                                        disabled={this.product == null || this.product.barCode.trim().length > 0}>Generate</button>
                                </div>
                            </div>
                        </div>
                        {this.product != null && this.product.manufacturing ?
                            <div class="col">
                                <label>Manufacturing order type</label>
                                <select class="form-control" ref="renderTypes">
                                </select>
                            </div>
                            :
                            <div class="col">
                                <label>Supplier</label>
                                <AutocompleteField findByName={this.findSupplierByName} defaultValueId={this.order != null ? this.order.supplier : null}
                                    defaultValueName={this.defaultValueNameSupplier} valueChanged={(value) => {
                                        this.currentSelectedSupplierId = value;
                                    }} />
                            </div>}
                    </div>
                    <div class="form-row">
                        <div class="col">
                            <label>Color</label>
                            <AutocompleteField findByName={this.findColorByName} defaultValueId={this.product != null ? this.product.color : null}
                                defaultValueName={this.defaultValueNameColor} valueChanged={(value) => {
                                    this.currentSelectedColorId = value;
                                }} />
                        </div>
                        <div class="col">
                            <label>Family</label>
                            <AutocompleteField findByName={this.findProductFamilyByName} defaultValueId={this.product != null ? this.product.family : null}
                                defaultValueName={this.defaultValueNameFamily} valueChanged={(value) => {
                                    this.currentSelectedFamilyId = value;
                                }} />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col">
                            <input type="checkbox" defaultChecked={this.product != null ? this.product.controlStock : true} ref="controlStock" />
                            <label>Control Stock</label>
                        </div>
                        <div class="col">
                            <label>Stock</label>
                            <input type="number" class="form-control" ref="stock" defaultValue={this.product != null ? this.product.stock : '0'}
                                readOnly={true} />
                        </div>
                        <div class="col">
                            <label>VAT Percent</label>
                            <input type="number" class="form-control" ref="vatPercent" defaultValue={this.product != null ? this.product.vatPercent : '0'} />
                        </div>
                        <div class="col">
                            <label>Price</label>
                            <input type="number" class="form-control" ref="price" defaultValue={this.product != null ? this.product.price : '0'} />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label for="exampleFormControlTextarea1">Description</label>
                        <textarea class="form-control" rows="6"></textarea>
                    </div>
                    <div class="form-row">
                        <div class="col">
                            <label>Weight</label>
                            <input type="number" class="form-control" ref="weight" defaultValue={this.product != null ? this.product.weight : '0'} />
                        </div>
                        <div class="col">
                            <label>Width</label>
                            <input type="number" class="form-control" ref="width" defaultValue={this.product != null ? this.product.width : '0'} />
                        </div>
                        <div class="col">
                            <label>Height</label>
                            <input type="number" class="form-control" ref="height" defaultValue={this.product != null ? this.product.height : '0'} />
                        </div>
                        <div class="col">
                            <label>Depth</label>
                            <input type="number" class="form-control" ref="depth" defaultValue={this.product != null ? this.product.depth : '0'} />
                        </div>
                        <div class="col">
                            <input class="form-check-input" type="checkbox" ref="manufacturing"
                                defaultChecked={this.product != null && this.product.manufacturing} />
                            <label class="form-check-label">Manufacturing</label>
                        </div>
                    </div>
                </div>
            </div>

            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <a class="nav-link active" href="#" onClick={this.tabStock}>Stock</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Images</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" onClick={this.tabSalesDetailsPending}>Sales details pending</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" onClick={this.tabPurchaseDetailsPending}>Purchase details pending</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" onClick={this.tabSalesDetails}>Sales details</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" onClick={this.tabPurchaseDetails}>Purchase details</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" onClick={this.tabWarehouseMovements}>Warehouse movements</a>
                </li>
            </ul>

            <div ref="render"></div>

            <div id="buttomBottomForm">
                {this.product != null ?
                    <div class="btn-group dropup">
                        <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true"
                            aria-expanded="false">Options</button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="#" onClick={this.printTags}>Print tags</a>
                        </div>
                    </div> : null}
                {this.product != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>Delete</button> : null}
                {this.product != null ? <button type="button" class="btn btn-success" onClick={this.update}>Update</button> : null}
                {this.product == null ? < button type="button" class="btn btn-primary" onClick={this.add}>Add</button> : null}
                <button type="button" class="btn btn-secondary" onClick={this.tabProducts}>Cancel</button>
            </div>
        </div>
    }
}

class ManufacturingOrderType extends Component {
    constructor({ type, selected }) {
        super();

        this.type = type;
        this.selected = selected;
    }

    render() {
        return <option value={this.type.id} selected={this.selected}>{this.type.name}</option>
    }
}

class PrintTagsModal extends Component {
    constructor({ barCode }) {
        super();

        this.barCode = barCode;

        this.quantity = this.quantity.bind(this);
    }

    componentDidMount() {
        window.$('#productPrintTagModal').modal({ show: true });
    }

    quantity() {
        this.refs.btn.href = "marketnettagprinter:\\\\copies=" + this.refs.quantity.value + "&barcode=ean13&data=" + this.barCode
    }

    render() {
        return <div class="modal fade" id="productPrintTagModal" tabindex="-1" role="dialog" aria-labelledby="productPrintTagModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="productPrintTagModalLabel">Print tags</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Quantity</label>
                            <input type="number" class="form-control" ref="quantity" defaultValue="1" onChange={this.quantity} />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <a type="button" ref="btn" class="btn btn-primary"
                            href={"marketnettagprinter:\\\\copies=1&barcode=ean13&data=" + this.barCode}>Print tags</a>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default ProductForm;
