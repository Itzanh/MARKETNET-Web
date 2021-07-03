import { Component } from "react";

class ProductFormMoreData extends Component {
	constructor({ product, saveTab }) {
		super();

		this.product = product;
		this.saveTab = saveTab;
	}

	componentWillUnmount() {
		this.saveTab(this.getProductFromForm());
	}

	getProductFromForm() {
		const product = {};
		product.weight = parseFloat(this.refs.weight.value);
		product.width = parseFloat(this.refs.width.value);
		product.height = parseFloat(this.refs.height.value);
		product.depth = parseFloat(this.refs.depth.value);
		product.description = this.refs.dsc.value;
		product.minimumStock = parseInt(this.refs.minimumStock.value);
		product.trackMinimumStock = this.refs.trackMinimumStock.checked;
		return product;
	}

	render() {
		return <div class="col">
			<div class="form-group">
				<label>Description</label>
				<textarea class="form-control" rows="6" ref="dsc" defaultValue={this.product !== undefined ? this.product.description : ''}></textarea>
			</div>
			<div class="form-row">
				<div class="col">
					<label>Weight</label>
					<input type="number" class="form-control" min="0" ref="weight" defaultValue={this.product !== undefined ? this.product.weight : '0'} />
				</div>
				<div class="col">
					<label>Width</label>
					<input type="number" class="form-control" min="0" ref="width" defaultValue={this.product !== undefined ? this.product.width : '0'} />
				</div>
				<div class="col">
					<label>Height</label>
					<input type="number" class="form-control" min="0" ref="height" defaultValue={this.product !== undefined ? this.product.height : '0'} />
				</div>
				<div class="col">
					<label>Depth</label>
					<input type="number" class="form-control" min="0" ref="depth" defaultValue={this.product !== undefined ? this.product.depth : '0'} />
				</div>
				<div class="col">
					<input type="checkbox" defaultChecked={this.product !== undefined ? this.product.trackMinimumStock : false} ref="trackMinimumStock" />
					<label>Track minimum stock</label>
				</div>
				<div class="col">
					<label>Minimum stock</label>
					<input type="number" class="form-control" min="0" ref="minimumStock" defaultValue={this.product !== undefined ? this.product.minimumStock : '0'} />
				</div>
			</div>
		</div>
	}
}

export default ProductFormMoreData;
