
import { React } from 'react'
import { useTheme } from '@mui/material/styles';
import { makeStyles } from "@material-ui/core";
import { Paper, Typography, List, ListItemButton, Stack, ListItemText, ListSubheader, Table, TableBody, TableCell, TableHead, TableRow, TableContainer } from '@mui/material';
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

    const handleListItemClick = (event, index) => {
      props.setSelectedIndex(index);
    };
    
    function getItemButton(siteData, index) {
      const sparsityScore = siteData.sparsityScore;
      return(
        <ListItemButton
          key={index}
          selected={props.selectedIndex === index}
          onClick={(event) => handleListItemClick(event, index)}
        >
          <ListItemText primary={siteData.monitorId} />
          <Typography edge='end'>{sparsityScore}</Typography>
        </ListItemButton>
      );
    }

    if(props.sparsityData.length > 0) {
      return (
        <Paper className={classes.paper} elevation={2}>
          <Typography align='center' variant='h5'>Sparsity Score Table</Typography>
          {returnTable()}
        </Paper>
      );
    }

    else {
      return (
        <Paper className={classes.paper} elevation={2}>
          <Typography>Sparsity Data Coming...</Typography>
        </Paper>
      );
    }

    function returnTable() {
      return (
          <TableContainer component={Paper} className={classes.list} >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Monitor ID</TableCell>
                  <TableCell>Sparsity Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  props.sparsityData.map((siteData, index) => {
                    return (
                      <TableRow
                        key={index}
                        onClick={(event) => handleListItemClick(event, index)}
                      >
                        <TableCell>{siteData.monitorId}</TableCell>
                        <TableCell align='right'>{siteData.sparsityScore}</TableCell>
                      </TableRow>
                    );
                  })
                }
              </TableBody>
            </Table>
          </TableContainer>
      );
    }

    function returnList() {
      return (
        <List component="nav" className={classes.list} disablePadding>
          <ListSubheader disableGutters>
            <Stack direction='row' justifyContent='space-between'>
              <Typography className={classes.listHeader}>Monitor Id</Typography>
              <Typography className={classes.listHeader}>Sparsity Score</Typography>
            </Stack>
          </ListSubheader>
          {
            props.sparsityData.map((siteData, index) => {
              return getItemButton(siteData, index)
            })
          }
        </List>
      );
    }
}
