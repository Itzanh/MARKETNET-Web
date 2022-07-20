/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from "i18next";
import { DataGrid } from "@material-ui/data-grid";
import SearchField from "../../../SearchField";
import DeprecatedProductsForm from "./DeprecatedProductsForm";



class DeprecatedProducts extends Component {
    constructor({ searchDeprecatedProducts, insertDeprecatedProduct, dropDeprecatedProduct, deleteDeprecatedProduct,
        getDeprecatedProductCheckList, insertDeprecatedProductCheckList, toggleDeprecatedProductCheckList, deleteDeprecatedProductCheckList,
        movePositionDeprecatedProductCheckList, calcDeprecatedProductUses, locateProduct, tabDeprecatedProducts }) {
        super();

        this.searchDeprecatedProducts = searchDeprecatedProducts;
        this.insertDeprecatedProduct = insertDeprecatedProduct;
        this.dropDeprecatedProduct = dropDeprecatedProduct;
        this.deleteDeprecatedProduct = deleteDeprecatedProduct;
        this.getDeprecatedProductCheckList = getDeprecatedProductCheckList;
        this.insertDeprecatedProductCheckList = insertDeprecatedProductCheckList;
        this.toggleDeprecatedProductCheckList = toggleDeprecatedProductCheckList;
        this.deleteDeprecatedProductCheckList = deleteDeprecatedProductCheckList;
        this.movePositionDeprecatedProductCheckList = movePositionDeprecatedProductCheckList;
        this.calcDeprecatedProductUses = calcDeprecatedProductUses;
        this.locateProduct = locateProduct;
        this.tabDeprecatedProducts = tabDeprecatedProducts;

        this.advancedSearchListener = null;
        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.search = this.search.bind(this);
        this.advanced = this.advanced.bind(this);
    }

    componentDidMount() {
        this.search();
    }

    async search(searchText) {
        var dropped = null;
        if (this.advancedSearchListener != null) {
            const s = this.advancedSearchListener();
            dropped = s.dropped;
        }
        const deprecatedProducts = await this.searchDeprecatedProducts({
            productName: searchText,
            dropped: dropped
        });
        this.list = deprecatedProducts;
        this.forceUpdate();
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(<DeprecatedProductsForm
            insertDeprecatedProduct={this.insertDeprecatedProduct}
            dropDeprecatedProduct={this.dropDeprecatedProduct}
            deleteDeprecatedProduct={this.deleteDeprecatedProduct}
            getDeprecatedProductCheckList={this.getDeprecatedProductCheckList}
            insertDeprecatedProductCheckList={this.insertDeprecatedProductCheckList}
            toggleDeprecatedProductCheckList={this.toggleDeprecatedProductCheckList}
            deleteDeprecatedProductCheckList={this.deleteDeprecatedProductCheckList}
            movePositionDeprecatedProductCheckList={this.movePositionDeprecatedProductCheckList}
            calcDeprecatedProductUses={this.calcDeprecatedProductUses}
            locateProduct={this.locateProduct}
            tabDeprecatedProducts={this.tabDeprecatedProducts}
        />, document.getElementById('renderTab'));
    }

    edit(deprecatedProduct) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(<DeprecatedProductsForm
            deprecatedProduct={deprecatedProduct}
            insertDeprecatedProduct={this.insertDeprecatedProduct}
            dropDeprecatedProduct={this.dropDeprecatedProduct}
            deleteDeprecatedProduct={this.deleteDeprecatedProduct}
            getDeprecatedProductCheckList={this.getDeprecatedProductCheckList}
            insertDeprecatedProductCheckList={this.insertDeprecatedProductCheckList}
            toggleDeprecatedProductCheckList={this.toggleDeprecatedProductCheckList}
            deleteDeprecatedProductCheckList={this.deleteDeprecatedProductCheckList}
            movePositionDeprecatedProductCheckList={this.movePositionDeprecatedProductCheckList}
            calcDeprecatedProductUses={this.calcDeprecatedProductUses}
            tabDeprecatedProducts={this.tabDeprecatedProducts}
        />, document.getElementById('renderTab'));
    }

    advanced(advanced) {
        if (!advanced) {
            ReactDOM.unmountComponentAtNode(this.refs.advancedSearch);
            this.advancedSearchListener = null;
        } else {
            ReactDOM.render(
                <DeprecatedProductsAdvancedSearch
                    subscribe={(listener) => {
                        this.advancedSearchListener = listener;
                    }}
                />, this.refs.advancedSearch);
        }
    }

    render() {
        return <div id="tabProducts" className="formRowRoot">
            <h4 className="ml-2">{i18next.t('deprecated-products')}</h4>
            <div class="form-row">
                <div class="col">
                    <div class="btn-group">
                        <button type="button" class="btn btn-primary ml-2" onClick={this.add}>{i18next.t('add')}</button>
                    </div>
                </div>
            </div>
            <div class="col">
                <SearchField handleSearch={this.search} hasAdvancedSearch={true} handleAdvanced={this.advanced} />
                <div ref="advancedSearch" className="advancedSearch" id="productsAdvancedSearch"></div>
            </div>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    {
                        field: 'name', headerName: i18next.t('name'), flex: 1, valueGetter: (params) => {
                            return params.row.product.name;
                        }
                    },
                    {
                        field: 'dateCreated', headerName: i18next.t('date'), width: 160, valueGetter: (params) => {
                            return window.dateFormat(params.row.dateCreated);
                        }
                    },
                    {
                        field: 'dateDrop', headerName: i18next.t('date-to-be-dropped'), width: 160, valueGetter: (params) => {
                            return window.dateFormat(params.row.dateDrop);
                        }
                    },
                    { field: 'dropped', headerName: i18next.t('dropped'), width: 150, type: 'boolean' }
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
};



class DeprecatedProductsAdvancedSearch extends Component {
    constructor({ subscribe }) {
        super();

        this.getFormData = this.getFormData.bind(this);

        subscribe(this.getFormData);
    }

    getFormData() {
        const search = {};
        search.dropped = this.refs.dropped.value;
        if (search.dropped == "") {
            search.dropped = null;
        }
        return search;
    }

    render() {
        return <div className="advancedSearchContent">
            <div class="form-row">
                <div class="custom-control custom-switch" style={{ 'marginTop': '2%' }}>
                    <label for="dropped">{i18next.t('dropped')}</label>
                    <select class="form-control" id="dropped">
                        <option value="">.{i18next.t('all')}</option>
                        <option value="true">{i18next.t('dropped')}</option>
                        <option value="false">{i18next.t('not-dropped')}</option>
                    </select>
                </div>
            </div>
        </div>
    }
};



export default DeprecatedProducts;
