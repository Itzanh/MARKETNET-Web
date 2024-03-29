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
import AlertModal from "../../AlertModal";
import LocateWarehouse from "../../Warehouse/Warehouse/LocateWarehouse";



class Needs extends Component {
    constructor({ getNeeds, purchaseNeeds, getWarehouses }) {
        super();

        this.getNeeds = getNeeds;
        this.purchaseNeeds = purchaseNeeds;
        this.getWarehouses = getWarehouses;

        this.needs = [];
        this.selectedNeeds = [];

        this.add = this.add.bind(this);
    }

    componentDidMount() {
        this.renderNeeds();
    }

    renderNeeds() {
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

        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        ReactDOM.render(<LocateWarehouse
            getWarehouses={this.getWarehouses}
            handleSelect={(warehouseId) => {
                this.purchaseNeeds({
                    needs: needs,
                    warehouse: warehouseId
                }).then((ok) => {
                    if (ok.ok) {
                        this.renderNeeds();
                    } else {
                        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
                        switch (ok.errorCode) {
                            case 0: {
                                ReactDOM.render(<AlertModal
                                    modalTitle={i18next.t('VALIDATION-ERROR')}
                                    modalText={i18next.t('an-unknown-error-has-happened')}
                                />, this.refs.renderModal);
                                break;
                            }
                            case 1: {
                                ReactDOM.render(<AlertModal
                                    modalTitle={i18next.t('VALIDATION-ERROR')}
                                    modalText={i18next.t('no-needs-selected')}
                                />, this.refs.renderModal);
                                break;
                            }
                            case 2: {
                                ReactDOM.render(<AlertModal
                                    modalTitle={i18next.t('VALIDATION-ERROR')}
                                    modalText={i18next.t('the-product-selected-is-a-manufacturing-product')}
                                />, this.refs.renderModal);
                                break;
                            }
                            case 3: {
                                ReactDOM.render(<AlertModal
                                    modalTitle={i18next.t('VALIDATION-ERROR')}
                                    modalText={i18next.t('the-product-does-not-have-a-supplier')}
                                />, this.refs.renderModal);
                                break;
                            }
                            case 4: {
                                ReactDOM.render(<AlertModal
                                    modalTitle={i18next.t('VALIDATION-ERROR')}
                                    modalText={i18next.t('no-quantity-specified')}
                                />, this.refs.renderModal);
                                break;
                            }
                            case 5: {
                                ReactDOM.render(<AlertModal
                                    modalTitle={i18next.t('VALIDATION-ERROR')}
                                    modalText={i18next.t('the-supplier-does-not-have-a-main-billing-address')}
                                />, this.refs.renderModal);
                                break;
                            }
                            case 6: {
                                ReactDOM.render(<AlertModal
                                    modalTitle={i18next.t('VALIDATION-ERROR')}
                                    modalText={i18next.t('the-supplier-does-not-have-a-main-shipping-address')}
                                />, this.refs.renderModal);
                                break;
                            }
                            case 7: {
                                ReactDOM.render(<AlertModal
                                    modalTitle={i18next.t('VALIDATION-ERROR')}
                                    modalText={i18next.t('the-supplier-does-not-have-a-payment-method')}
                                />, this.refs.renderModal);
                                break;
                            }
                            case 8: {
                                ReactDOM.render(<AlertModal
                                    modalTitle={i18next.t('VALIDATION-ERROR')}
                                    modalText={i18next.t('the-supplier-does-not-have-a-billing-series')}
                                />, this.refs.renderModal);
                                break;
                            }
                        }
                    }
                });
            }}
        />, this.refs.renderModal);
    }

    render() {
        return <div id="tabNeeds">
            <div ref="renderModal"></div>
            <h4 className="ml-2">{i18next.t('needs')}</h4>
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
