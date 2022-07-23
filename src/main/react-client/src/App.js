
import { React, useState } from 'react'
// import { makeStyles } from "@material-ui/core";
import { Container, Stack } from '@mui/material';
import UseConnectionStatus from './hooks/UseConnectionStatus';
import ConnectionStatus from './components/ConnectionStatus';
import UseSparsityScoreGenerator from './hooks/UseSparsityScoreGenerator';
import SparsityTable from './components/SparsityTable';
import SelectedSite from './components/SelectedSite';
import TestChart from './components/TestChart';

export default function App() {
  const { serverConnection, DbConnection } = UseConnectionStatus();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { sparsityData } = UseSparsityScoreGenerator(setSelectedIndex);

  console.log({selectedIndex})

  if(serverConnection && DbConnection) {
    return (
      <>
        <Stack direction='row'>
          <Container maxWidth='sm'>
              <ConnectionStatus serverConnection={serverConnection} DbConnection={DbConnection}/>
          </Container>
          <Container maxWidth='auto'>
              <SparsityTable selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} sparsityData={sparsityData}/>
          </Container>
        </Stack>
        <Stack direction='row'>
          <Container maxWidth='auto'>
              <SelectedSite site={sparsityData[selectedIndex]}/>
          </Container>
          <Container maxWidth='auto'>
              <TestChart sparsityData={sparsityData} />
          </Container>
        </Stack>
      </>
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
