import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

class Incoterms extends Component {
    constructor({ getIncoterms, addIncoterms, updateIncoterms, deleteIncoterms }) {
        super();

        this.getIncoterms = getIncoterms;
        this.addIncoterms = addIncoterms;
        this.updateIncoterms = updateIncoterms;
        this.deleteIncoterms = deleteIncoterms;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.getIncoterms().then((series) => {
            this.list = series;
            this.forceUpdate();
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderIncotermsModal'));
        ReactDOM.render(
            <IncotermModal
                addIncoterms={this.addIncoterms}
            />,
            document.getElementById('renderIncotermsModal'));
    }

    edit(incoterm) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderIncotermsModal'));
        ReactDOM.render(
            <IncotermModal
                incoterm={incoterm}
                updateIncoterms={this.updateIncoterms}
                deleteIncoterms={this.deleteIncoterms}
            />,
            document.getElementById('renderIncotermsModal'));
    }

    render() {
        return <div id="tabIncoterms">
            <div id="renderIncotermsModal"></div>
            <h1>Incoterms</h1>
            <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add')}</button>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'id', headerName: '#', width: 90 },
                    { field: 'key', headerName: i18next.t('key'), width: 300 },
                    { field: 'name', headerName: i18next.t('name'), flex: 1 },
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

class IncotermModal extends Component {
    constructor({ incoterm, addIncoterms, updateIncoterms, deleteIncoterms }) {
        super();

        this.incoterm = incoterm;
        this.addIncoterms = addIncoterms;
        this.updateIncoterms = updateIncoterms;
        this.deleteIncoterms = deleteIncoterms;

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        window.$('#incotermsModal').modal({ show: true });
    }

    getIncotermFromForm() {
        const incoterm = {};
        incoterm.key = this.refs.key.value;
        incoterm.name = this.refs.name.value;
        return incoterm;
    }

    isValid(incoterm) {
        this.refs.errorMessage.innerText = "";
        if (incoterm.name.length === 0) {
            this.refs.errorMessage.innerText = i18next.t('name-0');
            return false;
        }
        if (incoterm.name.length > 75) {
            this.refs.errorMessage.innerText = i18next.t('name-75');
            return false;
        }
        if (incoterm.key.length === 0) {
            this.refs.errorMessage.innerText = i18next.t('key-0');
            return false;
        }
        if (incoterm.key.length > 3) {
            this.refs.errorMessage.innerText = i18next.t('key-3');
            return false;
        }
        return true;
    }

    add() {
        const incoterm = this.getIncotermFromForm();
        if (!this.isValid(incoterm)) {
            return;
        }

        this.addIncoterms(incoterm).then((ok) => {
            if (ok) {
                window.$('#incotermsModal').modal('hide');
            }
        });
    }

    update() {
        const incoterm = this.getIncotermFromForm();
        if (!this.isValid(incoterm)) {
            return;
        }
        incoterm.id = this.incoterm.id;

        this.updateIncoterms(incoterm).then((ok) => {
            if (ok) {
                window.$('#incotermsModal').modal('hide');
            }
        });
    }

    delete() {
        this.deleteIncoterms(this.incoterm.id).then((ok) => {
            if (ok) {
                window.$('#incotermsModal').modal('hide');
            }
        });
    }

    render() {
        return <div class="modal fade" id="incotermsModal" tabindex="-1" role="dialog" aria-labelledby="incotermsModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="incotermsModalLabel">Incoterm</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-row">
                            <div class="col">
                                <label>{i18next.t('key')}</label>
                                <input type="text" class="form-control" ref="key" defaultValue={this.incoterm != null ? this.incoterm.key : ''} />
                            </div>
                            <div class="col">
                                <label>{i18next.t('name')}</label>
                                <input type="text" class="form-control" ref="name" defaultValue={this.incoterm != null ? this.incoterm.name : ''} />
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <p className="errorMessage" ref="errorMessage"></p>
                        {this.incoterm != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                        {this.incoterm == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                        {this.incoterm != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default Incoterms;
