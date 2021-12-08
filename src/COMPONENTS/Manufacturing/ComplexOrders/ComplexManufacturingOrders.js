import { Component } from "react";
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
import ManufacturingOrderType from "../OrderTypes/ManufacturingOrderType";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

// IMG
import TransactionLogViewModal from "../../VisualComponents/TransactionLogViewModal";
import AlertModal from "../../AlertModal";

class ComplexManufacturingOrders extends Component {
	constructor({ getManufacturingOrderTypes, getComplexManufacturingOrder, insertComplexManufacturingOrder, deleteComplexManufacturingOrder,
		toggleManufactuedComplexManufacturingOrder, getComplexManufacturingOrderManufacturingOrder }) {
		super();

		this.getManufacturingOrderTypes = getManufacturingOrderTypes;
		this.getComplexManufacturingOrder = getComplexManufacturingOrder;
		this.insertComplexManufacturingOrder = insertComplexManufacturingOrder;
		this.deleteComplexManufacturingOrder = deleteComplexManufacturingOrder;
		this.toggleManufactuedComplexManufacturingOrder = toggleManufactuedComplexManufacturingOrder;
		this.getComplexManufacturingOrderManufacturingOrder = getComplexManufacturingOrderManufacturingOrder;

		this.list = [];
		this.rows = 0;
		this.limit = 100;

		this.add = this.add.bind(this);
		this.edit = this.edit.bind(this);
		this.getAndRenderComplexManufacturingOrders = this.getAndRenderComplexManufacturingOrders.bind(this);
	}

	async componentDidMount() {
		await new Promise((resolve) => {
			this.getManufacturingOrderTypes().then((types) => {
				types.unshift({ id: 0, name: "." + i18next.t('all') });
				ReactDOM.render(types.map((element, i) => {
					return <ManufacturingOrderType key={i}
						type={element}
					/>
				}), this.refs.renderTypes);
				resolve();
			});
		});

		this.getAndRenderComplexManufacturingOrders();
	}

	async getAndRenderComplexManufacturingOrders() {
		this.getComplexManufacturingOrder({
			offset: 0,
			limit: 100,
			orderTypeId: parseInt(this.refs.renderTypes.value)
		}).then(async (orders) => {
			this.renderComplexManufacturingOrders(orders);
		});
	}

	renderComplexManufacturingOrders(orders) {
		this.list = orders.complexManufacturingOrder;
		this.rows = orders.rows;
		this.forceUpdate();
	}

	add() {
		ReactDOM.unmountComponentAtNode(document.getElementById('renderComplexManufacturingOrdersModal'));
		ReactDOM.render(
			<ComplexManufacturingOrderModal
				insertComplexManufacturingOrder={(order) => {
					const promise = this.insertComplexManufacturingOrder(order);
					promise.then((ok) => {
						if (ok) {
							this.getAndRenderComplexManufacturingOrders();
						}
					});
					return promise;
				}}
				getManufacturingOrderTypes={this.getManufacturingOrderTypes}
				getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
			/>,
			document.getElementById('renderComplexManufacturingOrdersModal'));
	}

	async edit(order) {
		ReactDOM.unmountComponentAtNode(document.getElementById('renderComplexManufacturingOrdersModal'));
		ReactDOM.render(
			<ComplexManufacturingOrderModal
				order={order}
				getManufacturingOrderTypes={this.getManufacturingOrderTypes}
				getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
				toggleManufactuedComplexManufacturingOrder={(order) => {
					const promise = this.toggleManufactuedComplexManufacturingOrder(order);
					promise.then((ok) => {
						if (ok) {
							this.getAndRenderComplexManufacturingOrders();
						}
					});
					return promise;
				}}
				deleteComplexManufacturingOrder={(order) => {
					const promise = this.deleteComplexManufacturingOrder(order);
					promise.then((ok) => {
						if (ok) {
							this.getAndRenderComplexManufacturingOrders();
						}
					});
					return promise;
				}}
				manufacturingOrderTagPrinted={this.manufacturingOrderTagPrinted}
				getComplexManufacturingOrderManufacturingOrder={this.getComplexManufacturingOrderManufacturingOrder}
			/>,
			document.getElementById('renderComplexManufacturingOrdersModal'));
	}

	render() {
		return <div id="tabComplexManufacturingOrders" className="formRowRoot">
			<div id="renderComplexManufacturingOrdersModal"></div>
			<h1>{i18next.t('complex-manufacturing-orders')}</h1>
			<div class="form-row">
				<div class="col">
					<button type="button" class="btn btn-primary ml-2 mb-2" onClick={this.add}>{i18next.t('add')}</button>
				</div>
				<div class="col">
					<select class="form-control" ref="renderTypes" onChange={this.getAndRenderComplexManufacturingOrders}>
					</select>
				</div>
			</div>
			<DataGrid
				ref="table"
				autoHeight
				rows={this.list}
				columns={[
					{ field: 'typeName', headerName: i18next.t('type'), flex: 1 },
					{
						field: 'dateCreated', headerName: i18next.t('date'), width: 160, valueGetter: (params) => {
							return window.dateFormat(params.row.dateCreated)
						}
					},
					{ field: 'manufactured', headerName: i18next.t('manufactured'), width: 180, type: 'boolean' },
				]}
				onRowClick={(data) => {
					this.edit(data.row);
				}}
				onPageChange={(data) => {
					this.getComplexManufacturingOrder({
						offset: data * this.limit,
						limit: this.limit,
						orderTypeId: this.refs.renderTypes.value
					}).then(async (orders) => {
						orders.complexManufacturingOrder = this.list.concat(orders.complexManufacturingOrder);
						this.renderManufacturingOrders(orders);
					});
				}}
				rowCount={this.rows}
			/>
		</div>
	}
}

