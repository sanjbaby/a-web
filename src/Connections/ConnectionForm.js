import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";
import { Delete as DeleteIcon } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import {
  closeConnectionForm,
  deleteConnection,
  saveConnection,
} from "../actions/connectionsActions";
import { validateJson } from "../shared/validators";
import JsonEditorHook from "../shared/JsonEditor";

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

const ConnectionForm = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { types, envs } = useSelector((state) => state.settings.settings.connections);
  const connections = useSelector((state) => state.connections);
  const { formDefaultValues } = connections;

  const [openConfirm, setConfirmOpen] = React.useState(false);
  const [userConfigEnabled, setUserConfigEnabled] = React.useState(false);

  useEffect(() => {
    formDefaultValues.userConfig ? setUserConfigEnabled(true) : setUserConfigEnabled(false);
  }, [formDefaultValues]);

  const { handleSubmit, control, errors, formState, register } = useForm({
    mode: "onBlur",
  });

  const onSubmit = (values) => {
    let connection = {
      name: [values.type, values.system, values.env].join("-").toLowerCase(),
      env: values.env,
      desc: values.desc,
      config: JSON.parse(values.config),
    };
    if (values.userConfig) {
      connection.user_config = JSON.parse(values.userConfig);
    }
    formDefaultValues._id
      ? dispatch(saveConnection(connection, formDefaultValues._id, formDefaultValues._etag))
      : dispatch(saveConnection(connection));
  };

  const handleConfirmOpen = () => {
    setConfirmOpen(true);
  };

  const handleConfirmClose = (confirm) => {
    confirm && dispatch(deleteConnection(formDefaultValues._id, formDefaultValues._etag));
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
          Delete connection
        </DialogTitle>
        <DialogContent dividers>Are you sure you want to delete connection?</DialogContent>
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
      open={connections.formOpen}
      onClose={() => dispatch(closeConnectionForm())}
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
            {formDefaultValues._id ? <span>Edit connection</span> : <span>Add connection</span>}
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
            Connection names should be on format <code>type-system-env</code>. Some examples:
            <br />
            <code>sqldb-biscuit-test</code>
            <br />
            <code>nzsql-biso-prod</code>
            <br />
            <code>sqldb-infa-biscuit-dev</code>
            <br />
          </DialogContentText>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Controller
                as={TextField}
                select
                name="type"
                label="Type"
                placeholder="Type"
                required
                fullWidth
                control={control}
                rules={{ required: true }}
                error={!!errors.type}
                defaultValue={formDefaultValues.type}
              >
                <MenuItem value="" />
                {types.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Controller>
            </Grid>
            <Grid item xs={4}>
              <Controller
                as={TextField}
                name="system"
                label="System"
                required
                fullWidth
                control={control}
                rules={{ required: true }}
                error={!!errors.system}
                className={classes.field}
                defaultValue={formDefaultValues.system}
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
                as={JsonEditorHook}
                name="config"
                label="Config"
                required
                fullWidth
                rules={{
                  required: true,
                  validate: { json: (value) => validateJson(value) },
                }}
                error={!!errors.config}
                control={control}
                defaultValue={JSON.stringify(formDefaultValues.config, null, 2)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="userConfigEnabled"
                    checked={userConfigEnabled}
                    onClick={() => setUserConfigEnabled(!userConfigEnabled)}
                    inputRef={register}
                  />
                }
                label="User config differs from normal config"
              />
              {userConfigEnabled && (
                <Controller
                  as={JsonEditorHook}
                  name="userConfig"
                  label="User config"
                  required
                  fullWidth
                  rules={{
                    required: true,
                    validate: { json: (value) => validateJson(value) },
                  }}
                  error={!!errors.userConfig}
                  control={control}
                  defaultValue={
                    formDefaultValues.userConfig
                      ? JSON.stringify(formDefaultValues.userConfig, null, 2)
                      : JSON.stringify(formDefaultValues.config, null, 2)
                  }
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <Controller
                as={TextField}
                name="desc"
                label="Description"
                helperText="Short description of what environment is referred to."
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
          {(connections.isSaving || connections.isDeleting) && <CircularProgress size={15} />}
          <Button
            onClick={() => dispatch(closeConnectionForm())}
            color="secondary"
            disabled={connections.isSaving || connections.isDeleting}
          >
            Close
          </Button>
          <Button
            type="submit"
            color="primary"
            disabled={
              connections.isSaving ||
              connections.isDeleting ||
              !formState.isValid ||
              !formState.dirty
            }
          >
            Save
          </Button>
        </DialogActions>
        {!connections.isSaving && connections.saveError && (
          <Alert severity="error">Could not save connection: {connections.saveError}.</Alert>
        )}
        {!connections.isDeleting && connections.deleteError && (
          <Alert severity="error">Could not delete connection: {connections.deleteError}.</Alert>
        )}
        {!connections.isSaving && connections.saveIssues.length !== 0 && (
          <Alert severity="error">
            Error saving field "{connections.saveIssues[0].name}":{" "}
            {connections.saveIssues[0].message}.
          </Alert>
        )}
      </form>
    </Dialog>
  );
};

export default ConnectionForm;
