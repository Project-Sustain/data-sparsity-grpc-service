
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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { colors } from './helpers/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
    },
    secondary: {
      main: colors.secondary,
    },
    tertiary: {
      main: colors.tertiary
    }
  }
});

export default function App() {
  const { serverConnection, DbConnection } = UseConnectionStatus();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { sparsityData } = UseSparsityScoreGenerator(setSelectedIndex);

  return (
    <ThemeProvider theme={theme}>

      <Stack direction='row'>
        <Container maxWidth='auto'>
          <Stack>
            <ConnectionStatus serverConnection={serverConnection} DbConnection={DbConnection} />
            <SparsityTable selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} sparsityData={sparsityData} />
          </Stack>
        </Container>

        <Container maxWidth='auto'>
          <Stack>
            <SelectedSite site={sparsityData[selectedIndex]} />
            <SparsityScoresChart sparsityData={sparsityData} />
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

    </ThemeProvider>
    );
}
