import { Component } from "react";
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



class LocateHSCodes extends Component {
    constructor({ getHSCodes, onSelect }) {
        super();

        this.getHSCodes = getHSCodes;
        this.onSelect = onSelect;
        this.open = true;
        this.list = [];

        this.search = this.search.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.search();
            this.refs.name.focus();
        }, 50);
    }

    async search() {
        this.list = await this.getHSCodes({
            id: this.refs.id.value,
            name: this.refs.name.value
        });

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
                <Dialog onClose={this.handleClose} aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'lg'} PaperComponent={this.PaperComponent}>
                    <this.DialogTitle onClose={this.handleClose} style={{ cursor: 'move' }} id="draggable-dialog-title">
                        Locate HS Code
                    </this.DialogTitle>
                    <this.DialogContent>
                        <div class="form-row mb-2">
                            <div class="col" style={{ 'max-width': '25%' }}>
                                <label>ID</label>
                                <input type="text" class="form-control" ref="id" placeholder="ID" onChange={this.search} autofocus />
                            </div>
                            <div class="col">
                                <label>{i18next.t('name')}</label>
                                <input type="text" class="form-control" ref="name" placeholder={i18next.t('name')} onChange={this.search} autofocus />
                            </div>
                        </div>
                        <div className="tableOverflowContainer">
                            <DataGrid
                                rows={this.list}
                                columns={[
                                    { field: 'id', headerName: '#', width: 90 },
                                    { field: 'name', headerName: i18next.t('name'), flex: 1 },
                                ]}
                                onRowClick={(data) => {
                                    this.handleClose();
                                    this.onSelect(data.row);
                                }}
                            />
                        </div>
                    </this.DialogContent>
                    <this.DialogActions>
                        <Button autoFocus onClick={() => {
                            this.onSelect({ id: null, name: "" });
                            this.handleClose();
                        }} color="primary">
                            Cancel
                    </Button>
                    </this.DialogActions>
                </Dialog>
            </div>
        );
    }
}



export default LocateHSCodes;
