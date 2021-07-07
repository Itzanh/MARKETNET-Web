import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

import WarehouseMovementModal from "../../Warehouse/WarehouseMovements/WarehouseMovementModal";

class SalesDeliveryNoteDetails extends Component {
    constructor({ noteId, findProductByName, getSalesDeliveryNoteDetails, addSalesInvoiceDetail, getNameProduct, deleteSalesInvoiceDetail,
        addWarehouseMovements, deleteWarehouseMovements, warehouseId }) {
        super();

        this.noteId = noteId;
        this.warehouseId = warehouseId;
        this.findProductByName = findProductByName;
        this.getSalesDeliveryNoteDetails = getSalesDeliveryNoteDetails;
        this.addSalesInvoiceDetail = addSalesInvoiceDetail;
        this.deleteSalesInvoiceDetail = deleteSalesInvoiceDetail;
        this.getNameProduct = getNameProduct;
        this.addWarehouseMovements = addWarehouseMovements;
        this.deleteWarehouseMovements = deleteWarehouseMovements;

        this.list = null;

        this.add = this.add.bind(this);
        this.addMovement = this.addMovement.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        if (this.noteId == null) {
            return;
        }

        this.printSalesDeliveryNoteDetails();
    }

    printSalesDeliveryNoteDetails() {
        this.getSalesDeliveryNoteDetails(this.noteId).then((movements) => {
            this.renderSalesDeliveryNoteDetails(movements);
        });
    }

    async renderSalesDeliveryNoteDetails(movements) {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        ReactDOM.render(movements.map((element, i) => {
            return <SalesDeliveryNoteDetail key={i} movement={element} edit={this.edit} pos={i} />;
        }), this.refs.render);

        this.list = movements;
    }

    add() {
        if (this.noteId == null) {
            return;
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('salesDeliveryNoteDetailsModal'));
        ReactDOM.render(
            <WarehouseMovementModal
                defaultType={"O"}
                findProductByName={this.findProductByName}
                findWarehouseByName={this.findWarehouseByName}
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
                <table class="table table-dark">
                    <thead>
                        <tr onClick={(e) => {
                            e.preventDefault();
                            const field = e.target.getAttribute("field");
                            if (field == null) {
                                return;
                            }

                            if (this.sortField == field) {
                                this.sortAscending = !this.sortAscending;
                            }
                            this.sortField = field;

                            var greaterThan = 1;
                            var lessThan = -1;
                            if (!this.sortAscending) {
                                greaterThan = -1;
                                lessThan = -1;
                            }

                            this.list.sort((a, b) => {
                                if (a[field] > b[field]) {
                                    return greaterThan;
                                } else if (a[field] < b[field]) {
                                    return lessThan;
                                } else {
                                    return 0;
                                }
                            });
                            this.renderSalesDeliveryNoteDetails(this.list);
                        }}>
                            <th scope="col">#</th>
                            <th field="productName" scope="col">{i18next.t('product')}</th>
                            <th field="quantity" scope="col">{i18next.t('quantity')}</th>
                            <th field="price" scope="col">{i18next.t('unit-price')}</th>
                            <th field="vatPercent" scope="col">{i18next.t('%-vat')}</th>
                            <th field="totalAmount" scope="col">{i18next.t('total-amount')}</th>
                        </tr>
                    </thead>
                    <tbody ref="render"></tbody>
                </table>
            </div>
        </div>
    }
}

class SalesDeliveryNoteDetail extends Component {
    constructor({ movement, edit, pos }) {
        super();

        this.movement = movement;
        this.edit = edit;
        this.pos = pos;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.movement);
        }}>
            <th scope="row">{this.pos + 1}</th>
            <td>{this.movement.productName}</td>
            <td>{-this.movement.quantity}</td>
            <td>{this.movement.price}</td>
            <td>{this.movement.vatPercent}</td>
            <td>{this.movement.totalAmount}</td>
        </tr>
    }
}

export default SalesDeliveryNoteDetails;
