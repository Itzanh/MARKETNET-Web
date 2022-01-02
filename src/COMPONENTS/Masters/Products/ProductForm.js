import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';

import './../../../CSS/product.css';

import ProductFormStock from './ProductFormStock';
import ProductSalesDetailsPending from './ProductSalesDetailsPending';
import ProductPurchaseDetailsPending from './ProductPurchaseDetailsPending';
import ProductSalesDetails from './ProductSalesDetails';
import ProductPurchaseDetails from './ProductPurchaseDetails';
import ProductWarehouseMovements from './ProductWarehouseMovements';
import AlertModal from '../../AlertModal';
import ProductFormImages from './ProductFormImages';
import ConfirmDelete from '../../ConfirmDelete';
import ProductFormMoreData from './ProductFormMoreData';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ProductManufacturingOrders from './ProductManufacturingOrders';
import TransactionLogViewModal from '../../VisualComponents/TransactionLogViewModal';
import ProductComplexManufacturingOrders from './ProductComplexManufacturingOrders';

// IMG
import HighlightIcon from '@material-ui/icons/Highlight';
import EditIcon from '@material-ui/icons/Edit';
import ManufacturingOrderTypeModal from '../../Manufacturing/OrderTypes/ManufacturingOrderTypeModal';
import LocateSupplier from '../Suppliers/LocateSupplier';
import ProductAccounts from './ProductAccounts';



class ProductForm extends Component {
    constructor({ product, addProduct, updateProduct, deleteProduct, tabProducts, getStock, getManufacturingOrderTypes, findSupplierByName,
        defaultValueNameSupplier, getProductSalesOrderPending, getNameProduct, getProductPurchaseOrderPending, getProductSalesOrder, getProductPurchaseOrder,
        getProductWarehouseMovements, getWarehouses, productGenerateBarcode, getProductImages, addProductImage, updateProductImage, deleteProductImage,
        getProductManufacturingOrders, getProductComplexManufacturingOrders, getRegisterTransactionalLogs, locateColor, locateProductFamilies, locateSuppliers,
        getProductRow, getProductAccounts, insertProductAccount, updateProductAccount, deleteProductAccount, locateAccountForSales, locateAccountForPurchases,
        getWarehouseMovementFunctions, getSalesOrdersFunctions, getPurchaseOrdersFunctions, getManufacturingOrdersFunctions,
        getComplexManufacturingOrerFunctions, getManufacturingOrderTypeFunctions }) {
        super();

        this.product = product;
        this.addProduct = addProduct;
        this.updateProduct = updateProduct;
        this.deleteProduct = deleteProduct;

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
        this.getProductManufacturingOrders = getProductManufacturingOrders;
        this.getProductComplexManufacturingOrders = getProductComplexManufacturingOrders;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;
        this.locateColor = locateColor;
        this.locateProductFamilies = locateProductFamilies;
        this.locateSuppliers = locateSuppliers;
        this.getProductRow = getProductRow;
        this.getProductAccounts = getProductAccounts;
        this.insertProductAccount = insertProductAccount;
        this.updateProductAccount = updateProductAccount;
        this.deleteProductAccount = deleteProductAccount;
        this.locateAccountForSales = locateAccountForSales;
        this.locateAccountForPurchases = locateAccountForPurchases;

        this.getWarehouseMovementFunctions = getWarehouseMovementFunctions;
        this.getSalesOrdersFunctions = getSalesOrdersFunctions;
        this.getPurchaseOrdersFunctions = getPurchaseOrdersFunctions;
        this.getManufacturingOrdersFunctions = getManufacturingOrdersFunctions;
        this.getComplexManufacturingOrerFunctions = getComplexManufacturingOrerFunctions;
        this.getManufacturingOrderTypeFunctions = getManufacturingOrderTypeFunctions;

        this.currentSelectedSupplierId = product != undefined ? product.supplier : undefined;

        this.tab = this.product == null || this.product.controlStock ? 0 : 1;

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
        this.tabMoreData = this.tabMoreData.bind(this);
        this.printTags = this.printTags.bind(this);
        this.generateBarcode = this.generateBarcode.bind(this);
        this.manufacturingOrSupplier = this.manufacturingOrSupplier.bind(this);
        this.tabManufacturingOrders = this.tabManufacturingOrders.bind(this);
        this.transactionLog = this.transactionLog.bind(this);
        this.editManufacturingOrderType = this.editManufacturingOrderType.bind(this);
        this.locateSupplier = this.locateSupplier.bind(this);
    }

