import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import './../../../CSS/product.css';

import AutocompleteField from '../../AutocompleteField';
import ProductFormStock from './ProductFormStock';
import ProductSalesDetailsPending from './ProductSalesDetailsPending';
import ProductPurchaseDetailsPending from './ProductPurchaseDetailsPending';
import ProductSalesDetails from './ProductSalesDetails';
import ProductPurchaseDetails from './ProductPurchaseDetails';
import ProductWarehouseMovements from './ProductWarehouseMovements';
import AlertModal from '../../AlertModal';
import ProductFormImages from './ProductFormImages';
import ConfirmDelete from '../../ConfirmDelete';

class ProductForm extends Component {
    constructor({ product, addProduct, updateProduct, deleteProduct, findColorByName, findProductFamilyByName, defaultValueNameColor, defaultValueNameFamily,
        tabProducts, getStock, getManufacturingOrderTypes, findSupplierByName, defaultValueNameSupplier, getProductSalesOrderPending, getNameProduct,
        getProductPurchaseOrderPending, getProductSalesOrder, getProductPurchaseOrder, getProductWarehouseMovements, getWarehouses, productGenerateBarcode,
        getProductImages, addProductImage, updateProductImage, deleteProductImage }) {
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
        this.getProductImages = getProductImages;
        this.addProductImage = addProductImage;
        this.updateProductImage = updateProductImage;
        this.deleteProductImage = deleteProductImage;

        this.currentSelectedColorId = product != undefined ? product.color : "";
        this.currentSelectedFamilyId = product != undefined ? product.family : "";
        this.currentSelectedSupplierId = product != undefined ? product.supplier : undefined;

        this.tab = 0;

        this.tabs = this.tabs.bind(this);
        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.loadManufacturingOrderTypes = this.loadManufacturingOrderTypes.bind(this);
        this.tabStock = this.tabStock.bind(this);
        this.tabImages = this.tabImages.bind(this);
        this.tabSalesDetailsPending = this.tabSalesDetailsPending.bind(this);
        this.tabPurchaseDetailsPending = this.tabPurchaseDetailsPending.bind(this);
        this.tabSalesDetails = this.tabSalesDetails.bind(this);
        this.tabPurchaseDetails = this.tabPurchaseDetails.bind(this);
        this.tabWarehouseMovements = this.tabWarehouseMovements.bind(this);
        this.printTags = this.printTags.bind(this);
        this.generateBarcode = this.generateBarcode.bind(this);
        this.manufacturingOrSupplier = this.manufacturingOrSupplier.bind(this);
    }

    componentDidMount() {
        this.tabs();
        this.tabStock();
    }

