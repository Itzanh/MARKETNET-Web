import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';


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

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.getJournals().then((journals) => {
            this.renderJournals(journals);
        });
    }

    renderJournals(journals) {
        this.list = journals;
        this.forceUpdate();
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
            <h4 className="ml-2">{i18next.t('journals')}</h4>
            <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add')}</button>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'id', headerName: '#', width: 90 },
                    { field: 'name', headerName: i18next.t('name'), flex: 1 },
                    {
                        field: 'type', headerName: i18next.t('type'), width: 300, valueGetter: (params) => {
                            return i18next.t(journalType[params.row.type])
                        }
                    }
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

class JournalModal extends Component {
    constructor({ journal, addJournal, updateJournal, deleteJournal }) {
        super();

        this.journal = journal;
        this.addJournal = addJournal;
        this.updateJournal = updateJournal;
        this.deleteJournal = deleteJournal;
        this.open = true;

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
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
                this.handleClose();
            }
        });
    }

    update() {
        const journal = this.getJournalFromForm();

        this.updateJournal(journal).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    delete() {
        this.deleteJournal(this.journal.id).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    styles = (theme) => ({
        root: {
            margin: 0,
            padding: theme.spacing(2),
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
    });

    DialogTitle = withStyles(this.styles)((props) => {
        const { children, classes, onClose, ...other } = props;
        return (
            <DialogTitle disableTypography className={classes.root} {...other}>
                <Typography variant="h6">{children}</Typography>
                <IconButton aria-label="close" className={classes.closeButton} onClick={this.handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
        );
    });

    PaperComponent(props) {
        return (
            <Draggable handle="#draggable-dialog-title" cancel={'[class*="DialogContent-root"]'}>
                <Paper {...props} />
            </Draggable>
        );
    }

    render() {
        return <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'sm'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('journal')}
            </this.DialogTitle>
            <DialogContent>
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
            </DialogContent>
            <DialogActions>
                {this.journal != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                {this.journal == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                {this.journal != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
            </DialogActions>
        </Dialog>
    }
}

export default Journals;
