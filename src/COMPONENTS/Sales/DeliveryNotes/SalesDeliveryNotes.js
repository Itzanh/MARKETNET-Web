import { Component } from "react";
import ReactDOM from 'react-dom';

import SalesDeliveryNotesForm from "./SalesDeliveryNotesForm";

class SalesDeliveryNotes extends Component {
    constructor({ getSalesDeliveryNotes, addSalesDeliveryNotes, deleteSalesDeliveryNotes, findCustomerByName, getCustomerName, findPaymentMethodByName,
        getNamePaymentMethod, findCurrencyByName, getNameCurrency, findBillingSerieByName, getNameBillingSerie, getCustomerDefaults, locateAddress,
        tabSalesDeliveryNotes, getNameAddress, getSalesDeliveryNoteDetails, findProductByName, getNameProduct, addWarehouseMovements, deleteWarehouseMovements }) {
        super();

        this.getSalesDeliveryNotes = getSalesDeliveryNotes;
        this.addSalesDeliveryNotes = addSalesDeliveryNotes;
        this.deleteSalesDeliveryNotes = deleteSalesDeliveryNotes;

        this.findCustomerByName = findCustomerByName;
        this.getCustomerName = getCustomerName;
        this.findPaymentMethodByName = findPaymentMethodByName;
        this.getNamePaymentMethod = getNamePaymentMethod;
        this.findCurrencyByName = findCurrencyByName;
        this.getNameCurrency = getNameCurrency;
        this.findBillingSerieByName = findBillingSerieByName;
        this.getNameBillingSerie = getNameBillingSerie;
        this.getCustomerDefaults = getCustomerDefaults;
        this.locateAddress = locateAddress;
        this.tabSalesDeliveryNotes = tabSalesDeliveryNotes;
        this.getNameAddress = getNameAddress;
        this.getSalesDeliveryNoteDetails = getSalesDeliveryNoteDetails;
        this.findProductByName = findProductByName;
        this.getNameProduct = getNameProduct;
        this.addWarehouseMovements = addWarehouseMovements;
        this.deleteWarehouseMovements = deleteWarehouseMovements;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.getSalesDeliveryNotes().then(async (notes) => {
            await ReactDOM.render(notes.map((element, i) => {
                element.customerName = "...";
                return <SalesDeliveryNote key={i}
                    note={element}
                    edit={this.edit}
                />
            }), this.refs.render);

            for (let i = 0; i < notes.length; i++) {
                notes[i].customerName = await this.getCustomerName(notes[i].customer);
            }

            ReactDOM.render(notes.map((element, i) => {
                return <SalesDeliveryNote key={i}
                    note={element}
                    edit={this.edit}
                />
            }), this.refs.render);
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <SalesDeliveryNotesForm
                addSalesDeliveryNotes={this.addSalesDeliveryNotes}
                deleteSalesDeliveryNotes={this.deleteSalesDeliveryNotes}

                findCustomerByName={this.findCustomerByName}
                findPaymentMethodByName={this.findPaymentMethodByName}
                findCurrencyByName={this.findCurrencyByName}
                findBillingSerieByName={this.findBillingSerieByName}
                getCustomerDefaults={this.getCustomerDefaults}
                locateAddress={this.locateAddress}
                tabSalesDeliveryNotes={this.tabSalesDeliveryNotes}
            />,
            document.getElementById('renderTab'));
    }

    async edit(note) {
        const defaultValueNameCustomer = await this.getCustomerName(note.customer);
        const defaultValueNamePaymentMethod = await this.getNamePaymentMethod(note.paymentMethod);
        const defaultValueNameCurrency = await this.getNameCurrency(note.currency);
        const defaultValueNameBillingSerie = await this.getNameBillingSerie(note.billingSeries);
        const defaultValueNameShippingAddress = await this.getNameAddress(note.shippingAddress);

        ReactDOM.unmountComponentAtNode(document.getElementById('renderTab'));
        ReactDOM.render(
            <SalesDeliveryNotesForm
                note={note}
                addSalesDeliveryNotes={this.addSalesDeliveryNotes}
                deleteSalesDeliveryNotes={this.deleteSalesDeliveryNotes}
                tabSalesDeliveryNotes={this.tabSalesDeliveryNotes}
                getSalesDeliveryNoteDetails={this.getSalesDeliveryNoteDetails}
                findProductByName={this.findProductByName}
                getNameProduct={this.getNameProduct}
                addWarehouseMovements={this.addWarehouseMovements}
                deleteWarehouseMovements={this.deleteWarehouseMovements}

                defaultValueNameCustomer={defaultValueNameCustomer}
                defaultValueNamePaymentMethod={defaultValueNamePaymentMethod}
                defaultValueNameCurrency={defaultValueNameCurrency}
                defaultValueNameBillingSerie={defaultValueNameBillingSerie}
                defaultValueNameShippingAddress={defaultValueNameShippingAddress}
            />,
            document.getElementById('renderTab'));
    }

    render() {
        return <div id="tabSalesOrders">
            <h1>Sales Delivery Notes</h1>
            <button type="button" class="btn btn-primary" onClick={this.add}>Add</button>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Delivery note no.</th>
                        <th scope="col">Customer</th>
                        <th scope="col">Date</th>
                        <th scope="col">Total products</th>
                        <th scope="col">Total amount</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class SalesDeliveryNote extends Component {
    constructor({ note, edit }) {
        super();

        this.note = note;
        this.edit = edit;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.note);
        }}>
            <th scope="row">{this.note.id}</th>
            <td>{this.note.deliveryNoteName}</td>
            <td>{this.note.customerName}</td>
            <td>{window.dateFormat(new Date(this.note.dateCreated))}</td>
            <td>{this.note.totalProducts}</td>
            <td>{this.note.totalAmount}</td>
        </tr>
    }
}

export default SalesDeliveryNotes;
