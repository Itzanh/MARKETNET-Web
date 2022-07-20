/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import React, { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from "i18next";
import { TextField } from "@material-ui/core";
import LocateProduct from "../../Products/LocateProduct";
import ProductForm from "../../Products/ProductForm";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { DataGrid } from "@material-ui/data-grid";
import ConfirmDelete from "../../../ConfirmDelete";
import { Button } from "@material-ui/core";
import AlertModal from "../../../AlertModal";
import WindowRequestData from "../../../WindowRequestData";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

// IMG
import HighlightIcon from '@material-ui/icons/Highlight';
import EditIcon from '@material-ui/icons/Edit';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ConfirmQuestion from "../../../ConfirmQuestion";



const saleOrderStates = {
    '_': 'waiting-for-payment',
    'A': 'waiting-for-purchase-order',
    'B': 'purchase-order-pending',
    'C': 'waiting-for-manufacturing-orders',
    'D': 'manufacturing-orders-pending',
    'E': 'sent-to-preparation',
    'F': 'awaiting-for-shipping',
    'G': 'shipped',
    'H': 'receiced-by-the-customer',
    'Z': 'cancelled'
};



class DeprecatedProductsForm extends Component {
    constructor({ deprecatedProduct, insertDeprecatedProduct, dropDeprecatedProduct, deleteDeprecatedProduct, getDeprecatedProductCheckList,
        insertDeprecatedProductCheckList, toggleDeprecatedProductCheckList, deleteDeprecatedProductCheckList,
        movePositionDeprecatedProductCheckList, calcDeprecatedProductUses, locateProduct, tabDeprecatedProducts }) {
        super();

        this.deprecatedProduct = deprecatedProduct;
        console.log(deprecatedProduct);
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

        this.currentSelectedProductId = deprecatedProduct == null ? null : deprecatedProduct.productId;

        this.productName = React.createRef();
        this.list = [];
        this.deprecatedProductUses = {};
        this.tab = 0;

        this.add = this.add.bind(this);
        this.delete = this.delete.bind(this);
        this.drop = this.drop.bind(this);
        this.addCheck = this.addCheck.bind(this);
        this.editCheck = this.editCheck.bind(this);
        this.locateProducts = this.locateProducts.bind(this);
        this.editProduct = this.editProduct.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
    }

    async componentDidMount() {
        if (this.deprecatedProduct != null) {
            await this.getDeprecatedProductUses();
            this.renderChecks();
        }
    }

    getDeprecatedProductUses() {
        return new Promise((resolve) => {
            this.calcDeprecatedProductUses(this.deprecatedProduct.id).then((deprecatedProductUses) => {
                console.log(deprecatedProductUses);
                this.deprecatedProductUses = deprecatedProductUses;
                resolve();
            });
        });
    }

    getDeprecatedProductFromForm() {
        const deprecatedProduct = {};
        deprecatedProduct.productId = this.currentSelectedProductId;
        deprecatedProduct.dateDrop = this.refs.dateDrop.value == '' ? null : new Date(this.refs.dateDrop.value);
        deprecatedProduct.reason = this.refs.reason.value;
        return deprecatedProduct;
    }

    isValid(deprecatedProduct) {
        var errorMessage = "";
        if (deprecatedProduct.productId == null || deprecatedProduct.productId <= 0 || isNaN(deprecatedProduct.productId)) {
            errorMessage = i18next.t('no-product');
            return errorMessage;
        }
        if (deprecatedProduct.dateDrop == null || deprecatedProduct.dateDrop == '' || deprecatedProduct.dateDrop <= 0) {
            errorMessage = i18next.t('no-date-drop');
            return errorMessage;
        }
        if (deprecatedProduct.reason.length == 0) {
            errorMessage = i18next.t('no-reason');
            return errorMessage;
        }
        if (deprecatedProduct.reason.length > 255) {
            errorMessage = i18next.t('reason-255');
            return errorMessage;
        }
        return errorMessage;
    }

    add() {
        const deprecatedProduct = this.getDeprecatedProductFromForm();
        const errorMessage = this.isValid(deprecatedProduct);
        if (errorMessage != "") {
            ReactDOM.unmountComponentAtNode(this.refs.render);
            ReactDOM.render(
                <AlertModal
                    modalTitle={i18next.t('VALIDATION-ERROR')}
                    modalText={errorMessage}
                />, this.refs.render);
            return;
        }

        this.insertDeprecatedProduct(deprecatedProduct).then((ok) => {
            if (ok) {
                this.tabDeprecatedProducts();
            }
        });
    }

    delete() {
        if (this.deprecatedProduct.dropped) {
            ReactDOM.unmountComponentAtNode(this.refs.render);
            ReactDOM.render(
                <AlertModal
                    modalTitle={i18next.t('ERROR-DELETING')}
                    modalText={i18next.t('cant-delete-a-dropped-product')}
                />, this.refs.render);
            return;
        }

        this.deleteDeprecatedProduct(this.deprecatedProduct.id).then((ok) => {
            if (ok) {
                this.tabDeprecatedProducts();
            }
        });
    }

    handleTabChange(_, tab) {
        this.tab = tab;
        this.forceUpdate();
    }

    drop() {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        if (this.deprecatedProductUses.noUses == false) {
            ReactDOM.render(<AlertModal
                modalTitle={i18next.t('product-in-use').toUpperCase()}
                modalText={i18next.t('a-product-that-is-being-used-cannot-be-dropped')}
            />, this.refs.render);
            return;
        }

        ReactDOM.render(<ConfirmQuestion
            modalTitle={i18next.t('CONFIRM-DROP')}
            modalText={i18next.t('are-you-sure-that-you-want-to-permanenly-drop-the-product')}
            modalButtonText={i18next.t('drop-product')}
            onConfirm={() => {
                this.dropDeprecatedProduct(this.deprecatedProduct.id).then((ok) => {
                    if (ok) {
                        this.tabDeprecatedProducts();
                    }
                });
            }}
        />, this.refs.render);
    }

    renderChecks() {
        this.getDeprecatedProductCheckList(this.deprecatedProduct.id).then((list) => {
            this.list = list;
            this.forceUpdate();
        });
    }

    addCheck() {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(
            <WindowRequestData
                modalTitle={i18next.t('INPUT-TEXT')}
                modalText={i18next.t('enter-the-text-of-the-check')}
                dataType="text"
                defaultValue=""
                onDataInput={(data) => {
                    if (data == "") {
                        ReactDOM.unmountComponentAtNode(this.refs.render);
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-CREATING')}
                            modalText={i18next.t('no-text')}
                        />, this.refs.render);
                        return;
                    }
                    this.insertDeprecatedProductCheckList({
                        deprecatedProductId: this.deprecatedProduct.id,
                        text: data
                    }).then((ok) => {
                        if (ok) {
                            this.renderChecks();
                            this.deprecatedProduct.totalChecks++;
                        }
                    });
                }}
            />, this.refs.render);
    }

    editCheck(check) {
        if (check.checked) {
            ReactDOM.unmountComponentAtNode(this.refs.render);
            ReactDOM.render(<ConfirmQuestion
                modalTitle={i18next.t('TASK-CHECKED')}
                modalText={i18next.t('this-task-is-checked-do-you-want-to-remove-the-check')}
                modalButtonText={i18next.t('uncheck')}
                onConfirm={() => {
                    this.toggleDeprecatedProductCheckList(check.id).then((ok) => {
                        if (ok) {
                            this.deprecatedProduct.checksDone--;
                            this.renderChecks();
                        }
                    });
                }}
            />, this.refs.render);
        } else {
            this.toggleDeprecatedProductCheckList(check.id).then((ok) => {
                if (ok) {
                    this.deprecatedProduct.checksDone++;
                    this.renderChecks();
                }
            });
        }
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

    async editProduct() {
        if (this.currentSelectedProductId == null) {
            return;
        }

        const commonProps = this.getProductFunctions();
        const product = await commonProps.getProductRow(this.currentSelectedProductId);

        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(<Dialog aria-labelledby="customized-dialog-title" open={true} fullWidth={true} maxWidth={'xl'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitleProduct style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('product')}
            </this.DialogTitleProduct>
            <DialogContent>
                <ProductForm
                    {...commonProps}
                    tabProducts={() => {
                        ReactDOM.unmountComponentAtNode(this.refs.render);
                    }}
                    product={product}
                />
            </DialogContent>
        </Dialog>, this.refs.render);
    }

    render() {
        return <div className="formRowRoot">
            <h4 className="ml-2">{i18next.t('deprecated-product')}</h4>
            <div ref="render"></div>

            <div class="form-row">
                <div class="col">
                    <label></label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateProducts}
                                disabled={this.deprecatedProduct != null}><HighlightIcon /></button>
                        </div>
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.editProduct}><EditIcon /></button>
                        </div>
                        <TextField label={i18next.t('product')} variant="outlined" fullWidth focused InputProps={{ readOnly: true }} size="small"
                            inputRef={this.productName} defaultValue={this.deprecatedProduct == null ? '' : this.deprecatedProduct.product.name} />
                    </div>
                </div>
                <div class="col">
                    <label>{i18next.t('date-to-be-dropped')}</label>
                    <input type="date" class="form-control" ref="dateDrop"
                        defaultValue={this.deprecatedProduct == null ? '' : (new Date(this.deprecatedProduct.dateDrop)).toISOString().split("T")[0]}
                        readOnly={this.deprecatedProduct != null} />
                </div>
                <div class="col">
                    <label>{i18next.t('reason')}</label>
                    <input type="text" class="form-control" ref="reason" defaultValue={this.deprecatedProduct == null ? '' : this.deprecatedProduct.reason}
                        readOnly={this.deprecatedProduct != null} />
                </div>
            </div>

            {this.deprecatedProduct == null ? null :
                <div>
                    <AppBar position="static" style={{ 'backgroundColor': '#1976d2', 'margin-top': '20px' }}>
                        <Tabs value={this.tab} onChange={this.handleTabChange}>
                            <Tab label={i18next.t('checklist')} />
                            <Tab label={i18next.t('uses')} />
                        </Tabs>
                    </AppBar>
                    {this.tab != 0 ? null :
                        <div>
                            <div class="progress mt-2">
                                <div class="progress-bar" role="progressbar"
                                    aria-valuenow={this.deprecatedProduct.totalChecks == 0 ? 0 : ((this.deprecatedProduct.checksDone / this.deprecatedProduct.totalChecks) * 100)}
                                    style={{ "width": this.deprecatedProduct.totalChecks == 0 ? 0 : ((this.deprecatedProduct.checksDone / this.deprecatedProduct.totalChecks) * 100) + "%" }}
                                    aria-valuemin="0" aria-valuemax="100">
                                    {this.deprecatedProduct.totalChecks == 0 ? 0 : ((this.deprecatedProduct.checksDone / this.deprecatedProduct.totalChecks) * 100)}%</div>
                            </div>
                            <br />
                            <button type="button" class="btn btn-primary ml-1 mb-2" onClick={this.addCheck} disabled={this.deprecatedProduct.dropped}>{i18next.t('add')}</button>
                            <DataGrid
                                ref="table"
                                autoHeight
                                rows={this.list}
                                columns={[
                                    { field: 'text', headerName: i18next.t('text'), flex: 1 },
                                    { field: 'checked', headerName: i18next.t('done'), width: 150, type: 'boolean' },
                                    {
                                        field: 'dateChecked', headerName: i18next.t('date-done'), width: 240, valueGetter: (params) => {
                                            return params.row.dateChecked == null ? '' : window.dateFormat(params.row.dateChecked);
                                        }
                                    },
                                    {
                                        field: 'userChecked', headerName: i18next.t('user-done'), width: 240, valueGetter: (params) => {
                                            return params.row.userChecked == null ? '' : params.row.userChecked.username;
                                        }
                                    }, {
                                        field: "up-down", headerName: i18next.t('up-down'), width: 200, renderCell: (params) => (
                                            <div>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    style={{ marginLeft: 16 }}
                                                    disabled={params.row.position == 1}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        this.movePositionDeprecatedProductCheckList({
                                                            id: params.row.id,
                                                            deprecatedProductId: params.row.deprecatedProductId,
                                                            newPosition: params.row.position - 1
                                                        }).then((ok) => {
                                                            if (ok) {
                                                                this.renderChecks();
                                                            }
                                                        });
                                                    }}
                                                >
                                                    <ArrowUpwardIcon />
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    style={{ marginLeft: 16 }}
                                                    disabled={params.row.position == this.list[(this.list.length - 1)].position}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        this.movePositionDeprecatedProductCheckList({
                                                            id: params.row.id,
                                                            deprecatedProductId: params.row.deprecatedProductId,
                                                            newPosition: params.row.position + 1
                                                        }).then((ok) => {
                                                            if (ok) {
                                                                this.renderChecks();
                                                            }
                                                        });
                                                    }}
                                                >
                                                    <ArrowDownwardIcon />
                                                </Button>
                                            </div>
                                        ),
                                    },
                                    {
                                        field: "delete", headerName: i18next.t('delete'), width: 200, renderCell: (params) => (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                style={{ marginLeft: 16 }}
                                                disabled={params.row.checked}
                                                onClick={(e) => {
                                                    e.stopPropagation();

                                                    ReactDOM.unmountComponentAtNode(this.refs.render);
                                                    ReactDOM.render(
                                                        <ConfirmDelete
                                                            onDelete={() => {
                                                                this.deleteDeprecatedProductCheckList(params.row.id).then((ok) => {
                                                                    if (ok) {
                                                                        this.deprecatedProduct.totalChecks--;
                                                                        this.renderChecks();
                                                                    }
                                                                });
                                                            }}
                                                        />,
                                                        this.refs.render);
                                                }}
                                            >
                                                {i18next.t('delete')}
                                            </Button>
                                        ),
                                    }
                                ]}
                                onRowClick={(data) => {
                                    this.editCheck(data.row);
                                }}
                            />
                        </div>}
                    {this.tab != 1 ? null :
                        <div>
                            <DeprecatedProductFormUses
                                deprecatedProductUses={this.deprecatedProductUses}
                            />
                        </div>}
                </div>}

            <div id="buttomBottomFormContainter">
                <div id="buttomBottomForm">
                    <div>
                        {this.deprecatedProduct != null ?
                            <button type="button" class="btn btn-success" onClick={this.drop}
                                disabled={this.deprecatedProduct.dropped || this.deprecatedProduct.totalChecks != this.deprecatedProduct.checksDone}>
                                {i18next.t('drop-product')}</button> : null}
                        {this.deprecatedProduct != null ?
                            <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                        <button type="button" class="btn btn-secondary" onClick={this.tabDeprecatedProducts}>{i18next.t('cancel')}</button>
                        {this.deprecatedProduct == null ?
                            <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
};



class DeprecatedProductFormUses extends Component {
    constructor({ deprecatedProductUses }) {
        super();

        this.deprecatedProductUses = deprecatedProductUses;

        this.summary = this.calcSummary();
    }

    calcSummary() {
        return [
            {
                "id": 1,
                "usage": i18next.t('sales-orders'),
                "quantity": this.deprecatedProductUses.salesOrders.length
            }, {
                "id": 2,
                "usage": i18next.t('purchase-orders'),
                "quantity": this.deprecatedProductUses.purchaseOrder.length
            }, {
                "id": 3,
                "usage": i18next.t('manufacturing-orders'),
                "quantity": this.deprecatedProductUses.manufacturingOrdersQuantity
            }, {
                "id": 4,
                "usage": i18next.t('complex-manufacturing-orders'),
                "quantity": this.deprecatedProductUses.complexManufacturingOrdersQuantity
            }, {
                "id": 5,
                "usage": i18next.t('units-in-stock'),
                "quantity": this.deprecatedProductUses.unitsInStock
            }
        ];
    }

    render() {
        return <div className="tableOverflowContainer">
            <div style={{ display: 'flex', height: '100%' }}>
                <div style={{ flexGrow: 1 }}>
                    {this.deprecatedProductUses.noUses == false ? <Alert severity="error">
                        <AlertTitle>{i18next.t('product-in-use')}</AlertTitle>
                        {i18next.t('a-product-that-is-being-used-cannot-be-dropped')}
                    </Alert> : null}
                    {this.deprecatedProductUses.noUses == true ? <Alert severity="success">
                        <AlertTitle>{i18next.t('product-not-in-use')}</AlertTitle>
                        {i18next.t('no-orders-are-using-this-product-so-it-can-be-dropped-anytime')}
                    </Alert> : null}
                    <DataGrid
                        ref="table"
                        autoHeight
                        rows={this.summary}
                        columns={[
                            { field: 'usage', headerName: i18next.t('usage'), flex: 1 },
                            { field: 'quantity', headerName: i18next.t('quantity'), width: 300 },
                        ]}
                    />
                    <br />
                    <h3>{i18next.t('sales-orders')}</h3>
                    <DataGrid
                        ref="table"
                        autoHeight
                        rows={this.deprecatedProductUses.salesOrders}
                        columns={[
                            { field: 'orderName', headerName: i18next.t('order-no'), flex: 1 },
                            { field: 'reference', headerName: i18next.t('reference'), width: 150 },
                            {
                                field: 'dateCreated', headerName: i18next.t('date'), width: 160, valueGetter: (params) => {
                                    return window.dateFormat(params.row.dateCreated)
                                }
                            },
                            {
                                field: 'status', headerName: i18next.t('status'), width: 250, valueGetter: (params) => {
                                    return i18next.t(saleOrderStates[params.row.status])
                                }
                            }
                        ]}
                    />
                    <h3>{i18next.t('purchase-orders')}</h3>
                    <DataGrid
                        ref="table"
                        autoHeight
                        rows={this.deprecatedProductUses.purchaseOrder}
                        columns={[
                            { field: 'orderName', headerName: i18next.t('order-no'), flex: 1 },
                            { field: 'supplierReference', headerName: i18next.t('supplier-reference'), width: 240 },
                            {
                                field: 'dateCreated', headerName: i18next.t('date'), width: 160, valueGetter: (params) => {
                                    return window.dateFormat(params.row.dateCreated)
                                }
                            }
                        ]}
                    />
                    <br />
                    <br />
                </div>
            </div>
        </div>
    }
};



export default DeprecatedProductsForm;
