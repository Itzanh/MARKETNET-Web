/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import ProductForm from './ProductForm';
import SearchField from '../../SearchField';
import ProductGenerator from './ProductGenerator';
import CustomPagination from '../../VisualComponents/CustomPagination';
import LocateWarehouse from '../../Warehouse/Warehouse/LocateWarehouse';
import AlertModal from '../../AlertModal';



class Products extends Component {
    constructor({ getProducts, searchProducts, addProduct, updateProduct, deleteProduct, tabProducts, getStock, getManufacturingOrderTypes, findSupplierByName,
        getProductSalesOrderPending, getProductPurchaseOrderPending, getProductSalesOrder, getProductPurchaseOrder, getProductWarehouseMovements,
        getWarehouses, productGenerateBarcode, getProductImages, addProductImage, updateProductImage, deleteProductImage, calculateMinimumStock,
        generateManufacturingOrPurchaseOrdersMinimumStock, productGenerator, getProductManufacturingOrders, getProductComplexManufacturingOrders,
        getRegisterTransactionalLogs, locateColor, locateProductFamilies, locateSuppliers, getProductRow, getProductAccounts, insertProductAccount,
        updateProductAccount, deleteProductAccount, locateAccountForSales, locateAccountForPurchases, getHSCodes, getWarehouseMovementFunctions,
        getSalesOrdersFunctions, getPurchaseOrdersFunctions, getManufacturingOrdersFunctions, getComplexManufacturingOrerFunctions,
        getManufacturingOrderTypeFunctions, getCustomFieldsFunctions, getTransferBetweenWarehousesMinimumStockFunctions,
        getProductIncludedProductsFunctions }) {
        super();

        this.getProducts = getProducts;
        this.searchProducts = searchProducts;
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
        this.calculateMinimumStock = calculateMinimumStock;
        this.generateManufacturingOrPurchaseOrdersMinimumStock = generateManufacturingOrPurchaseOrdersMinimumStock;
        this.productGen = productGenerator;
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

        this.advancedSearchListener = null;
        this.list = [];
        this.footer = { stock: 0 };

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.search = this.search.bind(this);
        this.calcMinStk = this.calcMinStk.bind(this);
        this.genManPurOrdStkMin = this.genManPurOrdStkMin.bind(this);
        this.advanced = this.advanced.bind(this);
        this.productGenerator = this.productGenerator.bind(this);
        this.generateTransferBetweenWarehousesForMinimumStock = this.generateTransferBetweenWarehousesForMinimumStock.bind(this);
    }

    componentDidMount() {
        const savedSearch = window.getSavedSearches("product");
        if (savedSearch != null && savedSearch.search != "") {
            this.search(savedSearch.search).then(() => {
                if (savedSearch.scroll != null) {
                    setTimeout(() => {
                        window.scrollTo(savedSearch.scroll[0], savedSearch.scroll[1]);
                    }, 100);
                }
            });
        } else {
            this.getProducts().then((products) => {
                this.renderProducts(products);
                if (savedSearch != null && savedSearch.scroll != null) {
                    setTimeout(() => {
                        window.scrollTo(savedSearch.scroll[0], savedSearch.scroll[1]);
                    }, 100);
                }
            });
        }
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

    search(searchText) {
        if (searchText == null) {
            searchText = "";
        }
        const searchIsBarCode = this.checkEan13(searchText);

        return new Promise(async (resolve) => {
            var savedSearch = window.getSavedSearches("product");
            if (savedSearch == null) {
                savedSearch = {};
            }
            if (!searchIsBarCode) {
                savedSearch.search = searchText;
            }

            window.addSavedSearches("product", savedSearch);

            var trackMinimumStock = false;
            var familyId = null;
            if (this.advancedSearchListener != null) {
                const s = this.advancedSearchListener();
                trackMinimumStock = s.trackMinimumStock;
                familyId = s.familyId;
            }
            const products = await this.searchProducts({
                search: searchText,
                trackMinimumStock: trackMinimumStock,
                familyId: familyId
            });

            if (searchIsBarCode) {
                if (products.length == 0) {
                    ReactDOM.unmountComponentAtNode(this.refs.renderModal);
                    ReactDOM.render(<AlertModal
                        modalTitle={i18next.t('BARCODE-ERROR')}
                        modalText={i18next.t('there-is-no-product-with-a-barcode-that-matches-the-scanned-barcode')}
                    />, this.refs.renderModal);
                } else {
                    this.edit(products[0]);
                }
            } else {
                this.renderProducts(products);
            }

            resolve();
        });
    }

    componentWillUnmount() {
        var savedSearch = window.getSavedSearches("product");
        if (savedSearch == null) {
            savedSearch = {};
        }
        savedSearch.scroll = document.getScroll();
        window.addSavedSearches("product", savedSearch);
    }

    renderProducts(products) {
        this.list = products;
        var stock = 0;
        for (let i = 0; i < products.length; i++) {
            stock += products[i].stock;
        }
        this.footer.stock = stock;
        this.forceUpdate();
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <ProductForm
                addProduct={this.addProduct}
                findColorByName={this.findColorByName}
                findProductFamilyByName={this.findProductFamilyByName}
                tabProducts={this.tabProducts}
                findSupplierByName={this.findSupplierByName}
                getManufacturingOrderTypes={this.getManufacturingOrderTypes}
                locateColor={this.locateColor}
                locateProductFamilies={this.locateProductFamilies}
                locateSuppliers={this.locateSuppliers}
                getProductRow={this.getProductRow}
                getHSCodes={this.getHSCodes}
            />,
            document.getElementById('renderTab'));
    }

