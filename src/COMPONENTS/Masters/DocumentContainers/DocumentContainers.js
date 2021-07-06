import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

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
        this.renderDocumentContainers();
    }

    renderDocumentContainers() {
        ReactDOM.unmountComponentAtNode(this.refs.render);
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
                addDocumentContainers={(container) => {
                    const promise = this.addDocumentContainers(container);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderDocumentContainers();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderocumentContainersModal'));
    }

    edit(container) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderocumentContainersModal'));
        ReactDOM.render(
            <DocumentContainersModal
                container={container}
                updateDocumentContainers={(container) => {
                    const promise = this.updateDocumentContainers(container);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderDocumentContainers();
                        }
                    });
                    return promise;
                }}
                deleteDocumentContainers={(containerId) => {
                    const promise = this.deleteDocumentContainers(containerId);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderDocumentContainers();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderocumentContainersModal'));
    }

    render() {
        return <div id="tabDocumentContainers" className="formRowRoot">
            <div id="renderocumentContainersModal"></div>
            <div className="menu">
                <h1>{i18next.t('document-containers')}</h1>
                <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button>
            </div>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">{i18next.t('name')}</th>
                        <th scope="col">{i18next.t('path')}</th>
                        <th scope="col">{i18next.t('max-file-size')}</th>
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

    isValid(containter) {
        this.refs.errorMessage.innerText = "";
        if (containter.name.length === 0) {
            this.refs.errorMessage.innerText = i18next.t('name-0');
            return false;
        }
        if (containter.name.length > 50) {
            this.refs.errorMessage.innerText = i18next.t('name-50');
            return false;
        }
        if (containter.path.length === 0) {
            this.refs.errorMessage.innerText = i18next.t('path-0');
            return false;
        }
        if (containter.path.length > 520) {
            this.refs.errorMessage.innerText = i18next.t('path-250');
            return false;
        }
        if (containter.maxFileSize <= 0) {
            this.refs.errorMessage.innerText = i18next.t('filesize-0');
            return false;
        }
        if (containter.disallowedMimeTypes.length > 250) {
            this.refs.errorMessage.innerText = i18next.t('disallow-mime-250');
            return false;
        }
        if (containter.allowedMimeTypes.length > 250) {
            this.refs.errorMessage.innerText = i18next.t('allow-mime-250');
            return false;
        }
        return true;
    }

    add() {
        const container = this.getContainerFromForm();
        if (!this.isValid(container)) {
            return;
        }

        this.addDocumentContainers(container).then((ok) => {
            if (ok) {
                window.$('#documentContainersModal').modal('hide');
            }
        });
    }

    update() {
        const container = this.getContainerFromForm();
        if (!this.isValid(container)) {
            return;
        }
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
                        <h5 class="modal-title" id="documentContainersModalLabel">{i18next.t('document-container')}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>{i18next.t('name')}</label>
                            <input type="text" class="form-control" ref="name" defaultValue={this.container != null ? this.container.name : ''} />
                        </div>
                        <div class="form-group">
                            <label>{i18next.t('date-created')}</label>
                            <input type="text" class="form-control" ref="dateCreated" defaultValue={this.container != null ? window.dateFormat(this.container.dateCreated) : ''} readOnly={true} />
                        </div>
                        <div class="form-group">
                            <label>{i18next.t('path')}</label>
                            <input type="text" class="form-control" ref="path" defaultValue={this.container != null ? this.container.path : ''} />
                        </div>
                        <div class="form-group">
                            <label>{i18next.t('max-file-size')} (Mb)</label>
                            <input type="number" class="form-control" min="0" ref="maxFileSize" defaultValue={this.container != null ? this.container.maxFileSize / 1000000 : ''} />
                        </div>
                        <div class="form-group">
                            <label>{i18next.t('disallowed-mime-types')}</label>
                            <input type="text" class="form-control" ref="disallowedMimeTypes" defaultValue={this.container != null ? this.container.disallowedMimeTypes : ''} />
                        </div>
                        <div class="form-group">
                            <label>{i18next.t('allowed-mime-types')}</label>
                            <input type="text" class="form-control" ref="allowedMimeTypes" defaultValue={this.container != null ? this.container.allowedMimeTypes : ''} />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <p className="errorMessage" ref="errorMessage"></p>
                        {this.container != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                        {this.container == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                        {this.container != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default DocumentContainers;