    async componentDidMount() {
        await this.renderColors();
        await this.renderProductFamilies();
        this.manufacturingOrSupplier();
        this.tabs();
        if (this.product == null || this.product.controlStock) {
            this.tabStock();
        } else {
            this.tabMoreData();
        }
    }

    async renderColors() {
        return new Promise(async (resolve) => {
            const colors = await this.locateColor();
            resolve();
            colors.unshift({ id: 0, name: "." + i18next.t('none') });

            ReactDOM.render(
                colors.map((element, i) => {
                    return <option key={i} value={element.id}
                        selected={this.product == null && element.id == 0 ? true
                            : this.product != null && (element.id == this.product.color)}>{element.name}</option>
                }),
                document.getElementById("color"));
        });
    }

    async renderProductFamilies() {
        return new Promise(async (resolve) => {
            const productFamilies = await this.locateProductFamilies();
            resolve();
            productFamilies.unshift({ id: 0, name: "." + i18next.t('none') });

            ReactDOM.render(
                productFamilies.map((element, i) => {
                    return <option key={i} value={element.id}
                        selected={this.product == null && element.id == 0 ? true
                            : this.product != null && (element.id == this.product.family)}>{element.name}</option>
                }),
                document.getElementById("family"));
        });
    }

    tabs() {
        ReactDOM.render(<AppBar position="static" style={{
            'backgroundColor': '#343a40'
        }}>
            <Tabs value={this.tab} variant="scrollable" scrollButtons="auto" onChange={(_, tab) => {
                this.tab = tab;
                switch (tab) {
                    case 0: {
                        this.tabStock();
                        break;
                    }
                    case 1: {
                        this.tabMoreData();
                        break;
                    }
                    case 2: {
                        this.tabImages();
                        break;
                    }
                    case 3: {
                        this.tabSalesDetailsPending();
                        break;
                    }
                    case 4: {
                        this.tabPurchaseDetailsPending();
                        break;
                    }
                    case 5: {
                        this.tabSalesDetails();
                        break;
                    }
                    case 6: {
                        this.tabPurchaseDetails();
                        break;
                    }
                    case 7: {
                        this.tabWarehouseMovements();
                        break;
                    }
                    case 8: {
                        this.tabManufacturingOrders();
                        break;
                    }
                    case 9: {
                        this.tabComplexManufacturingOrders();
                        break;
                    }
                    case 10: {
                        this.tabProductAccounts();
                        break;
                    }
                }
            }}>
                <Tab label={i18next.t('stock')} disabled={this.product != null && !this.product.controlStock} />
                <Tab label={i18next.t('more-data')} />
                <Tab label={i18next.t('images')} />
                <Tab label={i18next.t('sales-details-pending')} wrapped />
                <Tab label={i18next.t('purchase-details-pending')} wrapped />
                <Tab label={i18next.t('sales-details')} />
                <Tab label={i18next.t('purchase-details')} />
                <Tab label={i18next.t('warehouse-movements')} />
                <Tab label={i18next.t('manufacturing-orders')} />
                <Tab label={i18next.t('complex-manufacturing-orders')} wrapped />
                <Tab label={i18next.t('accounting')} disabled={this.product == null} />
            </Tabs>
        </AppBar>, this.refs.tabs);
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
        this.tab = 2;
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
        this.tab = 3;
        this.tabs();
        ReactDOM.render(<ProductSalesDetailsPending
            productId={this.product !== undefined ? this.product.id : undefined}
            getProductSalesOrderPending={this.getProductSalesOrderPending}
            getNameProduct={this.getNameProduct}
            getSalesOrdersFunctions={this.getSalesOrdersFunctions}
        />, this.refs.render);
    }

