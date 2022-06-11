import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';

import './../../../CSS/product.css';

import ProductFormStock from './ProductFormStock';
import AlertModal from '../../AlertModal';
import ConfirmDelete from '../../ConfirmDelete';
import ProductFormMoreData from './ProductFormMoreData';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TransactionLogViewModal from '../../VisualComponents/TransactionLogViewModal';

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import Slide from '@mui/material/Slide';

import { TextField, FormControl, NativeSelect } from "@material-ui/core";
import { InputLabel } from "@mui/material";

// IMG
import HighlightIcon from '@material-ui/icons/Highlight';
import EditIcon from '@material-ui/icons/Edit';
import ManufacturingOrderTypeModal from '../../Manufacturing/OrderTypes/ManufacturingOrderTypeModal';
import LocateSupplier from '../Suppliers/LocateSupplier';
import ProductAccounts from './ProductAccounts';
import CustomFields from '../CustomFields/CustomFields';
import ProductFormRelations from './ProductFormRelations';
import ProductWarehouseMinimumStock from './ProductWarehouseMinimumStock';
import ProductIncludedProducts from './ProductIncludedProducts';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});



class ProductForm extends Component {
    constructor({ product, addProduct, updateProduct, deleteProduct, tabProducts, getStock, getManufacturingOrderTypes, findSupplierByName,
        getProductSalesOrderPending, getProductPurchaseOrderPending, getProductSalesOrder, getProductPurchaseOrder, getProductWarehouseMovements,
        getWarehouses, productGenerateBarcode, getProductImages, addProductImage, updateProductImage, deleteProductImage, getProductManufacturingOrders,
        getProductComplexManufacturingOrders, getRegisterTransactionalLogs, locateColor, locateProductFamilies, locateSuppliers, getProductRow,
        getProductAccounts, insertProductAccount, updateProductAccount, deleteProductAccount, locateAccountForSales, locateAccountForPurchases, getHSCodes,
        getWarehouseMovementFunctions, getSalesOrdersFunctions, getPurchaseOrdersFunctions, getManufacturingOrdersFunctions,
        getComplexManufacturingOrerFunctions, getManufacturingOrderTypeFunctions, getCustomFieldsFunctions,
        getTransferBetweenWarehousesMinimumStockFunctions, getProductIncludedProductsFunctions }) {
        super();

        this.product = product;
        this.addProduct = addProduct;
        this.updateProduct = updateProduct;
        this.deleteProduct = deleteProduct;

        this.tabProducts = tabProducts;
        this.getStock = getStock;
        this.getManufacturingOrderTypes = getManufacturingOrderTypes;
        this.findSupplierByName = findSupplierByName;
        this.getProductSalesOrderPending = getProductSalesOrderPending;
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
        this.getHSCodes = getHSCodes;

        this.getWarehouseMovementFunctions = getWarehouseMovementFunctions;
        this.getSalesOrdersFunctions = getSalesOrdersFunctions;
        this.getPurchaseOrdersFunctions = getPurchaseOrdersFunctions;
        this.getManufacturingOrdersFunctions = getManufacturingOrdersFunctions;
        this.getComplexManufacturingOrerFunctions = getComplexManufacturingOrerFunctions;
        this.getManufacturingOrderTypeFunctions = getManufacturingOrderTypeFunctions;
        this.getCustomFieldsFunctions = getCustomFieldsFunctions;
        this.getTransferBetweenWarehousesMinimumStockFunctions = getTransferBetweenWarehousesMinimumStockFunctions;
        this.getProductIncludedProductsFunctions = getProductIncludedProductsFunctions;

        this.defaultValueNameSupplier = product != null && product.supplierId != null ? product.supplier.name : undefined;
        this.currentSelectedSupplierId = product != undefined ? product.supplierId : undefined;

        this.tab = this.product == null || this.product.controlStock ? 0 : 1;

        this.name = React.createRef();
        this.reference = React.createRef();
        this.barCode = React.createRef();
        this.vatPercent = React.createRef();
        this.price = React.createRef();
        this.supplierName = React.createRef();

        this.tabs = this.tabs.bind(this);
        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.loadManufacturingOrderTypes = this.loadManufacturingOrderTypes.bind(this);
        this.tabStock = this.tabStock.bind(this);
        this.tabMoreData = this.tabMoreData.bind(this);
        this.tabRelations = this.tabRelations.bind(this);
        this.printTags = this.printTags.bind(this);
        this.generateBarcode = this.generateBarcode.bind(this);
        this.manufacturingOrSupplier = this.manufacturingOrSupplier.bind(this);
        this.transactionLog = this.transactionLog.bind(this);
        this.editManufacturingOrderType = this.editManufacturingOrderType.bind(this);
        this.locateSupplier = this.locateSupplier.bind(this);
        this.tabMinimumStock = this.tabMinimumStock.bind(this);
    }

