import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import Sum from '../libs/Sum';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: '8px',
    display: 'flex',
    width: '80%',
  },
  paper: {
    position: 'relative',
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
    paddingTop: '100%',
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
}));

function MySubjects() {
  const classes = useStyles();

  function FormRow() {
    return (
      <React.Fragment>
        <Grid item xs={4}>
          <Paper className={classes.paper}>
            <div className={classes.content}>{'' + Sum(1, 2)}</div>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>
            <div className={classes.content}>과목2</div>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>
            <div className={classes.content}>과목3</div>
          </Paper>
        </Grid>
      </React.Fragment>
    );
  }
  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid container item xs={12} spacing={2}>
          <FormRow />
        </Grid>
        <Grid container item xs={12} spacing={2}>
          <FormRow />
        </Grid>
        <Grid container item xs={12} spacing={2}>
          <FormRow />
        </Grid>
      </Grid>
    </div>
  );
}

export default MySubjects;
