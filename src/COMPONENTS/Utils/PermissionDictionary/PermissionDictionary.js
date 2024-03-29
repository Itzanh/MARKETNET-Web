/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import { Component } from "react";
import i18next from 'i18next';
import { DataGrid } from "@material-ui/data-grid";
import ReactDOM from 'react-dom';

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

import { TextField } from "@material-ui/core";



class PermissionDictionary extends Component {
    constructor({ getPermissionDictionary, getGroupsPermissionDictionary }) {
        super();

        this.getPermissionDictionary = getPermissionDictionary;
        this.getGroupsPermissionDictionary = getGroupsPermissionDictionary;

        this.list = [];

        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.getPermissionDictionary().then((permissions) => {
            for (let i = 0; i < permissions.length; i++) {
                permissions[i].id = i;
            }
            this.list = permissions;
            this.forceUpdate();
        });
    }

    edit(permission) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderPermissionDictionaryModal'));
        ReactDOM.render(
            <PermissionDictionaryGroupsModal
                permission={permission}
                getGroupsPermissionDictionary={this.getGroupsPermissionDictionary}
            />,
            document.getElementById('renderPermissionDictionaryModal'));
    }

    render() {
        return <div id="tabPermissionDictionary">
            <div id="renderPermissionDictionaryModal"></div>
            <h4 className="ml-2 mb-2">{i18next.t('permission-dictionary')}</h4>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'key', headerName: i18next.t('key'), width: 350 },
                    { field: 'description', headerName: i18next.t('description'), flex: 1 },
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

class PermissionDictionaryGroupsModal extends Component {
    constructor({ permission, getGroupsPermissionDictionary }) {
        super();

        this.permission = permission;
        this.getGroupsPermissionDictionary = getGroupsPermissionDictionary;

        this.open = true;
        this.list = [];

        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        this.getGroupsPermissionDictionary(this.permission.key).then((groups) => {
            this.list = groups;
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
                {i18next.t('permission')}
            </this.DialogTitle>
            <DialogContent>
                <TextField label={i18next.t('key')} variant="outlined" fullWidth size="small" inputRef={this.name}
                    defaultValue={this.permission.key} InputProps={{ readOnly: true }} />
                <br />
                <br />
                <TextField label={i18next.t('description')} variant="outlined" fullWidth size="small" defaultValue={this.permission.description}
                    multiline maxRows={10} minRows={5} InputProps={{ readOnly: true }} />
                <br />
                <br />
                <DataGrid
                    ref="table"
                    autoHeight
                    rows={this.list}
                    columns={[
                        { field: 'name', headerName: i18next.t('name'), flex: 1 }
                    ]}
                />
            </DialogContent>
            <DialogActions>
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
            </DialogActions>
        </Dialog>
    }
}



export default PermissionDictionary;
