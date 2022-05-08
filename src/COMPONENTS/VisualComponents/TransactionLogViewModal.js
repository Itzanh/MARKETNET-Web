import { Component } from "react";
import ReactDOM from 'react-dom';
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

const transactionLogMode = {
    "I": "insert",
    "U": "update",
    "D": "delete"
}



class TransactionLogViewModal extends Component {
    constructor({ getRegisterTransactionalLogs, tableName, registerId }) {
        super();

        this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;
        this.tableName = tableName;
        this.registerId = registerId;

        this.open = true;

        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        this.getRegisterTransactionalLogs(this.tableName, this.registerId).then((logs) => {
            ReactDOM.render(
                logs.map((element, i) => {
                    const register = JSON.parse(element.register);
                    element.register = register;

                    const keys = Object.keys(register).filter((key) => {
                        if (i == 0) {
                            return true;
                        } else {
                            return logs[i - 1].register[key] != register[key];
                        }
                    });

                    if (keys.length > 0) {
                        return <div key={i}>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">{i18next.t(transactionLogMode[element.mode])}</th>
                                        <th scope="col">{window.dateFormat(element.dateCreated)}</th>
                                        <th scope="col">{element.user != null ? element.user.username : i18next.t('automatic-user')}</th>
                                    </tr>
                                </thead>
                            </table>

                            <table class="table table-dark">
                                <tbody>
                                    {keys.map((key) => {
                                        return <tr>
                                            <td>{key}</td>
                                            <td>{register[key]}</td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                        </div>
                    }
                }).reverse()
                , this.refs.container);
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
        return <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'md'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('transactional-log')}
            </this.DialogTitle>
            <DialogContent>
                <div ref="container">

                </div>
            </DialogContent>
            <DialogActions>
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
            </DialogActions>
        </Dialog>
    }
}

export default TransactionLogViewModal;
