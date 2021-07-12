import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

const journalType = {
    "S": "sale",
    "P": "purchase",
    "B": "bank",
    "C": "cash",
    "G": "general"
}

class Journals extends Component {
    constructor({ getJournals, addJournal, updateJournal, deleteJournal }) {
        super();

        this.getJournals = getJournals;
        this.addJournal = addJournal;
        this.updateJournal = updateJournal;
        this.deleteJournal = deleteJournal;

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderJournals();
    }

    renderJournals() {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        this.getJournals().then((journals) => {
            ReactDOM.render(journals.map((element, i) => {
                return <Journal key={i}
                    journal={element}
                    edit={this.edit}
                />
            }), this.refs.render);
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderJournalModal'));
        ReactDOM.render(
            <JournalModal
                addJournal={(journal) => {
                    const promise = this.addJournal(journal);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderJournals();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderJournalModal'));
    }

    edit(journal) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderJournalModal'));
        ReactDOM.render(
            <JournalModal
                journal={journal}
                updateJournal={(journal) => {
                    const promise = this.updateJournal(journal);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderJournals();
                        }
                    });
                    return promise;
                }}
                deleteJournal={(journalId) => {
                    const promise = this.deleteJournal(journalId);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderJournals();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderJournalModal'));
    }

    render() {
        return <div id="tabJournals">
            <div id="renderJournalModal"></div>
            <div className="menu">
                <h1>{i18next.t('journals')}</h1>
                <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button>
            </div>
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">{i18next.t('name')}</th>
                        <th scope="col">{i18next.t('type')}</th>
                    </tr>
                </thead>
                <tbody ref="render"></tbody>
            </table>
        </div>
    }
}

class Journal extends Component {
    constructor({ journal, edit }) {
        super();

        this.journal = journal;
        this.edit = edit;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.journal);
        }}>
            <th scope="row">{this.journal.id}</th>
            <td>{this.journal.name}</td>
            <td>{i18next.t(journalType[this.journal.type])}</td>
        </tr>
    }
}

class JournalModal extends Component {
    constructor({ journal, addJournal, updateJournal, deleteJournal }) {
        super();

        this.journal = journal;
        this.addJournal = addJournal;
        this.updateJournal = updateJournal;
        this.deleteJournal = deleteJournal;

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        window.$('#journalModal').modal({ show: true });
    }

    getJournalFromForm() {
        const journal = {};
        journal.id = parseInt(this.refs.id.value);
        journal.name = this.refs.name.value;
        journal.type = this.refs.type.value;
        return journal;
    }

    add() {
        const journal = this.getJournalFromForm();

        this.addJournal(journal).then((ok) => {
            if (ok) {
                window.$('#journalModal').modal('hide');
            }
        });
    }

    update() {
        const journal = this.getJournalFromForm();

        this.updateJournal(journal).then((ok) => {
            if (ok) {
                window.$('#journalModal').modal('hide');
            }
        });
    }

    delete() {
        this.deleteJournal(this.journal.id).then((ok) => {
            if (ok) {
                window.$('#journalModal').modal('hide');
            }
        });
    }

    render() {
        return <div class="modal fade" id="journalModal" tabindex="-1" role="dialog" aria-labelledby="journalModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="journalModalLabel">{i18next.t('journal')}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>ID</label>
                            <input type="number" class="form-control" ref="id" defaultValue={this.journal != null ? this.journal.id : '0'}
                                readOnly={this.journal != null} />
                        </div>
                        <div class="form-group">
                            <label>{i18next.t('name')}</label>
                            <input type="text" class="form-control" ref="name" defaultValue={this.journal != null ? this.journal.name : ''} />
                        </div>
                        <div class="form-group">
                            <label>{i18next.t('type')}</label>
                            <select class="form-control" ref="type" defaultValue={this.journal != null ? this.journal.type : 'G'}>
                                <option value="S">{i18next.t('sale')}</option>
                                <option value="P">{i18next.t('purchase')}</option>
                                <option value="B">{i18next.t('bank')}</option>
                                <option value="C">{i18next.t('cash')}</option>
                                <option value="G">{i18next.t('general')}</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        {this.journal != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                        {this.journal == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                        {this.journal != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default Journals;
