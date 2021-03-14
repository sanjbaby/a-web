import React from "react";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle as MuiDialogTitle,
  IconButton,
  Typography,
} from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { JsonViewer } from "../shared/JsonViewer";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
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

const TemplateDetails = (props) => {
  const { template, open, handleClose } = props;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle onClose={handleClose}>{template.name}</DialogTitle>
      <DialogContent>
        <DialogContentText>Path: {template.path}</DialogContentText>
        <DialogContentText>
          Team: {template.team}
          <br />
          Owner: {template.owner}
        </DialogContentText>
        <DialogContentText>{template.desc}</DialogContentText>
        <JsonViewer value={JSON.stringify(template.template, null, 2)} />
        <DialogContentText>{template.guide}</DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateDetails;
