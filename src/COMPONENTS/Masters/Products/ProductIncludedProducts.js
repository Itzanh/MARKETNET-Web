/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { DataGrid } from '@material-ui/data-grid';
import i18next from "i18next";

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import LocateProduct from "../../Masters/Products/LocateProduct";
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import Grow from '@mui/material/Grow';
import { TextField, FormControl, NativeSelect } from "@material-ui/core";
import { InputLabel } from "@mui/material";

// IMG
import HighlightIcon from '@material-ui/icons/Highlight';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Grow direction="up" ref={ref} {...props} />;
});



class ProductIncludedProducts extends Component {
    constructor({ productId, getProductIncludedProduct, insertProductIncludedProduct, updateProductIncludedProduct,
        deleteProductIncludedProduct, locateProduct }) {
        super();

        this.productId = productId;
        this.getProductIncludedProduct = getProductIncludedProduct;
        this.insertProductIncludedProduct = insertProductIncludedProduct;
        this.updateProductIncludedProduct = updateProductIncludedProduct;
        this.deleteProductIncludedProduct = deleteProductIncludedProduct;
        this.locateProduct = locateProduct;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.print();
    }

    print() {
        this.getProductIncludedProduct(this.productId).then((list) => {
            this.list = list;
            this.forceUpdate();
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(<ProductIncludedProductsModal
            productId={this.productId}
            insertProductIncludedProduct={(includedProduct) => {
                const promise = this.insertProductIncludedProduct(includedProduct);
                promise.then((ok) => {
                    if (ok) {
                        this.print();
                    }
                });
                return promise;
            }}
            locateProduct={this.locateProduct}
        />, this.refs.renderModal);
    }

    edit(includedProduct) {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(<ProductIncludedProductsModal
            productId={this.productId}
            includedProduct={includedProduct}
            updateProductIncludedProduct={(includedProduct) => {
                const promise = this.updateProductIncludedProduct(includedProduct);
                promise.then((ok) => {
                    if (ok) {
                        this.print();
                    }
                });
                return promise;
            }}
            deleteProductIncludedProduct={(includedProductId) => {
                const promise = this.deleteProductIncludedProduct(includedProductId);
                promise.then((ok) => {
                    if (ok) {
                        this.print();
                    }
                });
                return promise;
            }}
        />, this.refs.renderModal);
    }

    render() {
        return <div>
            <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button>
            <div ref="renderModal"></div>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    {
                        field: 'productIncludedName', headerName: i18next.t('product-included'), flex: 1, valueGetter: (params) => {
                            return params.row.productIncluded.name;
                        }
                    },
                    { field: 'quantity', headerName: i18next.t('quantity'), width: 160 },
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
};



class ProductIncludedProductsModal extends Component {
    constructor({ productId, includedProduct, insertProductIncludedProduct, updateProductIncludedProduct, deleteProductIncludedProduct,
        locateProduct }) {
        super();

        this.productId = productId;
        this.includedProduct = includedProduct;
        this.insertProductIncludedProduct = insertProductIncludedProduct;
        this.updateProductIncludedProduct = updateProductIncludedProduct;
        this.deleteProductIncludedProduct = deleteProductIncludedProduct;
        this.locateProduct = locateProduct;

        this.open = true;
        this.tab = 0;
        this.currentSelectedProductId = includedProduct != null ? includedProduct.productIncludedId : 0;

        this.productName = React.createRef();
        this.quantity = React.createRef();

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.locateProducts = this.locateProducts.bind(this);
    }

    getProductIncludedProductsFromForm() {
        const includedProduct = {};
        includedProduct.ProductBaseId = this.productId;
        includedProduct.productIncludedId = this.currentSelectedProductId;
        includedProduct.quantity = parseInt(this.quantity.current.value);
        return includedProduct;
    }

    add() {
        const includedProduct = this.getProductIncludedProductsFromForm();

        this.insertProductIncludedProduct(includedProduct).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    update() {
        const includedProduct = this.getProductIncludedProductsFromForm();
        includedProduct.id = this.includedProduct.id;

        this.updateProductIncludedProduct(includedProduct).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    delete() {
        this.deleteProductIncludedProduct(this.includedProduct.id).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    locateProducts() {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(<LocateProduct
            locateProduct={this.locateProduct}
            onSelect={(product) => {
                this.currentSelectedProductId = product.id;
                this.productName.current.value = product.name;
            }}
        />, this.refs.render);
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
        return <div>
            <div ref="render"></div>
            <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'md'}
                PaperComponent={this.PaperComponent} TransitionComponent={Transition}>
                <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    {i18next.t('included-product')}
                </this.DialogTitle>
                <DialogContent>

                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateProducts}
                                disabled={this.includedProduct != null}><HighlightIcon /></button>
                        </div>
                        <TextField label={i18next.t('product')} variant="outlined" fullWidth focused InputProps={{ readOnly: true }} size="small"
                            inputRef={this.productName} defaultValue={this.includedProduct != null ? this.includedProduct.productIncluded.name : ''} />
                    </div>

                    <br />

                    <TextField id="quantity" inputRef={this.quantity} label={i18next.t('quantity')} variant="outlined" fullWidth size="small"
                        defaultValue={this.includedProduct != null ? this.includedProduct.quantity : '1'} type="number"
                        InputProps={{ inputProps: { min: 1 } }} />

                </DialogContent>
                <DialogActions>
                    {this.includedProduct != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                    <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                    {this.includedProduct == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                    {this.includedProduct != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
                </DialogActions>
            </Dialog>
        </div>;
    }
}



export default ProductIncludedProducts;
