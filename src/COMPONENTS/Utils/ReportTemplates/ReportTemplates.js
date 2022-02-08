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

import { TextField } from "@material-ui/core";



class ReportTemplates extends Component {
    constructor({ getReportTemplates, updateReportTemplate }) {
        super();

        this.getReportTemplates = getReportTemplates;
        this.updateReportTemplate = updateReportTemplate;

        this.list = [];

        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
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
                updateReportTemplate={this.updateReportTemplate}
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

        this.update = this.update.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    update() {
        this.updateReportTemplate({ key: this.template.key, html: this.html.current.value });
        this.handleClose();
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
        return <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'md'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('report-template')}
            </this.DialogTitle>
            <DialogContent>
                <TextField label='HTML' variant="outlined" fullWidth size="small" defaultValue={this.template.html} inputRef={this.html}
                    multiline maxRows={25} minRows={10} />
            </DialogContent>
            <DialogActions>
                <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button>
            </DialogActions>
        </Dialog>
    }
}

export default ReportTemplates;
