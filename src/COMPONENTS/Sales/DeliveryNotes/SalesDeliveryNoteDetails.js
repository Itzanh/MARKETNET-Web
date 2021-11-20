import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import WarehouseMovementModal from "../../Warehouse/WarehouseMovements/WarehouseMovementModal";

class SalesDeliveryNoteDetails extends Component {
    constructor({ noteId, findProductByName, getSalesDeliveryNoteDetails, getNameProduct, deleteSalesInvoiceDetail, addWarehouseMovements,
        deleteWarehouseMovements, warehouseId, locateProduct, addNow, getRegisterTransactionalLogs, getProductFunctions }) {
        super();

        this.noteId = noteId;
        this.warehouseId = warehouseId;
        this.findProductByName = findProductByName;
        this.getSalesDeliveryNoteDetails = getSalesDeliveryNoteDetails;
        this.deleteSalesInvoiceDetail = deleteSalesInvoiceDetail;
        this.getNameProduct = getNameProduct;
        this.addWarehouseMovements = addWarehouseMovements;
        this.deleteWarehouseMovements = deleteWarehouseMovements;
        this.locateProduct = locateProduct;
        this.addNow = addNow;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;
        this.getProductFunctions = getProductFunctions;

        this.list = [];

        this.add = this.add.bind(this);
        this.addMovement = this.addMovement.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        if (this.noteId == null) {
            return;
        }

        this.printSalesDeliveryNoteDetails();

        if (this.addNow == true) {
            this.add();
        }
    }

    printSalesDeliveryNoteDetails() {
        this.getSalesDeliveryNoteDetails(this.noteId).then((movements) => {
            this.renderSalesDeliveryNoteDetails(movements);
        });
    }

    async renderSalesDeliveryNoteDetails(movements) {
        this.list = movements;
        this.forceUpdate();
    }

    add() {
        if (this.noteId == null) {
            this.addWarehouseMovements();
            return;
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('salesDeliveryNoteDetailsModal'));
        ReactDOM.render(
            <WarehouseMovementModal
                defaultType={"O"}
                findProductByName={this.findProductByName}
                findWarehouseByName={this.findWarehouseByName}
                locateProduct={this.locateProduct}
                getProductFunctions={this.getProductFunctions}
                addWarehouseMovements={(movement) => {
                    const promise = this.addMovement(movement);
                    promise.then((ok) => {
                        if (ok) {
                            this.printSalesDeliveryNoteDetails();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('salesDeliveryNoteDetailsModal'));
    }

    addMovement(movement) {
        movement.salesDeliveryNote = this.noteId;
        movement.warehouse = this.warehouseId;
        return this.addWarehouseMovements(movement);
    }

    async edit(movement) {
        ReactDOM.unmountComponentAtNode(document.getElementById('salesDeliveryNoteDetailsModal'));
        ReactDOM.render(
            <WarehouseMovementModal
                movement={movement}
                getProductFunctions={this.getProductFunctions}
                getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
                deleteWarehouseMovements={(movementId) => {
                    const promise = this.deleteWarehouseMovements(movementId);
                    promise.then((ok) => {
                        if (ok) {
                            this.printSalesDeliveryNoteDetails();
                        }
                    });
                    return promise;
                }}
                defaultValueNameProduct={movement.productName}
            />,
            document.getElementById('salesDeliveryNoteDetailsModal'));
    }

    render() {
        return <div id="salesDeliveryNoteDetails">
            <div id="salesDeliveryNoteDetailsModal"></div>
            <button type="button" class="btn btn-primary mb-1 ml-1" onClick={this.add}>{i18next.t('add')}</button>
            <div className="tableOverflowContainer tableOverflowContainer2">
                <DataGrid
                    ref="table"
                    autoHeight
                    rows={this.list}
                    columns={[
                        { field: 'productName', headerName: i18next.t('product'), flex: 1 },
                        { field: 'price', headerName: i18next.t('price'), width: 150 },
                        { field: 'quantity', headerName: i18next.t('quantity'), width: 150 },
                        { field: 'vatPercent', headerName: i18next.t('%-vat'), width: 150 },
                        { field: 'totalAmount', headerName: i18next.t('total-amount'), width: 200 }
                    ]}
                    onRowClick={(data) => {
                        this.edit(data.row);
                    }}
                />
            </div>
        </div>
    }
}

export default SalesDeliveryNoteDetails;
