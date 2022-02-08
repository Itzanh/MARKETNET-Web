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

import splashScreen from './../../../IMG/splash_screen.svg';
import "./../../../CSS/about.css"



class About extends Component {
    constructor({ }) {
        super();

        this.open = true;

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

    DialogTitleProduct = withStyles(this.styles)((props) => {
        const { children, classes, onClose, ...other } = props;
        return (
            <DialogTitle disableTypography className={classes.root} {...other}>
                <Typography variant="h6">{children}</Typography>
                <IconButton aria-label="close" className={classes.closeButton} onClick={() => {
                    this.handleClose();
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
                {i18next.t('about')}
            </this.DialogTitle>
            <DialogContent id="aboutModal">
                <div className="splashScreen">
                    <img src={splashScreen} alt="MARKETNET" />
                </div>
                <br />
                <h4>MARKETNET</h4>
                <p>{i18next.t('about-1')}</p>
                <br />
                <p>{i18next.t('about-2')}</p>
                <br />
                <p>{i18next.t('official-website')}: <a href="https://www.marketnet.io/">marketnet.io</a></p>
                <p>{i18next.t('repositories')}:</p>
                <a href="https://github.com/Itzanh/MARKETNET-Server">MARKETNET Server</a>
                <br />
                <a href="https://github.com/Itzanh/MARKETNET-Web">MARKETNET Web</a>
                <br />
                <p>{i18next.t('this-software-is-distributed-under-AGPL-license')} <a href="https://spdx.org/licenses/AGPL-3.0-or-later.html">AGPL</a></p>
            </DialogContent>
            <DialogActions>
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
            </DialogActions>
        </Dialog>
    }
}

export default About;
