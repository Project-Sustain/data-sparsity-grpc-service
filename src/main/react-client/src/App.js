
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

  console.log({sparsityData})

  if(serverConnection && DbConnection) {
    return (
      <Stack direction='row'>
        <Container maxWidth='auto'>
          <Stack>
                <ConnectionStatus serverConnection={serverConnection} DbConnection={DbConnection}/>
                <SparsityTable selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} sparsityData={sparsityData}/>
          </Stack>
        </Container>
        <Container maxWidth='auto'>
        <Stack>
            <SelectedSite site={sparsityData[selectedIndex]}/>
            <TestChart sparsityData={sparsityData} />
        </Stack>
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
