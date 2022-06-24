/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';



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
            <div className="tableOverflowContainer">
                <div style={{ display: 'flex', height: '100%' }}>
                    <table class="table table-dark">
                        <thead>
                            <tr>
                                <th scope="col">{i18next.t('url')}</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody ref="render"></tbody>
                    </table>
                </div>
            </div>
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

        this.open = true;

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    add() {
        const image = {
            productId: this.productId,
            url: this.refs.url.value,
        };

        this.addProductImage(image).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    update() {
        const image = {
            id: this.image.id,
            url: this.refs.url.value,
        };

        this.updateProductImage(image).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    delete() {
        this.deleteProductImage(this.image.id).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    styles = (theme) => ({
        root: {
            margin: 0,
            padding: theme.spacing(2),
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
    });

    DialogTitle = withStyles(this.styles)((props) => {
        const { children, classes, onClose, ...other } = props;
        return (
            <DialogTitle disableTypography className={classes.root} {...other}>
                <Typography variant="h6">{children}</Typography>
                <IconButton aria-label="close" className={classes.closeButton} onClick={this.handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
        );
    });

    DialogTitleProduct = withStyles(this.styles)((props) => {
        const { children, classes, onClose, ...other } = props;
        return (
            <DialogTitle disableTypography className={classes.root} {...other}>
                <Typography variant="h6">{children}</Typography>
                <IconButton aria-label="close" className={classes.closeButton} onClick={() => {
                    ReactDOM.unmountComponentAtNode(this.refs.render);
                }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
        );
    });

    PaperComponent(props) {
        return (
            <Draggable handle="#draggable-dialog-title" cancel={'[class*="DialogContent-root"]'}>
                <Paper {...props} />
            </Draggable>
        );
    }

    render() {
        return <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'md'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('image')}
            </this.DialogTitle>
            <DialogContent>
                <div class="form-group">
                    <label>ID</label>
                    <input type="text" class="form-control" ref="id" defaultValue={this.image != null ? this.image.id : '0'} readOnly={true} />
                </div>
                <div class="form-group">
                    <label>{i18next.t('url')}</label>
                    <input type="text" class="form-control" ref="url" defaultValue={this.image != null ? this.image.url : ''} />
                </div>
            </DialogContent>
            <DialogActions>
                <p className="errorMessage" ref="errorMessage"></p>
                {this.image != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                {this.image == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                {this.image != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
            </DialogActions>
        </Dialog>
    }
}

export default ProductFormImages;
