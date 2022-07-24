
import { React, useState } from 'react'
// import { makeStyles } from "@material-ui/core";
import { Container, Stack } from '@mui/material';
import UseConnectionStatus from './hooks/UseConnectionStatus';
import ConnectionStatus from './components/ConnectionStatus';
import UseSparsityScoreGenerator from './hooks/UseSparsityScoreGenerator';
import SparsityTable from './components/SparsityTable';
import SelectedSite from './components/SelectedSite';
import SparsityScoresChart from './components/SparsityScoresChart';
import EpochTimeChart from './components/EpochTimeChart';

export default function App() {
  const { serverConnection, DbConnection } = UseConnectionStatus();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { sparsityData } = UseSparsityScoreGenerator(setSelectedIndex);

  return (
    <>
      <Stack direction='row'>
        <Container maxWidth='auto'>
          <Stack>
            <ConnectionStatus serverConnection={serverConnection} DbConnection={DbConnection} />
            <SparsityTable selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} sparsityData={sparsityData} />
          </Stack>
        </Container>
        <Container maxWidth='auto'>
          <Stack>
            <SparsityScoresChart sparsityData={sparsityData} />
            <SelectedSite site={sparsityData[selectedIndex]} />
          </Stack>
        </Container>
      </Stack>

      <Stack direction='row'>
        <Container maxWidth='auto'>
            <Stack>
              <EpochTimeChart sparsityData={sparsityData} />
            </Stack>
          </Container>
      </Stack>
    </>

    );
}