    async edit(product) {

        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <ProductForm
                product={product}
                updateProduct={this.updateProduct}
                deleteProduct={this.deleteProduct}
                tabProducts={this.tabProducts}
                getStock={this.getStock}
                getManufacturingOrderTypes={this.getManufacturingOrderTypes}
                findSupplierByName={this.findSupplierByName}
                getProductSalesOrderPending={this.getProductSalesOrderPending}
                getProductPurchaseOrderPending={this.getProductPurchaseOrderPending}
                getProductSalesOrder={this.getProductSalesOrder}
                getProductPurchaseOrder={this.getProductPurchaseOrder}
                getProductWarehouseMovements={this.getProductWarehouseMovements}
                getWarehouses={this.getWarehouses}
                productGenerateBarcode={this.productGenerateBarcode}
                getProductImages={this.getProductImages}
                addProductImage={this.addProductImage}
                updateProductImage={this.updateProductImage}
                deleteProductImage={this.deleteProductImage}
                getProductManufacturingOrders={this.getProductManufacturingOrders}
                getProductComplexManufacturingOrders={this.getProductComplexManufacturingOrders}
                getWarehouseMovementFunctions={this.getWarehouseMovementFunctions}
                getSalesOrdersFunctions={this.getSalesOrdersFunctions}
                getPurchaseOrdersFunctions={this.getPurchaseOrdersFunctions}
                getManufacturingOrdersFunctions={this.getManufacturingOrdersFunctions}
                getComplexManufacturingOrerFunctions={this.getComplexManufacturingOrerFunctions}
                getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
                locateColor={this.locateColor}
                locateProductFamilies={this.locateProductFamilies}
                getManufacturingOrderTypeFunctions={this.getManufacturingOrderTypeFunctions}
                locateSuppliers={this.locateSuppliers}
                getProductRow={this.getProductRow}
                getProductAccounts={this.getProductAccounts}
                insertProductAccount={this.insertProductAccount}
                updateProductAccount={this.updateProductAccount}
                deleteProductAccount={this.deleteProductAccount}
                locateAccountForSales={this.locateAccountForSales}
                locateAccountForPurchases={this.locateAccountForPurchases}
                getHSCodes={this.getHSCodes}
                getCustomFieldsFunctions={this.getCustomFieldsFunctions}
                getTransferBetweenWarehousesMinimumStockFunctions={this.getTransferBetweenWarehousesMinimumStockFunctions}
                getProductIncludedProductsFunctions={this.getProductIncludedProductsFunctions}
            />,
            document.getElementById('renderTab'));
    }

    calcMinStk() {
        this.calculateMinimumStock();
    }

    genManPurOrdStkMin() {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(<LocateWarehouse
            getWarehouses={this.getWarehouses}
            handleSelect={(warehouseId) => {
                this.generateManufacturingOrPurchaseOrdersMinimumStock({
                    warehouse: warehouseId
                });
            }}
        />, this.refs.renderModal);
    }

    advanced(advanced) {
        if (!advanced) {
            ReactDOM.unmountComponentAtNode(this.refs.advancedSearch);
            this.advancedSearchListener = null;
        } else {
            ReactDOM.render(
                <ProductAdvancedSearch
                    subscribe={(listener) => {
                        this.advancedSearchListener = listener;
                    }}
                    locateProductFamilies={this.locateProductFamilies}
                />, this.refs.advancedSearch);
        }
    }

    productGenerator() {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(<ProductGenerator
            productGenerator={this.productGen}
        />, this.refs.renderModal);
    }

    generateTransferBetweenWarehousesForMinimumStock() {
        this.getTransferBetweenWarehousesMinimumStockFunctions().generateTransferBetweenWarehousesForMinimumStock().then((ok) => {
            if (ok) {
                ReactDOM.unmountComponentAtNode(this.refs.renderModal);
                ReactDOM.render(<AlertModal
                    modalTitle={i18next.t('OK')}
                    modalText={i18next.t('the-transfers-between-warehouses-were-generated-successfully')}
                />, this.refs.renderModal);
            } else {
                ReactDOM.unmountComponentAtNode(this.refs.renderModal);
                ReactDOM.render(<AlertModal
                    modalTitle={i18next.t('ERROR-CREATING')}
                    modalText={i18next.t('an-unknown-error-ocurred')}
                />, this.refs.renderModal);
            }
        });
    }

    render() {
        return <div id="tabProducts" className="formRowRoot">
            <h4 className="ml-2">{i18next.t('products')}</h4>
            <div ref="renderModal"></div>
            <div class="form-row">
                <div class="col">
                    <div class="btn-group">
                        {window.getPermission("CANT_CREATE_PRODUCT") ? null :
                            <button type="button" class="btn btn-primary ml-2" onClick={this.add}>{i18next.t('add')}</button>}
                        <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <a class="dropdown-item" href="#" onClick={this.calcMinStk}>
                                {i18next.t('calculate-minimum-stock')}</a>
                            <a class="dropdown-item" href="#" onClick={this.genManPurOrdStkMin}>
                                {i18next.t('generate-manufacturing-purchase-orders-to-cover-minimum-stock')}</a>
                            {window.getPermission("CANT_USE_PRODUCT_GENERATOR") ? null :
                                <a class="dropdown-item" href="#" onClick={this.productGenerator}>
                                    {i18next.t('product-generator')}</a>}
                            <a class="dropdown-item" href="#" onClick={this.generateTransferBetweenWarehousesForMinimumStock}>
                                {i18next.t('make-transfer-between-warehouses-for-minimum-stock')}</a>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <SearchField handleSearch={this.search} hasAdvancedSearch={true} handleAdvanced={this.advanced}
                        defaultSearchValue={window.savedSearches["product"] != null ? window.savedSearches["product"].search : ""} />
                    <div ref="advancedSearch" className="advancedSearch" id="productsAdvancedSearch"></div>
                </div>
            </div>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'name', headerName: i18next.t('name'), flex: 1 },
                    { field: 'reference', headerName: i18next.t('reference'), width: 150 },
                    { field: 'barCode', headerName: i18next.t('bar-code'), width: 200 },
                    { field: 'stock', headerName: i18next.t('stock'), width: 150 },
                    {
                        field: 'familyName', headerName: i18next.t('family'), width: 250, valueGetter: (params) => {
                            return params.row.family == null ? '' : params.row.family.name;
                        }
                    },
                    { field: 'price', headerName: i18next.t('price'), width: 125 }
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
                getRowClassName={(params) =>
                    params.row.off ? 'btn-danger' : ''
                }
                pageSize={100}
                rowCount={this.list.length}
                components={{
                    Pagination: () => <CustomPagination footer={<div>
                        <p>Stock: {this.footer.stock}</p>
                    </div>} />,
                }}
            />
        </div>
    }
}



