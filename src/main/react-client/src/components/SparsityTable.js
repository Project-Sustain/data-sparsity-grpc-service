
import { React, useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles';
import { makeStyles } from "@material-ui/core";
import { Paper, Typography, List, ListItemButton, Stack, ListItemText, ListSubheader } from '@mui/material';

const useStyles = makeStyles({
  paper: {
    margin: "10px",
    padding: "10px",
    maxHeight: "70vh",
    overflow: "auto"
  },
  listHeader: {
    margin: "0px"
  }
});

export default function SparsityTable(props) {
    const theme = useTheme();
    const classes = useStyles(theme);

    const handleListItemClick = (event, index) => {
      props.setSelectedIndex(index);
    };
    
    function getItemButton(siteData, index) {
      const sparsityScore = siteData.sparsityScore.toFixed(3);
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
          <List component="nav">
            <ListSubheader className={classes.listHeader}>
              <Stack direction='row' justifyContent='space-between'>
                <Typography>Monitor Id</Typography>
                <Typography>Sparsity Score</Typography>
              </Stack>
            </ListSubheader>
            {
              props.sparsityData.map((siteData, index) => {
                return getItemButton(siteData, index)
              })
            }
          </List>
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
}
