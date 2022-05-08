import { Component } from "react";
import ReactDOM from 'react-dom';
import i18next from 'i18next';

import SelectPackage from "./SelectPackage";
import ReportModal from "../../ReportModal";
import AlertModal from '../../AlertModal';

import './../../../CSS/packaging_wizard.css'
import ConfirmDelete from "../../ConfirmDelete";

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



class PackagingWizard extends Component {
    constructor({ orderId, orderName, getSalesOrderDetails, getPackages, getSalesOrderPackaging, addSalesOrderPackaging,
        addSalesOrderDetailPackaged, addSalesOrderDetailPackagedEan13, deleteSalesOrderDetailPackaged, deletePackaging, tabPackaging,
        generateShipping, getSalesOrderPallets, insertPallet, updatePallet, deletePallet, getProductRow, grantDocumentAccessToken, noCarrier }) {
        super();

        this.orderId = orderId;
        this.orderName = orderName;
        this.getSalesOrderDetails = getSalesOrderDetails;
        this.getPackages = getPackages;
        this.getSalesOrderPackaging = getSalesOrderPackaging;
        this.addSalesOrderPackaging = addSalesOrderPackaging;
        this.addSalesOrderDetailPackaged = addSalesOrderDetailPackaged;
        this.addSalesOrderDetailPackagedEan13 = addSalesOrderDetailPackagedEan13;
        this.deleteSalesOrderDetailPackaged = deleteSalesOrderDetailPackaged;
        this.deletePackaging = deletePackaging;
        this.tabPackaging = tabPackaging;
        this.generateShipping = generateShipping;
        this.getSalesOrderPallets = getSalesOrderPallets;
        this.insertPallet = insertPallet;
        this.updatePallet = updatePallet;
        this.deletePallet = deletePallet;
        this.getProductRow = getProductRow;
        this.grantDocumentAccessToken = grantDocumentAccessToken;
        this.noCarrier = noCarrier;

        this.selectedOrderDetail = -1;
        this.selectedOrderDetailRow = null;
        this.selectedPackage = -1;
        this.selectedDetailPackageOrderDetail = -1;
        this.selectedDetailPackagePackaging = -1;
        this.pallets = null;
        this.hasPallets = false;

        this.editDetails = this.editDetails.bind(this);
        this.editPackaged = this.editPackaged.bind(this);
        this.addPackage = this.addPackage.bind(this);
        this.selectPackage = this.selectPackage.bind(this);
        this.addToPackage = this.addToPackage.bind(this);
        this.editDetailPackaged = this.editDetailPackaged.bind(this);
        this.unpack = this.unpack.bind(this);
        this.deletePackage = this.deletePackage.bind(this);
        this.shipping = this.shipping.bind(this);
        this.barCode = this.barCode.bind(this);
        this.addPallet = this.addPallet.bind(this);
        this.editPallet = this.editPallet.bind(this);
        this.renderPackaged = this.renderPackaged.bind(this);
        this.printProductTag = this.printProductTag.bind(this);
        this.boxContent = this.boxContent.bind(this);
        this.palletContent = this.palletContent.bind(this);
        this.carrierPallet = this.carrierPallet.bind(this);
    }

    async componentDidMount() {
        await this.renderDetails();
        await this.renderPallets();
        await this.renderPackaged();
    }

    renderDetails() {
        return new Promise((resolve) => {
            this.getSalesOrderDetails(this.orderId).then(async (details) => {
                ReactDOM.unmountComponentAtNode(this.refs.renderDetails);
                ReactDOM.render(details.map((element, i) => {
                    return <SalesOrderDetail key={i}
                        detail={element}
                        edit={this.editDetails}
                        pos={i}
                        selected={element.id == this.selectedOrderDetail}
                    />
                }), this.refs.renderDetails);
                resolve();
            });
        });
    }

