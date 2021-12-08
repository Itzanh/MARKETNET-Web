import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

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
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import LocateProduct from "../../Masters/Products/LocateProduct";
import HighlightIcon from '@material-ui/icons/Highlight';



class ManufacturingOrderTypes extends Component {
    constructor({ getManufacturingOrderTypes, addManufacturingOrderTypes, updateManufacturingOrderTypes, deleteManufacturingOrderTypes,
        getManufacturingOrderTypeComponents, insertManufacturingOrderTypeComponents, updateManufacturingOrderTypeComponents,
        deleteManufacturingOrderTypeComponents, locateProduct }) {
        super();

        this.getManufacturingOrderTypes = getManufacturingOrderTypes;
        this.addManufacturingOrderTypes = addManufacturingOrderTypes;
        this.updateManufacturingOrderTypes = updateManufacturingOrderTypes;
        this.deleteManufacturingOrderTypes = deleteManufacturingOrderTypes;

        this.getManufacturingOrderTypeComponents = getManufacturingOrderTypeComponents;
        this.insertManufacturingOrderTypeComponents = insertManufacturingOrderTypeComponents;
        this.updateManufacturingOrderTypeComponents = updateManufacturingOrderTypeComponents;
        this.deleteManufacturingOrderTypeComponents = deleteManufacturingOrderTypeComponents;

        this.locateProduct = locateProduct;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderManufacturingOrderTypes();
    }

    renderManufacturingOrderTypes() {
        this.getManufacturingOrderTypes().then((types) => {
            this.list = types;
            this.forceUpdate();
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderManufacturingOrderTypesModal'));
        ReactDOM.render(
            <ManufacturingOrderTypeModal
                addManufacturingOrderTypes={(type) => {
                    const promise = this.addManufacturingOrderTypes(type);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderManufacturingOrderTypes();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderManufacturingOrderTypesModal'));
    }

    edit(type) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderManufacturingOrderTypesModal'));
        ReactDOM.render(
            <ManufacturingOrderTypeModal
                type={type}
                updateManufacturingOrderTypes={(type) => {
                    const promise = this.updateManufacturingOrderTypes(type);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderManufacturingOrderTypes();
                        }
                    });
                    return promise;
                }}
                deleteManufacturingOrderTypes={(typeId) => {
                    const promise = this.deleteManufacturingOrderTypes(typeId);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderManufacturingOrderTypes();
                        }
                    });
                    return promise;
                }}

                getManufacturingOrderTypeComponents={this.getManufacturingOrderTypeComponents}
                insertManufacturingOrderTypeComponents={this.insertManufacturingOrderTypeComponents}
                updateManufacturingOrderTypeComponents={this.updateManufacturingOrderTypeComponents}
                deleteManufacturingOrderTypeComponents={this.deleteManufacturingOrderTypeComponents}

                locateProduct={this.locateProduct}
            />,
            document.getElementById('renderManufacturingOrderTypesModal'));
    }

    render() {
        return <div id="tabManufacturingOrderTypes">
            <div id="renderManufacturingOrderTypesModal"></div>
            <h1>{i18next.t('manufacturing-order-types')}</h1>
            <button type="button" class="btn btn-primary ml-2 m-2" onClick={this.add}>{i18next.t('add')}</button>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'name', headerName: i18next.t('name'), flex: 1 },
                    { field: 'quantityManufactured', headerName: i18next.t('quantity-manufactured'), width: 300 },
                    { field: 'complex', headerName: i18next.t('complex'), width: 200, type: 'boolean' }
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

class ManufacturingOrderTypeModal extends Component {
    constructor({ type, addManufacturingOrderTypes, updateManufacturingOrderTypes, deleteManufacturingOrderTypes,
        getManufacturingOrderTypeComponents, insertManufacturingOrderTypeComponents, updateManufacturingOrderTypeComponents,
        deleteManufacturingOrderTypeComponents, locateProduct }) {
        super();

        this.type = type;
        this.addManufacturingOrderTypes = addManufacturingOrderTypes;
        this.updateManufacturingOrderTypes = updateManufacturingOrderTypes;
        this.deleteManufacturingOrderTypes = deleteManufacturingOrderTypes;

        this.getManufacturingOrderTypeComponents = getManufacturingOrderTypeComponents;
        this.insertManufacturingOrderTypeComponents = insertManufacturingOrderTypeComponents;
        this.updateManufacturingOrderTypeComponents = updateManufacturingOrderTypeComponents;
        this.deleteManufacturingOrderTypeComponents = deleteManufacturingOrderTypeComponents;

        this.locateProduct = locateProduct;

        this.open = true;
        this.tab = 0;
        this.listInput = [];
        this.listOutput = [];

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.addComponent = this.addComponent.bind(this);
        this.editComponent = this.editComponent.bind(this);
    }

    componentDidMount() {
        this.showComponents();
    }

