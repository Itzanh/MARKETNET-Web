/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import { useGridSlotComponentProps } from '@material-ui/data-grid';
import { TablePagination, Grid } from '@material-ui/core';



function CustomPagination({ footer }) {
    const { state, apiRef, options } = useGridSlotComponentProps();
    return (
        <Grid container direction="row">
            <Grid item xs={10}>
                {footer}
            </Grid>
            <Grid item xs={2}>
                <TablePagination
                    count={state.pagination.rowCount}
                    page={state.pagination.page}
                    onPageChange={(event, value) => apiRef.current.setPage(value)}
                    rowsPerPage={options.pageSize}
                    rowsPerPageOptions={[]}
                />
            </Grid>
        </Grid>
    );
};



export default CustomPagination;
