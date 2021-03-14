import React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle as MuiDialogTitle,
  DialogActions,
  Grid,
  IconButton,
  Typography,
} from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  dialog: {
    marginTop: theme.spacing(2),
  },
  label: {
    color: theme.palette.grey[500],
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

const DialogTitle = (props) => {
  const classes = useStyles();
  const { children, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
};

const ScenarioDetails = (props) => {
  const classes = useStyles();
  const { scenario, open, handleClose } = props;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle onClose={handleClose}>{scenario.name}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="subtitle1">
              <span className={classes.label}>Team:</span> {scenario.team}
              <br />
              <span className={classes.label}>Owner:</span> {scenario.owner}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1">
              <span className={classes.label}>Incidents:</span>{" "}
              {scenario.incident && scenario.incident.enabled ? "Enabled" : "Disabled"}
              <br />
              <span className={classes.label}>Dashboard:</span>{" "}
              {scenario.dashboard && scenario.dashboard.enabled ? "Enabled" : "Disabled"}
              <br />
              <span className={classes.label}>Email:</span>{" "}
              {scenario.dashboard && scenario.email.enabled ? "Enabled" : "Disabled"}
              <br />
              <span className={classes.label}>Cron:</span>{" "}
              {scenario.dashboard && scenario.cron.enabled ? "Enabled" : "Disabled"}
            </Typography>
          </Grid>
        </Grid>
        <DialogContentText className={classes.dialog}>{scenario.desc}</DialogContentText>
        <DialogActions>
          <Button component={Link} to={"/scenarios/" + scenario._id}>
            Go to scenario
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default ScenarioDetails;
