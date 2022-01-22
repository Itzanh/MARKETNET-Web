import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

// IMG
import HighlightIcon from '@material-ui/icons/Highlight';
import LocateHSCodes from "./LocateHSCodes";



class ProductFormMoreData extends Component {
    constructor({ product, saveTab, getHSCodes }) {
        super();

        this.product = product;
        this.saveTab = saveTab;
        this.getHSCodes = getHSCodes;

        this.hscode = this.product == null ? null : this.product.HSCode;

        this.HSCode = this.HSCode.bind(this);
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
        product.digitalProduct = this.refs.digitalProduct.checked;
        product.purchasePrice = this.product != null && !this.product.manufacturing ? parseFloat(this.refs.purchasePrice.value) : 0;
        product.minimumPurchaseQuantity = this.product != null && !this.product.manufacturing ? parseInt(this.refs.minimumPurchaseQuantity.value) : 0;
        product.HSCode = this.hscode;
        product.originCountry = this.refs.originCountry.value;
        return product;
    }

    HSCode() {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(<LocateHSCodes
            getHSCodes={this.getHSCodes}
            onSelect={(hsCode) => {
                this.hscode = hsCode.id;
                this.refs.HSCodeName.value = hsCode.name;
            }}
        />, this.refs.render);
    }

    render() {
        return <div class="col">
            <div ref="render"></div>
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
                    <div class="custom-control custom-switch" style={{ 'margin-top': '15%' }}>
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
                    <div class="custom-control custom-switch" style={{ 'margin-top': '15%' }}>
                        <input type="checkbox" class="custom-control-input" ref="digitalProduct" id="digitalProduct"
                            defaultChecked={this.product !== undefined ? this.product.digitalProduct : false} />
                        <label class="custom-control-label" htmlFor="digitalProduct">{i18next.t('digital-product')}</label>
                    </div>
                </div>
                <div class="col">
                    <div class="custom-control custom-switch" style={{ 'margin-top': '15%' }}>
                        <input type="checkbox" class="custom-control-input" ref="off" id="off"
                            defaultChecked={this.product !== undefined ? this.product.off : false} />
                        <label class="custom-control-label" htmlFor="off">{i18next.t('off')}</label>
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="col">
                    {this.product != null && !this.product.manufacturing ? <div>
                        <label>{i18next.t('purchase-price')}</label>
                        <input type="number" class="form-control" min="0" ref="purchasePrice"
                            defaultValue={this.product !== undefined ? this.product.purchasePrice : '0'} />
                    </div> : null}
                </div>
                <div class="col">
                    {this.product != null && !this.product.manufacturing ? <div>
                        <label>{i18next.t('minimum-purchase-quantity')}</label>
                        <input type="number" class="form-control" min="0" ref="minimumPurchaseQuantity"
                            defaultValue={this.product !== undefined ? this.product.minimumPurchaseQuantity : '0'} />
                    </div> : null}
                </div>
                <div class="col">
                </div>
                <div class="col">
                </div>
                <div class="col">
                </div>
                <div class="col">
                </div>
                <div class="col">
                </div>
                <div class="col">
                </div>
            </div>
            <div class="form-row">
                <div class="col">
                    <label>Origin country</label>
                    <input type="text" class="form-control" ref="originCountry" defaultValue={this.product == null ? "" : this.product.originCountry} />
                </div>
                <div class="col">
                    <label>HS Code</label>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.HSCode}><HighlightIcon /></button>
                        </div>
                        <input type="text" class="form-control" ref="HSCodeName" readOnly={true}
                            defaultValue={this.product == null ? "" : this.product.HSCodeName} />
                    </div>
                </div>
            </div>
        </div>
    }
}



export default ProductFormMoreData;
