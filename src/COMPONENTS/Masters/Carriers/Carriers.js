import React, { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

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

import { TextField, FormControl, NativeSelect } from "@material-ui/core";
import { InputLabel } from "@mui/material";
import AlertModal from "../../AlertModal";



class Carriers extends Component {
    constructor({ getCarriers, addCarrier, updateCarrier, deleteCarrier }) {
        super();

        this.getCarriers = getCarriers;
        this.addCarrier = addCarrier;
        this.updateCarrier = updateCarrier;
        this.deleteCarrier = deleteCarrier;

        this.list = [];

        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
    }

    componentDidMount() {
        this.renderCarriers();
    }

    renderCarriers() {
        this.getCarriers().then((carriers) => {
            this.list = carriers;
            this.forceUpdate();
        });
    }

    add() {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderCarrierModal'));
        ReactDOM.render(
            <CarriersModal
                addCarrier={(carrier) => {
                    const promise = this.addCarrier(carrier);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderCarriers();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderCarrierModal'));
    }

    edit(carrier) {
        ReactDOM.unmountComponentAtNode(document.getElementById('renderCarrierModal'));
        ReactDOM.render(
            <CarriersModal
                carrier={carrier}
                updateCarrier={(carrier) => {
                    const promise = this.updateCarrier(carrier);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderCarriers();
                        }
                    });
                    return promise;
                }}
                deleteCarrier={(carrierId) => {
                    const promise = this.deleteCarrier(carrierId);
                    promise.then((ok) => {
                        if (ok) {
                            this.renderCarriers();
                        }
                    });
                    return promise;
                }}
            />,
            document.getElementById('renderCarrierModal'));
    }

    render() {
        return <div id="tabCarriers">
            <div id="renderCarrierModal"></div>
            <h4 className="ml-2">{i18next.t('carriers')}</h4>
            <button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add')}</button>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    { field: 'name', headerName: i18next.t('name'), flex: 1 },
                    { field: 'email', headerName: 'Email', width: 300 },
                    { field: 'web', headerName: 'Web', width: 300 }
                ]}
                onRowClick={(data) => {
                    this.edit(data.row);
                }}
            />
        </div>
    }
}

