import { Component } from "react";
import i18next from 'i18next';

class ProductFormMoreData extends Component {
    constructor({ product, saveTab }) {
        super();

        this.product = product;
        this.saveTab = saveTab;
    }

    componentWillUnmount() {
        this.saveTab(this.getProductFromForm());
    }

    getProductFromForm() {
        const product = {};
        product.weight = parseFloat(this.refs.weight.value);
        product.width = parseFloat(this.refs.width.value);
        product.height = parseFloat(this.refs.height.value);
        product.depth = parseFloat(this.refs.depth.value);
        product.description = this.refs.dsc.value;
        product.minimumStock = parseInt(this.refs.minimumStock.value);
        product.trackMinimumStock = this.refs.trackMinimumStock.checked;
        product.off = this.refs.off.checked;
        return product;
    }

    render() {
        return <div class="col">
            <div class="form-group">
                <label>{i18next.t('description')}</label>
                <textarea class="form-control" rows="6" ref="dsc" defaultValue={this.product !== undefined ? this.product.description : ''}></textarea>
            </div>
            <div class="form-row">
                <div class="col">
                    <label>{i18next.t('weight')}</label>
                    <input type="number" class="form-control" min="0" ref="weight" defaultValue={this.product !== undefined ? this.product.weight : '0'} />
                </div>
                <div class="col">
                    <label>{i18next.t('width')}</label>
                    <input type="number" class="form-control" min="0" ref="width" defaultValue={this.product !== undefined ? this.product.width : '0'} />
                </div>
                <div class="col">
                    <label>{i18next.t('height')}</label>
                    <input type="number" class="form-control" min="0" ref="height" defaultValue={this.product !== undefined ? this.product.height : '0'} />
                </div>
                <div class="col">
                    <label>{i18next.t('depth')}</label>
                    <input type="number" class="form-control" min="0" ref="depth" defaultValue={this.product !== undefined ? this.product.depth : '0'} />
                </div>
                <div class="col">
                    <div class="custom-control custom-switch">
                        <input type="checkbox" class="custom-control-input" ref="trackMinimumStock" id="trackMinimumStock"
                            defaultChecked={this.product !== undefined ? this.product.trackMinimumStock : false} />
                        <label class="custom-control-label" htmlFor="trackMinimumStock">{i18next.t('track-minimum-stock')}</label>
                    </div>
                </div>
                <div class="col">
                    <label>{i18next.t('minimum-stock')}</label>
                    <input type="number" class="form-control" min="0" ref="minimumStock"
                        defaultValue={this.product !== undefined ? this.product.minimumStock : '0'} />
                </div>
                <div class="col">
                    <div class="custom-control custom-switch">
                        <input type="checkbox" class="custom-control-input" ref="off" id="off"
                            defaultChecked={this.product !== undefined ? this.product.off : false} />
                        <label class="custom-control-label" htmlFor="off">{i18next.t('off')}</label>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default ProductFormMoreData;
