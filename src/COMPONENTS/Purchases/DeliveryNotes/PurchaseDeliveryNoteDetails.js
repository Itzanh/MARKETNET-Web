/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import WarehouseMovementModal from "../../Warehouse/WarehouseMovements/WarehouseMovementModal";

class PurchaseDeliveryNoteDetails extends Component {
    constructor({ noteId, findProductByName, getPurchaseDeliveryNoteDetails, addSalesInvoiceDetail, deleteSalesInvoiceDetail,
        addWarehouseMovements, deleteWarehouseMovements, warehouseId, locateProduct, addNow, getRegisterTransactionalLogs, getWarehouses,
        getProductFunctions }) {
        super();

        this.noteId = noteId;
        this.warehouseId = warehouseId;
        this.findProductByName = findProductByName;
        this.getPurchaseDeliveryNoteDetails = getPurchaseDeliveryNoteDetails;
        this.addSalesInvoiceDetail = addSalesInvoiceDetail;
        this.deleteSalesInvoiceDetail = deleteSalesInvoiceDetail;
        this.addWarehouseMovements = addWarehouseMovements;
        this.deleteWarehouseMovements = deleteWarehouseMovements;
        this.locateProduct = locateProduct;
        this.addNow = addNow;
        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;
        this.getWarehouses = getWarehouses;
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
                locateProduct={this.locateProduct}
                getProductFunctions={this.getProductFunctions}
                getWarehouses={this.getWarehouses}
                defaultWarehouse={this.warehouseId}
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
        movement.purchaseDeliveryNoteId = this.noteId;
        return this.addWarehouseMovements(movement);
    }

    async edit(movement) {
        ReactDOM.unmountComponentAtNode(document.getElementById('purchaseDeliveryNoteDetailsModal'));
        ReactDOM.render(
            <WarehouseMovementModal
                movement={movement}
                getProductFunctions={this.getProductFunctions}
                getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
                getWarehouses={this.getWarehouses}
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
                        {
                            field: 'productName', headerName: i18next.t('product'), flex: 1, valueGetter: (params) => {
                                return params.row.product.name;
                            }
                        },
                        { field: 'price', headerName: i18next.t('price'), width: 150 },
                        { field: 'quantity', headerName: i18next.t('quantity'), width: 150 },
                        { field: 'vatPercent', headerName: i18next.t('%-vat'), width: 150 },
                        { field: 'totalAmount', headerName: i18next.t('total-amount'), width: 200 },
                        {
                            field: 'warehouse', headerName: i18next.t('warehouse'), width: 200, valueGetter: (params) => {
                                return params.row.warehouse.name;
                            }
                        }
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
