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
