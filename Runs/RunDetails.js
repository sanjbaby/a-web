import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@material-ui/core";
import { Delete as DeleteIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import moment from "moment-timezone";
import StatusIcons from "../shared/StatusIcons";
import { deleteRun } from "../actions/runsActions";
import { useHistory } from "react-router";
import api from "../api";
import download from "downloadjs";

const dateFormat = "ddd, YYYY-MM-DD";
const timeFormat = "HH:mm:ss z";
const elapsedFormat = "HH:mm:ss";
const dateTimeFormat = "ddd, YYYY-MM-DD HH:mm:ss z";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  item: {
    minWidth: "200px",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  fot: {
    marginTop: 12,
  },
  summary: {
    fontWeight: "bold",
  },
  delete: {
    marginLeft: "auto",
  },
});

const Timer = (props) => {
  const { startTime } = props;
  const [elapsed, setElapsed] = useState(moment().diff(moment(startTime)));

  useEffect(() => {
    const timer = setInterval(() => setElapsed(moment().diff(moment(startTime))), 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  return moment.utc(elapsed).format(elapsedFormat);
};

const RunDetails = (props) => {
  const { run, instances } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [openConfirm, setConfirmOpen] = useState(false);
  const scenario = useSelector((state) =>
    state.scenarios.items.find((scenario) => scenario.name === run.scenario)
  );
  const scenario_id = scenario ? scenario._id : "";

  const total = instances.length;
  const passed = instances.filter((instance) => instance.status === "passed").length;
  const failed = instances.filter((instance) => instance.status === "failed").length;
  const cancelled = instances.filter((instance) => instance.status === "cancelled").length;
  const skipped = instances.filter((instance) => instance.status === "skipped").length;
  const errors = instances.filter((instance) => instance.status === "error").length;

  const handleConfirmClose = (confirm) => {
    confirm && dispatch(deleteRun(run, history));
    setConfirmOpen(false);
  };

  const ConfirmDialog = () => {
    return (
      <Dialog
        onClose={() => handleConfirmClose(false)}
        aria-labelledby="customized-dialog-title"
        open={openConfirm}
      >
        <DialogTitle id="customized-dialog-title" onClose={() => handleConfirmClose(false)}>
          Delete run
        </DialogTitle>
        <DialogContent dividers>
          Are you sure you want to delete run? All test results will be deleted.
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => handleConfirmClose(false)} color="secondary">
            Cancel
          </Button>
          <Button autoFocus onClick={() => handleConfirmClose(true)} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <div>
      <ConfirmDialog />
      <Card className={classes.root}>
        <CardContent>
          <Grid container className={classes.fot}>
            <Grid item xs={11}>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                Scenario
              </Typography>
              <Typography variant="h5" component="h2">
                {run.scenario}
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
                {run.team}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              {StatusIcons[run.status]}
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={8} sm={8} md={6} lg={4}>
              <Typography className={classes.item} color="textSecondary">
                Environment:
              </Typography>
            </Grid>
            <Grid item xs>
              <Typography color="textPrimary">{run.env}</Typography>
            </Grid>
          </Grid>
          {run.status === "scheduled" ? (
            <Grid container className={classes.fot}>
              <Grid item xs={8} sm={8} md={6} lg={4}>
                <Typography color="textSecondary">Scheduled:</Typography>
              </Grid>
              <Grid item xs>
                <Typography color="textPrimary">
                  {moment(run.scheduled_date).format(dateTimeFormat)}
                </Typography>
              </Grid>
            </Grid>
          ) : (
            <Grid container className={classes.fot}>
              <Grid item xs={8} sm={8} md={6} lg={4}>
                <Typography color="textSecondary">Date:</Typography>
                <Typography color="textSecondary">Started:</Typography>
                <Typography color="textSecondary">Finished:</Typography>
                <Typography color="textSecondary">Run time:</Typography>
              </Grid>
              <Grid item xs>
                <Typography color="textPrimary">
                  {moment(run._created).format(dateFormat)}
                </Typography>
                <Typography color="textPrimary">
                  {moment(run._created).format(timeFormat)}
                </Typography>
                <Typography color="textPrimary">
                  {!["queued", "starting", "running"].includes(run.status)
                    ? moment(run._updated).format(timeFormat)
                    : "N/A"}
                </Typography>
                <Typography color="textPrimary">
                  {["queued", "starting", "running"].includes(run.status) ? (
                    <Timer startTime={run._created} />
                  ) : (
                    moment
                      .utc(moment(run._updated).diff(moment(run._created)))
                      .format(elapsedFormat)
                  )}
                </Typography>
              </Grid>
            </Grid>
          )}
          <Grid container className={classes.fot}>
            <Grid item xs={12}>
              {run.artifact ? (
                <Button
                  variant="contained"
                  onClick={() => {
                    api
                      .get("/files/" + run.artifact)
                      .then((response) => {
                        if (response.status !== 200) {
                          throw Error(response.statusText);
                        }
                        download(
                          atob(response.data.data),
                          `artifacts_${run.scenario.toLowerCase().split(" ").join("_")}${
                            run.env
                          }_${moment(run._updated).format("YYYYmmDDHHMMss")}.zip`
                        );
                      })
                      .catch(() => console.log("Could not fetch file with id " + run.artifact));
                  }}
                >
                  Download artifacts
                </Button>
              ) : (
                <Typography color="textSecondary">
                  <i>No artifacts</i>
                </Typography>
              )}
            </Grid>
          </Grid>
          <Table size="small" className={classes.fot}>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  Passed:
                </TableCell>
                <TableCell align="right">{passed}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Failed:
                </TableCell>
                <TableCell align="right">{failed}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Cancelled:
                </TableCell>
                <TableCell align="right">{cancelled}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Skipped:
                </TableCell>
                <TableCell align="right">{skipped}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Errors:
                </TableCell>
                <TableCell align="right">{errors}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" className={classes.summary}>
                  Total:
                </TableCell>
                <TableCell align="right" className={classes.summary}>
                  {total}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
        <CardActions disableSpacing>
          <Button component={Link} to={"/scenarios/" + scenario_id}>
            Go to scenario
          </Button>
          <IconButton onClick={() => setConfirmOpen(true)} className={classes.delete}>
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>
    </div>
  );
};

export default RunDetails;
