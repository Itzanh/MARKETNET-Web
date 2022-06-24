/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

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
                <p>{i18next.t('official-website')}: <a href="https://www.marketneterp.io/">https://www.marketneterp.io/</a></p>
                <h5>{i18next.t('repositories')}:</h5>
                <a href="https://gitlab.com/itzanh/marketnet-server">MARKETNET Server</a>
                <br />
                <a href="https://gitlab.com/itzanh/marketnet-web">MARKETNET Web</a>
                <br />
                <br />
                <h5>{i18next.t('license')}</h5>
                <p>{i18next.t('this-software-is-distributed-under-AGPL-license')} <a href="https://spdx.org/licenses/AGPL-3.0-only.html">GNU AGPL v3.0-only</a></p>
                <br />
                <h5>{i18next.t('attributions')}</h5>
                <p>{i18next.t('loading-io-attribution')} <a href="https://loading.io/icon/">loading.io</a>.</p>
            </DialogContent>
            <DialogActions>
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
            </DialogActions>
        </Dialog>
    }
}

export default About;
