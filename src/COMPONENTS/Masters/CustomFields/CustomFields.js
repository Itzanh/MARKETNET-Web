/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

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
import Grow from '@mui/material/Grow';

import { TextField, FormControl, NativeSelect } from "@material-ui/core";
import { InputLabel } from "@mui/material";
import AlertModal from "../../AlertModal";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Grow direction="up" ref={ref} {...props} />;
});



class CustomFields extends Component {
    constructor({ productId, customerId, supplierId, getCustomFields, insertCustomFields, updateCustomFields, deleteCustomFields }) {
        super();

        this.productId = productId;
        this.customerId = customerId;
        this.supplierId = supplierId;

        this.getCustomFields = getCustomFields;
        this.insertCustomFields = insertCustomFields;
        this.updateCustomFields = updateCustomFields;
        this.deleteCustomFields = deleteCustomFields;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderRows();
    }

    renderRows() {
        this.getCustomFields({
            product: this.productId,
            customer: this.customerId,
            supplier: this.supplierId
        }).then((fields) => {
            this.list = fields;
            this.forceUpdate();
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(<CustomFieldsModal
            productId={this.productId}
            customerId={this.customerId}
            supplierId={this.supplierId}
            insertCustomFields={(field) => {
                return new Promise((resolve) => {
                    this.insertCustomFields(field).then((ok) => {
                        this.renderRows();
                        resolve(ok);
                    });
                });
            }}
        />, this.refs.renderModal);
    }

    edit(field) {
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(<CustomFieldsModal
            field={field}
            productId={this.productId}
            customerId={this.customerId}
            supplierId={this.supplierId}
            updateCustomFields={(field) => {
                return new Promise((resolve) => {
                    this.updateCustomFields(field).then((ok) => {
                        this.renderRows();
                        resolve(ok);
                    });
                });
            }}
            deleteCustomFields={(fieldId) => {
                return new Promise((resolve) => {
                    this.deleteCustomFields(fieldId).then((ok) => {
                        this.renderRows();
                        resolve(ok);
                    });
                });
            }}
        />, this.refs.renderModal);
    }

    customFieldToString(customField) {
        if (customField.fieldType == 1 || customField.fieldType == 2) {
            return customField.valueString;
        }
        if (customField.fieldType == 3) {
            return "" + customField.valueNumber;
        }
        if (customField.fieldType == 4) {
            return customField.valueBoolean ? i18next.t('yes') : i18next.t('no');
        }
        if (customField.fieldType == 5 || customField.fieldType == 6) {
            return customField.fileName + " (" + window.bytesToSize(customField.fileSize) + ")";
        }
    }

    render() {
        return <div>
            <div ref="renderModal"></div>
            <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add')}</button>
            <br />
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'name', headerName: i18next.t('name'), width: 500 },
                    {
                        field: 'valueString', headerName: i18next.t('value'), flex: 1, valueGetter: (params) => {
                            return this.customFieldToString(params.row);
                        }
                    },
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}



class CustomFieldsModal extends Component {
    constructor({ field, productId, customerId, supplierId, insertCustomFields, updateCustomFields, deleteCustomFields }) {
        super();

        this.field = field;
        console.log(field);
        this.productId = productId;
        this.customerId = customerId;
        this.supplierId = supplierId;
        this.insertCustomFields = insertCustomFields;
        this.updateCustomFields = updateCustomFields;
        this.deleteCustomFields = deleteCustomFields;

        this.open = true;
        this.fieldType = this.field != null ? this.field.fieldType : 1;

        this.name = React.createRef();
        this.valueString = React.createRef();
        this.valueNumber = React.createRef();

        this.handleClose = this.handleClose.bind(this);
        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                resolve(reader.result);
            };
            reader.onerror = function (error) {
                reject(error);
            };
        });
    }

    async getCustomFieldFromForm() {
        const customField = {
            product: this.productId,
            customer: this.customerId,
            supplier: this.supplierId,
            name: this.name.current.value,
            fieldType: this.fieldType,
            valueString: this.valueString.current == null ? null : this.valueString.current.value,
            valueNumber: this.valueNumber.current == null ? null : parseFloat(this.valueNumber.current.value),
            valueBoolean: this.refs.valueBoolean == null ? null : this.refs.valueBoolean.checked,
            valueBinary: null,
            fileName: null
        };

        if (customField.name.length == 0) {
            ReactDOM.unmountComponentAtNode(this.refs.renderModal);
            ReactDOM.render(<AlertModal
                modalTitle={i18next.t('VALIDATION-ERROR')}
                modalText={i18next.t('the-name-cant-be-empty')}
            />, this.refs.renderModal);
            return null;
        }
        if (customField.name.length > 255) {
            ReactDOM.unmountComponentAtNode(this.refs.renderModal);
            ReactDOM.render(<AlertModal
                modalTitle={i18next.t('VALIDATION-ERROR')}
                modalText={i18next.t('the-name-cant-be-longer-than-255-characters')}
            />, this.refs.renderModal);
            return null;
        }
        if (customField.valueString != null && customField.valueString.length == 0) {
            ReactDOM.unmountComponentAtNode(this.refs.renderModal);
            ReactDOM.render(<AlertModal
                modalTitle={i18next.t('VALIDATION-ERROR')}
                modalText={i18next.t('the-text-cant-be-empty')}
            />, this.refs.renderModal);
            return null;
        }
        if (customField.valueString != null && customField.valueString.length > 80000) {
            ReactDOM.unmountComponentAtNode(this.refs.renderModal);
            ReactDOM.render(<AlertModal
                modalTitle={i18next.t('VALIDATION-ERROR')}
                modalText={i18next.t('the-text-cant-be-longer-than-80000-characters')}
            />, this.refs.renderModal);
            return null;
        }

        // UPLOAD IMAGE FILE
        if (customField.fieldType == 5) {
            if (this.refs.fileImage.files.length != 1) {
                return null;
            }
            const file = this.refs.fileImage.files[0];
            if (file.size > 5000000) { // 5 MB
                ReactDOM.unmountComponentAtNode(this.refs.renderModal);
                ReactDOM.render(<AlertModal
                    modalTitle={i18next.t('cant-upload-file')}
                    modalText={i18next.t('the-file-cant-exceed-the-5-mb')}
                />, this.refs.renderModal);
                return null;
            }

            if (file.type != "image/jpeg" && file.type != "image/jpg" && file.type != "image/png"
                && file.type != "image/gif" && file.type != "image/bmp" && file.type != "image/webp") {
                ReactDOM.unmountComponentAtNode(this.refs.renderModal);
                ReactDOM.render(<AlertModal
                    modalTitle={i18next.t('cant-upload-file')}
                    modalText={i18next.t('the-file-is-not-in-a-supported-image-format')}
                />, this.refs.renderModal);
                return null;
            }

            const base64 = await this.fileToBase64(file);
            customField.valueBinary = base64.substring(base64.indexOf(",") + 1);
            customField.fileName = file.name;
        }
        // UPLOAD CUSTOM FILE
        if (customField.fieldType == 6) {
            if (this.refs.fileBinary.files.length != 1) {
                return null;
            }
            const file = this.refs.fileBinary.files[0];
            if (file.size > 5000000) { // 5 MB
                ReactDOM.unmountComponentAtNode(this.refs.renderModal);
                ReactDOM.render(<AlertModal
                    modalTitle={i18next.t('cant-upload-file')}
                    modalText={i18next.t('the-file-cant-exceed-the-5-mb')}
                />, this.refs.renderModal);
                return null;
            }

            const base64 = await this.fileToBase64(file);
            customField.valueBinary = base64.substring(base64.indexOf(",") + 1);
            customField.fileName = file.name;
        }

        return customField;
    }

    async add() {
        const customField = await this.getCustomFieldFromForm();
        if (customField == null) {
            return;
        }

        this.insertCustomFields(customField).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    async update() {
        const customField = await this.getCustomFieldFromForm();
        if (customField == null) {
            return;
        }
        customField.id = this.field.id;

        this.updateCustomFields(customField).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    delete() {
        this.deleteCustomFields(this.field.id).then((ok) => {
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
        return <div>
            <div ref="renderModal"></div>
            <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'md'}
                PaperComponent={this.PaperComponent} TransitionComponent={Transition}>
                <this.DialogTitle style={this.detail != null && this.detail.cancelled ?
                    { cursor: 'move', 'backgroundColor': '#dc3545', 'color': 'white' } :
                    { cursor: 'move' }} id="draggable-dialog-title">
                    {i18next.t('custom-field')}
                </this.DialogTitle>
                <DialogContent>

                    <TextField label={i18next.t('name')} variant="outlined" fullWidth size="small" inputRef={this.name}
                        defaultValue={this.field != null ? this.field.name : ''} />

                    <br />
                    <br />

                    <FormControl fullWidth>
                        <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('type')}</InputLabel>
                        <NativeSelect
                            style={{ 'marginTop': '0' }}
                            id="renderType"
                            defaultValue={this.field != null ? this.field.fieldType : '1'}
                            readOnly={this.field != null}
                            onChange={() => {
                                this.fieldType = parseInt(document.getElementById("renderType").value);
                                this.forceUpdate();
                            }}
                        >
                            <option value="1">{i18next.t('short-text')}</option>
                            <option value="2">{i18next.t('long-text')}</option>
                            <option value="3">{i18next.t('number')}</option>
                            <option value="4">{i18next.t('boolean')}</option>
                            <option value="5">{i18next.t('image')}</option>
                            <option value="6">{i18next.t('file')}</option>
                        </NativeSelect>
                    </FormControl>

                    <br />
                    <br />

                    {this.fieldType != 1 ? null : <div>
                        <TextField label={i18next.t('text')} variant="outlined" fullWidth size="small" inputRef={this.valueString}
                            defaultValue={this.field != null ? this.field.valueString : ''} />
                        <p>{i18next.t('max-80000-characters')}</p>
                    </div>}

                    {this.fieldType != 2 ? null : <div>
                        <TextField label={i18next.t('text')} variant="outlined" fullWidth size="small" inputRef={this.valueString}
                            defaultValue={this.field != null ? this.field.valueString : ''} multiline maxRows={10} minRows={6} />
                        <p>{i18next.t('max-80000-characters')}</p>
                    </div>}

                    {this.fieldType != 3 ? null : <div>
                        <TextField label={i18next.t('number')} variant="outlined" fullWidth size="small" inputRef={this.valueNumber}
                            defaultValue={this.field != null ? this.field.valueNumber : '0'} type="number" />
                    </div>}

                    {this.fieldType != 4 ? null : <div>
                        <div class="custom-control custom-switch" style={{ 'marginTop': '2%' }}>
                            <input type="checkbox" class="custom-control-input" ref="valueBoolean" id="valueBoolean"
                                defaultChecked={this.field != null ? this.field.valueBoolean : false} />
                            <label class="custom-control-label" htmlFor="valueBoolean">{i18next.t('check')}</label>
                        </div>
                    </div>}

                    {this.fieldType != 5 ? null : <div>
                        {this.field != null ? <img src={"data:" + this.field.imageMimeType + ";base64," + this.field.valueBinary} /> : null}
                        <label for="fileImage">{i18next.t('select-file')}</label>
                        <input type="file" class="form-control-file" id="fileImage" ref="fileImage" />
                    </div>}

                    {this.fieldType != 6 ? null : <div>
                        {this.field == null ? null :
                            <a href={"data:application/octet-stream;base64," + this.field.valueBinary}
                                target="_blank" download={this.field.fileName}>{i18next.t('download-file')}</a>}
                        <br />
                        <br />
                        <label for="fileBinary">{i18next.t('select-file')}</label>
                        <input type="file" class="form-control-file" id="fileBinary" ref="fileBinary" />
                    </div>}

                </DialogContent>
                <DialogActions>
                    {this.field != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                    <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                    {this.field == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                    {this.field != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
                </DialogActions>
            </Dialog>
        </div>
    }
}



export default CustomFields;
