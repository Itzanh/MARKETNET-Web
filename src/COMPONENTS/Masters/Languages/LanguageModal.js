/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

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

import { TextField } from "@material-ui/core";



class LanguageModal extends Component {
    constructor({ language, addLanguages, updateLanguages, deleteLanguages }) {
        super();

        this.language = language;
        this.addLanguages = addLanguages;
        this.updateLanguages = updateLanguages;
        this.deleteLanguages = deleteLanguages;

        this.open = true;
        this.errorMessages = {};

        this.name = React.createRef();
        this.iso2 = React.createRef();
        this.iso3 = React.createRef();

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
        language.name = this.name.current.value;
        language.iso2 = this.iso2.current.value;
        language.iso3 = this.iso3.current.value;
        return language;
    }

    isValid(language) {
        this.errorMessages = {};
        if (language.name.length === 0) {
            this.errorMessages['name'] = i18next.t('name-0');
            this.forceUpdate();
            return false;
        }
        if (language.name.length > 50) {
            this.errorMessages['name'] = i18next.t('name-50');
            this.forceUpdate();
            return false;
        }
        if (language.iso2.length !== 2) {
            this.errorMessages['iso2'] = i18next.t('iso-2');
            this.forceUpdate();
            return false;
        }
        if (language.iso3.length !== 3) {
            this.errorMessages['iso3'] = i18next.t('iso-3');
            this.forceUpdate();
            return false;
        }
        this.forceUpdate();
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
                    <TextField label={i18next.t('name')} variant="outlined" fullWidth size="small" inputRef={this.name}
                        defaultValue={this.language != null ? this.language.name : ''} inputProps={{ maxLength: 50 }}
                        error={this.errorMessages['name']} helperText={this.errorMessages['name']} />
                </div>
                <div class="form-row">
                    <div class="col">
                        <TextField label='ISO 2' variant="outlined" fullWidth size="small" inputRef={this.iso2}
                            defaultValue={this.language != null ? this.language.iso2 : ''} inputProps={{ maxLength: 2 }}
                            error={this.errorMessages['iso2']} helperText={this.errorMessages['iso2']} />
                    </div>
                    <div class="col">
                        <TextField label='ISO 3' variant="outlined" fullWidth size="small" inputRef={this.iso3}
                            defaultValue={this.language != null ? this.language.iso3 : ''} inputProps={{ maxLength: 3 }}
                            error={this.errorMessages['iso3']} helperText={this.errorMessages['iso3']} />
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                {this.language != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                {this.language == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                {this.language != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
            </DialogActions>
        </Dialog>
    }
};



export default LanguageModal;
