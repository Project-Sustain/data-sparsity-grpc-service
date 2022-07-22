
import { React, useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles';
import { makeStyles } from "@material-ui/core";
import { Paper, Typography, List, ListItemButton, Stack, ListItemText, ListSubheader } from '@mui/material';

const useStyles = makeStyles({
  paper: {
    margin: "10px",
    padding: "10px",
    maxHeight: "70vh",
    width: "28vw",
    overflow: "auto"
  },
  listHeader: {
    margin: "0px"
  }
});

export default function SparsityData(props) {
    const theme = useTheme();
    const classes = useStyles(theme);
    const [accumulatedResults, setAccumulatedResults] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(1);

    const handleListItemClick = (event, index) => {
      setSelectedIndex(index);
    };
    

    useEffect(() => {
        (async => {
          const url = 'http://localhost:5000/sparsityScores';
          let streamedResults = [];
          fetch(url).then(async stream => {
            let reader = stream.body.getReader();     
            while (true) {
              const { done, value } = await reader.read();
              if (done) {
                break;
              }
              else {
                try {
                  const response = JSON.parse(new TextDecoder().decode(value));
                  streamedResults.push(response);
                  // const sortedResults = streamedResults.sort((a, b) => {return a.sparsityScore > b.sparsityScore});
                  setAccumulatedResults(streamedResults);
                } catch(err) {}
              }
            }
          });
        })();
    }, []);

    function getItemButton(siteData, index) {
      const sparsityScore = siteData.sparsityScore ? (siteData.sparsityScore).toFixed(3) : 0;
      return(
        <ListItemButton
          key={index}
          selected={selectedIndex === index}
          onClick={(event) => handleListItemClick(event, index)}
        >
          <ListItemText primary={siteData.monitorId} />
          <Typography edge='end'>{sparsityScore}</Typography>
        </ListItemButton>
      );
    }

    if(accumulatedResults.length > 0) {
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
              accumulatedResults.map((siteData, index) => {
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