    tabPurchaseDetailsPending() {
        this.tab = 4;
        this.tabs();
        ReactDOM.render(<ProductPurchaseDetailsPending
            productId={this.product !== undefined ? this.product.id : undefined}
            getProductPurchaseOrderPending={this.getProductPurchaseOrderPending}
            getNameProduct={this.getNameProduct}
            getPurchaseOrdersFunctions={this.getPurchaseOrdersFunctions}
        />, this.refs.render);
    }

    tabSalesDetails() {
        this.tab = 5;
        this.tabs();
        ReactDOM.render(<ProductSalesDetails
            productId={this.product !== undefined ? this.product.id : undefined}
            getProductSalesOrder={this.getProductSalesOrder}
            getNameProduct={this.getNameProduct}
            getSalesOrdersFunctions={this.getSalesOrdersFunctions}
        />, this.refs.render);
    }

    tabPurchaseDetails() {
        this.tab = 6;
        this.tabs();
        ReactDOM.render(<ProductPurchaseDetails
            productId={this.product !== undefined ? this.product.id : undefined}
            getProductPurchaseOrder={this.getProductPurchaseOrder}
            getNameProduct={this.getNameProduct}
            getPurchaseOrdersFunctions={this.getPurchaseOrdersFunctions}
        />, this.refs.render);
    }

    tabWarehouseMovements() {
        this.tab = 7;
        this.tabs();
        ReactDOM.render(<ProductWarehouseMovements
            productId={this.product !== undefined ? this.product.id : undefined}
            productName={this.product !== undefined ? this.product.name : undefined}
            getProductWarehouseMovements={this.getProductWarehouseMovements}
            getNameProduct={this.getNameProduct}
            getWarehouses={this.getWarehouses}
            getWarehouseMovementFunctions={this.getWarehouseMovementFunctions}
        />, this.refs.render);
    }

    tabMoreData() {
        this.tab = 1;
        this.tabs();
        ReactDOM.render(<ProductFormMoreData
            product={this.product}
            saveTab={this.saveTab}
        />, this.refs.render);
    }

    tabManufacturingOrders() {
        this.tab = 8;
        this.tabs();

        const commonProps = this.getManufacturingOrdersFunctions();

        ReactDOM.render(<ProductManufacturingOrders
            {...commonProps}
            getProductManufacturingOrders={this.getProductManufacturingOrders}
            productId={this.product !== undefined ? this.product.id : undefined}
        />, this.refs.render);
    }

    tabComplexManufacturingOrders() {
        this.tab = 9;
        this.tabs();

        const commonProps = this.getComplexManufacturingOrerFunctions();

        ReactDOM.render(<ProductComplexManufacturingOrders
            {...commonProps}
            getProductComplexManufacturingOrders={this.getProductComplexManufacturingOrders}
            productId={this.product !== undefined ? this.product.id : undefined}
        />, this.refs.render);
    }

    tabProductAccounts() {
        this.tab = 10;
        this.tabs();

        ReactDOM.render(<ProductAccounts
            productId={this.product.id}
            getProductAccounts={this.getProductAccounts}
            insertProductAccount={this.insertProductAccount}
            updateProductAccount={this.updateProductAccount}
            deleteProductAccount={this.deleteProductAccount}
            locateAccountForSales={this.locateAccountForSales}
            locateAccountForPurchases={this.locateAccountForPurchases}
        />, this.refs.render);
    }

    transactionLog() {
        if (this.product == null) {
            return;
        }

        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(<TransactionLogViewModal
            getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
            tableName={"product"}
            registerId={this.product.id}
        />,
            this.refs.renderModal);
    }

