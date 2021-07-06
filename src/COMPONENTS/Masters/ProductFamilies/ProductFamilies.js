import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';

import ProductFamiliesModal from './ProductFamiliesModal';


class ProductFamilies extends Component {
    constructor({ getProductFamilies, addProductFamilies, updateProductFamilies, deleteProductFamilies }) {
        super();

        this.getProductFamilies = getProductFamilies;
        this.addProductFamilies = addProductFamilies;
        this.updateProductFamilies = updateProductFamilies;
        this.deleteProductFamilies = deleteProductFamilies;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderProductFamilies();
    }

    renderProductFamilies() {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        this.getProductFamilies().then((productFamilies) => {
            ReactDOM.render(productFamilies.map((element, i) => {
                return <ProductFamily key={i}
                    productFamily={element}
                    edit={this.edit}
                />
            }), this.refs.render);
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
            <div className="menu">
                <h1>{i18next.t('product-families')}</h1>
                <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button>
            </div>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">{i18next.t('name')}</th>
                        <th scope="col">{i18next.t('reference')}</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class ProductFamily extends Component {
    constructor({ productFamily, edit }) {
        super();

        this.productFamily = productFamily;
        this.edit = edit;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.productFamily);
        }}>
            <th scope="row">{this.productFamily.id}</th>
            <td>{this.productFamily.name}</td>
            <td>{this.productFamily.reference}</td>
        </tr>
    }
}

export default ProductFamilies;