    tabs() {
        ReactDOM.render(<ul class="nav nav-tabs">
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 0 ? " active" : "")} href="#" onClick={this.tabStock}>Stock</a>
            </li>
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 1 ? " active" : "")} href="#" onClick={this.tabImages}>Images</a>
            </li>
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 2 ? " active" : "")} href="#" onClick={this.tabSalesDetailsPending}>Sales details pending</a>
            </li>
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 3 ? " active" : "")} href="#" onClick={this.tabPurchaseDetailsPending}>Purchase details pending</a>
            </li>
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 4 ? " active" : "")} href="#" onClick={this.tabSalesDetails}>Sales details</a>
            </li>
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 5 ? " active" : "")} href="#" onClick={this.tabPurchaseDetails}>Purchase details</a>
            </li>
            <li class="nav-item">
                <a class={"nav-link" + (this.tab === 6 ? " active" : "")} href="#" onClick={this.tabWarehouseMovements}>Warehouse movements</a>
            </li>
        </ul>, this.refs.tabs);
    }

    tabStock() {
        this.tab = 0;
        this.tabs();
        ReactDOM.render(<ProductFormStock
            productId={this.product !== undefined ? this.product.id : undefined}
            getStock={this.getStock}
            doneLoading={this.manufacturingOrSupplier}
        />, this.refs.render);
    }

    tabImages() {
        this.tab = 1;
        this.tabs();
        ReactDOM.render(<ProductFormImages
            productId={this.product !== undefined ? this.product.id : undefined}
            getProductImages={this.getProductImages}
            addProductImage={this.addProductImage}
            updateProductImage={this.updateProductImage}
            deleteProductImage={this.deleteProductImage}
        />, this.refs.render);
    }

    tabSalesDetailsPending() {
        this.tab = 2;
        this.tabs();
        ReactDOM.render(<ProductSalesDetailsPending
            productId={this.product !== undefined ? this.product.id : undefined}
            getProductSalesOrderPending={this.getProductSalesOrderPending}
            getNameProduct={this.getNameProduct}
        />, this.refs.render);
    }

    tabPurchaseDetailsPending() {
        this.tab = 3;
        this.tabs();
        ReactDOM.render(<ProductPurchaseDetailsPending
            productId={this.product !== undefined ? this.product.id : undefined}
            getProductPurchaseOrderPending={this.getProductPurchaseOrderPending}
            getNameProduct={this.getNameProduct}
        />, this.refs.render);
    }

    tabSalesDetails() {
        this.tab = 4;
        this.tabs();
        ReactDOM.render(<ProductSalesDetails
            productId={this.product !== undefined ? this.product.id : undefined}
            getProductSalesOrder={this.getProductSalesOrder}
            getNameProduct={this.getNameProduct}
        />, this.refs.render);
    }

    tabPurchaseDetails() {
        this.tab = 5;
        this.tabs();
        ReactDOM.render(<ProductPurchaseDetails
            productId={this.product !== undefined ? this.product.id : undefined}
            getProductPurchaseOrder={this.getProductPurchaseOrder}
            getNameProduct={this.getNameProduct}
        />, this.refs.render);
    }

    tabWarehouseMovements() {
        this.tab = 6;
        this.tabs();
        ReactDOM.render(<ProductWarehouseMovements
            productId={this.product !== undefined ? this.product.id : undefined}
            getProductWarehouseMovements={this.getProductWarehouseMovements}
            getNameProduct={this.getNameProduct}
            getWarehouses={this.getWarehouses}
        />, this.refs.render);
    }

    loadManufacturingOrderTypes() {
        this.getManufacturingOrderTypes().then((types) => {
            ReactDOM.render(types.map((element, i) => {
                return <ManufacturingOrderType key={i}
                    type={element}
                    selected={this.product === undefined ? false : element.id === this.product.manufacturingOrderType}
                />
            }), document.getElementById("renderTypes"));
        });
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
        product.description = this.refs.dsc.value;
        product.manufacturing = this.refs.manufacturing.checked;
        if (product.manufacturing) {
            product.manufacturingOrderType = parseInt(document.getElementById("renderTypes").value);
        } else {
            product.supplier = parseInt(this.currentSelectedSupplierId);
        }
        return product;
    }

    isValid(product) {
        var errorMessage = "";
        if (product.name.length === 0) {
            errorMessage = "The name can't be empty.";
            return errorMessage;
        }
        if (product.name.length > 150) {
            errorMessage = "The name can't be longer than 150 characters.";
            return errorMessage;
        }
        if (product.reference.length > 40) {
            errorMessage = "The reference can't be longer than 40 characters.";
            return errorMessage;
        }
        if (product.barCode.length !== 0 && product.barCode.length !== 13) {
            errorMessage = "The bar code must have a length of 13 digits.";
            return errorMessage;
        }
        return errorMessage;
    }

    add() {
        const product = this.getProductFromForm();
        const errorMessage = this.isValid(product);
        if (errorMessage !== "") {
            ReactDOM.unmountComponentAtNode(this.refs.renderModal);
            ReactDOM.render(
                <AlertModal
                    modalTitle={"VALIDATION ERROR"}
                    modalText={errorMessage}
                />,
                this.refs.renderModal);
            return;
        }

        this.addProduct(product).then((ok) => {
            if (ok) {
                this.tabProducts();
            }
        });
    }

    update() {
        const product = this.getProductFromForm();
        const errorMessage = this.isValid(product);
        if (errorMessage !== "") {
            ReactDOM.unmountComponentAtNode(this.refs.renderModal);
            ReactDOM.render(
                <AlertModal
                    modalTitle={"VALIDATION ERROR"}
                    modalText={errorMessage}
                />,
                this.refs.renderModal);
            return;
        }
        product.id = this.product.id;

        this.updateProduct(product).then((ok) => {
            if (ok) {
                this.tabProducts();
            }
        });
    }

    delete() {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(
            <ConfirmDelete
                onDelete={() => {
                    const productId = this.product.id;
                    this.deleteProduct(productId).then((ok) => {
                        if (ok) {
                            this.tabProducts();
                        }
                    });
                }}
            />,
            this.refs.renderModal);
    }

    printTags() {
        ReactDOM.render(<PrintTagsModal
            barCode={this.product.barCode.substring(0, 12)}
        />, this.refs.renderModal);
    }

    generateBarcode() {
        this.productGenerateBarcode(this.product.id);
    }

    async manufacturingOrSupplier() {
        ReactDOM.unmountComponentAtNode(this.refs.manufacturingOrSupplier);
        await ReactDOM.render(
            this.refs.manufacturing.checked ?
                <div class="col">
                    <label>Manufacturing order type</label>
                    <select class="form-control" id="renderTypes">
                    </select>
                </div>
                :
                <div class="col">
                    <label>Supplier</label>
                    <AutocompleteField findByName={this.findSupplierByName} defaultValueId={this.product !== undefined ? this.product.supplier : undefined}
                        defaultValueName={this.defaultValueNameSupplier} valueChanged={(value) => {
                            this.currentSelectedSupplierId = value;
                        }} />
                </div>
            , this.refs.manufacturingOrSupplier);
        if (this.refs.manufacturing.checked) {
            if (this.product !== undefined) {
                this.product.manufacturing = true;
            }
            this.loadManufacturingOrderTypes();
        }
    }

    render() {
        return <div id="tabProduct" className="formRowRoot">
            <div ref="renderModal"></div>
            <h2>Product</h2>
            <div class="form-row">
                <div class="col">
                    <label>Name</label>
                    <input type="text" class="form-control" ref="name" defaultValue={this.product !== undefined ? this.product.name : ''} />
                    <div class="form-row">
                        <div class="col">
                            <label>Reference</label>
                            <input type="text" class="form-control" ref="reference" defaultValue={this.product !== undefined ? this.product.reference : ''} />
                        </div>
                        <div class="col">
                            <label>Bar Code</label>
                            <div class="input-group">
                                <input type="text" class="form-control" ref="barCode" defaultValue={this.product !== undefined ? this.product.barCode : ''} />
                                <div class="input-group-append">
                                    <button class="btn btn-outline-secondary" type="button" onClick={this.generateBarcode}
                                        disabled={this.product === undefined || this.product.barCode.trim().length > 0}>Generate</button>
                                </div>
                            </div>
                        </div>
                        <div ref="manufacturingOrSupplier"></div>
                    </div>
                    <div class="form-row">
                        <div class="col">
                            <label>Color</label>
                            <AutocompleteField findByName={this.findColorByName} defaultValueId={this.product !== undefined ? this.product.color : undefined}
                                defaultValueName={this.defaultValueNameColor} valueChanged={(value) => {
                                    this.currentSelectedColorId = value;
                                }} />
                        </div>
                        <div class="col">
                            <label>Family</label>
                            <AutocompleteField findByName={this.findProductFamilyByName} defaultValueId={this.product !== undefined ? this.product.family : undefined}
                                defaultValueName={this.defaultValueNameFamily} valueChanged={(value) => {
                                    this.currentSelectedFamilyId = value;
                                }} />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col">
                            <input type="checkbox" defaultChecked={this.product !== undefined ? this.product.controlStock : true} ref="controlStock" />
                            <label>Control Stock</label>
                        </div>
                        <div class="col">
                            <label>Stock</label>
                            <input type="number" class="form-control" ref="stock" defaultValue={this.product !== undefined ? this.product.stock : '0'}
                                readOnly={true} />
                        </div>
                        <div class="col">
                            <label>VAT Percent</label>
                            <input type="number" class="form-control" min="0" ref="vatPercent" defaultValue={this.product !== undefined ? this.product.vatPercent : '0'} />
                        </div>
                        <div class="col">
                            <label>Price</label>
                            <input type="number" class="form-control" min="0" ref="price" defaultValue={this.product !== undefined ? this.product.price : '0'} />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label>Description</label>
                        <textarea class="form-control" rows="6" ref="dsc" defaultValue={this.product !== undefined ? this.product.description : ''}></textarea>
                    </div>
                    <div class="form-row">
                        <div class="col">
                            <label>Weight</label>
                            <input type="number" class="form-control" min="0" ref="weight" defaultValue={this.product !== undefined ? this.product.weight : '0'} />
                        </div>
                        <div class="col">
                            <label>Width</label>
                            <input type="number" class="form-control" min="0" ref="width" defaultValue={this.product !== undefined ? this.product.width : '0'} />
                        </div>
                        <div class="col">
                            <label>Height</label>
                            <input type="number" class="form-control" min="0" ref="height" defaultValue={this.product !== undefined ? this.product.height : '0'} />
                        </div>
                        <div class="col">
                            <label>Depth</label>
                            <input type="number" class="form-control" min="0" ref="depth" defaultValue={this.product !== undefined ? this.product.depth : '0'} />
                        </div>
                        <div class="col">
                            <input class="form-check-input" type="checkbox" ref="manufacturing" onChange={this.manufacturingOrSupplier}
                                defaultChecked={this.product !== undefined && this.product.manufacturing} />
                            <label class="form-check-label">Manufacturing</label>
                        </div>
                    </div>
                </div>
            </div>

            <div ref="tabs" className="mt-2"></div>

            <div ref="render" className="mt-2"></div>

            <div id="buttomBottomFormContainter">
                <div id="buttomBottomForm" className="pt-1">
                    {this.product != undefined ?
                        <div class="btn-group dropup">
                            <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true"
                                aria-expanded="false">Options</button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="#" onClick={this.printTags}>Print tags</a>
                            </div>
                        </div> : undefined}
                    {this.product != undefined ? <button type="button" class="btn btn-danger" onClick={this.delete}>Delete</button> : undefined}
                    {this.product != undefined ? <button type="button" class="btn btn-success" onClick={this.update}>Update</button> : undefined}
                    {this.product == undefined ? < button type="button" class="btn btn-primary" onClick={this.add}>Add</button> : undefined}
                    <button type="button" class="btn btn-secondary" onClick={this.tabProducts}>Cancel</button>
                </div>
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