    renderPackaged() {
        return new Promise((resolve) => {
            this.getSalesOrderPackaging(this.orderId).then((packages) => {
                ReactDOM.unmountComponentAtNode(this.refs.renderPackaged);
                const components = [];
                for (let i = 0; i < packages.length; i++) {
                    if (this.hasPallets && packages[i].palletId != this.refs.renderPallets.value) {
                        continue;
                    }

                    components.push(<SalesOrderPackaged key={"i" + i}
                        _package={packages[i]}
                        edit={this.editPackaged}
                        selected={packages[i].id === this.selectedPackage}
                    />);

                    for (let j = 0; j < packages[i].detailsPackaged.length; j++) {
                        components.push(<SalesOrderPackagedDetail key={"j" + j}
                            packaged={packages[i].detailsPackaged[j]}
                            edit={this.editDetailPackaged}
                            selected={packages[i].detailsPackaged[j].orderDetailId === this.selectedDetailPackageOrderDetail}
                        />);
                    }
                }
                ReactDOM.render(components, this.refs.renderPackaged);
                resolve();
            });
        });
    }

    editDetails(pos, detail) {
        this.selectedOrderDetail = pos;
        this.selectedOrderDetailRow = detail;
        this.refs.quantity.value = detail.quantityPendingPackaging;
        this.renderDetails();
    }

    editPackaged(pos) {
        this.selectedPackage = pos;
        this.selectedDetailPackageOrderDetail = -1;
        this.selectedDetailPackagePackaging = -1;
        this.renderPackaged();
        this.refs.barCode.focus();
    }

    editDetailPackaged(orderDetail, packaging) {
        this.selectedDetailPackageOrderDetail = orderDetail;
        this.selectedDetailPackagePackaging = packaging;
        this.selectedPackage = -1;
        this.renderPackaged();
    }

    addPackage() {
        ReactDOM.unmountComponentAtNode(document.getElementById('packagingWizardModal'));
        this.getPackages().then((packages) => {
            ReactDOM.render(
                <SelectPackage
                    packages={packages}
                    handleSelect={this.selectPackage}
                />,
                document.getElementById('packagingWizardModal'));
        });
    }

    selectPackage(__package) {
        const _package = {
            "salesOrderId": this.orderId,
            "packageId": __package.id
        };

        if (this.hasPallets && this.refs.renderPallets.value == "") {
            return;
        }

        if (this.hasPallets) {
            _package.palletId = parseInt(this.refs.renderPallets.value);
        }

        this.addSalesOrderPackaging(_package).then((ok) => {
            if (ok) {
                this.refresh();
                this.refs.barCode.focus();
            }
        });
    }

    addToPackage() {
        if (this.selectedOrderDetail < 0) {
            ReactDOM.unmountComponentAtNode(document.getElementById("packagingWizardModal"));
            ReactDOM.render(
                <AlertModal
                    modalTitle={i18next.t('VALIDATION-ERROR')}
                    modalText={i18next.t('there-is-no-order-detail-selected')}
                />, document.getElementById("packagingWizardModal"));
            this.refresh();
            this.refs.barCode.value = "";
            this.refs.barCode.focus();
            return;
        }
        if (this.selectedPackage < 0) {
            ReactDOM.unmountComponentAtNode(document.getElementById("packagingWizardModal"));
            ReactDOM.render(
                <AlertModal
                    modalTitle={i18next.t('VALIDATION-ERROR')}
                    modalText={i18next.t('there-is-no-box-selected')}
                />, document.getElementById("packagingWizardModal"));
            this.refresh();
            this.refs.barCode.value = "";
            this.refs.barCode.focus();
            return;
        }
        if (parseInt(this.refs.quantity.value) == 0) {
            return;
        }

        this.addSalesOrderDetailPackaged({
            orderDetailId: this.selectedOrderDetail,
            packagingId: this.selectedPackage,
            quantity: parseInt(this.refs.quantity.value)
        }).then((ok) => {
            if (ok) {
                this.refresh();
            }
        });
    }

    unpack() {
        if (this.selectedDetailPackageOrderDetail < 0 || this.selectedDetailPackagePackaging < 0) {
            return;
        }

        this.deleteSalesOrderDetailPackaged({
            orderDetailId: this.selectedDetailPackageOrderDetail,
            packagingId: this.selectedDetailPackagePackaging
        }).then((ok) => {
            if (ok) {
                this.refresh();
                this.refs.barCode.focus();
            }
        });
    }

