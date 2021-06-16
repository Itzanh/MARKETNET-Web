import { Component } from "react";
import ReactDOM from 'react-dom';

class ReportModal extends Component {
    constructor({ resource, documentId, grantDocumentAccessToken }) {
        super();

        this.resource = resource;
        this.documentId = documentId;
        this.grantDocumentAccessToken = grantDocumentAccessToken;

        this.print = this.print.bind(this);
    }

    async getURL() {
        const token = (await this.grantDocumentAccessToken()).token;
        return "http://" + window.location.hostname + ":12279/report?report=" + this.resource + "&id=" + this.documentId + "&token=" + token
    }

    async componentDidMount() {
        window.$('#reportModal').modal({ show: true });

        const url = await this.getURL();
        ReactDOM.render(<iframe
            id="report"
            name="report"
            width="1100"
            height="740"
            src={url}>
        </iframe>, this.refs.body);
    }

    async print() {
        const url = await this.getURL();
        ReactDOM.unmountComponentAtNode(this.refs.body);
        ReactDOM.render(<iframe
            id="report"
            name="report"
            width="1100"
            height="740"
            src={url + "&force_print=1"}>
        </iframe>, this.refs.body);
    }

    render() {
        return <div class="modal fade" id="reportModal" tabindex="-1" role="dialog" aria-labelledby="reportModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="reportModalLabel">Report</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body" ref="body">

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" onClick={this.print}>Print</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default ReportModal;
