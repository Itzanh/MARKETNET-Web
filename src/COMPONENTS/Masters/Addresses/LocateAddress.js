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

        this.list = [];
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
            this.list = addresses;
            this.forceUpdate();
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
                <DataGrid
                    ref="table"
                    autoHeight
                    rows={this.list}
                    columns={[
                        { field: 'address', headerName: i18next.t('address'), flex: 1 },
                    ]}
                    onRowClick={(data) => {
                        this.select(data.row);
                    }}
                />
            </this.DialogContent>
        </Dialog>
    }
}



export default LocateAddress;
