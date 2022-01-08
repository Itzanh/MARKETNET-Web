import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';
import ManufacturingOrderTypeModal from "./ManufacturingOrderTypeModal";



class ManufacturingOrderTypes extends Component {
    constructor({ getManufacturingOrderTypes, addManufacturingOrderTypes, updateManufacturingOrderTypes, deleteManufacturingOrderTypes,
        getManufacturingOrderTypeComponents, insertManufacturingOrderTypeComponents, updateManufacturingOrderTypeComponents,
        deleteManufacturingOrderTypeComponents, locateProduct, getProductsByManufacturingOrderType, getProductFunctions }) {
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
        this.getProductsByManufacturingOrderType = getProductsByManufacturingOrderType;
        this.getProductFunctions = getProductFunctions;

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
                getProductsByManufacturingOrderType={this.getProductsByManufacturingOrderType}
                getProductFunctions={this.getProductFunctions}
            />,
            document.getElementById('renderManufacturingOrderTypesModal'));
    }

    render() {
        return <div id="tabManufacturingOrderTypes">
            <div id="renderManufacturingOrderTypesModal"></div>
            <h4 className="ml-2">{i18next.t('manufacturing-order-types')}</h4>
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



export default ManufacturingOrderTypes;
