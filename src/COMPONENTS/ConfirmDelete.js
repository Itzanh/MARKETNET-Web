import { Component } from "react";
import i18next from 'i18next';

class ConfirmDelete extends Component {
    constructor({ onDelete }) {
        super();

        this.onDelete = onDelete;

        this.onDel = this.onDel.bind(this);
    }

    componentDidMount() {
        window.$('#deleteModal').modal({ show: true });
    }

    onDel() {
        this.onDelete();
        window.$('#deleteModal').modal('hide');
    }

    render() {
        return <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="deleteModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="deleteModalLabel">{i18next.t('confirm-delete')}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>{i18next.t('are-you-sure-that-you-want-to-delete-this')}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                        <button type="button" class="btn btn-danger" onClick={this.onDel}>{i18next.t('delete')}</button>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default ConfirmDelete;
