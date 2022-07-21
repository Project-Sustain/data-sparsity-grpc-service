
import {React} from 'react'
import { makeStyles } from "@material-ui/core";
import UseConnectionStatus from './hooks/UseConnectionStatus';
import ConnectionStatus from './components/ConnectionStatus';
import { Container } from '@mui/material';
import UseSparsityScoreGenerator from './hooks/UseSparsityScoreGenerator';

const useStyles = makeStyles({
  root: {
  }
});

export default function App() {
  const classes = useStyles();
  const { serverConnection, DbConnection } = UseConnectionStatus();
  const { sparsityData } = UseSparsityScoreGenerator();
  console.log({sparsityData});

  return (
    <Container maxWidth='xs'>
      <ConnectionStatus serverConnection={serverConnection} DbConnection={DbConnection}/>
    </Container>
  );
}