    deletePackage() {
        ReactDOM.unmountComponentAtNode(document.getElementById("packagingWizardModal"));
        ReactDOM.render(
            <ConfirmDelete
                onDelete={() => {
                    this.deletePackaging(this.selectedPackage).then((ok) => {
                        if (ok) {
                            this.refresh(true);
                            this.refs.barCode.focus();
                        }
                    });
                }}
            />, document.getElementById("packagingWizardModal"));
    }

    async refresh(packageDeleted = false) {
        this.selectedOrderDetail = -1;
        if (packageDeleted) {
            this.selectedPackage = -1;
        }
        this.selectedDetailPackageOrderDetail = -1;
        this.selectedDetailPackagePackaging = -1;

        await this.renderDetails();
        this.renderPackaged();
    }

    shipping() {
        if (this.noCarrier) {
            ReactDOM.unmountComponentAtNode(document.getElementById("packagingWizardModal"));
            ReactDOM.render(
                <AlertModal
                    modalTitle={i18next.t('NO-CARRIER')}
                    modalText={i18next.t('no-carrier')}
                />, document.getElementById("packagingWizardModal"));
            return;
        }

        this.generateShipping(this.orderId).then((ok) => {
            if (ok.ok) {
                this.tabPackaging();
            } else {
                ReactDOM.unmountComponentAtNode(document.getElementById("packagingWizardModal"));
                switch (ok.errorCode) {
                    case 1: {
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-SHIPPING')}
                            modalText={i18next.t('no-carrier-selected-in-the-order')}
                        />, document.getElementById("packagingWizardModal"));
                        break;
                    }
                    case 2: {
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-SHIPPING')}
                            modalText={i18next.t('a-detail-has-not-been-completely-packaged') + ": " + ok.extraData[0] + "."}
                        />, document.getElementById("packagingWizardModal"));
                        break;
                    }
                    case 3: {
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-SHIPPING')}
                            modalText={i18next.t('cant-generate-delivery-note')}
                        />, document.getElementById("packagingWizardModal"));
                        break;
                    }
                    default: // 0
                        ReactDOM.render(<AlertModal
                            modalTitle={i18next.t('ERROR-SHIPPING')}
                            modalText={i18next.t('an-unknown-error-ocurred')}
                        />, document.getElementById("packagingWizardModal"));
                }
            }
        });
    }

    barCode() {
        if (this.selectedPackage == null || this.selectedPackage == -1) {
            ReactDOM.unmountComponentAtNode(document.getElementById("packagingWizardModal"));
            ReactDOM.render(
                <AlertModal
                    modalTitle={i18next.t('BARCODE-ERROR')}
                    modalText={i18next.t('there-is-no-box-selected')}
                />, document.getElementById("packagingWizardModal"));
            this.refresh();
            this.refs.barCode.value = "";
            this.refs.barCode.focus();
            return;
        }

        this.addSalesOrderDetailPackagedEan13({
            "salesOrder": this.orderId,
            "ean13": this.refs.barCode.value.padStart(13, "0"),
            "packaging": this.selectedPackage,
            "quantity": parseInt(this.refs.quantity.value)
        }).then((ok) => {
            if (ok) {
                this.refresh();
                this.refs.barCode.value = "";
                this.refs.barCode.focus();
            } else {
                ReactDOM.unmountComponentAtNode(document.getElementById("packagingWizardModal"));
                ReactDOM.render(
                    <AlertModal
                        modalTitle={i18next.t('BARCODE-ERROR')}
                        modalText={i18next.t('the-scanned-product-cannot-be-packaged')}
                    />, document.getElementById("packagingWizardModal"));
                this.refs.barCode.value = "";
                this.refs.barCode.focus();
            }
        });
    }

    renderPallets() {
        return new Promise((resolve) => {
            this.getSalesOrderPallets(this.orderId).then((pallets) => {
                if (!pallets.hasPallets) {
                    resolve();
                    return;
                }

                this.refs.palletToolbar.style.visibility = "visible";
                this.pallets = pallets.pallets;
                this.hasPallets = true;
                ReactDOM.render(pallets.pallets.map((element, i) => {
                    return <option key={i} value={element.id}>{element.name}</option>
                }), this.refs.renderPallets);
                resolve();
            });
        });
    }

    addPallet() {
        ReactDOM.unmountComponentAtNode(document.getElementById("packagingWizardModal"));
        ReactDOM.render(<SalesOrderPalletModal
            orderId={this.orderId}
            palletsLength={this.pallets.length}
            insertPallet={(pallet) => {
                return new Promise((resolve) => {
                    this.insertPallet(pallet).then((result) => {
                        resolve(result);
                        this.renderPallets();
                    });
                });
            }}
        />, document.getElementById("packagingWizardModal"));
    }

    editPallet() {
        for (let i = 0; i < this.pallets.length; i++) {
            if (this.refs.renderPallets.value == this.pallets[i].id) {
                ReactDOM.unmountComponentAtNode(document.getElementById("packagingWizardModal"));
                ReactDOM.render(<SalesOrderPalletModal
                    pallet={this.pallets[i]}
                    orderId={this.orderId}
                    updatePallet={(pallet) => {
                        return new Promise((resolve) => {
                            this.updatePallet(pallet).then((result) => {
                                resolve(result);
                                this.renderPallets();
                            });
                        });
                    }}
                    deletePallet={(pallet) => {
                        return new Promise((resolve) => {
                            this.deletePallet(pallet).then((result) => {
                                resolve(result);
                                this.renderPallets();
                            });
                        });
                    }}
                />, document.getElementById("packagingWizardModal"));
            }
        }
    }

    boxContent() {
        ReactDOM.unmountComponentAtNode(document.getElementById('packagingWizardModal'));
        ReactDOM.render(
            <ReportModal
                resource="BOX_CONTENT"
                documentId={this.selectedPackage}
                grantDocumentAccessToken={this.grantDocumentAccessToken}
            />,
            document.getElementById('packagingWizardModal'));
    }

    palletContent() {
        ReactDOM.unmountComponentAtNode(document.getElementById('packagingWizardModal'));
        ReactDOM.render(
            <ReportModal
                resource="PALLET_CONTENT"
                documentId={this.refs.renderPallets.value}
                grantDocumentAccessToken={this.grantDocumentAccessToken}
            />,
            document.getElementById('packagingWizardModal'));
    }

    carrierPallet() {
        ReactDOM.unmountComponentAtNode(document.getElementById('packagingWizardModal'));
        ReactDOM.render(
            <ReportModal
                resource="CARRIER_PALLET"
                documentId={this.orderId}
                grantDocumentAccessToken={this.grantDocumentAccessToken}
            />,
            document.getElementById('packagingWizardModal'));
    }

    async printProductTag() {
        if (this.selectedOrderDetail < 0) {
            return;
        }

        const product = await this.getProductRow(this.selectedOrderDetailRow.product);

        ReactDOM.unmountComponentAtNode(this.refs.renderBarCodes);
        const quantity = this.selectedOrderDetailRow.quantity;
        const components = [];

        for (let i = 0; i < quantity; i++) {
            components.push(<div style={{
                "display": "block",
                "width": window.config.productBarCodeLabelWidth + "px",
                "height": window.config.productBarCodeLabelHeight + "px"
            }}>
                <p style={{
                    "fontFamily": "'Libre Barcode EAN13 Text'",
                    "font-size": window.config.productBarCodeLabelSize + "px",
                    "marginTop": window.config.productBarCodeLabelMarginTop + "px",
                    "marginBottom": window.config.productBarCodeLabelMarginBottom + "px",
                    "marginLeft": window.config.productBarCodeLabelMarginLeft + "px",
                    "marginRight": window.config.productBarCodeLabelMarginRight + "px"
                }}
                >{product.barCode}</p>
            </div>);
        }

        ReactDOM.render(components, this.refs.renderBarCodes);

        const content = document.getElementById("renderBarCodes");
        const pri = document.getElementById("barcodesToPrint").contentWindow;
        pri.document.open();
        pri.document.write(content.innerHTML + '<link href="https://fonts.googleapis.com/css2?family=Libre+Barcode+EAN13+Text&display=swap" rel="stylesheet">');
        pri.document.close();
        pri.focus();
        setTimeout(() => {
            pri.print();
        }, 250);
    }

    render() {
        return <div id="packagingWizard" className="formRowRoot">

            <div ref="renderBarCodes" id="renderBarCodes" style={{ "height": "0px", "width": "0px", "display": "none" }}>
            </div>
            <iframe id="barcodesToPrint" style={{ "height": "0px", "width": "0px", "position": "absolute" }}></iframe>

            <div id="packagingWizardModal"></div>
            <div class="form-row">
                <div class="col">
                    <div class="form-row mb-2">
                        <div class="col">
                            <h4 className="ml-2">{i18next.t('order-details')}</h4>
                            <small className="ml-2">{this.orderName}</small>
                        </div>
                        <div class="col">
                            <input type="text" class="form-control" ref="barCode" onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    this.barCode();
                                }
                            }} placeholder={i18next.t('bar-code')} autoFocus />
                            <input type="number" class="form-control ml-2" ref="quantity" defaultValue="1" placeholder={i18next.t('quantity')} />
                            <button type="button" class="btn btn-success ml-2" onClick={this.addToPackage}>{i18next.t('add-to-package')}</button>
                            <div class="btn-group">
                                <button type="button" class="btn btn-secondary ml-2" onClick={this.tabPackaging}>{i18next.t('back')}</button>
                                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                </button>
                                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <a class="dropdown-item" href="#" onClick={this.boxContent}>{i18next.t('box-content')}</a>
                                    <a class="dropdown-item" href="#" onClick={this.palletContent}>{i18next.t('pallet-content')}</a>
                                    <a class="dropdown-item" href="#" onClick={this.carrierPallet}>{i18next.t('carrier-pallet-content')}</a>
                                    <a class="dropdown-item" href="#" onClick={this.printProductTag}>{i18next.t('product-tag')}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <table class="table table-dark">
                        <thead>
                            <tr>
                                <th scope="col">{i18next.t('product')}</th>
                                <th scope="col">{i18next.t('quantity')}</th>
                                <th scope="col">{i18next.t('quantity-pending')}</th>
                            </tr>
                        </thead>
                        <tbody ref="renderDetails"></tbody>
                    </table>
                </div>
                <div class="col">
                    <div class="form-row mb-4">
                        <div class="col">
                            <h4>{i18next.t('packaged')}</h4>
                        </div>
                        <div class="col">
                            <div className="palletToolbar" ref="palletToolbar" style={{ visibility: "hidden" }}>
                                <select class="form-control" ref="renderPallets" onChange={this.renderPackaged}>
                                </select>
                                <button type="button" class="btn btn-primary" onClick={this.addPallet}>+</button>
                                <button type="button" class="btn btn-warning" onClick={this.editPallet}>*</button>
                            </div>
                            <button type="button" class="btn btn-primary ml-2" onClick={this.addPackage}>{i18next.t('add-package')}</button>
                            <button type="button" class="btn btn-danger ml-2" onClick={this.deletePackage}>{i18next.t('delete-package')}</button>
                            <button type="button" class="btn btn-warning ml-2" onClick={this.unpack}>{i18next.t('unpack-detail')}</button>
                            <button type="button" class="btn btn-info ml-2" onClick={this.shipping}>{i18next.t('generate-shipping')}</button>
                        </div>
                    </div>
                    <table class="table table-dark">
                        <thead>
                            <tr>
                                <th scope="col">{i18next.t('package')}</th>
                                <th scope="col">{i18next.t('weight')}</th>
                            </tr>
                        </thead>
                        <tbody ref="renderPackaged"></tbody>
                    </table>
                </div>
            </div>
        </div>
    }
}

