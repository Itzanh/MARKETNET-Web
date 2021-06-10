import { Component } from "react";

class AlertModal extends Component {
    constructor({ modalTitle, modalText }) {
        super();

        this.modalTitle = modalTitle;
        this.modalText = modalText;
    }

    componentDidMount() {
        window.$('#alertModal').modal({ show: true });
    }

    render() {
        return <div class="modal fade" id="alertModal" tabindex="-1" role="dialog" aria-labelledby="alertModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="alertModalLabel">{this.modalTitle}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>{this.modalText}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default AlertModal;
