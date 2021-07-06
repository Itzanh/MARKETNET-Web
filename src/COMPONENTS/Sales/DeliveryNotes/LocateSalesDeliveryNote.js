import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

class LocateSalesDeliveryNote extends Component {
    constructor({ locateSaleDeliveryNote, handleSelect }) {
        super();

        this.locateSaleDeliveryNote = locateSaleDeliveryNote;
        this.handleSelect = handleSelect;

        this.select = this.select.bind(this);
    }

    componentDidMount() {
        window.$('#notesModal').modal({ show: true });

        this.locateSaleDeliveryNote().then((notes) => {
            ReactDOM.render(notes.map((element, i) => {
                return <DeliveryNote key={i}
                    note={element}
                    select={this.select}
                />
            }), this.refs.render);
        });
    }

    select(note) {
        window.$('#notesModal').modal('hide');
        this.handleSelect(note.id, note.deliveryNoteName);
    }

    render() {
        return <div class="modal fade" id="notesModal" tabindex="-1" role="dialog" aria-labelledby="notesModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="notesModalLabel">{i18next.t('locate-sales-delivery-note')}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <table class="table table-dark">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">{i18next.t('customer')}</th>
                                    <th scope="col">{i18next.t('delivery-note-no')}</th>
                                    <th scope="col">{i18next.t('date-created')}</th>
                                </tr>
                            </thead>
                            <tbody ref="render"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    }
}

class DeliveryNote extends Component {
    constructor({ note, select }) {
        super();

        this.note = note;
        this.select = select;
    }

    render() {
        return <tr onClick={() => {
            this.select(this.note);
        }}>
            <th scope="row">{this.note.id}</th>
            <td>{this.note.customerName}</td>
            <td>{this.note.deliveryNoteName}</td>
            <td>{window.dateFormat(new Date(this.note.dateCreated))}</td>
        </tr>
    }
}

export default LocateSalesDeliveryNote;