class SalesOrderDetail extends Component {
    constructor({ detail, edit, selected }) {
        super();

        this.detail = detail;
        this.edit = edit;
        this.selected = selected;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.detail.id, this.detail);
        }} className={this.selected ? 'bg-primary' : ''}>
            <td>{this.detail.product.name}</td>
            <td>{this.detail.quantity}</td>
            <td>{this.detail.quantityPendingPackaging}</td>
        </tr>
    }
}

class SalesOrderPackaged extends Component {
    constructor({ _package, edit, selected }) {
        super();

        this._package = _package;
        this.edit = edit;
        this.selected = selected;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this._package.id);
        }} className={this.selected ? 'bg-primary' : ''}>
            <td>{this._package.packageName}</td>
            <td>{this._package.weight}</td>
        </tr>
    }
}

class SalesOrderPackagedDetail extends Component {
    constructor({ packaged, edit, selected }) {
        super();

        this.packaged = packaged;
        this.edit = edit;
        this.selected = selected;
    }

    render() {
        return <tr onClick={() => {
            this.edit(this.packaged.orderDetailId, this.packaged.packagingId);
        }} className={this.selected ? 'detailPackage bg-primary' : 'detailPackage'}>
            <td>Detail: {this.packaged.productName}</td>
            <td>Quantity: {this.packaged.quantity}</td>
        </tr>
    }
}