class ComplexManufacturingOrderModal extends Component {
	constructor({ order, insertComplexManufacturingOrder, getManufacturingOrderTypes, toggleManufactuedComplexManufacturingOrder,
		deleteComplexManufacturingOrder, manufacturingOrderTagPrinted, getRegisterTransactionalLogs, getComplexManufacturingOrderManufacturingOrder }) {
		super();

		this.order = order;
		this.insertComplexManufacturingOrder = insertComplexManufacturingOrder;
		this.getManufacturingOrderTypes = getManufacturingOrderTypes;
		this.toggleManufactuedComplexManufacturingOrder = toggleManufactuedComplexManufacturingOrder;
		this.deleteComplexManufacturingOrder = deleteComplexManufacturingOrder;
		this.manufacturingOrderTagPrinted = manufacturingOrderTagPrinted;
		this.getRegisterTransactionalLogs = getRegisterTransactionalLogs;
		this.getComplexManufacturingOrderManufacturingOrder = getComplexManufacturingOrderManufacturingOrder;

		this.open = true;
		this.tab = 0;
		this.listInput = [];
		this.listOutput = [];

		this.add = this.add.bind(this);
		this.update = this.update.bind(this);
		this.delete = this.delete.bind(this);
		this.printTags = this.printTags.bind(this);
		this.printTagManufacturing = this.printTagManufacturing.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.renderOrderTypes = this.renderOrderTypes.bind(this);
		this.transactionLog = this.transactionLog.bind(this);
		this.handleTabChange = this.handleTabChange.bind(this);
	}

	componentDidMount() {
		this.getComponents();
		setTimeout(this.renderOrderTypes, 100);
	}

	getComponents() {
		if (this.order == null) {
			return;
		}

		this.getComplexManufacturingOrderManufacturingOrder(this.order.id).then((components) => {
			this.listInput = components.filter((element) => { return element.type == "I" });
			this.listOutput = components.filter((element) => { return element.type == "O" });
		});
	}

	renderOrderTypes() {
		if (this.order == null) {
			this.getManufacturingOrderTypes().then((types) => {
				types.unshift({ id: 0, name: ".Any" });
				ReactDOM.render(types.map((element, i) => {
					return <ManufacturingOrderType key={i}
						type={element}
					/>
				}), this.refs.renderTypes);
			});
		} else {
			ReactDOM.render(<ManufacturingOrderType
				type={{ id: this.order.type, name: this.order.typeName }}
			/>, this.refs.renderTypes);
		}
	}

	handleClose() {
		this.open = false;
		this.forceUpdate();
	}

	getComplexManufacturingOrderFromForm() {
		const order = {};
		order.type = parseInt(this.refs.renderTypes.value);
		return order;
	}

	isValid(order) {
		this.refs.errorMessage.innerText = "";
		if (order.type === 0) {
			this.refs.errorMessage.innerText = i18next.t('must-order-type');
			return false;
		}
		return true;
	}

	add() {
		const order = this.getComplexManufacturingOrderFromForm();
		if (!this.isValid(order)) {
			return;
		}

		this.insertComplexManufacturingOrder(order).then((ok) => {
			if (ok) {
				this.handleClose();
			}
		});
	}

	update() {
		this.toggleManufactuedComplexManufacturingOrder(this.order.id).then((ok) => {
			if (ok) {
				this.handleClose();
			} else if (this.order.manufactured && !ok) {
				ReactDOM.render(<AlertModal
					modalTitle={i18next.t('cant-undo')}
					modalText={i18next.t('undoing-this-manufacturing-order-is-not-permitted')}
				/>, document.getElementById("locateProductModal"));
			}
		});
	}

	delete() {
		this.deleteComplexManufacturingOrder(this.order.id).then((ok) => {
			if (ok) {
				this.handleClose();
			}
		});
	}

	async printTags() {
		const product = await this.getProductRow(this.order.product);
		window.open("marketnettagprinter:\\\\copies=1&barcode=ean13&data=" + product.barCode.substring(0, 12));
		this.manufacturingOrderTagPrinted(this.order.id);
	}

