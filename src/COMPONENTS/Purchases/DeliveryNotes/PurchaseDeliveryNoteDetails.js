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

        ReactDOM.unmountComponentAtNode(document.getElementById('salesDeliveryNoteDetailsModal'));
        ReactDOM.render(
            <WarehouseMovementModal
                defaultType={"I"}
                findProductByName={this.findProductByName}
                findWarehouseByName={this.findWarehouseByName}
                addWarehouseMovements={this.addMovement}
            />,
            document.getElementById('salesDeliveryNoteDetailsModal'));
    }

    addMovement(movement) {
        movement.purchaseDeliveryNote = this.noteId;
        movement.warehouse = this.warehouseId;
        return this.addWarehouseMovements(movement);
    }

    async edit(movement) {
        ReactDOM.unmountComponentAtNode(document.getElementById('salesDeliveryNoteDetailsModal'));
        ReactDOM.render(
            <WarehouseMovementModal
                movement={movement}
                deleteWarehouseMovements={this.deleteWarehouseMovements}
                defaultValueNameProduct={movement.productName}
            />,
            document.getElementById('salesDeliveryNoteDetailsModal'));
    }

    render() {
        return <div id="salesDeliveryNoteDetails">
            <div id="salesDeliveryNoteDetailsModal"></div>
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