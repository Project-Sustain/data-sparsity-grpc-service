
import { React, useState } from 'react'
import { makeStyles } from "@material-ui/core";
import { Container, Stack } from '@mui/material';
import UseConnectionStatus from './hooks/UseConnectionStatus';
import ConnectionStatus from './components/ConnectionStatus';
import UseSparsityScoreGenerator from './hooks/UseSparsityScoreGenerator';
import SparsityTable from './components/SparsityTable';
import SelectedSite from './components/SelectedSite';

const useStyles = makeStyles({
  root: {
  }
});

export default function App() {
  const classes = useStyles();
  const { serverConnection, DbConnection } = UseConnectionStatus();
  const { sparsityData } = UseSparsityScoreGenerator();
  const [selectedIndex, setSelectedIndex] = useState(0);

  if(serverConnection && DbConnection) {
    return (
      <Stack direction='row'>
        <Container maxWidth='xs'>
            <ConnectionStatus serverConnection={serverConnection} DbConnection={DbConnection}/>
        </Container>
        <Container maxWidth='med'>
            <SparsityTable selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} sparsityData={sparsityData}/>
        </Container>
        <Container maxWidth='med'>
            <SelectedSite site={sparsityData[selectedIndex]}/>
        </Container>
      </Stack>
    );
  }

  else {
    return (
      <Stack direction='row'>
        <Container maxWidth='xs'>
            <ConnectionStatus serverConnection={serverConnection} DbConnection={DbConnection}/>
        </Container>
      </Stack>
    );
  }
}
