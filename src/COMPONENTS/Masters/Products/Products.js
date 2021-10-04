import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import ProductForm from './ProductForm';
import SearchField from '../../SearchField';
import ProductGenerator from './ProductGenerator';


class Products extends Component {
    constructor({ getProducts, searchProducts, addProduct, updateProduct, deleteProduct, findColorByName, getNameColor, findProductFamilyByName,
        getNameProductFamily, tabProducts, getStock, getManufacturingOrderTypes, findSupplierByName, getSupplierName, getProductSalesOrderPending, getNameProduct,
        getProductPurchaseOrderPending, getProductSalesOrder, getProductPurchaseOrder, getProductWarehouseMovements, getWarehouses, productGenerateBarcode,
        getProductImages, addProductImage, updateProductImage, deleteProductImage, calculateMinimumStock, generateManufacturingOrPurchaseOrdersMinimumStock,
        productGenerator}) {
        super();

        this.getProducts = getProducts;
        this.searchProducts = searchProducts;
        this.addProduct = addProduct;
        this.updateProduct = updateProduct;
        this.deleteProduct = deleteProduct;

        this.findColorByName = findColorByName;
        this.getNameColor = getNameColor;
        this.findProductFamilyByName = findProductFamilyByName;
        this.getNameProductFamily = getNameProductFamily;
        this.tabProducts = tabProducts;
        this.getStock = getStock;
        this.getManufacturingOrderTypes = getManufacturingOrderTypes;
        this.findSupplierByName = findSupplierByName;
        this.getSupplierName = getSupplierName;
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
        this.calculateMinimumStock = calculateMinimumStock;
        this.generateManufacturingOrPurchaseOrdersMinimumStock = generateManufacturingOrPurchaseOrdersMinimumStock;
        this.productGen = productGenerator;

        this.advancedSearchListener = null;
        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.search = this.search.bind(this);
        this.calcMinStk = this.calcMinStk.bind(this);
        this.genManPurOrdStkMin = this.genManPurOrdStkMin.bind(this);
        this.advanced = this.advanced.bind(this);
        this.productGenerator = this.productGenerator.bind(this);
    }

    componentDidMount() {
        this.getProducts().then((products) => {
            this.renderProducts(products);
        });
    }

    async search(searchText) {
        var trackMinimumStock = false;
        if (this.advancedSearchListener != null) {
            const s = this.advancedSearchListener();
            trackMinimumStock = s.trackMinimumStock;
        }
        const products = await this.searchProducts({
            search: searchText,
            trackMinimumStock: trackMinimumStock
        });
        this.renderProducts(products);
    }

    async renderProducts(products) {
        this.list = products;
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
            />,
            document.getElementById('renderTab'));
    }

    async edit(product) {
        var defaultValueNameColor;
        if (product.color != null) {
            defaultValueNameColor = await this.getNameColor(product.color);
        }
        var defaultValueNameFamily;
        if (product.family != null) {
            defaultValueNameFamily = await this.getNameProductFamily(product.family);
        }
        var defaultValueNameSupplier;
        if (product.supplier != null) {
            defaultValueNameSupplier = await this.getSupplierName(product.supplier);
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <ProductForm
                product={product}
                updateProduct={this.updateProduct}
                deleteProduct={this.deleteProduct}
                findColorByName={this.findColorByName}
                findProductFamilyByName={this.findProductFamilyByName}
                defaultValueNameColor={defaultValueNameColor}
                defaultValueNameFamily={defaultValueNameFamily}
                tabProducts={this.tabProducts}
                getStock={this.getStock}
                getManufacturingOrderTypes={this.getManufacturingOrderTypes}
                findSupplierByName={this.findSupplierByName}
                defaultValueNameSupplier={defaultValueNameSupplier}
                getProductSalesOrderPending={this.getProductSalesOrderPending}
                getNameProduct={this.getNameProduct}
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
            />,
            document.getElementById('renderTab'));
    }

    calcMinStk() {
        this.calculateMinimumStock();
    }

    genManPurOrdStkMin() {
        this.generateManufacturingOrPurchaseOrdersMinimumStock();
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
                />, this.refs.advancedSearch);
        }
    }

    productGenerator() {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(<ProductGenerator
            productGenerator={this.productGen}
        />, this.refs.renderModal);
    }

    render() {
        return <div id="tabProducts" className="formRowRoot">
            <h1>{i18next.t('products')}</h1>
            <div ref="renderModal"></div>
            <div class="form-row">
                <div class="col">
                    <div class="btn-group">
                        <button type="button" class="btn btn-primary ml-2" onClick={this.add}>{i18next.t('add')}</button>
                        <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <a class="dropdown-item" href="#" onClick={this.calcMinStk}>{i18next.t('calculate-minimum-stock')}</a>
                            <a class="dropdown-item" href="#" onClick={this.genManPurOrdStkMin}>
                                {i18next.t('generate-manufacturing-purchase-orders-to-cover-minimum-stock')}</a>
                            <a class="dropdown-item" href="#" onClick={this.productGenerator}>{i18next.t('product-generator')}</a>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <SearchField handleSearch={this.search} hasAdvancedSearch={true} handleAdvanced={this.advanced} />
                    <div ref="advancedSearch" className="advancedSearch"></div>
                </div>
            </div>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'id', headerName: '#', width: 90 },
                    { field: 'name', headerName: i18next.t('name'), flex: 1 },
                    { field: 'reference', headerName: i18next.t('reference'), width: 150 },
                    { field: 'barCode', headerName: i18next.t('bar-code'), width: 200 },
                    { field: 'stock', headerName: i18next.t('stock'), width: 150 },
                    { field: 'familyName', headerName: i18next.t('family'), width: 250 },
                    { field: 'price', headerName: i18next.t('price'), width: 125 }
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

class ProductAdvancedSearch extends Component {
    constructor({ subscribe }) {
        super();

        this.getFormData = this.getFormData.bind(this);

        subscribe(this.getFormData);
    }

    getFormData() {
        const search = {};
        search.trackMinimumStock = this.refs.trackMinimumStock.checked;
        return search;
    }

    render() {
        return <div class="form-row">
            <div class="col">
                <input type="checkbox" defaultChecked={false} ref="trackMinimumStock" />
                <label>{i18next.t('only-tracking-minimum-stock')}</label>
            </div>
        </div>
    }
}

export default Products;
