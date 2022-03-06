import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import { DataGrid } from '@material-ui/data-grid';
import i18next from 'i18next';



class LocateCustomer extends Component {
    constructor({ locateCustomers, onSelect }) {
        super();

        this.locateCustomers = locateCustomers;
        this.onSelect = onSelect;
        this.open = true;
        this.list = [];

        this.handleClose = this.handleClose.bind(this);
        this.search = this.search.bind(this);
    }

    componentDidMount() {
        this.search();
        setTimeout(() => {
            this.refs.txt.focus();
        }, 50);
    }

    async search() {
        if (this.refs.searchMode != null) {
            this.list = await this.locateCustomers({
                mode: parseInt(this.refs.searchMode.value),
                value: this.refs.txt.value
            });
        } else {
            this.list = await this.locateCustomers({
                mode: 0,
                value: ""
            });
        }

        this.forceUpdate();
    }

    PaperComponent(props) {
        return (
            <Draggable handle="#draggable-dialog-title" cancel={'[class*="DialogContent-root"]'}>
                <Paper {...props} />
            </Draggable>
        );
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
            <MuiDialogTitle disableTypography className={classes.root} {...other}>
                <Typography variant="h6">{children}</Typography>
                {onClose ? (
                    <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                ) : null}
            </MuiDialogTitle>
        );
    });

    DialogContent = withStyles((theme) => ({
        root: {
            padding: theme.spacing(2),
        },
    }))(MuiDialogContent);

    DialogActions = withStyles((theme) => ({
        root: {
            margin: 0,
            padding: theme.spacing(1),
        },
    }))(MuiDialogActions);

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    render() {
        return (
            <div>
                <Dialog onClose={this.handleClose} aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true}
                    maxWidth={'md'} PaperComponent={this.PaperComponent}>
                    <this.DialogTitle onClose={this.handleClose} style={{ cursor: 'move' }} id="draggable-dialog-title">
                        {i18next.t('locate-customer')}
                    </this.DialogTitle>
                    <this.DialogContent>
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <select class="form-control" ref="searchMode" onChange={this.search} defaultValue="1">
                                    <option value="0">ID</option>
                                    <option value="1">Name</option>
                                </select>
                            </div>
                            <input type="text" class="form-control" ref="txt" onChange={this.search} autofocus />
                        </div>
                        <div className="tableOverflowContainer">
                            <DataGrid
                                rows={this.list}
                                columns={[
                                    { field: 'id', headerName: '#', width: 90 },
                                    { field: 'name', headerName: i18next.t('name'), flex: 1 }
                                ]}
                                onRowClick={(data) => {
                                    this.handleClose();
                                    this.onSelect(data.row);
                                }}
                            />
                        </div>
                    </this.DialogContent>
                    <this.DialogActions>
                        <Button autoFocus onClick={this.handleClose} color="primary">
                            {i18next.t('cancel')}
                        </Button>
                    </this.DialogActions>
                </Dialog>
            </div>
        );
    }
}



export default LocateCustomer;
