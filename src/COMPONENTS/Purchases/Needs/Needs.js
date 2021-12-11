import { Component } from "react";
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';

class Needs extends Component {
    constructor({ getNeeds, purchaseNeeds }) {
        super();

        this.getNeeds = getNeeds;
        this.purchaseNeeds = purchaseNeeds;

        this.needs = [];
        this.selectedNeeds = [];

        this.add = this.add.bind(this);
    }

    componentDidMount() {
        this.getNeeds().then((needs) => {
            this.needs = needs;
            for (let i = 0; i < this.needs.length; i++) {
                this.needs[i].id = i;
                this.needs[i].quantitySelected = this.needs[i].quantity;
            }
            this.forceUpdate();
        });
    }

    add() {
        const needs = [];

        for (let i = 0; i < this.selectedNeeds.length; i++) {
            const selectedNeed = this.needs[this.selectedNeeds[i]];
            if (selectedNeed.quantitySelected >= selectedNeed.quantity) {
                needs.push({
                    "product": selectedNeed.product,
                    "quantity": parseInt(selectedNeed.quantitySelected)
                });
            }
        }

        this.purchaseNeeds(needs);
    }

    render() {
        return <div id="tabNeeds">
            <h1>{i18next.t('needs')}</h1>
            <button type="button" class="btn btn-primary mt-1 mb-1 ml-1" onClick={this.add}>{i18next.t('generate-purchase orders-selected')}</button>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.needs}
                columns={[
                    { field: 'productName', headerName: i18next.t('product'), flex: 1 },
                    { field: 'supplierName', headerName: i18next.t('supplier'), width: 500 },
                    { field: 'quantity', headerName: i18next.t('quantity-needed'), width: 200 },
                    { field: 'quantitySelected', headerName: i18next.t('quantity-to-order'), width: 200, type: 'number', editable: true }
                ]}
                checkboxSelection
                disableSelectionOnClick
                onRowSelected={(data) => {
                    if (data.isSelected) {
                        this.selectedNeeds.push(data.data);
                    } else {
                        this.selectedNeeds.splice(this.selectedNeeds.indexOf(data.data.id), 1);
                    }
                }}
                onSelectionModelChange={(data) => {
                    this.selectedNeeds = data;
                }}
            />
        </div>
    }
}

export default Needs;
