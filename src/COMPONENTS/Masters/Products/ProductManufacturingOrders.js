import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import ManufacturingOrderModal from "../../Manufacturing/Orders/ManufacturingOrderModal";



class ProductManufacturingOrders extends Component {
    constructor({ getManufacturingOrderTypes, getManufacturingOrders, addManufacturingOrder, updateManufacturingOrder, deleteManufacturingOrder,
        findProductByName, getNameProduct, toggleManufactuedManufacturingOrder, getProductRow, manufacturingOrderTagPrinted, getProductManufacturingOrders,
        productId, locateProduct }) {
        super();

        this.getManufacturingOrderTypes = getManufacturingOrderTypes;
        this.getManufacturingOrders = getManufacturingOrders;
        this.addManufacturingOrder = addManufacturingOrder;
        this.updateManufacturingOrder = updateManufacturingOrder;
        this.deleteManufacturingOrder = deleteManufacturingOrder;
        this.findProductByName = findProductByName;
        this.getNameProduct = getNameProduct;
        this.toggleManufactuedManufacturingOrder = toggleManufactuedManufacturingOrder;
        this.getProductRow = getProductRow;
        this.manufacturingOrderTagPrinted = manufacturingOrderTagPrinted;
        this.getProductManufacturingOrders = getProductManufacturingOrders;
        this.productId = productId;
        this.locateProduct = locateProduct;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.getAndRenderManufacturingOrders();
    }

    async getAndRenderManufacturingOrders() {
        if (this.productId != undefined) {
            this.getProductManufacturingOrders(this.productId).then((orders) => {
                this.renderManufacturingOrders(orders);
            });
        }
    }

    renderManufacturingOrders(orders) {
        this.list = orders;
        this.forceUpdate();
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderManufacturingOrdersModal'));
        ReactDOM.render(
            <ManufacturingOrderModal
                addManufacturingOrder={(order) => {
                    const promise = this.addManufacturingOrder(order);
                    promise.then((ok) => {
                        if (ok) {
                            this.getAndRenderManufacturingOrders();
                        }
                    });
                    return promise;
                }}
                findProductByName={this.findProductByName}
                getManufacturingOrderTypes={this.getManufacturingOrderTypes}
                locateProduct={this.locateProduct}
            />,
            document.getElementById('renderManufacturingOrdersModal'));
    }

    async edit(order) {
        var productName = await this.getNameProduct(order.product);
        ReactDOM.unmountComponentAtNode(document.getElementById('renderManufacturingOrdersModal'));
        ReactDOM.render(
            <ManufacturingOrderModal
                order={order}
                defaultValueNameProduct={productName}
                findProductByName={this.findProductByName}
                getManufacturingOrderTypes={this.getManufacturingOrderTypes}
                toggleManufactuedManufacturingOrder={(order) => {
                    const promise = this.toggleManufactuedManufacturingOrder(order);
                    promise.then((ok) => {
                        if (ok) {
                            this.getAndRenderManufacturingOrders();
                        }
                    });
                    return promise;
                }}
                deleteManufacturingOrder={(order) => {
                    const promise = this.deleteManufacturingOrder(order);
                    promise.then((ok) => {
                        if (ok) {
                            this.getAndRenderManufacturingOrders();
                        }
                    });
                    return promise;
                }}
                getProductRow={this.getProductRow}
                manufacturingOrderTagPrinted={this.manufacturingOrderTagPrinted}
                locateProduct={this.locateProduct}
            />,
            document.getElementById('renderManufacturingOrdersModal'));
    }

    render() {
        return <div id="tabManufacturingOrders" className="formRowRoot">
            <div id="renderManufacturingOrdersModal"></div>
            <div class="form-row">
                <div class="col">
                    <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add')}</button>
                </div>
                <div class="col">
                </div>
            </div>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'productName', headerName: i18next.t('product'), flex: 1 },
                    { field: 'typeName', headerName: i18next.t('type'), width: 500 },
                    {
                        field: 'dateCreated', headerName: i18next.t('date'), width: 160, valueGetter: (params) => {
                            return window.dateFormat(params.row.dateCreated)
                        }
                    },
                    { field: 'manufactured', headerName: i18next.t('manufactured'), width: 180, type: 'boolean' },
                    { field: 'orderName', headerName: i18next.t('order-no'), width: 200 },
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

export default ProductManufacturingOrders;
