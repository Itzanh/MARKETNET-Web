/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import React, { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { TextField } from "@material-ui/core";

// IMG
import HighlightIcon from '@material-ui/icons/Highlight';
import LocateHSCodes from "./LocateHSCodes";



class ProductFormMoreData extends Component {
    constructor({ product, saveTab, getHSCodes }) {
        super();

        this.product = product;
        this.saveTab = saveTab;
        this.getHSCodes = getHSCodes;

        this.hscode = this.product == null ? null : this.product.HSCodeId;

        this.description = React.createRef();
        this.weight = React.createRef();
        this.width = React.createRef();
        this.height = React.createRef();
        this.depth = React.createRef();
        this.minimumStock = React.createRef();
        this.purchasePrice = React.createRef();
        this.minimumPurchaseQuantity = React.createRef();
        this.costPrice = React.createRef();
        this.originCountry = React.createRef();
        this.HSCodeName = React.createRef();

        this.HSCode = this.HSCode.bind(this);
    }

    componentWillUnmount() {
        this.saveTab(this.getProductFromForm());
    }

    getProductFromForm() {
        const product = {};
        product.weight = parseFloat(this.weight.current.value);
        product.width = parseFloat(this.width.current.value);
        product.height = parseFloat(this.height.current.value);
        product.depth = parseFloat(this.depth.current.value);
        product.description = this.description.current.value;
        product.minimumStock = parseInt(this.minimumStock.current.value);
        product.trackMinimumStock = this.refs.trackMinimumStock.checked;
        product.off = this.refs.off.checked;
        product.digitalProduct = this.refs.digitalProduct.checked;
        product.purchasePrice = this.product != null && !this.product.manufacturing ? parseFloat(this.purchasePrice.current.value) : 0;
        product.minimumPurchaseQuantity = this.product != null && !this.product.manufacturing ? parseInt(this.minimumPurchaseQuantity.current.value) : 0;
        product.HSCodeId = this.hscode;
        product.originCountry = this.originCountry.current.value;
        product.costPrice = parseFloat(this.costPrice.current.value);
        return product;
    }

    HSCode() {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(<LocateHSCodes
            getHSCodes={this.getHSCodes}
            onSelect={(hsCode) => {
                this.hscode = hsCode.id;
                this.HSCodeName.current.value = hsCode.name;
            }}
        />, this.refs.render);
    }

    render() {
        return <div class="col">
            <div ref="render"></div>
            <div class="form-group">
                <TextField label={i18next.t('description')} variant="outlined" fullWidth size="small" inputRef={this.description}
                    defaultValue={this.product !== undefined ? this.product.description : ''} multiline maxRows={10} minRows={6}
                    inputProps={{ maxLength: 3000 }} />
            </div>
            <div class="form-row">
                <div class="col">
                    <TextField id="weight" inputRef={this.weight} label={i18next.t('weight')} variant="outlined" fullWidth size="small"
                        defaultValue={this.product !== undefined ? this.product.weight : '0'} type="number"
                        InputProps={{ inputProps: { min: 0 } }} />
                </div>
                <div class="col">
                    <TextField id="width" inputRef={this.width} label={i18next.t('width')} variant="outlined" fullWidth size="small"
                        defaultValue={this.product !== undefined ? this.product.width : '0'} type="number"
                        InputProps={{ inputProps: { min: 0 } }} />
                </div>
                <div class="col">
                    <TextField id="height" inputRef={this.height} label={i18next.t('height')} variant="outlined" fullWidth size="small"
                        defaultValue={this.product !== undefined ? this.product.height : '0'} type="number"
                        InputProps={{ inputProps: { min: 0 } }} />
                </div>
                <div class="col">
                    <TextField id="depth" inputRef={this.depth} label={i18next.t('depth')} variant="outlined" fullWidth size="small"
                        defaultValue={this.product !== undefined ? this.product.depth : '0'} type="number"
                        InputProps={{ inputProps: { min: 0 } }} />
                </div>
                <div class="col">
                    <div class="custom-control custom-switch" style={{ 'margin-top': '5%' }}>
                        <input type="checkbox" class="custom-control-input" ref="trackMinimumStock" id="trackMinimumStock"
                            defaultChecked={this.product !== undefined ? this.product.trackMinimumStock : false} />
                        <label class="custom-control-label" htmlFor="trackMinimumStock">{i18next.t('track-minimum-stock')}</label>
                    </div>
                </div>
                <div class="col">
                    <TextField id="minimumStock" inputRef={this.minimumStock} label={i18next.t('minimum-stock')} variant="outlined"
                        fullWidth size="small" defaultValue={this.product !== undefined ? this.product.minimumStock : '0'} type="number"
                        InputProps={{ inputProps: { min: 0 } }} />
                </div>
                <div class="col">
                    <div class="custom-control custom-switch" style={{ 'margin-top': '5%' }}>
                        <input type="checkbox" class="custom-control-input" ref="digitalProduct" id="digitalProduct"
                            defaultChecked={this.product !== undefined ? this.product.digitalProduct : false} />
                        <label class="custom-control-label" htmlFor="digitalProduct">{i18next.t('digital-product')}</label>
                    </div>
                </div>
                <div class="col">
                    <div class="custom-control custom-switch" style={{ 'margin-top': '5%' }}>
                        <input type="checkbox" class="custom-control-input" ref="off" id="off"
                            defaultChecked={this.product !== undefined ? this.product.off : false} />
                        <label class="custom-control-label" htmlFor="off">{i18next.t('off')}</label>
                    </div>
                </div>
            </div>
            <div class="form-row mt-3">
                <div class="col">
                    {this.product != null && !this.product.manufacturing ? <div>
                        <TextField id="purchasePrice" inputRef={this.purchasePrice} label={i18next.t('purchase-price')} variant="outlined"
                            fullWidth size="small" defaultValue={this.product !== undefined ? this.product.purchasePrice : '0'} type="number"
                            InputProps={{ inputProps: { min: 0 } }} />
                    </div> : null}
                </div>
                <div class="col">
                    {this.product != null && !this.product.manufacturing ? <div>
                        <TextField id="minimumPurchaseQuantity" inputRef={this.minimumPurchaseQuantity} label={i18next.t('minimum-purchase-quantity')}
                            variant="outlined" fullWidth size="small" defaultValue={this.product !== undefined ? this.product.minimumPurchaseQuantity : '0'}
                            type="number" InputProps={{ inputProps: { min: 0 } }} />
                    </div> : null}
                </div>
            </div>
            <div class="form-row mt-3">
                <div class="col">
                    <div class="form-row">
                        <div class="col">
                            <TextField id="costPrice" inputRef={this.costPrice} label={i18next.t('cost-price')}
                                variant="outlined" fullWidth size="small" defaultValue={this.product == null ? "0" : this.product.costPrice}
                                type="number" InputProps={{ inputProps: { min: 0 } }} />
                        </div>
                        <div class="col">
                            <TextField id="originCountry" inputRef={this.originCountry} label={i18next.t('origin-country')}
                                variant="outlined" fullWidth size="small" defaultValue={this.product == null ? "" : this.product.originCountry} />
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.HSCode}><HighlightIcon /></button>
                        </div>
                        <TextField label='HS Code' variant="outlined" fullWidth focused InputProps={{ readOnly: true }} size="small"
                            inputRef={this.HSCodeName} defaultValue={this.product == null || this.product.HSCode == null ? "" : this.product.HSCode.name} />
                    </div>
                </div>
            </div>
        </div>
    }
}



export default ProductFormMoreData;
