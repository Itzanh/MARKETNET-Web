import React, { Component } from 'react';

class EmailModal extends Component {
    constructor({ sendEmail, destinationAddress, destinationAddressName, subject, reportId, reportDataId }) {
        super();

        this.sendEmail = sendEmail;
        this.destinationAddress = destinationAddress;
        this.destinationAddressName = destinationAddressName;
        this.subject = subject;
        this.reportId = reportId;
        this.reportDataId = reportDataId;

        this.send = this.send.bind(this);
    }

    componentDidMount() {
        window.$('#emailModal').modal({ show: true });
    }

    send() {
        this.sendEmail({
            destinationAddress: this.refs.destinationAddress.value,
            destinationAddressName: this.refs.destinationAddressName.value,
            subject: this.refs.subject.value,
            reportId: this.reportId,
            reportDataId: this.reportDataId
        });
        window.$('#emailModal').modal('hide');
    }

    render() {
        return <div class="modal fade" id="emailModal" tabindex="-1" role="dialog" aria-labelledby="emailModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="emailModalLabel">Email</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Address to</label>
                            <input type="text" class="form-control" ref="destinationAddress" defaultValue={this.destinationAddress} />
                        </div>
                        <div class="form-group">
                            <label>Name to</label>
                            <input type="text" class="form-control" ref="destinationAddressName" defaultValue={this.destinationAddressName} />
                        </div>
                        <div class="form-group">
                            <label>Subject</label>
                            <input type="text" class="form-control" ref="subject" defaultValue={this.subject} />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onClick={this.send}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default EmailModal;