    async componentDidMount() {
        await this.renderColors();
        await this.renderProductFamilies();
        await this.manufacturingOrSupplier();
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
                            : this.product != null && (element.id == this.product.colorId)}>{element.name}</option>
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
                            : this.product != null && (element.id == this.product.familyId)}>{element.name}</option>
                }),
                document.getElementById("family"));
        });
    }

    tabs() {
        ReactDOM.render(<AppBar position="static" style={{ 'backgroundColor': '#1976d2' }}>
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
                        this.tabRelations();
                        break;
                    }
                    case 3: {
                        this.tabProductAccounts();
                        break;
                    }
                    case 4: {
                        this.tabCustomFields();
                        break;
                    }
                    case 5: {
                        this.tabMinimumStock();
                        break;
                    }
                    case 6: {
                        this.tabIncludedProducts();
                        break;
                    }
                }
            }}>
                <Tab label={i18next.t('stock')} disabled={this.product != null && !this.product.controlStock} />
                <Tab label={i18next.t('more-data')} />
                <Tab label={i18next.t('relations')} disabled={this.product == null} />
                <Tab label={i18next.t('accounting')} disabled={this.product == null} />
                <Tab label={i18next.t('custom-fields')} disabled={this.product == null} />
                <Tab label={i18next.t('minimum-stock')} disabled={this.product == null} />
                <Tab label={i18next.t('included-products')} disabled={this.product == null} />
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

    tabMoreData() {
        this.tab = 1;
        this.tabs();
        ReactDOM.render(<ProductFormMoreData
            product={this.product}
            saveTab={this.saveTab}
            getHSCodes={this.getHSCodes}
        />, this.refs.render);
    }

    tabRelations() {
        this.tab = 2;
        this.tabs();
        ReactDOM.render(<ProductFormRelations
            product={this.product}
            productId={this.product !== undefined ? this.product.id : undefined}

            getProductImages={this.getProductImages}
            addProductImage={this.addProductImage}
            updateProductImage={this.updateProductImage}
            deleteProductImage={this.deleteProductImage}

            getProductSalesOrderPending={this.getProductSalesOrderPending}
            getSalesOrdersFunctions={this.getSalesOrdersFunctions}

            getProductPurchaseOrderPending={this.getProductPurchaseOrderPending}
            getPurchaseOrdersFunctions={this.getPurchaseOrdersFunctions}

            getProductSalesOrder={this.getProductSalesOrder}

            getProductPurchaseOrder={this.getProductPurchaseOrder}

            productName={this.product !== undefined ? this.product.name : undefined}
            getProductWarehouseMovements={this.getProductWarehouseMovements}
            getWarehouses={this.getWarehouses}
            getWarehouseMovementFunctions={this.getWarehouseMovementFunctions}

            getManufacturingOrderTypes={this.getManufacturingOrderTypes}
            getProductManufacturingOrders={this.getProductManufacturingOrders}
            manufacturingOrderTypeId={this.product !== undefined ? this.product.manufacturingOrderType : undefined}

            getProductComplexManufacturingOrders={this.getProductComplexManufacturingOrders}
        />, this.refs.render);
    }

    tabProductAccounts() {
        this.tab = 3;
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

    tabCustomFields() {
        this.tab = 4;
        this.tabs();

        const commonProps = this.getCustomFieldsFunctions();

        ReactDOM.render(<CustomFields
            {...commonProps}
            productId={this.product.id}
        />, this.refs.render);
    }

    tabMinimumStock() {
        this.tab = 5;
        this.tabs();

        const commonProps = this.getTransferBetweenWarehousesMinimumStockFunctions();

        ReactDOM.render(<ProductWarehouseMinimumStock
            {...commonProps}
            productId={this.product.id}
        />, this.refs.render);
    }

    tabIncludedProducts() {
        this.tab = 6;
        this.tabs();

        const commonProps = this.getProductIncludedProductsFunctions();

        ReactDOM.render(<ProductIncludedProducts
            {...commonProps}
            productId={this.product.id}
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
        return new Promise((resolve) => {
            this.getManufacturingOrderTypes().then((types) => {
                ReactDOM.render(types.map((element, i) => {
                    return <ManufacturingOrderType key={i}
                        type={element}
                        selected={this.product === undefined ? false : element.id === this.product.manufacturingOrderType}
                    />
                }), document.getElementById("renderTypes"));
                resolve();
            });
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
        product.name = this.name.current.value;
        product.reference = this.reference.current.value;
        product.barCode = this.barCode.current.value.trim();
        product.colorId = document.getElementById("color").value == "0" ? null : parseInt(document.getElementById("color").value);
        product.familyId = document.getElementById("family").value == "0" ? null : parseInt(document.getElementById("family").value);
        product.controlStock = this.refs.controlStock.checked;
        product.vatPercent = parseFloat(this.vatPercent.current.value);
        product.price = parseFloat(this.price.current.value);
        product.manufacturing = this.refs.manufacturing.checked;
        if (product.manufacturing) {
            product.manufacturingOrderTypeId = parseInt(document.getElementById("renderTypes").value);
        } else {
            product.supplierId = parseInt(this.currentSelectedSupplierId);
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
        if (product.barCode != "" && !this.checkEan13(product.barCode)) {
            errorMessage = i18next.t('the-bar-code-is-not-a-valid-ean13-code');
            return errorMessage;
        }
        return errorMessage;
    }

    checkEan13(barcode) {
        if (barcode.length != 13) {
            return false
        }
        // barcode must be a number
        if (isNaN(parseInt(barcode))) {
            return false
        }

        // get the first 12 digits (remove the 13 character, which is the control digit), and reverse the string
        var barcode12 = barcode.substring(0, 12);
        barcode12 = barcode12.split("").reverse().join("");

        // add the numbers in the odd positions
        var controlNumber = 0;
        for (let i = 0; i < barcode12.length; i += 2) {
            controlNumber += parseInt(barcode12[i]);
        }

        // multiply by 3
        controlNumber *= 3;

        // add the numbers in the pair positions
        for (let i = 1; i < barcode12.length; i += 2) {
            controlNumber += parseInt(barcode12[i]);
        }

        // immediately higher ten
        var controlDigit = (10 - (controlNumber % 10)) % 10

        // check the control digits are the same
        return controlDigit == parseInt(barcode[12]);
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
            if (ok.ok) {
                this.tabProducts();
            } else {
                switch (ok.errorCode) {
                    case 1: {
                        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-CREATING')}
                            modalText={i18next.t('there-is-a-product-with-the-same-ean13-code')}
                        />, this.refs.renderModal);
                        break;
                    }
                    default: // 0
                        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-CREATING')}
                            modalText={i18next.t('an-unknown-error-ocurred')}
                        />, this.refs.renderModal);
                }
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
            if (ok.ok) {
                this.tabProducts();
            } else {
                switch (ok.errorCode) {
                    case 1: {
                        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-UPDATING')}
                            modalText={i18next.t('there-is-a-product-with-the-same-ean13-code')}
                        />, this.refs.renderModal);
                        break;
                    }
                    default: // 0
                        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-UPDATING')}
                            modalText={i18next.t('an-unknown-error-ocurred')}
                        />, this.refs.renderModal);
                }
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
                        if (ok.ok) {
                            this.tabProducts();
                        } else {
                            switch (ok.errorCode) {
                                case 1: {
                                    var errorMessage = i18next.t('there-are-registers-associated-to-this-product') + ":";

                                    for (let i = 0; i < ok.extraData.length; i++) {
                                        if (i > 0) {
                                            errorMessage += ", ";
                                        }
                                        switch (ok.extraData[i]) {
                                            case "1": {
                                                errorMessage += i18next.t('complex-manufacturing-orders');
                                                break;
                                            }
                                            case "2": {
                                                errorMessage += i18next.t('manufacturing-orders');
                                                break;
                                            }
                                            case "3": {
                                                errorMessage += i18next.t('manufacturing-order-type-components');
                                                break;
                                            }
                                            case "4": {
                                                errorMessage += i18next.t('packages');
                                                break;
                                            }
                                            case "5": {
                                                errorMessage += i18next.t('product-accounts');
                                                break;
                                            }
                                            case "6": {
                                                errorMessage += i18next.t('product-images');
                                                break;
                                            }
                                            case "7": {
                                                errorMessage += i18next.t('product-translations');
                                                break;
                                            }
                                            case "8": {
                                                errorMessage += i18next.t('purchase-invoice-details');
                                                break;
                                            }
                                            case "9": {
                                                errorMessage += i18next.t('purchase-order-details');
                                                break;
                                            }
                                            case "10": {
                                                errorMessage += i18next.t('sale-order-details');
                                                break;
                                            }
                                            case "11": {
                                                errorMessage += i18next.t('sale-order-details');
                                                break;
                                            }
                                            case "12": {
                                                errorMessage += i18next.t('warehouse-movements');
                                                break;
                                            }
                                        }
                                    }
                                    errorMessage += ".";

                                    ReactDOM.unmountComponentAtNode(this.refs.renderModal);
                                    ReactDOM.render(<AlertModal
                                        modalTitle={i18next.t('ERROR-DELETING')}
                                        modalText={errorMessage}
                                    />, this.refs.renderModal);
                                    break;
                                }
                                default: // 0
                                    ReactDOM.unmountComponentAtNode(this.refs.renderModal);
                                    ReactDOM.render(<AlertModal
                                        modalTitle={i18next.t('ERROR-DELETING')}
                                        modalText={i18next.t('an-unknown-error-ocurred')}
                                    />, this.refs.renderModal);
                            }
                        }
                    });
                }}
            />,
            this.refs.renderModal);
    }

    printTags() {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
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
                    this.barCode.current.value = product.barCode;
                    this.forceUpdate();
                });
            }
        });
    }

    manufacturingOrSupplier() {
        return new Promise(async (resolve) => {
            ReactDOM.unmountComponentAtNode(this.refs.manufacturingOrSupplier);
            await ReactDOM.render(
                this.refs.manufacturing.checked ?
                    <div>
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <button class="btn btn-outline-secondary" type="button" onClick={this.editManufacturingOrderType}><EditIcon /></button>
                            </div>
                            <FormControl>
                                <InputLabel htmlFor="uncontrolled-native" style={{
                                    'marginBottom': '0', 'marginLeft': '5px'
                                }}>{i18next.t('manufacturing-order-type')}</InputLabel>
                                <NativeSelect
                                    style={{ 'marginTop': '0', 'marginLeft': '5px' }}
                                    id="renderTypes">

                                </NativeSelect>
                            </FormControl>
                        </div>
                    </div>
                    :
                    <div>
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <button class="btn btn-outline-secondary" type="button" onClick={this.locateSupplier}><HighlightIcon /></button>
                            </div>
                            <TextField label={i18next.t('supplier')} variant="outlined" fullWidth focused InputProps={{ readOnly: true }} size="small"
                                inputRef={this.supplierName} defaultValue={this.defaultValueNameSupplier} />
                        </div>
                    </div>
                , this.refs.manufacturingOrSupplier);
            if (this.refs.manufacturing.checked) {
                if (this.product !== undefined) {
                    this.product.manufacturing = true;
                }
                await this.loadManufacturingOrderTypes();
                resolve();
            } else {
                resolve();
            }
        });
    }

    locateSupplier() {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(<LocateSupplier
            locateSuppliers={this.locateSuppliers}
            onSelect={(supplier) => {
                this.currentSelectedSupplierId = supplier.id;
                this.supplierName.current.value = supplier.name;
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
            <h4 className="ml-2">{i18next.t('product')}</h4>
            <div class="form-row">
                <div class="col">
                    <TextField label={i18next.t('name')} variant="outlined" fullWidth size="small" inputRef={this.name}
                        defaultValue={this.product !== undefined ? this.product.name : ''} inputProps={{ maxLength: 150 }} />
                </div>
                <div class="col">
                    <TextField label={i18next.t('reference')} variant="outlined" fullWidth size="small" inputRef={this.reference}
                        defaultValue={this.product !== undefined ? this.product.reference : ''} inputProps={{ maxLength: 40 }} />
                </div>
                <div class="col">
                    <FormControl fullWidth>
                        <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('family')}</InputLabel>
                        <NativeSelect
                            style={{ 'marginTop': '0' }}
                            id="family">

                        </NativeSelect>
                    </FormControl>
                </div>
            </div>
            <div class="form-row mt-2">
                <div class="col">
                    <FormControl fullWidth>
                        <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('color')}</InputLabel>
                        <NativeSelect
                            style={{ 'marginTop': '0' }}
                            id="color">

                        </NativeSelect>
                    </FormControl>
                </div>
                <div class="col">
                    <div class="input-group">
                        <TextField label={i18next.t('bar-code')} variant="outlined" fullWidth size="small" inputRef={this.barCode}
                            defaultValue={this.product !== undefined ? this.product.barCode : ''} inputProps={{ maxLength: 13 }} />
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.generateBarcode}
                                disabled={this.product === undefined || this.product.barCode.trim().length > 0}>{i18next.t('generate')}</button>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="form-row">
                        <div class="col" style={{ 'max-width': '30%' }}>
                            <div class="custom-control custom-switch" style={{ 'margin-top': '5%' }}>
                                <input class="form-check-input custom-control-input" type="checkbox" ref="manufacturing" id="manufacturing"
                                    onChange={this.manufacturingOrSupplier} defaultChecked={this.product !== undefined && this.product.manufacturing} />
                                <label class="form-check-label custom-control-label" htmlFor="manufacturing">{i18next.t('manufacturing')}</label>
                            </div>
                        </div>
                        <div ref="manufacturingOrSupplier" class="col"></div>
                    </div>
                </div>
            </div>
            <div class="form-row mt-2">
                <div class="col">
                    <div class="custom-control custom-switch" style={{ 'margin-top': '2%' }}>
                        <input type="checkbox" class="custom-control-input" ref="controlStock" id="controlStock"
                            defaultChecked={this.product !== undefined ? this.product.controlStock : true} />
                        <label class="custom-control-label" htmlFor="controlStock">{i18next.t('control-stock')}</label>
                    </div>
                </div>
                <div class="col">
                    <TextField label={i18next.t('vat-percent')} variant="outlined" fullWidth size="small" inputRef={this.vatPercent}
                        defaultValue={this.product !== undefined ? this.product.vatPercent : window.config.defaultVatPercent} />
                </div>
                <div class="col">
                    <TextField label={i18next.t('price')} variant="outlined" fullWidth size="small" inputRef={this.price}
                        defaultValue={this.product !== undefined ? this.product.price : '0'} />
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

        this.open = true;

        this.handleClose = this.handleClose.bind(this);
        this.printLabels = this.printLabels.bind(this);
    }

    printLabels() {
        ReactDOM.unmountComponentAtNode(this.refs.renderBarCodes);
        const quantity = parseInt(this.refs.quantity.value);
        const components = [];

        for (let i = 0; i < quantity; i++) {
            components.push(<div style={{
                "display": "block",
                "width": window.config.productBarCodeLabelWidth + "px",
                "height": window.config.productBarCodeLabelHeight + "px"
            }}>
                <p style={{
                    "fontFamily": "'Libre Barcode EAN13 Text'",
                    "font-size": window.config.productBarCodeLabelSize + "px",
                    "marginTop": window.config.productBarCodeLabelMarginTop + "px",
                    "marginBottom": window.config.productBarCodeLabelMarginBottom + "px",
                    "marginLeft": window.config.productBarCodeLabelMarginLeft + "px",
                    "marginRight": window.config.productBarCodeLabelMarginRight + "px"
                }}
                >{this.barCode}</p>
            </div>);
        }

        ReactDOM.render(components, this.refs.renderBarCodes);

        const content = document.getElementById("renderBarCodes");
        const pri = document.getElementById("barcodesToPrint").contentWindow;
        pri.document.open();
        pri.document.write(content.innerHTML + '<link href="librebarcodeean13text.css" rel="stylesheet">');
        pri.document.close();
        pri.focus();
        setTimeout(() => {
            pri.print();
        }, 250);
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    styles = (theme) => ({
        root: {
            margin: 0,
            padding: theme.spacing(2),
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
    });

    DialogTitle = withStyles(this.styles)((props) => {
        const { children, classes, onClose, ...other } = props;
        return (
            <DialogTitle disableTypography className={classes.root} {...other}>
                <Typography variant="h6">{children}</Typography>
                <IconButton aria-label="close" className={classes.closeButton} onClick={this.handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
        );
    });

    PaperComponent(props) {
        return (
            <Draggable handle="#draggable-dialog-title" cancel={'[class*="DialogContent-root"]'}>
                <Paper {...props} />
            </Draggable>
        );
    }

    render() {
        return <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'sm'}
            PaperComponent={this.PaperComponent} TransitionComponent={Transition}>
            <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('print-labels')}
            </this.DialogTitle>
            <DialogContent>
                <div class="form-group">
                    <label>{i18next.t('quantity')}</label>
                    <input type="number" class="form-control" ref="quantity" defaultValue="1" />
                </div>

                <div ref="renderBarCodes" id="renderBarCodes" style={{ "height": "0px", "width": "0px", "display": "none" }}>
                </div>
                <iframe id="barcodesToPrint" style={{ "height": "0px", "width": "0px", "position": "absolute" }}></iframe>
            </DialogContent>
            <DialogActions>
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('cancel')}</button>
                <a type="button" ref="btn" class="btn btn-primary" onClick={this.printLabels}>{i18next.t('print-labels')}</a>
            </DialogActions>
        </Dialog>
    }
}



export default ProductForm;
