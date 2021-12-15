import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';



class LocateAddress extends Component {
    constructor({ locateAddress, handleSelect }) {
        super();

        this.locateAddress = locateAddress;
        this.handleSelect = handleSelect;

        this.open = true;

        this.select = this.select.bind(this);
        this.handleClose = this.handleClose.bind(this);
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

    componentDidMount() {
        this.locateAddress().then((addresses) => {
            ReactDOM.render(addresses.map((element, i) => {
                return <LocateAddresAddr key={i}
                    address={element}
                    select={this.select}
                />
            }), this.refs.render);
        });
    }

    select(address) {
        this.handleClose();
        this.handleSelect(address.id, address.address);
    }

    render() {
        return <Dialog onClose={this.handleClose} aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitle onClose={this.handleClose} style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('locate-address')}
            </this.DialogTitle>
            <this.DialogContent>
                <table class="table table-dark">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">{i18next.t('address')}</th>
                        </tr>
                    </thead>
                    <tbody ref="render"></tbody>
                </table>
            </this.DialogContent>
        </Dialog>
    }
}

class LocateAddresAddr extends Component {
    constructor({ address, select }) {
        super();

        this.address = address;
        this.select = select;
    }

    render() {
        return <tr onClick={() => {
            this.select(this.address);
        }}>
            <th scope="row">{this.address.id}</th>
            <td>{this.address.address}</td>
        </tr>
    }
}

export default LocateAddress;
