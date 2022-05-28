import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { DataGrid } from '@material-ui/data-grid';
import i18next from "i18next";

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

import { TextField, FormControl, NativeSelect } from "@material-ui/core";
import { InputLabel } from "@mui/material";



class ReportTemplateTranslation extends Component {
    constructor({ getReportTemplateTranslations, insertReportTemplateTranslation, updateReportTemplateTranslation, deleteReportTemplateTranslation }) {
        super();

        this.getReportTemplateTranslations = getReportTemplateTranslations;
        this.insertReportTemplateTranslation = insertReportTemplateTranslation;
        this.updateReportTemplateTranslation = updateReportTemplateTranslation;
        this.deleteReportTemplateTranslation = deleteReportTemplateTranslation;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderTranslations();
    }

    renderTranslations() {
        this.getReportTemplateTranslations().then((translations) => {
            for (let i = 0; i < translations.length; i++) {
                translations[i].id = i;
            }
            this.list = translations;
            this.forceUpdate();
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderModal'));
        ReactDOM.render(
            <ReportTemplateTranslationModal
                insertReportTemplateTranslation={(template) => {
                    return new Promise((resolve) => {
                        this.insertReportTemplateTranslation(template).then((ok) => {
                            this.renderTranslations();
                            resolve(ok);
                        });
                    });
                }}
            />,
            document.getElementById('renderModal'));
    }

    edit(translation) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderModal'));
        ReactDOM.render(
            <ReportTemplateTranslationModal
                translation={translation}
                updateReportTemplateTranslation={(template) => {
                    return new Promise((resolve) => {
                        this.updateReportTemplateTranslation(template).then((ok) => {
                            this.renderTranslations();
                            resolve(ok);
                        });
                    });
                }}
                deleteReportTemplateTranslation={(template) => {
                    return new Promise((resolve) => {
                        this.deleteReportTemplateTranslation(template).then((ok) => {
                            this.renderTranslations();
                            resolve(ok);
                        });
                    });
                }}
            />,
            document.getElementById('renderModal'));
    }

    render() {
        return <div id="tabReportTemplateTranslation" className="formRowRoot">
            <div id="renderModal"></div>
            <h4 className="ml-2 mb-2">{i18next.t('report-template-translation')}</h4>
            <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add')}</button>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'key', headerName: i18next.t('key'), flex: 1 },
                    {
                        field: 'languageName', headerName: i18next.t('language'), width: 350, valueGetter: (params) => {
                            return params.row.language.name;
                        }
                    },
                    { field: 'translation', headerName: i18next.t('translation'), width: 600 },
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
};

class ReportTemplateTranslationModal extends Component {
    constructor({ translation, insertReportTemplateTranslation, updateReportTemplateTranslation, deleteReportTemplateTranslation }) {
        super();

        this.translation = translation;
        this.insertReportTemplateTranslation = insertReportTemplateTranslation;
        this.updateReportTemplateTranslation = updateReportTemplateTranslation;
        this.deleteReportTemplateTranslation = deleteReportTemplateTranslation;

        this.list = [];
        this.open = true;

        this.key = React.createRef();
        this.value = React.createRef();

        this.handleClose = this.handleClose.bind(this);
        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async componentDidMount() {
        await this.renderLanguages();
    }

    renderLanguages() {
        return new Promise((resolve) => {
            window.getLanguages().then((languages) => {
                var components = languages.map((element, i) => {
                    return <option value={element.id} key={i}>{element.name}</option>
                });
                ReactDOM.render(components, document.getElementById("lang"));

                if (this.translation != null) {
                    document.getElementById("lang").value = this.translation.languageId;
                }

                resolve();
            });
        });
    }

    getTranslationFromForm() {
        const translation = {};
        translation.key = this.key.current.value;
        translation.languageId = parseInt(document.getElementById("lang").value);
        translation.translation = this.value.current.value;
        return translation;
    }

    add() {
        const translation = this.getTranslationFromForm();

        this.insertReportTemplateTranslation(translation).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    update() {
        const translation = this.getTranslationFromForm();

        this.updateReportTemplateTranslation(translation).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    delete() {
        const translation = this.getTranslationFromForm();

        this.deleteReportTemplateTranslation(translation).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
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

    DialogTitleProduct = withStyles(this.styles)((props) => {
        const { children, classes, onClose, ...other } = props;
        return (
            <DialogTitle disableTypography className={classes.root} {...other}>
                <Typography variant="h6">{children}</Typography>
                <IconButton aria-label="close" className={classes.closeButton} onClick={() => {
                    ReactDOM.unmountComponentAtNode(this.refs.render);
                }}>
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
        return (<div>
            <div ref="render"></div>
            <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'md'}
                PaperComponent={this.PaperComponent}>
                <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    {i18next.t('translation')}
                </this.DialogTitle>
                <DialogContent>
                    <div class="form-row">
                        <div class="col">
                            <TextField label={i18next.t('key')} variant="outlined" fullWidth size="small" inputRef={this.key}
                                defaultValue={this.translation != null ? this.translation.key : ""} InputProps={{ readOnly: this.translation != null }}
                                inputProps={{ maxLength: 50 }}/>
                        </div>
                        <div class="col">
                            <FormControl fullWidth>
                                <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('language')}</InputLabel>
                                <NativeSelect
                                    style={{ 'marginTop': '0' }}
                                    id="lang"
                                    disabled={this.translation != null}>

                                </NativeSelect>
                            </FormControl>
                        </div>
                    </div>
                    <br />
                    <TextField label={i18next.t('value')} variant="outlined" fullWidth size="small" inputRef={this.value}
                        defaultValue={this.translation != null ? this.translation.translation : ""} inputProps={{ maxLength: 255 }} />
                </DialogContent>
                <DialogActions>
                    {this.translation != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                    {this.translation != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
                    <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                    {this.translation == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                </DialogActions>
            </Dialog>
        </div>);
    }
};



export default ReportTemplateTranslation;