class SalesOrderPalletModal extends Component {
    constructor({ orderId, pallet, palletsLength, insertPallet, updatePallet, deletePallet }) {
        super();

        this.orderId = orderId;
        this.pallet = pallet;
        this.palletsLength = palletsLength;
        this.insertPallet = insertPallet;
        this.updatePallet = updatePallet;
        this.deletePallet = deletePallet;

        this.open = true;

        this.handleClose = this.handleClose.bind(this);
        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    handleClose() {
        this.open = false;
        this.forceUpdate();
    }

    add() {
        const pallet = {
            salesOrderId: this.orderId,
            name: this.refs.name.value
        };

        this.insertPallet(pallet).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    update() {
        const pallet = {
            id: this.pallet.id,
            name: this.refs.name.value,
            weight: parseFloat(this.refs.weight.value),
            width: parseFloat(this.refs.width.value),
            height: parseFloat(this.refs.height.value),
            depth: parseFloat(this.refs.depth.value)
        }

        this.updatePallet(pallet).then((ok) => {
            if (ok) {
                this.handleClose();
            }
        });
    }

    delete() {
        this.deletePallet(this.pallet.id).then((ok) => {
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
        return <Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'sm'}
            PaperComponent={this.PaperComponent}>
            <this.DialogTitle id="draggable-dialog-title">
                {i18next.t('pallet')}
            </this.DialogTitle>
            <DialogContent>
                <div class="form-group">
                    <label>{i18next.t('name')}</label>
                    <input type="text" class="form-control" ref="name"
                        defaultValue={this.pallet != null ? this.pallet.name : i18next.t('pallet') + ' ' + (this.palletsLength + 1)} />
                </div>
                {this.pallet == null ? null :
                    <div class="form-row">
                        <div class="col">
                            <label>{i18next.t('weight')}</label>
                            <input type="number" class="form-control" min="0" ref="weight" defaultValue={this.pallet.weight} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('width')}</label>
                            <input type="number" class="form-control" min="0" ref="width" defaultValue={this.pallet.width} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('height')}</label>
                            <input type="number" class="form-control" min="0" ref="height" defaultValue={this.pallet.height} />
                        </div>
                        <div class="col">
                            <label>{i18next.t('depth')}</label>
                            <input type="number" class="form-control" min="0" ref="depth" defaultValue={this.pallet.depth} />
                        </div>
                    </div>}
            </DialogContent>
            <DialogActions>
                {this.pallet != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
                <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                {this.pallet == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
                {this.pallet != null ? <button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('update')}</button> : null}
            </DialogActions>
        </Dialog>
    }
}

export default PackagingWizard;
