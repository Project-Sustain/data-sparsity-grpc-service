
import { React } from 'react'
import { makeStyles } from "@material-ui/core";
import UseConnectionStatus from './hooks/UseConnectionStatus';
import ConnectionStatus from './components/ConnectionStatus';
import { Container, Stack } from '@mui/material';
import SparsityData from './components/SparsityData';
// import UseSparsityScoreGenerator from './hooks/UseSparsityScoreGenerator';

const useStyles = makeStyles({
  root: {
  }
});

export default function App() {
  const classes = useStyles();
  const { serverConnection, DbConnection } = UseConnectionStatus();
  // const { sparsityScores } = UseSparsityScoreGenerator();
  // console.log({sparsityScores});

  return (
    <Container maxWidth='lg'>
      <Stack direction='column' justifyContent='center' alignItems='center'>
        <ConnectionStatus serverConnection={serverConnection} DbConnection={DbConnection}/>
        <SparsityData/>
      </Stack>
    </Container>
  );
}
