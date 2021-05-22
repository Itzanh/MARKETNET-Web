import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import AutocompleteField from '../../AutocompleteField';
import ProductFormStock from './ProductFormStock';

class ProductForm extends Component {
    constructor({ product, addProduct, updateProduct, deleteProduct, findColorByName, findProductFamilyByName, defaultValueNameColor, defaultValueNameFamily,
        tabProducts, getStock, getManufacturingOrderTypes }) {
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

        this.currentSelectedColorId = product != null ? product.color : "";
        this.currentSelectedFamilyId = product != null ? product.family : "";

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.loadManufacturingOrderTypes = this.loadManufacturingOrderTypes.bind(this);
    }

    componentDidMount() {
        ReactDOM.render(<ProductFormStock
            productId={this.product.id}
            getStock={this.getStock}
            doneLoading={this.loadManufacturingOrderTypes}
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
        product.manufacturingOrderType = parseInt(this.refs.renderTypes.value);
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

    render() {
        return <div id="tabProduct">
            <h1>Product</h1>
            <div class="form-group">
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
                                <input type="text" class="form-control" ref="barCode" defaultValue={this.product != null ? this.product.barCode : ''} />
                            </div>
                            {this.product != null && this.product.manufacturing ?
                                <div class="col">
                                    <label>Manufacturing order type</label>
                                    <select class="form-control" ref="renderTypes">
                                    </select>
                                </div>
                                : null}
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
                                <label class="form-check-label">
                                    Manufacturing
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <ul class="nav nav-tabs">
                    <li class="nav-item">
                        <a class="nav-link active" href="#">Stock</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Images</a>
                    </li>
                </ul>

                <div ref="render"></div>

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

export default ProductForm;