	printTagManufacturing() {
		window.open("marketnettagprinter:\\\\copies=1&barcode=datamatrix&data=" + this.order.uuid);
		this.manufacturingOrderTagPrinted(this.order.id);
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

	transactionLog() {
		if (this.order == null) {
			return;
		}

		ReactDOM.unmountComponentAtNode(document.getElementById('locateProductModal'));
		ReactDOM.render(<TransactionLogViewModal
			getRegisterTransactionalLogs={this.getRegisterTransactionalLogs}
			tableName={"manufacturing_order"}
			registerId={this.order.id}
		/>,
			document.getElementById('locateProductModal'));
	}

	handleTabChange(_, tab) {
		this.tab = tab;
		this.forceUpdate();
	}

	render() {
		return <div>
			<div id="locateProductModal"></div>
			<Dialog aria-labelledby="customized-dialog-title" open={this.open} fullWidth={true} maxWidth={'lg'}
				PaperComponent={this.PaperComponent}>
				<this.DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
					{i18next.t('manufacturing-order')}
				</this.DialogTitle>
				<DialogContent>
					<AppBar position="static" style={{
						'backgroundColor': '#343a40'
					}}>
						<Tabs value={this.tab} onChange={this.handleTabChange}>
							<Tab label={i18next.t('details')} />
							<Tab label={i18next.t('input')} />
							<Tab label={i18next.t('output')} />
						</Tabs>
					</AppBar>
					{this.tab != 0 ? null : <div>
						<div class="form-group">
							<label>{i18next.t('type')}</label>
							<select class="form-control" ref="renderTypes" disabled={this.order != null}>
							</select>
						</div>
						<div class="form-row">
							<div class="col">
								<label>User created</label>
								<input type="text" class="form-control" readOnly={true}
									defaultValue={this.order != null ? this.order.userCreatedName : null} />
							</div>
							<div class="col">
								<label>User manufactured</label>
								<input type="text" class="form-control" readOnly={true}
									defaultValue={this.order != null ? this.order.userManufacturedName : null} />
							</div>
							<div class="col">
								<label>User that printed the tag</label>
								<input type="text" class="form-control" readOnly={true}
									defaultValue={this.order != null ? this.order.userTagPrintedName : null} />
							</div>
						</div>
					</div>}
					{this.tab != 1 ? null : <div>
						<DataGrid
							ref="table"
							autoHeight
							rows={this.listInput}
							columns={[
								{ field: 'productName', headerName: i18next.t('product'), flex: 1 },
								{ field: 'manufacturingOrder', headerName: i18next.t('manufacturing-order'), width: 210 },
								{ field: 'warehouseMovement', headerName: i18next.t('warehouse-movement'), width: 220 },
								{ field: 'purchaseOrderName', headerName: i18next.t('purchase-order'), width: 200 },
								{ field: 'manufactured', headerName: i18next.t('manufactured'), width: 180, type: 'boolean' },
							]}
							onRowClick={(data) => {
								this.edit(data.row);
							}}
						/>
					</div>}
					{this.tab != 2 ? null : <div>
						<DataGrid
							ref="table"
							autoHeight
							rows={this.listOutput}
							columns={[
								{ field: 'productName', headerName: i18next.t('product'), flex: 1 },
								{ field: 'warehouseMovement', headerName: i18next.t('warehouse-movement'), width: 250 },
								{ field: 'saleOrderName', headerName: i18next.t('sale-order'), width: 250 },
								{ field: 'manufactured', headerName: i18next.t('manufactured'), width: 180, type: 'boolean' },
							]}
							onRowClick={(data) => {
								this.edit(data.row);
							}}
						/>
					</div>}
				</DialogContent>
				<DialogActions>
					<div class="btn-group dropup">
						<button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							{i18next.t('options')}
						</button>
						<div class="dropdown-menu">
							{this.order != null ? <a class="dropdown-item" href="#" onClick={this.transactionLog}>{i18next.t('transactional-log')}</a> : null}
						</div>
					</div>

					<p className="errorMessage" ref="errorMessage"></p>
					{this.order != null ? <button type="button" class="btn btn-danger" onClick={this.delete}>{i18next.t('delete')}</button> : null}
					<button type="button" class="btn btn-secondary" onClick={this.handleClose}>{i18next.t('close')}</button>
					{this.order == null ? <button type="button" class="btn btn-primary" onClick={this.add}>{i18next.t('add')}</button> : null}
					{this.order != null && !this.order.manufactured ?
						<button type="button" class="btn btn-success" onClick={this.update}>{i18next.t('manufactured')}</button> : null}
					{this.order != null && this.order.manufactured ?
						<button type="button" class="btn btn-danger" onClick={this.update}>{i18next.t('undo-manufactured')}</button> : null}
					{this.order != null && this.order.manufactured ?
						<button type="button" class="btn btn-primary" onClick={this.printTags}>{i18next.t('print-barcode')}</button> : null}
					{this.order != null && this.order.manufactured ?
						<button type="button" class="btn btn-primary" onClick={this.printTagManufacturing}>{i18next.t('print-datamatrix')}</button> : null}
				</DialogActions>
			</Dialog>
		</div>
	}
}



export default ComplexManufacturingOrders;
