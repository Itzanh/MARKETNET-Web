import React, { Component } from "react";
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
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});



class WindowRequestData extends Component {
    constructor({ modalTitle, modalText, dataType, min, max, defaultValue, onDataInput }) {
        super();

        this.open = true;

        this.modalTitle = modalTitle;
        this.modalText = modalText;
        this.dataType = dataType;
        this.min = min;
        this.max = max;
        this.defaultValue = defaultValue;

        this.value = this.defaultValue;

        this.onDataInput = onDataInput;

        this.handleClose = this.handleClose.bind(this);
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

    PaperComponent(props) {
        return (
            <Draggable handle="#draggable-dialog-title" cancel={'[class*="DialogContent-root"]'}>
                <Paper {...props} />
            </Draggable>
        );
    }

    render() {
        return <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'sm'}
            PaperComponent={this.PaperComponent} TransitionComponent={Transition}>
            <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {this.modalTitle}
            </this.DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="data"
                    label={this.modalText}
                    type={this.dataType}
                    fullWidth
                    variant="standard"
                    defaultValue={this.defaultValue}
                    InputProps={{ inputProps: { min: this.min, max: this.max } }}
                    onChange={(e) => {
                        this.value = e.target.value;
                    }}
                />
            </DialogContent>
            <DialogActions>
                <button type="button" class="btn btn-primary" onClick={() => {
                    this.onDataInput(this.value);
                    this.handleClose();
                }}>OK</button>
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
            </DialogActions>
        </Dialog>
    }
}



export default WindowRequestData;