class CarriersModal extends Component {
    constructor({ carrier, addCarrier, updateCarrier, deleteCarrier }) {
        super();

        this.carrier = carrier;
        this.addCarrier = addCarrier;
        this.updateCarrier = updateCarrier;
        this.deleteCarrier = deleteCarrier;

        this.tab = 0;
        this.open = true;

        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.saveTab = this.saveTab.bind(this);
        this.generalTab = this.generalTab.bind(this);
        this.webserviceTab = this.webserviceTab.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.tabs();
            this.generalTab();
        }, 10);
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    tabs() {
        ReactDOM.render(<AppBar position="static" style={{ 'backgroundColor': '#1976d2' }}>
            <Tabs value={this.tab} onChange={(_, tab) => {
                this.tab = tab;
                switch (tab) {
                    case 0: {
                        this.generalTab();
                        break;
                    }
                    case 1: {
                        this.webserviceTab();
                        break;
                    }
                }
            }}>
                <Tab label="General" />
                <Tab label="WebService" />
            </Tabs>
        </AppBar>, this.refs.tabs);
    }

    generalTab() {
        this.tab = 0;
        this.tabs();
        ReactDOM.render(<CarriersModalGeneral
            carrier={this.carrier}
            saveTab={this.saveTab}
        />, this.refs.render);
    }

    webserviceTab() {
        this.tab = 1;
        this.tabs();
        ReactDOM.render(<CarriersModalWebService
            carrier={this.carrier}
            saveTab={this.saveTab}
        />, this.refs.render);
    }

    saveTab(changes) {
        if (this.carrier == null) {
            this.carrier = {
                webservice: "_"
            };
        }
        Object.keys(changes).forEach((key) => {
            this.carrier[key] = changes[key];
        });
    }

    getCarrierFromForm() {
        ReactDOM.unmountComponentAtNode(this.refs.render);
        return this.carrier;
    }

    isValid(carrier) {
        var errorMessage = "";
        if (carrier.name.length === 0) {
            errorMessage = i18next.t('name-0');
        } else if (carrier.name.length > 50) {
            errorMessage = i18next.t('name-50');
        } else if (carrier.phone.length > 15) {
            errorMessage = i18next.t('phone-15');
        } else if (carrier.email.length > 100) {
            errorMessage = i18next.t('email-100');
        } else if (carrier.web.length > 100) {
            errorMessage = i18next.t('web-100');
        } else if (carrier.webservice == "S") {
            if (carrier.sendcloudUrl.length > 75) {
                errorMessage = i18next.t('the-SendCloud-URL-cant-be-longer-than-75-characters');
            } else if (carrier.sendcloudKey.length != 32) {
                errorMessage = i18next.t('the-SendCloud-Key-must-be-32-characters-long');
            } else if (carrier.sendcloudSecret.length != 32) {
                errorMessage = i18next.t('the-SendCloud-Secret-must-be-32-characters-long');
            }
        }

        if (errorMessage != "") {
            ReactDOM.unmountComponentAtNode(this.refs.renderModal);
            ReactDOM.render(<AlertModal
                modalTitle={i18next.t('VALIDATION-ERROR')}
                modalText={errorMessage}
            />, this.refs.renderModal);

            return false;
        }

        return true;
    }

    add() {
        const carrier = this.getCarrierFromForm();
        if (!this.isValid(carrier)) {
            return;
        }

        this.addCarrier(carrier).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    update() {
        const carrier = this.getCarrierFromForm();
        if (!this.isValid(carrier)) {
            return;
        }
        carrier.id = this.carrier.id;

        this.updateCarrier(carrier).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    delete() {
        this.deleteCarrier(this.carrier.id).then((ok) => {
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

    render() {
        return <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'md'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {i18next.t('carrier')}
            </this.DialogTitle>
            <DialogContent>
                <div ref="renderModal"></div>
                <div ref="tabs"></div>

                <div ref="render"></div>
            </DialogContent>
            <DialogActions>
                {this.carrier != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                <button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
                {this.carrier == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                {this.carrier != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
            </DialogActions>
        </Dialog>
    }
}

class CarriersModalGeneral extends Component {
    constructor({ carrier, saveTab }) {
        super();

        this.carrier = carrier;
        this.saveTab = saveTab;

        this.name = React.createRef();
        this.maxWeight = React.createRef();
        this.maxWidth = React.createRef();
        this.maxHeight = React.createRef();
        this.maxDepth = React.createRef();
        this.maxPackages = React.createRef();
        this.phone = React.createRef();
        this.email = React.createRef();
        this.web = React.createRef();
    }

    componentWillUnmount() {
        this.saveTab(this.getCarrierFromForm());
    }

    getCarrierFromForm() {
        const carrier = {};
        carrier.name = this.name.current.value;
        carrier.maxWeight = parseFloat(this.maxWeight.current.value);
        carrier.maxWidth = parseFloat(this.maxWidth.current.value);
        carrier.maxHeight = parseFloat(this.maxHeight.current.value);
        carrier.maxDepth = parseFloat(this.maxDepth.current.value);
        carrier.maxPackages = parseInt(this.maxPackages.current.value);
        carrier.phone = this.phone.current.value;
        carrier.email = this.email.current.value;
        carrier.web = this.web.current.value;
        carrier.pallets = this.refs.pallets.checked;
        return carrier;
    }

    render() {
        return <div>
            <div class="form-group mt-3">
                <TextField label={i18next.t('name')} variant="outlined" fullWidth size="small" inputRef={this.name}
                    defaultValue={this.carrier != null ? this.carrier.name : ''} inputProps={{ maxLength: 50 }} />
            </div>
            <div class="form-row mt-3">
                <div class="col">
                    <TextField label={i18next.t('max-weight')} variant="outlined" fullWidth size="small" inputRef={this.maxWeight} type="number"
                        defaultValue={this.carrier != null ? this.carrier.maxWeight : '0'} InputProps={{ inputProps: { min: 0 } }} />
                </div>
                <div class="col">
                    <TextField label={i18next.t('max-width')} variant="outlined" fullWidth size="small" inputRef={this.maxWidth} type="number"
                        defaultValue={this.carrier != null ? this.carrier.maxWidth : '0'} InputProps={{ inputProps: { min: 0 } }} />
                </div>
                <div class="col">
                    <TextField label={i18next.t('max-height')} variant="outlined" fullWidth size="small" inputRef={this.maxHeight} type="number"
                        defaultValue={this.carrier != null ? this.carrier.maxHeight : '0'} InputProps={{ inputProps: { min: 0 } }} />
                </div>
                <div class="col">
                    <TextField label={i18next.t('max-depth')} variant="outlined" fullWidth size="small" inputRef={this.maxDepth} type="number"
                        defaultValue={this.carrier != null ? this.carrier.maxDepth : '0'} InputProps={{ inputProps: { min: 0 } }} />
                </div>
                <div class="col">
                    <TextField label={i18next.t('max-packages')} variant="outlined" fullWidth size="small" inputRef={this.maxPackages} type="number"
                        defaultValue={this.carrier != null ? this.carrier.maxPackages : '0'} InputProps={{ inputProps: { min: 0 } }} />
                </div>
            </div>
            <div class="form-group mt-3">
                <div class="form-row">
                    <div class="col">
                        <TextField label={i18next.t('phone')} variant="outlined" fullWidth size="small" inputRef={this.phone}
                            defaultValue={this.carrier != null ? this.carrier.phone : ''} inputProps={{ maxLength: 15 }} />
                    </div>
                    <div class="col">
                        <div class="custom-control custom-switch" style={{ 'marginTop': '0%' }}>
                            <input class="form-check-input custom-control-input" type="checkbox" ref="pallets" id="pallets"
                                defaultChecked={this.carrier !== undefined && this.carrier.pallets} />
                            <label class="form-check-label custom-control-label" htmlFor="pallets">{i18next.t('pallets')}</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <TextField label={i18next.t('email')} variant="outlined" fullWidth size="small" inputRef={this.email}
                    defaultValue={this.carrier != null ? this.carrier.email : ''} inputProps={{ maxLength: 100 }} />
            </div>
            <div class="form-group">
                <TextField label='Web' variant="outlined" fullWidth size="small" inputRef={this.web}
                    defaultValue={this.carrier != null ? this.carrier.web : ''} inputProps={{ maxLength: 100 }} />
            </div>
        </div>
    }
}

class CarriersModalWebService extends Component {
    constructor({ carrier, saveTab }) {
        super();

        this.carrier = carrier;
        this.saveTab = saveTab;

        this.sendcloudUrl = React.createRef();
        this.sendcloudKey = React.createRef();
        this.sendcloudSecret = React.createRef();
        this.sendcloudShippingMethod = React.createRef();
        this.sendcloudSenderAddress = React.createRef();
    }

    componentWillUnmount() {
        this.saveTab(this.getCarrierFromForm());
    }

    getCarrierFromForm() {
        const carrier = {};
        carrier.webservice = document.getElementById("webservice").value;
        carrier.sendcloudUrl = this.sendcloudUrl.current.value;
        carrier.sendcloudKey = this.sendcloudKey.current.value;
        carrier.sendcloudSecret = this.sendcloudSecret.current.value;
        carrier.sendcloudShippingMethod = parseInt(this.sendcloudShippingMethod.current.value);
        carrier.sendcloudSenderAddress = parseInt(this.sendcloudSenderAddress.current.value);
        return carrier;
    }

    render() {
        return <div>
            <div class="form-group mt-3">
                <FormControl fullWidth>
                    <InputLabel htmlFor="uncontrolled-native" style={{ 'marginBottom': '0' }}>{i18next.t('webservice-type')}</InputLabel>
                    <NativeSelect
                        style={{ 'marginTop': '0' }}
                        id="webservice"
                        defaultValue={this.carrier.webservice}>
                        <option value="_">{i18next.t('no-webservice')}</option>
                        <option value="S">SendCloud</option>
                    </NativeSelect>
                </FormControl>
                <br />
                <br />
                <TextField label='Sendcloud URL' variant="outlined" fullWidth size="small" inputRef={this.sendcloudUrl}
                    defaultValue={this.carrier != null ? this.carrier.sendcloudUrl : ''} inputProps={{ maxLength: 75 }} />
                <br />
                <br />
                <TextField label='Sendcloud Key' variant="outlined" fullWidth size="small" inputRef={this.sendcloudKey}
                    defaultValue={this.carrier != null ? this.carrier.sendcloudKey : ''} inputProps={{ maxLength: 32 }} />
                <br />
                <br />
                <TextField label='Sendcloud Secret' variant="outlined" fullWidth size="small" inputRef={this.sendcloudSecret}
                    defaultValue={this.carrier != null ? this.carrier.sendcloudSecret : ''} inputProps={{ maxLength: 32 }} />
                <br />
                <br />
                <TextField label='ID of shipping method' variant="outlined" fullWidth size="small" inputRef={this.sendcloudShippingMethod} type="number"
                    defaultValue={this.carrier != null ? this.carrier.sendcloudShippingMethod : '0'} InputProps={{ inputProps: { min: 0 } }} />
                <br />
                <br />
                <TextField label='Sendcloud sender address Id' variant="outlined" fullWidth size="small" inputRef={this.sendcloudSenderAddress} type="number"
                    defaultValue={this.carrier != null ? this.carrier.sendcloudSenderAddress : '0'} InputProps={{ inputProps: { min: 0 } }} />
            </div>
        </div>
    }
}

export default Carriers;
