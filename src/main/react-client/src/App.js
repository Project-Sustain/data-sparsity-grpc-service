
import { useEffect, useState } from 'react'
import { Container, Stack } from '@mui/material';
import UseConnectionStatus from './hooks/UseConnectionStatus';
import ApplicationStatus from './components/ApplicationStatus';
import SparsityTable from './components/dataDashboard/SparsityTable';
import SelectedSite from './components/dataDashboard/SelectedSite';
import SparsityScoresChart from './components/dataDashboard/charts/SparsityScoresChart';
import EpochTimeChart from './components/dataDashboard/charts/EpochTimeChart';
import RequestForm from './components/request/RequestForm';
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
  const [sparsityData, setSparsityData] = useState([]);
  const [streamComplete, setStreamComplete] = useState(false);
  const [requestPending, setRequestPending] = useState(false);
  const [noData, setNoData] = useState(false);

  console.log("Number of Streamed Results: " + sparsityData.length);

  useEffect(() => {
    setNoData(sparsityData.length === 0);
  }, [sparsityData]);

  return (
    <ThemeProvider theme={theme}>

      <Stack direction='row'>
        <Container maxWidth='auto'>
          <Stack>
            <ApplicationStatus setRequestPending={setRequestPending} setStreamComplete={setStreamComplete} setSelectedIndex={setSelectedIndex} setSparsityData={setSparsityData} serverConnection={serverConnection} DbConnection={DbConnection} />
            <RequestForm setRequestPending={setRequestPending} setStreamComplete={setStreamComplete} setSparsityData={setSparsityData} setSelectedIndex={setSelectedIndex} />
            <SelectedSite noData={noData} requestPending={requestPending} streamComplete={streamComplete} site={sparsityData[selectedIndex]} />
          </Stack>
        </Container>

        <Container maxWidth='auto'>
          <Stack>
            <SparsityScoresChart noData={noData} requestPending={requestPending} streamComplete={streamComplete} sparsityData={sparsityData} />
            <SparsityTable noData={noData} requestPending={requestPending} streamComplete={streamComplete} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} sparsityData={sparsityData} />
          </Stack>
        </Container>
      </Stack>

      <Stack direction='row'>
        <Container maxWidth='auto'>
            <Stack>
              <EpochTimeChart noData={noData} requestPending={requestPending} streamComplete={streamComplete} sparsityData={sparsityData} />
            </Stack>
          </Container>
      </Stack>

    </ThemeProvider>
    );
}
