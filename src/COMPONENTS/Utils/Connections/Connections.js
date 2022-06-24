/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

import { Button } from "@material-ui/core";
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



class Connections extends Component {
    constructor({ getConnections, disconnectConnection }) {
        super();

        this.getConnections = getConnections;
        this.disconnectConnection = disconnectConnection;

        this.list = [];
        this.open = true;

        this.renderConnections = this.renderConnections.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        this.renderConnections();
    }

    renderConnections() {
        this.getConnections().then((connections) => {
            this.list = connections;
            this.forceUpdate();
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
        return <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'lg'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('connections')}
            </this.DialogTitle>
            <DialogContent>
                <DataGrid
                    ref="table"
                    autoHeight
                    rows={this.list}
                    columns={[
                        { field: 'id', headerName: 'UUID', width: 350 },
                        { field: 'address', headerName: i18next.t('address'), width: 150 },
                        { field: 'user', headerName: i18next.t('user'), flex: 1 },
                        {
                            field: 'dateConnected', headerName: i18next.t('date-connected'), width: 200, valueGetter: (params) => {
                                return window.dateFormat(params.row.dateConnected)
                            }
                        },
                        {
                            field: "", width: 130, renderCell: (params) => (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    style={{ marginLeft: 16 }}
                                    onClick={() => {
                                        this.disconnectConnection(params.row.id).then((ok) => {
                                            if (ok) {
                                                this.renderConnections();
                                            }
                                        })
                                    }}
                                >
                                    {i18next.t('disconnect')}
                                </Button>
                            ),
                        }
                    ]}
                />
            </DialogContent>
            <DialogActions>
                <button type="button" class="btn btn-primary" onClick={this.renderConnections}>{i18next.t('refresh')}</button>
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
            </DialogActions>
        </Dialog>
    }
}

export default Connections;
