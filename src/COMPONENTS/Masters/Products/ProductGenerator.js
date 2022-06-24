/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

class ProductGenerator extends Component {
    constructor({ productGenerator }) {
        super();

        this.productGenerator = productGenerator;

        this.simpleProduct = this.simpleProduct.bind(this);
        this.multipleProducts = this.multipleProducts.bind(this);
    }

    componentDidMount() {
        window.$('#productGeneratorModal').modal({ show: true });

        ReactDOM.render(<ProductGeneratorFirstStep
            simpleProduct={this.simpleProduct}
            multipleProducts={this.multipleProducts}
        />, this.refs.render);
    }

    simpleProduct() {
        ReactDOM.render(<ProductGeneratorSingleProduct
            productGenerator={this.productGenerator}
        />, this.refs.render);
    }

    multipleProducts() {
        ReactDOM.render(<ProductGeneratorMultipleProducts
            productGenerator={this.productGenerator}
        />, this.refs.render);
    }

    render() {
        return <div class="modal fade" id="productGeneratorModal" tabindex="-1" role="dialog" aria-labelledby="productGeneratorModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="productGeneratorModalLabel">{i18next.t('product-generator')}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div ref="render">

                    </div>
                </div>
            </div>
        </div>
    }

}

class ProductGeneratorFirstStep extends Component {
    constructor({ simpleProduct, multipleProducts }) {
        super();

        this.simpleProduct = simpleProduct;
        this.multipleProducts = multipleProducts;
    }

    render() {
        return <div>
            <div class="modal-body">
                <div class="list-group">
                    <a href="#" class="list-group-item list-group-item-action" onClick={this.simpleProduct}>
                        <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1">{i18next.t('simple-product')}</h5>
                        </div>
                        <p class="mb-1">{i18next.t('simple-product-desc')}</p>
                    </a>
                    <a href="#" class="list-group-item list-group-item-action" onClick={this.multipleProducts}>
                        <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1">{i18next.t('product-with-combinations')}</h5>
                        </div>
                        <p class="mb-1">{i18next.t('product-with-combinations-desc')}</p>
                    </a>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                </div>
            </div>
        </div>
    }
}

class ProductGeneratorSingleProduct extends Component {
    constructor({ productGenerator }) {
        super();

        this.productGenerator = productGenerator;

        this.generate = this.generate.bind(this);
    }

    generate() {
        this.productGenerator({
            products: [{
                name: this.refs.name.value,
                reference: this.refs.reference.value,
                generateBarCode: this.refs.generateBarCode.checked,
                barCode: this.refs.barCode.value,
                weight: parseFloat(this.refs.weight.value),
                width: parseFloat(this.refs.width.value),
                height: parseFloat(this.refs.height.value),
                depth: parseFloat(this.refs.depth.value),
                price: parseFloat(this.refs.price.value),
                initialStock: parseInt(this.refs.initialStock.value),
                manufacturing: this.refs.manufacturing.checked,
            }],
            manufacturingOrderTypeMode: this.refs.manufacturingOrderTypeMode.checked ? 1 : 2,
            manufacturingOrderTypeName: this.refs.manufacturingOrderTypeName.value,
        }).then((ok) => {
            if (ok) {
                window.$('#productGeneratorModal').modal('hide');
            }
        });
    }

    render() {
        return <div>
            <div class="modal-body" ref="render">
                <form>
                    <div class="form-row">
                        <div class="col">
                            <label>{i18next.t('name')}</label>
                            <input type="text" class="form-control" placeholder={i18next.t('name')} ref="name" />
                        </div>
                        <div class="col">
                            <label>{i18next.t('reference')}</label>
                            <input type="text" class="form-control" placeholder={i18next.t('reference')} ref="reference" />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col">
                            <label>{i18next.t('price')}</label>
                            <input type="number" class="form-control" placeholder={i18next.t('price')} ref="price" defaultValue="0" />
                        </div>
                        <div class="col">
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="checkbox" defaultChecked={true} ref="generateBarCode" />
                                <label class="form-check-label">{i18next.t('generate')}</label>
                            </div>
                            <br />
                            <label>EAN13</label>
                            <input type="text" class="form-control" placeholder="EAN13" ref="barCode" />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col">
                            <label>{i18next.t('initial-stock')}</label>
                            <input type="number" class="form-control" placeholder={i18next.t('initial-stock')} ref="initialStock" defaultValue="0" />
                        </div>
                        <div class="col">
                            <label>{i18next.t('weight')}</label>
                            <input type="number" class="form-control" placeholder={i18next.t('weight')} ref="weight" defaultValue="0" />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col">
                            <label>{i18next.t('width')}</label>
                            <input type="number" class="form-control" placeholder={i18next.t('width')} ref="width" defaultValue="0" />
                        </div>
                        <div class="col">
                            <label>{i18next.t('height')}</label>
                            <input type="number" class="form-control" placeholder={i18next.t('height')} ref="height" defaultValue="0" />
                        </div>
                        <div class="col">
                            <label>{i18next.t('depth')}</label>
                            <input type="number" class="form-control" placeholder={i18next.t('depth')} ref="depth" defaultValue="0" />
                        </div>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" defaultChecked={false} ref="manufacturing" />
                        <label class="form-check-label">{i18next.t('manufacturing')}</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" defaultChecked={true} ref="manufacturingOrderTypeMode" />
                        <label class="form-check-label">{i18next.t('create-a-manufacturing-order-type-with-the-same-name')}</label>
                    </div>
                    <br />
                    <label>{i18next.t('name')}</label>
                    <input type="text" class="form-control" placeholder={i18next.t('name')} ref="manufacturingOrderTypeName" />
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                <button type="button" class="btn btn-primary" onClick={this.generate}>{i18next.t('next')}</button>
            </div>
        </div>
    }
}

