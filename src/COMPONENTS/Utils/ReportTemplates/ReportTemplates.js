/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import React, { Component } from "react";
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
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { TextField } from "@material-ui/core";
import BundledEditor from "../../../BundledEditor";

import tinymce from 'tinymce/tinymce';



class ReportTemplates extends Component {
    constructor({ getReportTemplates, updateReportTemplate }) {
        super();

        this.getReportTemplates = getReportTemplates;
        this.updateReportTemplate = updateReportTemplate;

        this.list = [];

        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderReportTemplates();
    }

    renderReportTemplates() {
        this.getReportTemplates().then((templates) => {
            this.list = templates;
            for (let i = 0; i < this.list.length; i++) {
                this.list[i].id = this.list[i].key;
            }
            this.forceUpdate();
        });
    }

    edit(template) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderModal'));
        ReactDOM.render(
            <ReportTemplate
                template={template}
                updateReportTemplate={(template) => {
                    const promise = this.updateReportTemplate(template);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderReportTemplates();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderModal'));
    }

    render() {
        return <div id="tabReportTemplate" className="formRowRoot">
            <div id="renderModal"></div>
            <h4 className="ml-2 mb-2">{i18next.t('report-templates')}</h4>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'key', headerName: i18next.t('key'), flex: 1 },
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

class ReportTemplate extends Component {
    constructor({ template, updateReportTemplate }) {
        super();

        this.template = template;
        this.updateReportTemplate = updateReportTemplate;

        this.open = true;

        this.html = React.createRef();
        this.editorRef = React.createRef();
        this.tab = 0;

        this.update = this.update.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
    }

    update() {
        if (this.tab === 0) {
            this.template.html = this.html.current.value;
        } else if (this.tab === 1) {
            this.template.html = tinymce.get("tinymce_editor").getContent();
        }
        this.updateReportTemplate({ key: this.template.key, html: this.template.html });
        this.handleClose();
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    handleTabChange(_, tab) {
        if (tab === 0 && this.tab === 1) {
            this.template.html = tinymce.get("tinymce_editor").getContent();
        } else if (tab === 1 && this.tab === 0) {
            this.template.html = this.html.current.value;
        }

        this.tab = tab;
        this.forceUpdate();

        if (tab === 1 && this.tab === 0) {
            tinymce.get("tinymce_editor").setContent(this.template.html);
        }
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
        var useDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

        return <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'md'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('report-template')}
            </this.DialogTitle>
            <DialogContent>
                <AppBar position="static" style={{ 'backgroundColor': '#1976d2' }}>
                    <Tabs value={this.tab} onChange={this.handleTabChange}>
                        <Tab label={i18next.t('Code')} />
                        <Tab label={i18next.t('Editor')} />
                    </Tabs>
                </AppBar>
                {this.tab === 0 ? <div>
                    <br />
                    <TextField label='HTML' variant="outlined" fullWidth size="small" defaultValue={this.template.html} inputRef={this.html}
                        multiline maxRows={25} minRows={10} />
                </div> : null}
                {this.tab === 1 ? <div>
                    <BundledEditor
                        id="tinymce_editor"
                        onInit={(evt, editor) => this.editorRef.current = editor}
                        initialValue={this.template.html}
                        init={{
                            height: 500,
                            plugins: 'print preview powerpaste casechange importcss searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker imagetools textpattern noneditable help formatpainter permanentpen pageembed charmap tinycomments mentions quickbars linkchecker emoticons advtable export',
                            mobile: {
                                plugins: 'print preview powerpaste casechange importcss searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker textpattern noneditable help formatpainter pageembed charmap mentions quickbars linkchecker emoticons advtable'
                            },
                            menu: {
                                tc: {
                                    title: 'Comments',
                                    items: 'addcomment showcomments deleteallconversations'
                                }
                            },
                            menubar: 'file edit view insert format tools table tc help',
                            toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile link image pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment',
                            autosave_ask_before_unload: true,
                            autosave_interval: '30s',
                            autosave_prefix: '{path}{query}-{id}-',
                            autosave_restore_when_empty: false,
                            autosave_retention: '2m',
                            importcss_append: true,
                            templates: [
                                { title: 'New Table', description: 'creates a new table', content: '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>' },
                                { title: 'Starting my story', description: 'A cure for writers block', content: 'Once upon a time...' },
                                { title: 'New list with dates', description: 'New List with dates', content: '<div class="mceTmpl"><span class="cdate">cdate</span><br /><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>' }
                            ],
                            template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
                            template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
                            height: 600,
                            quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
                            noneditable_noneditable_class: 'mceNonEditable',
                            toolbar_mode: 'sliding',
                            spellchecker_ignore_list: ['Ephox', 'Moxiecode'],
                            tinycomments_mode: 'embedded',
                            content_style: '.mymention{ color: gray; }',
                            contextmenu: 'link image imagetools table configurepermanentpen',
                            a11y_advanced_options: true,
                            skin: useDarkMode ? 'oxide-dark' : 'oxide',
                            content_css: useDarkMode ? 'dark' : 'default'
                        }}
                    />
                </div> : null}
            </DialogContent>
            <DialogActions>
                <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button>
            </DialogActions>
        </Dialog>
    }
};



export default ReportTemplates;
