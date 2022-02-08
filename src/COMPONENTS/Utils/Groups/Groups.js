import React, { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

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
import ConfirmDelete from "../../ConfirmDelete";

import { TextField } from "@material-ui/core";



class Groups extends Component {
    constructor({ getGroups, addGroup, updateGroup, deleteGroup, getGroupPermissionDictionary, insertPermissionDictionaryGroup,
        deletePermissionDictionaryGroup }) {
        super();

        this.getGroups = getGroups;
        this.addGroup = addGroup;
        this.updateGroup = updateGroup;
        this.deleteGroup = deleteGroup;
        this.getGroupPermissionDictionary = getGroupPermissionDictionary;
        this.insertPermissionDictionaryGroup = insertPermissionDictionaryGroup;
        this.deletePermissionDictionaryGroup = deletePermissionDictionaryGroup;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.getGroups().then((groups) => {
            this.list = groups;
            this.forceUpdate();
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderGroupsModal'));
        ReactDOM.render(
            <GroupModal
                addGroup={this.addGroup}
            />,
            document.getElementById('renderGroupsModal'));
    }

    edit(group) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderGroupsModal'));
        ReactDOM.render(
            <GroupModal
                group={group}
                updateGroup={this.updateGroup}
                deleteGroup={this.deleteGroup}
                getGroupPermissionDictionary={this.getGroupPermissionDictionary}
                insertPermissionDictionaryGroup={this.insertPermissionDictionaryGroup}
                deletePermissionDictionaryGroup={this.deletePermissionDictionaryGroup}
            />,
            document.getElementById('renderGroupsModal'));
    }

    render() {
        return <div id="tabGroups">
            <div id="renderGroupsModal"></div>
            <h4 className="ml-2">{i18next.t('groups')}</h4>
            <button type="button" class="btn btn-primary mb-2 ml-2" onClick={this.add}>{i18next.t('add')}</button>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'name', headerName: i18next.t('name'), flex: 1 }
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

class GroupModal extends Component {
    constructor({ group, addGroup, updateGroup, deleteGroup, getGroupPermissionDictionary, insertPermissionDictionaryGroup,
        deletePermissionDictionaryGroup }) {
        super();

        this.group = group;
        this.addGroup = addGroup;
        this.updateGroup = updateGroup;
        this.deleteGroup = deleteGroup;
        this.getGroupPermissionDictionary = getGroupPermissionDictionary;
        this.insertPermissionDictionaryGroup = insertPermissionDictionaryGroup;
        this.deletePermissionDictionaryGroup = deletePermissionDictionaryGroup;

        this.open = true;
        this.permissions = {
            in: [],
            out: [],
        };

        this.name = React.createRef();

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.addPermission = this.addPermission.bind(this);
    }

    componentDidMount() {
        this.renderPermissions();
    }

    renderPermissions() {
        if (this.group == null) {
            return;
        }

        this.getGroupPermissionDictionary(this.group.id).then((data) => {
            for (let i = 0; i < data.in.length; i++) {
                data.in[i].id = i;
            }
            for (let i = 0; i < data.out.length; i++) {
                data.out[i].id = i;
            }

            this.permissions = data;
            this.forceUpdate();
        });
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    getGroupFromForm() {
        const group = {}
        group.name = this.name.current.value;
        group.sales = this.refs.sales.checked;
        group.purchases = this.refs.purchases.checked;
        group.masters = this.refs.masters.checked;
        group.warehouse = this.refs.warehouse.checked;
        group.manufacturing = this.refs.manufacturing.checked;
        group.preparation = this.refs.preparation.checked;
        group.admin = this.refs.admin.checked;
        group.prestashop = this.refs.prestashop.checked;
        group.accounting = this.refs.accounting.checked;
        group.pointOfSale = this.refs.pointOfSale.checked;
        return group;
    }

    add() {
        const group = this.getGroupFromForm();

        this.addGroup(group).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    update() {
        const group = this.getGroupFromForm();
        group.id = this.group.id;

        this.updateGroup(group).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    delete() {
        this.deleteGroup(this.group.id).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
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

    addPermission() {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(<GroupAddPermissionModal
            permissionsOut={this.permissions.out}
            handlePermissionSelected={(permission) => {
                this.insertPermissionDictionaryGroup({
                    group: this.group.id,
                    permissionKey: permission,
                }).then((ok) => {
                    if (ok) {
                        this.renderPermissions();
                    }
                })
            }}
        />, this.refs.renderModal);
    }

    removePermission(permission) {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(<ConfirmDelete
            onDelete={() => {
                this.deletePermissionDictionaryGroup(permission).then((ok) => {
                    if (ok) {
                        this.renderPermissions();
                    }
                });
            }}
        />, this.refs.renderModal);
    }

    render() {
        return <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'lg'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('group')}
            </this.DialogTitle>
            <DialogContent>
                <div ref="renderModal"></div>
                <div class="form-group">
                    <TextField label={i18next.t('name')} variant="outlined" fullWidth size="small" inputRef={this.name}
                        defaultValue={this.group != null ? this.group.name : ''} />
                </div>
                <div class="form-row">
                    <div class="col">
                        <div class="custom-control custom-switch">
                            <input class="form-check-input custom-control-input" type="checkbox" ref="sales" id="sales"
                                defaultChecked={this.group != null && this.group.sales} />
                            <label class="form-check-label custom-control-label" htmlFor="sales">{i18next.t('sales')}</label>
                        </div>
                    </div>
                    <div class="col">
                        <div class="custom-control custom-switch">
                            <input class="form-check-input custom-control-input" type="checkbox" ref="purchases" id="purchases"
                                defaultChecked={this.group != null && this.group.purchases} />
                            <label class="form-check-label custom-control-label" htmlFor="purchases">{i18next.t('purchases')}</label>
                        </div>
                    </div>
                    <div class="col">
                        <div class="custom-control custom-switch">
                            <input class="form-check-input custom-control-input" type="checkbox" ref="masters" id="masters"
                                defaultChecked={this.group != null && this.group.masters} />
                            <label class="form-check-label custom-control-label" htmlFor="masters">{i18next.t('masters')}</label>
                        </div>
                    </div>
                    <div class="col">
                        <div class="custom-control custom-switch">
                            <input class="form-check-input custom-control-input" type="checkbox" ref="warehouse" id="warehouse"
                                defaultChecked={this.group != null && this.group.warehouse} />
                            <label class="form-check-label custom-control-label" htmlFor="warehouse">{i18next.t('warehouse')}</label>
                        </div>
                    </div>
                    <div class="col">
                        <div class="custom-control custom-switch">
                            <input class="form-check-input custom-control-input" type="checkbox" ref="manufacturing" id="manufacturing"
                                defaultChecked={this.group != null && this.group.manufacturing} />
                            <label class="form-check-label custom-control-label" htmlFor="manufacturing">{i18next.t('manufacturing')}</label>
                        </div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="col">
                        <div class="custom-control custom-switch">
                            <input class="form-check-input custom-control-input" type="checkbox" ref="preparation" id="preparation"
                                defaultChecked={this.group != null && this.group.preparation} />
                            <label class="form-check-label custom-control-label" htmlFor="preparation">{i18next.t('preparation')}</label>
                        </div>
                    </div>
                    <div class="col">
                        <div class="custom-control custom-switch">
                            <input class="form-check-input custom-control-input" type="checkbox" ref="admin" id="admin"
                                defaultChecked={this.group != null && this.group.admin} />
                            <label class="form-check-label custom-control-label" htmlFor="admin">Admin</label>
                        </div>
                    </div>
                    <div class="col">
                        <div class="custom-control custom-switch">
                            <input class="form-check-input custom-control-input" type="checkbox" ref="prestashop" id="prestashop"
                                defaultChecked={this.group != null && this.group.prestashop} />
                            <label class="form-check-label custom-control-label" htmlFor="prestashop">PrestaShop</label>
                        </div>
                    </div>
                    <div class="col">
                        <div class="custom-control custom-switch">
                            <input class="form-check-input custom-control-input" type="checkbox" ref="accounting" id="accounting"
                                defaultChecked={this.group != null && this.group.accounting} />
                            <label class="form-check-label custom-control-label" htmlFor="accounting">{i18next.t('accounting')}</label>
                        </div>
                    </div>
                    <div class="col">
                        <div class="custom-control custom-switch">
                            <input class="form-check-input custom-control-input" type="checkbox" ref="pointOfSale" id="pointOfSale"
                                defaultChecked={this.group != null && this.group.pointOfSale} />
                            <label class="form-check-label custom-control-label" htmlFor="pointOfSale">{i18next.t('point-of-sale')}</label>
                        </div>
                    </div>
                </div>
                <br />
                {this.group == null ? null :
                    <div>
                        <button type="button" class="btn btn-primary mt-1 mb-2 ml-2" onClick={this.addPermission}>{i18next.t('add-permission')}</button>
                        <DataGrid
                            ref="table"
                            autoHeight
                            rows={this.permissions.in}
                            columns={[
                                { field: 'permissionKey', headerName: i18next.t('key'), width: 450 },
                                { field: 'description', headerName: i18next.t('description'), flex: 1 },
                            ]}
                            onRowClick={(data) => {
                                this.removePermission(data.row);
                            }}
                        />
                    </div>}
            </DialogContent>
            <DialogActions>
                {this.group != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                {this.group == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                {this.group != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
            </DialogActions>
        </Dialog>
    }
}

class GroupAddPermissionModal extends Component {
    constructor({ permissionsOut, handlePermissionSelected }) {
        super();

        this.permissionsOut = permissionsOut;
        this.handlePermissionSelected = handlePermissionSelected;

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
                {i18next.t('group')}
            </this.DialogTitle>
            <DialogContent>
                <DataGrid
                    ref="table"
                    autoHeight
                    rows={this.permissionsOut}
                    columns={[
                        { field: 'key', headerName: i18next.t('key'), width: 450 },
                        { field: 'description', headerName: i18next.t('description'), flex: 1 },
                    ]}
                    onRowClick={(data) => {
                        this.handlePermissionSelected(data.row.key);
                        this.handleClose();
                    }}
                />
            </DialogContent>
            <DialogActions>
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
            </DialogActions>
        </Dialog>
    }
}


export default Groups;