class ProductGeneratorMultipleProducts extends Component {
    constructor({ productGenerator }) {
        super();

        this.list = [];
        this.productGenerator = productGenerator;

        this.generate = this.generate.bind(this);
        this.addProduct = this.addProduct.bind(this);
    }

    generate() {
        this.productGenerator({
            products: this.list,
            manufacturingOrderTypeMode: this.refs.manufacturingOrderTypeMode.checked ? 1 : 2,
            manufacturingOrderTypeName: this.refs.manufacturingOrderTypeName.value,
        }).then((ok) => {
            if (ok) {
                window.$('#productGeneratorModal').modal('hide');
            }
        });
    }

    addProduct() {
        this.list = Object.assign([], this.list);
        this.list.push({
            id: this.list.length + 1,
            name: this.refs.name.value,
            reference: this.refs.reference.value,
            generateBarCode: this.refs.generateBarCode.checked,
            barCode: this.refs.barCode.value,
            weight: parseFloat(this.refs.weight.value),
            width: parseFloat(this.refs.width.value),
            height: parseFloat(this.refs.height.value),
            depth: parseFloat(this.refs.depth.value),
            price: parseFloat(this.refs.price.value),
            initialStock: parseInt(this.refs.initialStock.value),
            manufacturing: this.refs.manufacturing.checked,
        });
        this.forceUpdate();
        this.resetForm();
    }

    resetForm() {
        this.refs.name.value = "";
        this.refs.reference.value = "";
        this.refs.generateBarCode.checked = true;
        this.refs.barCode.value = "";
        this.refs.weight.value = "0";
        this.refs.width.value = "0";
        this.refs.height.value = "0";
        this.refs.depth.value = "0";
        this.refs.price.value = "0";
        this.refs.initialStock.value = "0";
        this.refs.manufacturing.checked = false;
    }

    render() {
        return <div>
            <div class="modal-body" ref="render">
                <DataGrid
                    ref="table"
                    autoHeight
                    rows={this.list}
                    columns={[
                        { field: 'name', headerName: i18next.t('name'), flex: 1 },
                        { field: 'price', headerName: i18next.t('price'), width: 125 }
                    ]}
                />
                <form>
                    <div class="form-row">
                        <div class="col">
                            <label>{i18next.t('name')}</label>
                            <input type="text" class="form-control" placeholder={i18next.t('name')} ref="name" />
                        </div>
                        <div class="col">
                            <label>{i18next.t('reference')}</label>
                            <input type="text" class="form-control" placeholder={i18next.t('reference')} ref="reference" />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col">
                            <label>{i18next.t('price')}</label>
                            <input type="number" class="form-control" placeholder={i18next.t('price')} ref="price" defaultValue="0" />
                        </div>
                        <div class="col">
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="checkbox" defaultChecked={true} ref="generateBarCode" />
                                <label class="form-check-label">{i18next.t('generate')}</label>
                            </div>
                            <br />
                            <label>EAN13</label>
                            <input type="text" class="form-control" placeholder="EAN13" ref="barCode" />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col">
                            <label>{i18next.t('initial-stock')}</label>
                            <input type="number" class="form-control" placeholder={i18next.t('initial-stock')} ref="initialStock" defaultValue="0" />
                        </div>
                        <div class="col">
                            <label>{i18next.t('weight')}</label>
                            <input type="number" class="form-control" placeholder={i18next.t('weight')} ref="weight" defaultValue="0" />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="col">
                            <label>{i18next.t('width')}</label>
                            <input type="number" class="form-control" placeholder={i18next.t('width')} ref="width" defaultValue="0" />
                        </div>
                        <div class="col">
                            <label>{i18next.t('height')}</label>
                            <input type="number" class="form-control" placeholder={i18next.t('height')} ref="height" defaultValue="0" />
                        </div>
                        <div class="col">
                            <label>{i18next.t('depth')}</label>
                            <input type="number" class="form-control" placeholder={i18next.t('depth')} ref="depth" defaultValue="0" />
                        </div>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" defaultChecked={false} ref="manufacturing" />
                        <label class="form-check-label">{i18next.t('manufacturing')}</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" defaultChecked={true} ref="manufacturingOrderTypeMode" />
                        <label class="form-check-label">{i18next.t('create-a-manufacturing-order-type-with-the-same-name')}</label>
                    </div>
                    <br />
                    <label>{i18next.t('name')}</label>
                    <input type="text" class="form-control" placeholder="Name" ref="manufacturingOrderTypeName" />
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-warning" onClick={this.addProduct}>{i18next.t('add-product')}</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                <button type="button" class="btn btn-primary" onClick={this.generate}>{i18next.t('next')}</button>
            </div>
        </div>
    }
}



export default ProductGenerator;
