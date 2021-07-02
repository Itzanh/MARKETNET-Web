import { Component } from "react";
import ReactDOM from 'react-dom';

class Incoterms extends Component {
    constructor({ getIncoterms, addIncoterms, updateIncoterms, deleteIncoterms }) {
        super();

        this.getIncoterms = getIncoterms;
        this.addIncoterms = addIncoterms;
        this.updateIncoterms = updateIncoterms;
        this.deleteIncoterms = deleteIncoterms;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.getIncoterms().then((series) => {
            ReactDOM.render(series.map((element, i) => {
                return <Incoterm key={i}
                    incoterm={element}
                    edit={this.edit}
                />
            }), this.refs.render);
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
            <div className="menu">
                <h1>Incoterms</h1>
                <button type="button" class="btn btn-primary" onClick={this.add}>Add</button>
            </div>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Key</th>
                        <th scope="col">Name</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class Incoterm extends Component {
    constructor({ incoterm, edit }) {
        super();

        this.incoterm = incoterm;
        this.edit = edit;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.incoterm);
        }}>
            <th scope="row">{this.incoterm.id}</th>
            <td>{this.incoterm.key}</td>
            <td>{this.incoterm.name}</td>
        </tr>
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
            this.refs.errorMessage.innerText = "The name can't be empty.";
            return false;
        }
        if (incoterm.name.length > 75) {
            this.refs.errorMessage.innerText = "The name can't be longer than 75 characters.";
            return false;
        }
        if (incoterm.key.length === 0) {
            this.refs.errorMessage.innerText = "The key can't be empty.";
            return false;
        }
        if (incoterm.key.length > 3) {
            this.refs.errorMessage.innerText = "The key can't be longer than 3 characters.";
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
                        <h5 class="modal-title" id="incotermsModalLabel">Incoterms</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-row">
                            <div class="col">
                                <label>Key</label>
                                <input type="text" class="form-control" ref="key" defaultValue={this.incoterm != null ? this.incoterm.key : ''} />
                            </div>
                            <div class="col">
                                <label>Name</label>
                                <input type="text" class="form-control" ref="name" defaultValue={this.incoterm != null ? this.incoterm.name : ''} />
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <p className="errorMessage" ref="errorMessage"></p>
                        {this.incoterm != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>Delete</button> : null}
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        {this.incoterm == null ? <button type="button" class="btn btn-primary" onClick={this.add}>Add</button> : null}
                        {this.incoterm != null ? <button type="button" class="btn btn-success" onClick={this.update}>Update</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default Incoterms;
