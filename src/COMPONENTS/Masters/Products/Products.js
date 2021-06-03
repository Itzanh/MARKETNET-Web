import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ProductForm from './ProductForm';


class Products extends Component {
    constructor({ getProducts, addProduct, updateProduct, deleteProduct, findColorByName, getNameColor, findProductFamilyByName, getNameProductFamily,
        tabProducts, getStock, getManufacturingOrderTypes, findSupplierByName, getSupplierName, getProductSalesOrderPending, getNameProduct,
        getProductPurchaseOrderPending, getProductSalesOrder, getProductPurchaseOrder, getProductWarehouseMovements, getWarehouses }) {
        super();

        this.getProducts = getProducts;
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

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.getProducts().then(async (products) => {
            await ReactDOM.render(products.map((element, i) => {
                element.familyName = "...";
                return <Product key={i}
                    product={element}
                    edit={this.edit}
                />
            }), this.refs.render);

            for (let i = 0; i < products.length; i++) {
                if (products[i].family == null) {
                    products[i].familyName = "";
                } else {
                    products[i].familyName = await this.getNameProductFamily(products[i].family);
                }
            }

            ReactDOM.render(products.map((element, i) => {
                return <Product key={i}
                    product={element}
                    edit={this.edit}
                />
            }), this.refs.render);
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <ProductForm
                addProduct={this.addProduct}
                findColorByName={this.findColorByName}
                findProductFamilyByName={this.findProductFamilyByName}
                tabProducts={this.tabProducts}
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
            />,
            document.getElementById('renderTab'));
    }

    render() {
        return <div id="tabProducts">
            <h1>Products</h1>
            <button type="button" class="btn btn-primary" onClick={this.add}>Add</button>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Reference</th>
                        <th scope="col">Bar Code</th>
                        <th scope="col">Stock</th>
                        <th scope="col">Family</th>
                        <th scope="col">Price</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class Product extends Component {
    constructor({ product, edit }) {
        super();

        this.product = product;
        this.edit = edit;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.product);
        }}>
            <th scope="row">{this.product.id}</th>
            <td>{this.product.name}</td>
            <td>{this.product.reference}</td>
            <td>{this.product.barCode}</td>
            <td>{this.product.stock}</td>
            <td>{this.product.familyName}</td>
            <td>{this.product.price}</td>
        </tr>
    }
}

export default Products;
