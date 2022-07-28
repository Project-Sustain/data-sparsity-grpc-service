
import { React } from 'react'
import { useTheme } from '@mui/material/styles';
import { makeStyles } from "@material-ui/core";
import { Paper, Typography, Stack, LinearProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const useStyles = makeStyles({
  paper: {
    margin: "10px",
    padding: "10px",
  },
  listHeader: {
    margin: "20px"
  },
  list: {
    margin: "10px",
    padding: "10px",
    maxHeight: "45vh",
    overflow: "auto"
  }
});

export default function SparsityTable(props) {
    const theme = useTheme();
    const classes = useStyles(theme);

    if(props.streamComplete && !props.noData) {
      return (
        <Paper className={classes.paper} elevation={2}>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Typography align='center' variant='h5'>Sparsity Score Table</Typography>
            {returnDataGrid()}
          </Stack>
        </Paper>
      );
    }

    else if(props.streamComplete && props.noData) {
        return (
            <Paper elevation={2} className={classes.paper}>
                <Typography>No Data Matching Request</Typography>
            </Paper>
        );
    }

    else if(props.requestPending) {
      return (
        <Paper className={classes.paper} elevation={2}>
          <Typography>Sparsity Data Coming...</Typography>
          <LinearProgress />
        </Paper>
      );
    }

    else return null;

    function returnDataGrid() {
      const columns = [
        {field: 'id', headerName: '', width: 100},
        {field: 'monitorId', headerName: 'Monitor ID', width: 450},
        {field: 'sparsityScore', headerName: 'Sparsity Score', width: 200}
      ]
      const rows = props.sparsityData.map((site, index) => {
        return {id: index, monitorId: site.monitorId, sparsityScore: site.sparsityScore};
      });
      return (
        <div style={{ height: 400, width: 750 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={100}
            rowsPerPageOptions={[100]}
            onCellClick={params => {props.setSelectedIndex(params.id)}}
          />
        </div>
      );
    }

}