    saveTab(changes) {
        if (this.product == null) {
            this.product = {
                webservice: "_"
            };
        }
        Object.keys(changes).forEach((key) => {
            this.product[key] = changes[key];
        });
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

    async getProductFromForm() {
        await ReactDOM.unmountComponentAtNode(this.refs.render);
        const product = {};
        if (this.product != null) {
            Object.keys(this.product).forEach((key) => {
                product[key] = this.product[key];
            });
        }
        product.name = this.refs.name.value;
        product.reference = this.refs.reference.value;
        product.barCode = this.refs.barCode.value;
        product.color = document.getElementById("color").value == "0" ? null : parseInt(document.getElementById("color").value);
        product.family = document.getElementById("family").value == "0" ? null : parseInt(document.getElementById("family").value);
        product.controlStock = this.refs.controlStock.checked;
        product.vatPercent = parseFloat(this.refs.vatPercent.value);
        product.price = parseFloat(this.refs.price.value);
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
            errorMessage = i18next.t('name-0');
            return errorMessage;
        }
        if (product.name.length > 150) {
            errorMessage = i18next.t('name-150');
            return errorMessage;
        }
        if (product.reference.length > 40) {
            errorMessage = i18next.t('reference-40');
            return errorMessage;
        }
        if (product.barCode.length !== 0 && product.barCode.length !== 13) {
            errorMessage = i18next.t('ean13-13');
            return errorMessage;
        }
        return errorMessage;
    }

