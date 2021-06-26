import { Component } from "react";
import ReactDOM from 'react-dom';

class DocumentModal extends Component {
    constructor({ document, addDocuments, deleteDocuments, uploadDocument, grantDocumentAccessToken, locateDocumentContainers, relations }) {
        super();

        this.document = document;
        this.addDocuments = addDocuments;
        this.deleteDocuments = deleteDocuments;
        this.uploadDocument = uploadDocument;
        this.grantDocumentAccessToken = grantDocumentAccessToken;
        this.locateDocumentContainers = locateDocumentContainers;
        this.relations = relations;

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.fileSelected = this.fileSelected.bind(this);
        this.open = this.open.bind(this);
    }

    componentDidMount() {
        window.$('#documentModal').modal({ show: true });
        this.renderContainers();
    }

    async renderContainers() {
        if (this.document != null) {
            return;
        }

        const containers = await this.locateDocumentContainers();
        ReactDOM.render(containers.map((element, i) => {
            return <option key={i} value={element.id}>{element.name}</option>
        }), this.refs.containers);
    }

    getDocumentFromForm() {
        const document = {}
        document.name = this.refs.name.value;
        document.size = this.refs.file.files[0].size;
        document.description = this.refs.dsc.value;
        document.container = parseInt(this.refs.containers.value);

        if (this.relations !== undefined) {
            Object.keys(this.relations).forEach((key) => {
                document[key] = this.relations[key];
            });
        }

        return document;
    }

    isValid(document) {
        this.refs.errorMessage.innerText = "";
        if (document.name.length === 0) {
            this.refs.errorMessage.innerText = "The name can't be empty.";
            return false;
        }
        if (document.name.length > 250) {
            this.refs.errorMessage.innerText = "The name can't be longer than 250 characters.";
            return false;
        }
        return true;
    }

    async add() {
        if (this.refs.file.files.length === 0) {
            return;
        }

        const document = this.getDocumentFromForm();
        if (!this.isValid(document)) {
            return;
        }
        const uploadDocument = this.uploadDocument;
        const token = (await this.grantDocumentAccessToken()).token;

        this.addDocuments(document).then((document) => {
            if (document !== false) {
                uploadDocument(document.uuid, token, this.refs.file.files[0]).then(() => {
                    window.$('#documentModal').modal('hide');
                });
            }
        });
    }

    async update() {
        if (this.refs.file.files.length === 0) {
            return;
        }

        const token = (await this.grantDocumentAccessToken()).token;

        this.uploadDocument(this.document.uuid, token, this.refs.file.files[0]).then(() => {
            window.$('#documentModal').modal('hide');
        });
    }

    delete() {
        const documentId = this.document.id;
        this.deleteDocuments(documentId).then((ok) => {
            if (ok) {
                window.$('#documentModal').modal('hide');
            }
        });
    }

    fileSelected() {
        if (this.refs.file.files.length === 0) {
            this.refs.name.value = "";
            this.refs.fileLabel.innerText = "Choose file";
            this.refs.size.value = "0";
        } else {
            this.refs.name.value = this.refs.file.files[0].name;
            this.refs.fileLabel.innerText = this.refs.file.files[0].name;
            this.refs.size.value = window.bytesToSize(this.refs.file.files[0].size);
        }
    }

    async open() {
        const token = (await this.grantDocumentAccessToken()).token;
        window.open(window.location.protocol + "//" + window.location.hostname + ":" + window.global_config.document.port + "/" + window.global_config.document.path + "?uuid=" + this.document.uuid + "&token=" + token, '_blank');
    }

    render() {
        return <div class="modal fade" id="documentModal" tabindex="-1" role="dialog" aria-labelledby="documentModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="documentModalLabel">Documents</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        {this.document != null ? null :
                            <div class="form-group">
                                <label>Document container</label>
                                <select class="form-control" ref="containers">
                                </select>
                            </div>}
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" class="form-control" ref="name" defaultValue={this.document != null ? this.document.name : ''}
                                readOnly={this.document != null} />
                        </div>
                        <div class="custom-file">
                            <input type="file" class="custom-file-input" ref="file" onChange={this.fileSelected} />
                            <label class="custom-file-label" ref="fileLabel">Choose file</label>
                        </div>
                        <div class="form-group">
                            <label>Size</label>
                            <input type="text" class="form-control" ref="size" readOnly={true}
                                defaultValue={this.document != null ? window.bytesToSize(this.document.size) : '0'} />
                        </div>
                        <div class="form-group">
                            <label>Description</label>
                            <textarea class="form-control" ref="dsc" rows="5" readOnly={this.document != null}></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <p className="errorMessage" ref="errorMessage"></p>
                        {this.document != null ? <button type="button" class="btn btn-primary" onClick={this.open}>Open document</button> : null}
                        {this.document != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>Delete</button> : null}
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        {this.document == null ? <button type="button" class="btn btn-primary" onClick={this.add}>Add</button> : null}
                        {this.document != null ? <button type="button" class="btn btn-success" onClick={this.update}>Update</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default DocumentModal;