    showComponents() {
        if (this.type == null) {
            return
        }

        this.getManufacturingOrderTypeComponents(this.type.id).then((data) => {
            this.listInput = data.filter((element) => { return element.type == "I" });
            this.listOutput = data.filter((element) => { return element.type == "O" });
            this.forceUpdate();
        });
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    getTypeFromForm() {
        const type = {}
        type.name = this.refs.name.value;
        type.quantityManufactured = parseInt(this.refs.quantityManufactured.value);
        type.complex = this.refs.complex.checked;
        return type;
    }

    isValid(type) {
        this.refs.errorMessage.innerText = "";
        if (type.name.length === 0) {
            this.refs.errorMessage.innerText = i18next.t('name-0');
            return false;
        }
        if (type.name.length > 100) {
            this.refs.errorMessage.innerText = i18next.t('name-100');
            return false;
        }
        return true;
    }

    add() {
        const type = this.getTypeFromForm();
        if (!this.isValid(type)) {
            return;
        }

        this.addManufacturingOrderTypes(type).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    update() {
        const type = this.getTypeFromForm();
        if (!this.isValid(type)) {
            return;
        }
        type.id = this.type.id;

        this.updateManufacturingOrderTypes(type).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    delete() {
        const typeId = this.type.id;
        this.deleteManufacturingOrderTypes(typeId).then((ok) => {
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

    PaperComponent(props) {
        return (
            <Draggable handle="#draggable-dialog-title" cancel={'[class*="DialogContent-root"]'}>
                <Paper {...props} />
            </Draggable>
        );
    }

    handleTabChange(_, tab) {
        this.tab = tab;
        this.forceUpdate();
    }

    addComponent(manufacturingOrderType, type) {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(<ManufacturingOrderTypeComponentModal
            manufacturingOrderType={manufacturingOrderType}
            type={type}
            insertManufacturingOrderTypeComponents={(component) => {
                return new Promise((resolve) => {
                    this.insertManufacturingOrderTypeComponents(component).then((ok) => {
                        if (ok) {
                            this.showComponents();
                        }
                        resolve(ok);
                    });
                });
            }}
            updateManufacturingOrderTypeComponents={(component) => {
                return new Promise((resolve) => {
                    this.updateManufacturingOrderTypeComponents(component).then((ok) => {
                        if (ok) {
                            this.showComponents();
                        }
                        resolve(ok);
                    });
                });
            }}
            deleteManufacturingOrderTypeComponents={(componentId) => {
                return new Promise((resolve) => {
                    this.deleteManufacturingOrderTypeComponents(componentId).then((ok) => {
                        if (ok) {
                            this.showComponents();
                        }
                        resolve(ok);
                    });
                });
            }}
            locateProduct={this.locateProduct}
        />, this.refs.renderModal);
    }

    editComponent(component, manufacturingOrderType, type) {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(<ManufacturingOrderTypeComponentModal
            component={component}
            manufacturingOrderType={manufacturingOrderType}
            type={type}
            insertManufacturingOrderTypeComponents={(component) => {
                return new Promise((resolve) => {
                    this.insertManufacturingOrderTypeComponents(component).then((ok) => {
                        if (ok) {
                            this.showComponents();
                        }
                        resolve(ok);
                    });
                });
            }}
            updateManufacturingOrderTypeComponents={(component) => {
                return new Promise((resolve) => {
                    this.updateManufacturingOrderTypeComponents(component).then((ok) => {
                        if (ok) {
                            this.showComponents();
                        }
                        resolve(ok);
                    });
                });
            }}
            deleteManufacturingOrderTypeComponents={(componentId) => {
                return new Promise((resolve) => {
                    this.deleteManufacturingOrderTypeComponents(componentId).then((ok) => {
                        if (ok) {
                            this.showComponents();
                        }
                        resolve(ok);
                    });
                });
            }}
            locateProduct={this.locateProduct}
        />, this.refs.renderModal);
    }

    render() {
        return <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'md'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('manufacturing-order-type')}
            </this.DialogTitle>
            <DialogContent>
                <div ref="renderModal"></div>
                <AppBar position="static" style={{
                    'backgroundColor': '#343a40'
                }}>
                    <Tabs value={this.tab} onChange={this.handleTabChange}>
                        <Tab label={i18next.t('details')} />
                        {this.type != null && this.type.complex ? <Tab label={i18next.t('input')} /> : null}
                        {this.type != null && this.type.complex ? <Tab label={i18next.t('output')} /> : null}
                    </Tabs>
                </AppBar>

                <div style={this.tab != 0 ? { 'display': 'none' } : null}>
                    <div class="form-group">
                        <label>{i18next.t('name')}</label>
                        <input type="text" class="form-control" ref="name" defaultValue={this.type != null ? this.type.name : ''} />
                    </div>
                    <div class="form-group">
                        <label>{i18next.t('quantity-manufactured')}</label>
                        <input type="number" class="form-control" ref="quantityManufactured" min="1"
                            defaultValue={this.type != null ? this.type.quantityManufactured : '1'} />
                    </div>
                    <div class="form-group">
                        <div class="custom-control custom-switch">
                            <input class="form-check-input custom-control-input" type="checkbox" id="complex" ref="complex"
                                defaultChecked={this.type != null && this.type.complex} />
                            <label class="form-check-label custom-control-label" htmlFor="complex">{i18next.t('complex')}</label>
                        </div>
                    </div>
                </div>

                {this.tab == 1 ? <div>
                    <button type="button" class="btn btn-primary mt-2 mb-2" onClick={() => {
                        this.addComponent(this.type.id, "I");
                    }}>{i18next.t('add')}</button>
                    <DataGrid
                        ref="table"
                        autoHeight
                        rows={this.listInput}
                        columns={[
                            { field: 'productName', headerName: i18next.t('product'), flex: 1 },
                            { field: 'quantity', headerName: i18next.t('quantity'), width: 200 },
                        ]}
                        onRowClick={(data) => {
                            this.editComponent(data.row, this.type.id, "I");
                        }}
                    />
                </div> : null}

                {this.tab == 2 ? <div>
                    <button type="button" class="btn btn-primary mt-2 mb-2" onClick={() => {
                        this.addComponent(this.type.id, "O");
                    }}>{i18next.t('add')}</button>
                    <DataGrid
                        ref="table"
                        autoHeight
                        rows={this.listOutput}
                        columns={[
                            { field: 'productName', headerName: i18next.t('product'), flex: 1 },
                            { field: 'quantity', headerName: i18next.t('quantity'), width: 200 },
                        ]}
                        onRowClick={(data) => {
                            this.editComponent(data.row, this.type.id, "O");
                        }}
                    />
                </div> : null}

            </DialogContent>
            <DialogActions>
                <p className="errorMessage" ref="errorMessage"></p>
                {this.type != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                {this.type == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                {this.type != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
            </DialogActions>
        </Dialog>
    }
}

class ManufacturingOrderTypeComponentModal extends Component {
    constructor({ component, manufacturingOrderType, type, insertManufacturingOrderTypeComponents, updateManufacturingOrderTypeComponents,
        deleteManufacturingOrderTypeComponents, locateProduct }) {
        super();

        this.component = component;
        this.manufacturingOrderType = manufacturingOrderType;
        this.type = type;

        this.insertManufacturingOrderTypeComponents = insertManufacturingOrderTypeComponents;
        this.updateManufacturingOrderTypeComponents = updateManufacturingOrderTypeComponents;
        this.deleteManufacturingOrderTypeComponents = deleteManufacturingOrderTypeComponents;
        this.locateProduct = locateProduct;

        this.open = true;
        this.currentSelectedProductId = component != null ? component.product : null;

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.locateProducts = this.locateProducts.bind(this);
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    getComponentFromForm() {
        const component = {}
        component.product = this.currentSelectedProductId;
        component.quantity = parseInt(this.refs.quantity.value);
        component.manufacturingOrderType = this.manufacturingOrderType;
        component.type = this.type;
        return component;
    }

    add() {
        const component = this.getComponentFromForm();

        this.insertManufacturingOrderTypeComponents(component).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    update() {
        const component = this.getComponentFromForm();
        component.id = this.type.id;

        this.updateManufacturingOrderTypeComponents(component).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    delete() {
        const componentId = this.component.id;
        this.deleteManufacturingOrderTypeComponents(componentId).then((ok) => {
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

    PaperComponent(props) {
        return (
            <Draggable handle="#draggable-dialog-title" cancel={'[class*="DialogContent-root"]'}>
                <Paper {...props} />
            </Draggable>
        );
    }

    locateProducts() {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(<LocateProduct
            locateProduct={this.locateProduct}
            onSelect={(product) => {
                this.currentSelectedProductId = product.id;
                this.refs.productName.value = product.name;
            }}
        />, this.refs.renderModal);
    }

    render() {
        return <div>
            <div ref="renderModal"></div>
            <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'sm'}
                PaperComponent={this.PaperComponent}>
                <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    {i18next.t('manufacturing-order-type-component')}
                </this.DialogTitle>
                <DialogContent>
                    <label>{i18next.t('product')}</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onClick={this.locateProducts}><HighlightIcon /></button>
                        </div>
                        <input type="text" class="form-control" ref="productName" defaultValue={this.component != null ? this.component.productName : ""}
                            readOnly={true} style={{ 'width': '90%' }} />
                    </div>
                    <div class="form-row">
                        <div class="col">
                            <label>{i18next.t('quantity')}</label>
                            <input type="number" class="form-control" ref="quantity" defaultValue={this.component != null ? this.component.quantity : '1'}
                                min="1" />
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    {this.component != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                    <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                    {this.component == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                    {this.component != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
                </DialogActions>
            </Dialog>
        </div>
    }

}



export default ManufacturingOrderTypes;
