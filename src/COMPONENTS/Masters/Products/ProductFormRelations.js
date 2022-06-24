/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import ProductSalesDetailsPending from './ProductSalesDetailsPending';
import ProductPurchaseDetailsPending from './ProductPurchaseDetailsPending';
import ProductSalesDetails from './ProductSalesDetails';
import ProductPurchaseDetails from './ProductPurchaseDetails';
import ProductWarehouseMovements from './ProductWarehouseMovements';
import ProductFormImages from './ProductFormImages';
import ProductManufacturingOrders from './ProductManufacturingOrders';
import ProductComplexManufacturingOrders from './ProductComplexManufacturingOrders';



class ProductFormRelations extends Component {
    constructor({ product, productId,
        getProductImages, addProductImage, updateProductImage, deleteProductImage,

        getProductSalesOrderPending, getSalesOrdersFunctions,

        getProductPurchaseOrderPending, getPurchaseOrdersFunctions,

        getProductSalesOrder,

        getProductPurchaseOrder,

        productName, getProductWarehouseMovements, getWarehouses, getWarehouseMovementFunctions,

        getManufacturingOrderTypes, getManufacturingOrders, addManufacturingOrder, updateManufacturingOrder, deleteManufacturingOrder,
        findProductByName, toggleManufactuedManufacturingOrder, getProductRow, manufacturingOrderTagPrinted, getProductManufacturingOrders,
        locateProduct, manufacturingOrderTypeId,

        getProductComplexManufacturingOrders, insertComplexManufacturingOrder, deleteComplexManufacturingOrder,
        toggleManufactuedComplexManufacturingOrder, getComplexManufacturingOrderManufacturingOrder, getRegisterTransactionalLogs
    }) {
        super();

        this.product = product;
        this.productId = productId;

        this.getProductImages = getProductImages;
        this.addProductImage = addProductImage;
        this.updateProductImage = updateProductImage;
        this.deleteProductImage = deleteProductImage;

        this.getProductSalesOrderPending = getProductSalesOrderPending;
        this.getSalesOrdersFunctions = getSalesOrdersFunctions;

        this.getProductPurchaseOrderPending = getProductPurchaseOrderPending;
        this.getPurchaseOrdersFunctions = getPurchaseOrdersFunctions;

        this.getProductSalesOrder = getProductSalesOrder;

        this.getProductPurchaseOrder = getProductPurchaseOrder;
        this.getPurchaseOrdersFunctions = getPurchaseOrdersFunctions;

        this.productName = productName;
        this.getProductWarehouseMovements = getProductWarehouseMovements;
        this.getWarehouses = getWarehouses;
        this.getWarehouseMovementFunctions = getWarehouseMovementFunctions;

        this.getManufacturingOrderTypes = getManufacturingOrderTypes;
        this.getManufacturingOrders = getManufacturingOrders;
        this.addManufacturingOrder = addManufacturingOrder;
        this.updateManufacturingOrder = updateManufacturingOrder;
        this.deleteManufacturingOrder = deleteManufacturingOrder;
        this.findProductByName = findProductByName;
        this.toggleManufactuedManufacturingOrder = toggleManufactuedManufacturingOrder;
        this.getProductRow = getProductRow;
        this.manufacturingOrderTagPrinted = manufacturingOrderTagPrinted;
        this.getProductManufacturingOrders = getProductManufacturingOrders;
        this.productId = productId;
        this.locateProduct = locateProduct;
        this.manufacturingOrderTypeId = manufacturingOrderTypeId;

        this.getProductComplexManufacturingOrders = getProductComplexManufacturingOrders;
        this.insertComplexManufacturingOrder = insertComplexManufacturingOrder;
        this.deleteComplexManufacturingOrder = deleteComplexManufacturingOrder;
        this.toggleManufactuedComplexManufacturingOrder = toggleManufactuedComplexManufacturingOrder;
        this.getComplexManufacturingOrderManufacturingOrder = getComplexManufacturingOrderManufacturingOrder;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;

        this.tabs = this.tabs.bind(this);
        this.tabImages = this.tabImages.bind(this);
        this.tabSalesDetailsPending = this.tabSalesDetailsPending.bind(this);
        this.tabPurchaseDetailsPending = this.tabPurchaseDetailsPending.bind(this);
        this.tabSalesDetails = this.tabSalesDetails.bind(this);
        this.tabPurchaseDetails = this.tabPurchaseDetails.bind(this);
        this.tabWarehouseMovements = this.tabWarehouseMovements.bind(this);
        this.tabManufacturingOrders = this.tabManufacturingOrders.bind(this);
    }

    async componentDidMount() {
        this.tabs();
    }

