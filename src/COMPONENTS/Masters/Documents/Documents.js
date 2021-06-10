import { Component } from "react";
import ReactDOM from 'react-dom';
import Document from "./Document";
import DocumentModal from "./DocumentModal";

class Documents extends Component {
    constructor({ getDocuments, addDocuments, deleteDocuments, uploadDocument, grantDocumentAccessToken, locateDocumentContainers }) {
        super();

        this.getDocuments = getDocuments;
        this.addDocuments = addDocuments;
        this.deleteDocuments = deleteDocuments;
        this.uploadDocument = uploadDocument;
        this.grantDocumentAccessToken = grantDocumentAccessToken;
        this.locateDocumentContainers = locateDocumentContainers;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderDocuments();
    }

    renderDocuments() {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        this.getDocuments().then((documents) => {
            ReactDOM.render(documents.map((element, i) => {
                return <Document key={i}
                    document={element}
                    edit={this.edit}
                />
            }), this.refs.render);
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderocumentsModal'));
        ReactDOM.render(
            <DocumentModal
                addDocuments={(doc) => {
                    const promise = this.addDocuments(doc);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderDocuments();
                        }
                    });
                    return promise;
                }}
                uploadDocument={(uuid, token, file) => {
                    const promise = this.uploadDocument(uuid, token, file);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderDocuments();
                        }
                    });
                    return promise;
                }}
                grantDocumentAccessToken={this.grantDocumentAccessToken}
                locateDocumentContainers={this.locateDocumentContainers}
            />,
            document.getElementById('renderocumentsModal'));
    }

    edit(doc) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderocumentsModal'));
        ReactDOM.render(
            <DocumentModal
                document={doc}
                deleteDocuments={(docId) => {
                    const promise = this.deleteDocuments(docId);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderDocuments();
                        }
                    });
                    return promise;
                }}
                uploadDocument={(uuid, token, file) => {
                    const promise = this.uploadDocument(uuid, token, file);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderDocuments();
                        }
                    });
                    return promise;
                }}
                grantDocumentAccessToken={this.grantDocumentAccessToken}
            />,
            document.getElementById('renderocumentsModal'));
    }

    render() {
        return <div id="tabDocuments" className="formRowRoot">
            <div id="renderocumentsModal"></div>
            <h1>Documents</h1>
            <button type="button" class="btn btn-primary" onClick={this.add}>Add</button>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Date created</th>
                        <th scope="col">Size</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

export default Documents;
