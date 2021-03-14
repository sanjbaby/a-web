import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";
import { Delete as DeleteIcon } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import { closeVariableForm, deleteVariable, saveVariable } from "../actions/variablesActions";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    width: "100%",
    padding: theme.spacing(2),
  },
  grow: {
    flexGrow: 1,
  },
  dialogActions: {
    alignItems: "center",
  },
}));

const VariableForm = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { envs } = useSelector((state) => state.settings.settings.connections);
  const variables = useSelector((state) => state.variables);
  const { formDefaultValues } = variables;

  const [openConfirm, setConfirmOpen] = React.useState(false);

  const { handleSubmit, control, errors, formState } = useForm({
    mode: "onBlur",
  });

  const onSubmit = (values) => {
    let variable = {
      env: values.env,
      key: values.key.toLowerCase(),
      value: values.value,
      desc: values.desc,
    };
    console.log(variable);
    formDefaultValues._id
      ? dispatch(saveVariable(variable, formDefaultValues._id, formDefaultValues._etag))
      : dispatch(saveVariable(variable));
  };

  const handleConfirmOpen = () => {
    setConfirmOpen(true);
  };

  const handleConfirmClose = (confirm) => {
    confirm && dispatch(deleteVariable(formDefaultValues._id, formDefaultValues._etag));
    setConfirmOpen(false);
  };

  const ConfirmDialog = () => {
    return (
      <Dialog
        onClose={handleConfirmClose}
        aria-labelledby="customized-dialog-title"
        open={openConfirm}
      >
        <DialogTitle id="customized-dialog-title" onClose={() => handleConfirmClose(false)}>
          Delete variable
        </DialogTitle>
        <DialogContent dividers>Are you sure you want to delete variable?</DialogContent>
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
    <Dialog
      open={variables.formOpen}
      onClose={() => dispatch(closeVariableForm())}
      aria-labelledby="form-dialog-title"
      scroll="body"
      fullWidth
      maxWidth="md"
      disableBackdropClick
    >
      <ConfirmDialog />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={classes.container}>
          <Typography variant="h6">
            {formDefaultValues._id ? <span>Edit variable</span> : <span>Add variable</span>}
          </Typography>
          <div className={classes.grow} />
          {formDefaultValues._id && (
            <IconButton onClick={handleConfirmOpen}>
              <DeleteIcon />
            </IconButton>
          )}
        </div>
        <DialogContent>
          <DialogContentText>
            Key should be on #{"{"}key{"}"} format and need to be unique within an environment.
          </DialogContentText>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Controller
                as={TextField}
                name="key"
                label="Key"
                placeholder="Key"
                required
                fullWidth
                control={control}
                rules={{ required: true, pattern: /^#{[a-z_]+}$/ }}
                error={!!errors.key}
                defaultValue={formDefaultValues.key}
              />
            </Grid>
            <Grid item xs={4}>
              <Controller
                as={TextField}
                name="value"
                label="Value"
                required
                fullWidth
                control={control}
                rules={{ required: true }}
                error={!!errors.value}
                className={classes.field}
                defaultValue={formDefaultValues.value}
              />
            </Grid>
            <Grid item xs={4}>
              <Controller
                as={TextField}
                select
                name="env"
                label="Environment"
                required
                fullWidth
                control={control}
                rules={{ required: true }}
                error={!!errors.env}
                defaultValue={formDefaultValues.env}
              >
                <MenuItem value="" />
                {envs.map((env) => (
                  <MenuItem key={env} value={env}>
                    {env}
                  </MenuItem>
                ))}
              </Controller>
            </Grid>
            <Grid item xs={12}>
              <Controller
                as={TextField}
                name="desc"
                label="Description"
                helperText="Short description clarifying what the variable is used for."
                multiline
                rows={2}
                fullWidth
                required
                control={control}
                rules={{ required: true }}
                error={!!errors.desc}
                defaultValue={formDefaultValues.desc}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          {(variables.isSaving || variables.isDeleting) && <CircularProgress size={15} />}
          <Button
            onClick={() => dispatch(closeVariableForm())}
            color="secondary"
            disabled={variables.isSaving || variables.isDeleting}
          >
            Close
          </Button>
          <Button
            type="submit"
            color="primary"
            disabled={
              variables.isSaving || variables.isDeleting || !formState.isValid || !formState.dirty
            }
          >
            Save
          </Button>
        </DialogActions>
        {!variables.isSaving && variables.saveError && (
          <Alert severity="error">Could not save variable: {variables.saveError}.</Alert>
        )}
        {!variables.isDeleting && variables.deleteError && (
          <Alert severity="error">Could not delete variable: {variables.deleteError}.</Alert>
        )}
        {!variables.isSaving && variables.saveIssues.length !== 0 && (
          <Alert severity="error">
            Error saving field "{variables.saveIssues[0].name}": {variables.saveIssues[0].message}.
          </Alert>
        )}
      </form>
    </Dialog>
  );
};

export default VariableForm;