    async add() {
        const product = await this.getProductFromForm();
        const errorMessage = this.isValid(product);
        if (errorMessage !== "") {
            ReactDOM.unmountComponentAtNode(this.refs.renderModal);
            ReactDOM.render(
                <AlertModal
                    modalTitle={i18next.t('VALIDATION-ERROR')}
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

    async update() {
        const product = await this.getProductFromForm();
        const errorMessage = this.isValid(product);
        if (errorMessage !== "") {
            ReactDOM.unmountComponentAtNode(this.refs.renderModal);
            ReactDOM.render(
                <AlertModal
                    modalTitle={i18next.t('VALIDATION-ERROR')}
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
        if (this.product == null) {
            return
        }

        this.productGenerateBarcode(this.product.id).then((ok) => {
            if (ok) {
                this.getProductRow(this.product.id).then((product) => {
                    this.product.barCode = product.barCode;
                    this.refs.barCode.value = product.barCode;
                    this.forceUpdate();
                });
            }
        });
    }

    async manufacturingOrSupplier() {
        ReactDOM.unmountComponentAtNode(this.refs.manufacturingOrSupplier);
        await ReactDOM.render(
            this.refs.manufacturing.checked ?
                <div>
                    <label>{i18next.t('manufacturing-order-type')}</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.editManufacturingOrderType}><EditIcon /></button>
                        </div>
                        <select class="form-control" id="renderTypes">
                        </select>
                    </div>
                </div>
                :
                <div>
                    <label>{i18next.t('supplier')}</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateSupplier}><HighlightIcon /></button>
                        </div>
                        <input type="text" class="form-control" id="supplierName" defaultValue={this.defaultValueNameSupplier}
                            readOnly={true} />
                    </div>
                </div>
            , this.refs.manufacturingOrSupplier);
        if (this.refs.manufacturing.checked) {
            if (this.product !== undefined) {
                this.product.manufacturing = true;
            }
            this.loadManufacturingOrderTypes();
        }
    }

    locateSupplier() {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(<LocateSupplier
            locateSuppliers={this.locateSuppliers}
            onSelect={(supplier) => {
                this.currentSelectedSupplierId = supplier.id;
                document.getElementById("supplierName").value = supplier.name;
                this.defaultValueNameSupplier = supplier.name;
            }}
        />, this.refs.renderModal);
    }

    editManufacturingOrderType() {
        const orderTypeId = document.getElementById("renderTypes").value;
        if (orderTypeId == null || orderTypeId == "") {
            return;
        }
        const commonProps = this.getManufacturingOrderTypeFunctions();

        this.getManufacturingOrderTypes().then((types) => {
            for (let i = 0; i < types.length; i++) {
                if (types[i].id == orderTypeId) {
                    ReactDOM.unmountComponentAtNode(this.refs.renderModal);
                    ReactDOM.render(<ManufacturingOrderTypeModal
                        {...commonProps}
                        type={types[i]}
                    />, this.refs.renderModal);
                    return
                }
            }
        });
    }

    render() {
        return <div id="tabProduct" className="formRowRoot">
            <div ref="renderModal"></div>
            <h2>{i18next.t('product')}</h2>
            <div class="form-row">
                <div class="col">
                    <label>{i18next.t('name')}</label>
                    <input type="text" class="form-control" ref="name" defaultValue={this.product !== undefined ? this.product.name : ''} />
                </div>
                <div class="col">
                    <label>{i18next.t('reference')}</label>
                    <input type="text" class="form-control" ref="reference" defaultValue={this.product !== undefined ? this.product.reference : ''} />
                </div>
                <div class="col">
                    <label>{i18next.t('family')}</label>
                    <select id="family" class="form-control">

                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="col">
                    <label>{i18next.t('color')}</label>
                    <select id="color" class="form-control">

                    </select>
                </div>
                <div class="col">
                    <label>{i18next.t('bar-code')}</label>
                    <div class="input-group">
                        <input type="text" class="form-control" ref="barCode" defaultValue={this.product !== undefined ? this.product.barCode : ''} />
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.generateBarcode}
                                disabled={this.product === undefined || this.product.barCode.trim().length > 0}>{i18next.t('generate')}</button>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="form-row">
                        <div class="col" style={{ 'max-width': '30%' }}>
                            <div class="custom-control custom-switch" style={{ 'margin-top': '15%' }}>
                                <input class="form-check-input custom-control-input" type="checkbox" ref="manufacturing" id="manufacturing"
                                    onChange={this.manufacturingOrSupplier} defaultChecked={this.product !== undefined && this.product.manufacturing} />
                                <label class="form-check-label custom-control-label" htmlFor="manufacturing">{i18next.t('manufacturing')}</label>
                            </div>
                        </div>
                        <div ref="manufacturingOrSupplier" class="col"></div>
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="col">
                    <div class="custom-control custom-switch" style={{ 'margin-top': '5%' }}>
                        <input type="checkbox" class="custom-control-input" ref="controlStock" id="controlStock"
                            defaultChecked={this.product !== undefined ? this.product.controlStock : true} />
                        <label class="custom-control-label" htmlFor="controlStock">{i18next.t('control-stock')}</label>
                    </div>
                </div>
                <div class="col">
                    <label>{i18next.t('vat-percent')}</label>
                    <input type="number" class="form-control" min="0" ref="vatPercent"
                        defaultValue={this.product !== undefined ? this.product.vatPercent : window.config.defaultVatPercent} />
                </div>
                <div class="col">
                    <label>{i18next.t('price')}</label>
                    <input type="number" class="form-control" min="0" ref="price" defaultValue={this.product !== undefined ? this.product.price : '0'} />
                </div>
            </div>

            <div ref="tabs" className="mt-2"></div>

            <div ref="render" className="mt-2"></div>

            <div id="buttomBottomFormContainter">
                <div id="buttomBottomForm" className="pt-1">
                    {this.product != undefined ?
                        <div class="btn-group dropup">
                            <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true"
                                aria-expanded="false">{i18next.t('options')}</button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="#" onClick={this.printTags}>{i18next.t('print-tags')}</a>
                                <a class="dropdown-item" href="#" onClick={this.transactionLog}>{i18next.t('transactional-log')}</a>
                            </div>
                        </div> : undefined}
                    {this.product != undefined && !window.getPermission("CANT_UPDATE_DELETE_PRODUCT") ?
                        <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : undefined}
                    {this.product != undefined && !window.getPermission("CANT_UPDATE_DELETE_PRODUCT") ?
                        <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : undefined}
                    {this.product == undefined ? < button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : undefined}
                    <button type="button" class="btn btn-secondary" onClick={this.tabProducts}>{i18next.t('cancel')}</button>
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