    tabs() {
        ReactDOM.render(<AppBar position="static" style={{ 'backgroundColor': '#1976d2' }}>
            <Tabs value={this.tab} variant="scrollable" scrollButtons="auto" orientation="vertical" onChange={(_, tab) => {
                this.tab = tab;
                switch (tab) {
                    case 0: {
                        this.tabImages();
                        break;
                    }
                    case 1: {
                        this.tabSalesDetailsPending();
                        break;
                    }
                    case 2: {
                        this.tabPurchaseDetailsPending();
                        break;
                    }
                    case 3: {
                        this.tabSalesDetails();
                        break;
                    }
                    case 4: {
                        this.tabPurchaseDetails();
                        break;
                    }
                    case 5: {
                        this.tabWarehouseMovements();
                        break;
                    }
                    case 6: {
                        this.tabManufacturingOrders();
                        break;
                    }
                    case 7: {
                        this.tabComplexManufacturingOrders();
                        break;
                    }
                }
            }}>
                <Tab label={i18next.t('images')} />
                <Tab label={i18next.t('sales-details-pending')} wrapped />
                <Tab label={i18next.t('purchase-details-pending')} wrapped disabled={this.product != null && this.product.manufacturing} />
                <Tab label={i18next.t('sales-details')} />
                <Tab label={i18next.t('purchase-details')} disabled={this.product != null && this.product.manufacturing} />
                <Tab label={i18next.t('warehouse-movements')} />
                <Tab label={i18next.t('manufacturing-orders')} disabled={this.product != null && !this.product.manufacturing} />
                <Tab label={i18next.t('complex-manufacturing-orders')} wrapped disabled={this.product != null && !this.product.manufacturing} />
            </Tabs>
        </AppBar>, this.refs.tabs);
    }

    tabImages() {
        this.tab = 0;
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
        this.tab = 1;
        this.tabs();
        ReactDOM.render(<ProductSalesDetailsPending
            productId={this.product !== undefined ? this.product.id : undefined}
            getProductSalesOrderPending={this.getProductSalesOrderPending}
            getSalesOrdersFunctions={this.getSalesOrdersFunctions}
        />, this.refs.render);
    }

    tabPurchaseDetailsPending() {
        this.tab = 2;
        this.tabs();
        ReactDOM.render(<ProductPurchaseDetailsPending
            productId={this.product !== undefined ? this.product.id : undefined}
            getProductPurchaseOrderPending={this.getProductPurchaseOrderPending}
            getPurchaseOrdersFunctions={this.getPurchaseOrdersFunctions}
        />, this.refs.render);
    }

    tabSalesDetails() {
        this.tab = 3;
        this.tabs();
        ReactDOM.render(<ProductSalesDetails
            productId={this.product !== undefined ? this.product.id : undefined}
            getProductSalesOrder={this.getProductSalesOrder}
            getSalesOrdersFunctions={this.getSalesOrdersFunctions}
        />, this.refs.render);
    }

    tabPurchaseDetails() {
        this.tab = 4;
        this.tabs();
        ReactDOM.render(<ProductPurchaseDetails
            productId={this.product !== undefined ? this.product.id : undefined}
            getProductPurchaseOrder={this.getProductPurchaseOrder}
            getPurchaseOrdersFunctions={this.getPurchaseOrdersFunctions}
        />, this.refs.render);
    }

    tabWarehouseMovements() {
        this.tab = 5;
        this.tabs();
        ReactDOM.render(<ProductWarehouseMovements
            productId={this.product !== undefined ? this.product.id : undefined}
            productName={this.product !== undefined ? this.product.name : undefined}
            getProductWarehouseMovements={this.getProductWarehouseMovements}
            getWarehouses={this.getWarehouses}
            getWarehouseMovementFunctions={this.getWarehouseMovementFunctions}
        />, this.refs.render);
    }

    tabManufacturingOrders() {
        this.tab = 6;
        this.tabs();

        const commonProps = this.getManufacturingOrdersFunctions();

        ReactDOM.render(<ProductManufacturingOrders
            {...commonProps}
            getProductManufacturingOrders={this.getProductManufacturingOrders}
            productId={this.product !== undefined ? this.product.id : undefined}
            productName={this.product !== undefined ? this.product.name : undefined}
            manufacturingOrderTypeId={this.product !== undefined ? this.product.manufacturingOrderType : undefined}
        />, this.refs.render);
    }

    tabComplexManufacturingOrders() {
        this.tab = 7;
        this.tabs();

        const commonProps = this.getComplexManufacturingOrerFunctions();

        ReactDOM.render(<ProductComplexManufacturingOrders
            {...commonProps}
            getProductComplexManufacturingOrders={this.getProductComplexManufacturingOrders}
            productId={this.product !== undefined ? this.product.id : undefined}
        />, this.refs.render);
    }

    render() {
        return <div className="formRowRoot">
            <div class="form-row" id="productRelationsVeritalTabs">
                <div class="col">
                    <div ref="tabs" className="mt-2"></div>
                </div>
                <div class="col">
                    <div ref="render" className="mt-2"></div>
                </div>
            </div>
        </div>
    }
}



export default ProductFormRelations;
