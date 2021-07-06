import { Component } from "react";
import i18next from 'i18next';

class ProductFamiliesModal extends Component {
    constructor({ productFamily, addProductFamilies, updateProductFamilies, deleteProductFamilies }) {
        super();

        this.productFamily = productFamily;

        this.addProductFamilies = addProductFamilies;
        this.updateProductFamilies = updateProductFamilies;
        this.deleteProductFamilies = deleteProductFamilies;

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        window.$('#productFamilyModal').modal({ show: true });
    }

    getProductFamilyFromForm() {
        const productFamily = {}
        productFamily.name = this.refs.name.value;
        productFamily.reference = this.refs.reference.value;
        return productFamily;
    }

    isValid(productFamily) {
        this.refs.errorMessage.innerText = "";
        if (productFamily.name.length === 0) {
            this.refs.errorMessage.innerText = i18next.t('name-0');
            return false;
        }
        if (productFamily.name.length > 100) {
            this.refs.errorMessage.innerText = i18next.t('name-100');
            return false;
        }
        if (productFamily.reference.length === 0) {
            this.refs.errorMessage.innerText = i18next.t('reference-0');
            return false;
        }
        if (productFamily.reference.length > 100) {
            this.refs.errorMessage.innerText = i18next.t('reference-40');
            return false;
        }
        return true;
    }

    add() {
        const productFamily = this.getProductFamilyFromForm();
        if (!this.isValid(productFamily)) {
            return;
        }

        this.addProductFamilies(productFamily).then((ok) => {
            if (ok) {
                window.$('#productFamilyModal').modal('hide');
            }
        });
    }

    update() {
        const productFamily = this.getProductFamilyFromForm();
        if (!this.isValid(productFamily)) {
            return;
        }
        productFamily.id = this.productFamily.id;

        this.updateProductFamilies(productFamily).then((ok) => {
            if (ok) {
                window.$('#productFamilyModal').modal('hide');
            }
        });
    }

    delete() {
        const productFamilyId = this.productFamily.id;
        this.deleteProductFamilies(productFamilyId).then((ok) => {
            if (ok) {
                window.$('#productFamilyModal').modal('hide');
            }
        });
    }

    render() {
        return <div class="modal fade" id="productFamilyModal" tabindex="-1" role="dialog" aria-labelledby="productFamilyModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="productFamilyModalLabel">{i18next.t('product-family')}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>{i18next.t('name')}</label>
                            <input type="text" class="form-control" ref="name" defaultValue={this.productFamily != null ? this.productFamily.name : ''} />
                        </div>
                        <div class="form-group">
                            <label>{i18next.t('reference')}</label>
                            <input type="text" class="form-control" ref="reference" defaultValue={this.productFamily != null ? this.productFamily.reference : ''} />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <p className="errorMessage" ref="errorMessage"></p>
                        {this.productFamily != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                        {this.productFamily == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                        {this.productFamily != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default ProductFamiliesModal;
