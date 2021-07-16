import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import ProductFamiliesModal from './ProductFamiliesModal';


class ProductFamilies extends Component {
    constructor({ getProductFamilies, addProductFamilies, updateProductFamilies, deleteProductFamilies }) {
        super();

        this.getProductFamilies = getProductFamilies;
        this.addProductFamilies = addProductFamilies;
        this.updateProductFamilies = updateProductFamilies;
        this.deleteProductFamilies = deleteProductFamilies;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderProductFamilies();
    }

    renderProductFamilies() {
        this.getProductFamilies().then((productFamilies) => {
            this.list = productFamilies;
            this.forceUpdate();
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderProductFamiliesModal'));
        ReactDOM.render(
            <ProductFamiliesModal
                addProductFamilies={(family) => {
                    const promise = this.addProductFamilies(family);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderProductFamilies();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderProductFamiliesModal'));
    }

    edit(productFamily) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderProductFamiliesModal'));
        ReactDOM.render(
            <ProductFamiliesModal
                productFamily={productFamily}
                updateProductFamilies={(family) => {
                    const promise = this.updateProductFamilies(family);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderProductFamilies();
                        }
                    });
                    return promise;
                }}
                deleteProductFamilies={(familyId) => {
                    const promise = this.deleteProductFamilies(familyId);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderProductFamilies();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderProductFamiliesModal'));
    }

    render() {
        return <div id="tabProductFamilies">
            <div id="renderProductFamiliesModal"></div>
            <h1>{i18next.t('product-families')}</h1>
            <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add')}</button>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'id', headerName: '#', width: 90 },
                    { field: 'name', headerName: i18next.t('name'), flex: 1 },
                    { field: 'reference', headerName: i18next.t('reference'), width: 300 }
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

export default ProductFamilies;
