import { Component } from "react";
import ReactDOM from 'react-dom';
import WarehouseMovementModal from "../../Warehouse/WarehouseMovements/WarehouseMovementModal";

class PurchaseDeliveryNoteDetails extends Component {
    constructor({ noteId, findProductByName, getPurchaseDeliveryNoteDetails, addSalesInvoiceDetail, getNameProduct, deleteSalesInvoiceDetail,
        addWarehouseMovements, deleteWarehouseMovements, warehouseId }) {
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

        this.add = this.add.bind(this);
        this.addMovement = this.addMovement.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        if (this.noteId == null) {
            return;
        }

        this.renderPurchaseDeliveryNoteDetails();
    }

    renderPurchaseDeliveryNoteDetails() {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        this.getPurchaseDeliveryNoteDetails(this.noteId).then(async (movements) => {
            ReactDOM.render(movements.map((element, i) => {
                element.productName = "...";
                return <PurchaseDeliveryNoteDetail key={i}
                    movement={element}
                    edit={this.edit}
                    pos={i}
                />
            }), this.refs.render);

            for (let i = 0; i < movements.length; i++) {
                movements[i].productName = await this.getNameProduct(movements[i].product);
            }

            ReactDOM.render(movements.map((element, i) => {
                return <PurchaseDeliveryNoteDetail key={i}
                    movement={element}
                    edit={this.edit}
                    pos={i}
                />
            }), this.refs.render);
        });
    }

    add() {
        if (this.noteId == null) {
            return;
        }

        ReactDOM.unmountComponentAtNode(document.getElementById('purchaseDeliveryNoteDetailsModal'));
        ReactDOM.render(
            <WarehouseMovementModal
                defaultType={"I"}
                findProductByName={this.findProductByName}
                findWarehouseByName={this.findWarehouseByName}
                addWarehouseMovements={(movement) => {
                    const promise = this.addMovement(movement);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderPurchaseDeliveryNoteDetails();
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
                deleteWarehouseMovements={(movementId) => {
                    const promise = this.deleteWarehouseMovements(movementId);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderPurchaseDeliveryNoteDetails();
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
            <button type="button" class="btn btn-primary" onClick={this.add}>Add</button>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Product</th>
                        <th scope="col">Quantity</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class PurchaseDeliveryNoteDetail extends Component {
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
            <td>{this.movement.quantity}</td>
        </tr>
    }
}

export default PurchaseDeliveryNoteDetails;
