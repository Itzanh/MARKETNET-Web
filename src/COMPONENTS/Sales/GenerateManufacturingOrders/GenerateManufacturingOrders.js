/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import { Component } from "react";
import i18next from 'i18next';
import { DataGrid } from '@material-ui/data-grid';
import ReactDOM from 'react-dom';
import AlertModal from "../../AlertModal";



class GenerateManufacturingOrders extends Component {
    constructor({ getSalesOrderDetailWaitingForManufacturingOrders, manufacturingOrderPartiallySaleOrder }) {
        super();

        this.getSalesOrderDetailWaitingForManufacturingOrders = getSalesOrderDetailWaitingForManufacturingOrders;
        this.manufacturingOrderPartiallySaleOrder = manufacturingOrderPartiallySaleOrder;

        this.list = [];
        this.selectedDetails = [];

        this.manufacturingOrderSelected = this.manufacturingOrderSelected.bind(this);
    }

    componentDidMount() {
        this.getSalesOrderDetailWaitingForManufacturingOrders().then((list) => {
            this.list = list;
            this.forceUpdate();
        });
    }

    manufacturingOrderSelected() {
        const details = [];

        for (let i = 0; i < this.selectedDetails.length; i++) {
            for (let j = 0; j < this.list.length; j++) {
                if (this.selectedDetails[i] === this.list[j].id) {
                    details.push({
                        orderId: this.list[j].orderId,
                        id: this.list[j].id,
                        quantity: this.list[j].quantity
                    });
                }
            }
        }

        if (details.length === 0) {
            return;
        }
        const request = {
            selection: details
        };
        ReactDOM.unmountComponentAtNode(this.refs.renderModal);
        this.manufacturingOrderPartiallySaleOrder(request).then((ok) => {
            if (ok) {
                ReactDOM.render(<AlertModal
                    modalTitle={i18next.t('generation-result')}
                    modalText={i18next.t('document-generated-successfully')}
                />, this.refs.renderModal);
            } else {
                ReactDOM.render(<AlertModal
                    modalTitle={i18next.t('generation-result')}
                    modalText={i18next.t('error-document-not-generated')}
                />, this.refs.renderModal);
            }
        });
    }

    render() {
        return <div id="tabSalesOrders" className="formRowRoot">
            <div ref="renderModal"></div>
            <h4 className="ml-2">{i18next.t('generate-manufacturing-orders')}</h4>
            <button type="button" class="btn btn-primary mt-1 mb-1 ml-1" onClick={this.manufacturingOrderSelected}>
                {i18next.t('manufacturing-order-selected')}
            </button>
            <DataGrid
                ref="table"
                autoHeight
                rows={this.list}
                columns={[
                    {
                        field: 'productName', headerName: i18next.t('product'), flex: 1, valueGetter: (params) => {
                            return params.row.product.name;
                        }
                    },
                    { field: 'orderName', headerName: i18next.t('sale-order'), width: 500 },
                    { field: 'customerName', headerName: i18next.t('customer'), width: 500 },
                ]}
                checkboxSelection
                onSelectionModelChange={(data) => {
                    this.selectedDetails = data;
                }}
            />
        </div>
    }
};



export default GenerateManufacturingOrders;
