import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

class ProductFormImages extends Component {
    constructor({ productId, getProductImages, addProductImage, updateProductImage, deleteProductImage }) {
        super();

        this.productId = productId;
        this.getProductImages = getProductImages;
        this.addProductImage = addProductImage;
        this.updateProductImage = updateProductImage;
        this.deleteProductImage = deleteProductImage;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderImages();
    }

    renderImages() {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        this.getProductImages(this.productId).then((images) => {
            ReactDOM.render(images.map((element, i) => {
                return <ProductFormImage key={i}
                    image={element}
                    edit={this.edit}
                />
            }), this.refs.render);
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderImageModal'));
        ReactDOM.render(
            <ProductFormImageModal
                productId={this.productId}
                addProductImage={(image) => {
                    const promise = this.addProductImage(image);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderImages();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderImageModal'));
    }

    edit(image) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderImageModal'));
        ReactDOM.render(
            <ProductFormImageModal
                image={image}
                updateProductImage={(image) => {
                    const promise = this.updateProductImage(image);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderImages();
                        }
                    });
                    return promise;
                }}
                deleteProductImage={(imageId) => {
                    const promise = this.deleteProductImage(imageId);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderImages();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderImageModal'));
    }

    render() {
        return <div>
            <div id="renderImageModal"></div>
            <button type="button" class="btn btn-primary mt-1 mb-1 ml-1" onClick={this.add}>{i18next.t('add')}</button>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">{i18next.t('url')}</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class ProductFormImage extends Component {
    constructor({ image, edit }) {
        super();

        this.image = image;
        this.edit = edit;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.image);
        }}>
            <th scope="row">{this.image.id}</th>
            <td>{this.image.url}</td>
            <td><img src={this.image.url} style={{ "max-height": "250px" }} /></td>
        </tr>
    }
}

class ProductFormImageModal extends Component {
    constructor({ image, productId, addProductImage, updateProductImage, deleteProductImage }) {
        super();

        this.image = image;
        this.productId = productId;
        this.addProductImage = addProductImage;
        this.updateProductImage = updateProductImage;
        this.deleteProductImage = deleteProductImage;

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        window.$('#productImageModal').modal({ show: true });
    }

    add() {
        const image = {
            "product": this.productId,
            "url": this.refs.url.value,
        };

        this.addProductImage(image).then((ok) => {
            if (ok) {
                window.$('#productImageModal').modal('hide');
            }
        });
    }

    update() {
        const image = {
            "id": this.image.id,
            "url": this.refs.url.value,
        };

        this.updateProductImage(image).then((ok) => {
            if (ok) {
                window.$('#productImageModal').modal('hide');
            }
        });
    }

    delete() {
        this.deleteProductImage(this.image.id).then((ok) => {
            if (ok) {
                window.$('#productImageModal').modal('hide');
            }
        });
    }

    render() {
        return <div class="modal fade" id="productImageModal" tabindex="-1" role="dialog" aria-labelledby="productImageModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="productImageModalLabel">{i18next.t('image')}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>ID</label>
                            <input type="text" class="form-control" ref="id" defaultValue={this.image != null ? this.image.id : '0'} readOnly={true} />
                        </div>
                        <div class="form-group">
                            <label>{i18next.t('url')}</label>
                            <input type="text" class="form-control" ref="url" defaultValue={this.image != null ? this.image.url : ''} />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <p className="errorMessage" ref="errorMessage"></p>
                        {this.image != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                        {this.image == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                        {this.image != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default ProductFormImages;
