import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import WarehouseMovementModal from "../../Warehouse/WarehouseMovements/WarehouseMovementModal";

class PurchaseDeliveryNoteDetails extends Component {
    constructor({ noteId, findProductByName, getPurchaseDeliveryNoteDetails, addSalesInvoiceDetail, getNameProduct, deleteSalesInvoiceDetail,
        addWarehouseMovements, deleteWarehouseMovements, warehouseId, locateProduct, addNow, getProductFunctions }) {
        super();

        this.noteId = noteId;
        this.warehouseId = warehouseId;
        this.findProductByName = findProductByName;
        this.getPurchaseDeliveryNoteDetails = getPurchaseDeliveryNoteDetails;
        this.addSalesInvoiceDetail = addSalesInvoiceDetail;
        this.deleteSalesInvoiceDetail = deleteSalesInvoiceDetail;
        this.getNameProduct = getNameProduct;
        this.addWarehouseMovements = addWarehouseMovements;
        this.deleteWarehouseMovements = deleteWarehouseMovements;
        this.locateProduct = locateProduct;
        this.addNow = addNow;
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

        this.printPurchaseDeliveryNoteDetails();

        if (this.addNow == true) {
            this.add();
        }
    }

    printPurchaseDeliveryNoteDetails() {
        this.getPurchaseDeliveryNoteDetails(this.noteId).then((movements) => {
            this.renderPurchaseDeliveryNoteDetails(movements);
        });
    }

    async renderPurchaseDeliveryNoteDetails(movements) {
        this.list = movements;
        this.forceUpdate();
    }

    add() {
        if (this.noteId == null) {
            this.addWarehouseMovements();
            return;
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('purchaseDeliveryNoteDetailsModal'));
        ReactDOM.render(
            <WarehouseMovementModal
                defaultType={"I"}
                findProductByName={this.findProductByName}
                findWarehouseByName={this.findWarehouseByName}
                locateProduct={this.locateProduct}
                getProductFunctions={this.getProductFunctions}
                addWarehouseMovements={(movement) => {
                    const promise = this.addMovement(movement);
                    promise.then((ok) => {
                        if (ok) {
                            this.printPurchaseDeliveryNoteDetails();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('purchaseDeliveryNoteDetailsModal'));
    }

    addMovement(movement) {
        movement.purchaseDeliveryNote = this.noteId;
        movement.warehouse = this.warehouseId;
        return this.addWarehouseMovements(movement);
    }

    async edit(movement) {
        ReactDOM.unmountComponentAtNode(document.getElementById('purchaseDeliveryNoteDetailsModal'));
        ReactDOM.render(
            <WarehouseMovementModal
                movement={movement}
                getProductFunctions={this.getProductFunctions}
                deleteWarehouseMovements={(movementId) => {
                    const promise = this.deleteWarehouseMovements(movementId);
                    promise.then((ok) => {
                        if (ok) {
                            this.printPurchaseDeliveryNoteDetails();
                        }
                    });
                    return promise;
                }}
                defaultValueNameProduct={movement.productName}
            />,
            document.getElementById('purchaseDeliveryNoteDetailsModal'));
    }

    render() {
        return <div id="purchaseDeliveryNoteDetails">
            <div id="purchaseDeliveryNoteDetailsModal"></div>
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

export default PurchaseDeliveryNoteDetails;
