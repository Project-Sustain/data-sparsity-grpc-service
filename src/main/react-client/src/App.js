
import { React, useState } from 'react'
import { Container, Stack } from '@mui/material';
import UseConnectionStatus from './hooks/UseConnectionStatus';
import ApplicationStatus from './components/ApplicationStatus';
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
  const [sparsityData, setSparsityData] = useState({});
  const [streamComplete, setStreamComplete] = useState(false);
  const [requestPending, setRequestPending] = useState(false);

  return (
    <ThemeProvider theme={theme}>

      <Stack direction='row'>
        <Container maxWidth='auto'>
          <Stack>
            <ApplicationStatus setRequestPending={setRequestPending} setStreamComplete={setStreamComplete} setSelectedIndex={setSelectedIndex} setSparsityData={setSparsityData} serverConnection={serverConnection} DbConnection={DbConnection} />
            <SparsityTable requestPending={requestPending} streamComplete={streamComplete} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} sparsityData={sparsityData} />
          </Stack>
        </Container>

        <Container maxWidth='auto'>
          <Stack>
            <SelectedSite requestPending={requestPending} streamComplete={streamComplete} site={sparsityData[selectedIndex]} />
            <SparsityScoresChart requestPending={requestPending} streamComplete={streamComplete} sparsityData={sparsityData} />
          </Stack>
        </Container>
      </Stack>

      <Stack direction='row'>
        <Container maxWidth='auto'>
            <Stack>
              <EpochTimeChart requestPending={requestPending} streamComplete={streamComplete} sparsityData={sparsityData} />
            </Stack>
          </Container>
      </Stack>

    </ThemeProvider>
    );
}
