import React, { Component } from 'react';
import i18next from 'i18next';

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



class LanguageModal extends Component {
    constructor({ language, addLanguages, updateLanguages, deleteLanguages }) {
        super();

        this.language = language;
        this.addLanguages = addLanguages;
        this.updateLanguages = updateLanguages;
        this.deleteLanguages = deleteLanguages;
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

    getLanguageFromForm() {
        const language = {}
        language.name = this.refs.name.value;
        language.iso2 = this.refs.iso2.value;
        language.iso3 = this.refs.iso3.value;
        return language;
    }

    isValid(language) {
        this.refs.errorMessage.innerText = "";
        if (language.name.length === 0) {
            this.refs.errorMessage.innerText = i18next.t('name-0');
            return false;
        }
        if (language.name.length > 50) {
            this.refs.errorMessage.innerText = i18next.t('name-50');
            return false;
        }
        if (language.iso2.length !== 2) {
            this.refs.errorMessage.innerText = i18next.t('iso-2');
            return false;
        }
        if (language.iso3.length !== 3) {
            this.refs.errorMessage.innerText = i18next.t('iso-3');
            return false;
        }
        return true;
    }


    add() {
        const language = this.getLanguageFromForm();
        if (!this.isValid(language)) {
            return;
        }

        this.addLanguages(language).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    update() {
        const language = this.getLanguageFromForm();
        if (!this.isValid(language)) {
            return;
        }
        language.id = this.language.id;

        this.updateLanguages(language).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    delete() {
        const languageId = this.language.id;
        this.deleteLanguages(languageId).then((ok) => {
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
                {i18next.t('language')}
            </this.DialogTitle>
            <DialogContent>
                <div class="form-group">
                    <label>{i18next.t('name')}</label>
                    <input type="text" class="form-control" ref="name" defaultValue={this.language != null ? this.language.name : ''} />
                </div>
                <div class="form-row">
                    <div class="col">
                        <label>ISO 2</label>
                        <input type="text" class="form-control" ref="iso2" defaultValue={this.language != null ? this.language.iso2 : ''} />
                    </div>
                    <div class="col">
                        <label>ISO 3</label>
                        <input type="text" class="form-control" ref="iso3" defaultValue={this.language != null ? this.language.iso3 : ''} />
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <p className="errorMessage" ref="errorMessage"></p>
                {this.language != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                {this.language == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                {this.language != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
            </DialogActions>
        </Dialog>
    }
}

export default LanguageModal;