class ProductAdvancedSearch extends Component {
    constructor({ subscribe, locateProductFamilies }) {
        super();

        this.locateProductFamilies = locateProductFamilies;

        this.getFormData = this.getFormData.bind(this);

        subscribe(this.getFormData);
    }

    componentDidMount() {
        this.renderProductFamilies();
    }

    async renderProductFamilies() {
        const productFamilies = await this.locateProductFamilies();
        productFamilies.unshift({ id: 0, name: "." + i18next.t('all') });

        ReactDOM.render(
            productFamilies.map((element, i) => {
                return <option key={i} value={element.id}>{element.name}</option>
            }),
            this.refs.productFamily);
    }

    getFormData() {
        const search = {};
        search.trackMinimumStock = this.refs.trackMinimumStock.checked;
        search.familyId = parseInt(this.refs.productFamily.value);
        if (search.familyId == 0) {
            search.familyId = null;
        }
        return search;
    }

    render() {
        return <div className="advancedSearchContent">
            <div class="form-row">
                <div class="col">
                    <div class="form-row">
                        <div class="custom-control custom-switch" style={{ 'marginTop': '2%' }}>
                            <input type="checkbox" class="custom-control-input" ref="trackMinimumStock" id="trackMinimumStock"
                                defaultChecked={false} />
                            <label class="custom-control-label" htmlFor="trackMinimumStock">{i18next.t('only-tracking-minimum-stock')}</label>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <label>{i18next.t('product-family')}</label>
                    <select class="form-control" ref="productFamily">

                    </select>
                </div>
            </div>
        </div>
    }
}



export default Products;
