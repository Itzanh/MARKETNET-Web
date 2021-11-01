import { Component } from "react";
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



class ColorsModal extends Component {
    constructor({ color, addColor, updateColor, deleteColor }) {
        super();

        this.color = color;

        this.addColor = addColor;
        this.updateColor = updateColor;
        this.deleteColor = deleteColor;
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

    getColorFromForm() {
        const color = {}
        color.name = this.refs.name.value;
        color.hexColor = this.refs.hexColor.value;
        return color;
    }

    isValid(color) {
        this.refs.errorMessage.innerText = "";
        if (color.name.length === 0) {
            this.refs.errorMessage.innerText = i18next.t('name-0');
            return false;
        }
        if (color.name.length > 50) {
            this.refs.errorMessage.innerText = i18next.t('name-50');
            return false;
        }
        if (color.hexColor.length > 6) {
            this.refs.errorMessage.innerText = i18next.t('color-6');
            return false;
        }
        return true;
    }

    add() {
        const color = this.getColorFromForm();
        if (!this.isValid(color)) {
            return;
        }

        this.addColor(color).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    update() {
        const color = this.getColorFromForm();
        color.id = this.color.id;
        if (!this.isValid(color)) {
            return;
        }

        this.updateColor(color).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    delete() {
        const colorId = this.color.id;
        this.deleteColor(colorId).then((ok) => {
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
                {i18next.t('color')}
            </this.DialogTitle>
            <DialogContent>
                <div class="form-group">
                    <label>{i18next.t('name')}</label>
                    <input type="text" class="form-control" ref="name" defaultValue={this.color != null ? this.color.name : ''} />
                </div>
                <div class="form-group">
                    <label>{i18next.t('hex-color')}</label>
                    <input type="text" class="form-control" ref="hexColor" defaultValue={this.color != null ? this.color.hexColor : ''} />
                </div>
            </DialogContent>
            <DialogActions>
                <p className="errorMessage" ref="errorMessage"></p>
                {this.color != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                {this.color == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                {this.color != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
            </DialogActions>
        </Dialog>
    }
}

export default ColorsModal;
