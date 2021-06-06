import { Component } from "react";
import ReactDOM from 'react-dom';

class DocumentContainers extends Component {
    constructor({ getDocumentContainers, addDocumentContainers, updateDocumentContainers, deleteDocumentContainers }) {
        super();

        this.getDocumentContainers = getDocumentContainers;
        this.addDocumentContainers = addDocumentContainers;
        this.updateDocumentContainers = updateDocumentContainers;
        this.deleteDocumentContainers = deleteDocumentContainers;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.getDocumentContainers().then((container) => {
            ReactDOM.render(container.map((element, i) => {
                return <DocumentContainer key={i}
                    container={element}
                    edit={this.edit}
                />
            }), this.refs.render);
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderocumentContainersModal'));
        ReactDOM.render(
            <DocumentContainersModal
                addDocumentContainers={this.addDocumentContainers}
            />,
            document.getElementById('renderocumentContainersModal'));
    }

    edit(container) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderocumentContainersModal'));
        ReactDOM.render(
            <DocumentContainersModal
                container={container}
                updateDocumentContainers={this.updateDocumentContainers}
                deleteDocumentContainers={this.deleteDocumentContainers}
            />,
            document.getElementById('renderocumentContainersModal'));
    }

    render() {
        return <div id="tabDocumentContainers" className="formRowRoot">
            <div id="renderocumentContainersModal"></div>
            <h1>Document Containers</h1>
            <button type="button" class="btn btn-primary" onClick={this.add}>Add</button>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Path</th>
                        <th scope="col">Max file size</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class DocumentContainer extends Component {
    constructor({ container, edit }) {
        super();

        this.container = container;
        this.edit = edit;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.container);
        }}>
            <th scope="row">{this.container.id}</th>
            <td>{this.container.name}</td>
            <td>{this.container.path}</td>
            <td>{this.container.maxFileSize / 1000000} Mb</td>
        </tr>
    }
}

class DocumentContainersModal extends Component {
    constructor({ container, addDocumentContainers, updateDocumentContainers, deleteDocumentContainers }) {
        super();

        this.container = container;
        this.addDocumentContainers = addDocumentContainers;
        this.updateDocumentContainers = updateDocumentContainers;
        this.deleteDocumentContainers = deleteDocumentContainers;

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        window.$('#documentContainersModal').modal({ show: true });
    }

    getContainerFromForm() {
        const containter = {};
        containter.name = this.refs.name.value;
        containter.path = this.refs.path.value;
        containter.maxFileSize = parseInt(this.refs.maxFileSize.value) * 1000000;
        containter.disallowedMimeTypes = this.refs.disallowedMimeTypes.value;
        containter.allowedMimeTypes = this.refs.allowedMimeTypes.value;
        return containter;
    }

    add() {
        const container = this.getContainerFromForm();

        this.addDocumentContainers(container).then((ok) => {
            if (ok) {
                window.$('#documentContainersModal').modal('hide');
            }
        });
    }

    update() {
        const container = this.getContainerFromForm();
        container.id = this.container.id;

        this.updateDocumentContainers(container).then((ok) => {
            if (ok) {
                window.$('#documentContainersModal').modal('hide');
            }
        });
    }

    delete() {
        this.deleteDocumentContainers(this.container.id).then((ok) => {
            if (ok) {
                window.$('#documentContainersModal').modal('hide');
            }
        });
    }


    render() {
        return <div class="modal fade" id="documentContainersModal" tabindex="-1" role="dialog" aria-labelledby="documentContainersModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="documentContainersModalLabel">Document Containers</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" class="form-control" ref="name" defaultValue={this.container != null ? this.container.name : ''} />
                        </div>
                        <div class="form-group">
                            <label>Date Created</label>
                            <input type="text" class="form-control" ref="dateCreated" defaultValue={this.container != null ? window.dateFormat(this.container.dateCreated) : ''} readOnly={true} />
                        </div>
                        <div class="form-group">
                            <label>Path</label>
                            <input type="text" class="form-control" ref="path" defaultValue={this.container != null ? this.container.path : ''} />
                        </div>
                        <div class="form-group">
                            <label>Max file size (Mb)</label>
                            <input type="text" class="form-control" ref="maxFileSize" defaultValue={this.container != null ? this.container.maxFileSize / 1000000 : ''} />
                        </div>
                        <div class="form-group">
                            <label>Disallowed mime types</label>
                            <input type="text" class="form-control" ref="disallowedMimeTypes" defaultValue={this.container != null ? this.container.disallowedMimeTypes : ''} />
                        </div>
                        <div class="form-group">
                            <label>Allowed mime types</label>
                            <input type="text" class="form-control" ref="allowedMimeTypes" defaultValue={this.container != null ? this.container.allowedMimeTypes : ''} />
                        </div>

                    </div>
                    <div class="modal-footer">
                        {this.container != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>Delete</button> : null}
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        {this.container == null ? <button type="button" class="btn btn-primary" onClick={this.add}>Add</button> : null}
                        {this.container != null ? <button type="button" class="btn btn-success" onClick={this.update}>Update</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default DocumentContainers;
