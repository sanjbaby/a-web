import React, { useEffect, useState } from "react";
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
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@material-ui/core";
import { Delete as DeleteIcon } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import { closeTemplateForm, deleteTemplate, saveTemplate } from "../actions/templatesActions";
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
  divider: {
    marginBottom: theme.spacing(2),
  },
  field: {
    width: "100%",
  },
}));

const TemplateForm = (props) => {
  const classes = useStyles();
  const { teams, repos } = useSelector((state) => state.settings.settings);
  const templates = useSelector((state) => state.templates);
  const { formDefaultValues } = templates;
  const dispatch = useDispatch();
  const { handleSubmit, control, register, errors, formState } = useForm({
    mode: "onBlur",
  });

  const onSubmit = (values) => {
    let template = {
      name: values.name,
      owner: values.owner,
      team: values.team,
      repo: values.repo,
      path: values.path,
      desc: values.desc,
      guide: values.guide,
      dashboard: values.dashboard === "yes",
    };
    template.template = JSON.parse(values.template);
    let dashboard = Object.assign(
      {},
      values.dashboard === "yes" ? { compatible: true } : { compatible: false }
    );
    let metadata = Object.assign(
      {},
      values.area && { area: values.area },
      values.system && { system: values.system },
      values.category && { category: values.category },
      values.type && { type: values.type },
      values.breakdown && { breakdown: values.breakdown },
      values.cadence && { cadence: values.cadence }
    );
    template = Object.assign(template, metadata && { metadata: metadata });
    template = Object.assign(template, dashboard && { dashboard: dashboard });
    formDefaultValues._id
      ? dispatch(saveTemplate(template, formDefaultValues._id, formDefaultValues._etag))
      : dispatch(saveTemplate(template));
  };

  const [openConfirm, setConfirmOpen] = React.useState(false);
  const [dashboardCompatible, setDashboardCompatible] = useState("no");

  useEffect(() => {
    setDashboardCompatible(formDefaultValues.dashboard.compatible ? "yes" : "no");
  }, [formDefaultValues]);

  const handleConfirmOpen = () => {
    setConfirmOpen(true);
  };

  const handleConfirmClose = (confirm) => {
    confirm && dispatch(deleteTemplate(formDefaultValues._id, formDefaultValues._etag));
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
          Delete template
        </DialogTitle>
        <DialogContent dividers>Are you sure you want to delete template?</DialogContent>
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
      open={templates.formOpen}
      onClose={() => dispatch(closeTemplateForm())}
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
            {formDefaultValues._id ? <span>Edit template</span> : <span>Add template</span>}
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
            Fill in as much information as possible and describe the template, this will increase
            the chance of reusability.
          </DialogContentText>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Controller
                as={TextField}
                name="name"
                label="Name"
                required
                control={control}
                rules={{ required: true }}
                error={!!errors.name}
                className={classes.field}
                defaultValue={formDefaultValues.name}
              />
            </Grid>
            <Grid item xs={4}>
              <Controller
                as={TextField}
                name="owner"
                label="Owner"
                required
                control={control}
                rules={{ required: true }}
                error={!!errors.owner}
                className={classes.field}
                defaultValue={formDefaultValues.owner}
              />
            </Grid>
            <Grid item xs={4}>
              <Controller
                as={TextField}
                select
                name="team"
                label="Team"
                required
                control={control}
                rules={{ required: true }}
                error={!!errors.team}
                className={classes.field}
                defaultValue={formDefaultValues.team}
              >
                <MenuItem value="" />
                {teams.map((team) => (
                  <MenuItem key={team} value={team}>
                    {team}
                  </MenuItem>
                ))}
              </Controller>
            </Grid>
            <Grid item xs={2}>
              <Controller
                as={TextField}
                select
                name="repo"
                label="Repository"
                helperText="Name of git repository where test is located"
                fullWidth
                required
                control={control}
                rules={{ required: true }}
                error={!!errors.repo}
                defaultValue={formDefaultValues.repo}
              >
                <MenuItem value="" />
                {repos.map((repo) => (
                  <MenuItem key={repo} value={repo}>
                    {repo}
                  </MenuItem>
                ))}
              </Controller>
            </Grid>
            <Grid item xs={10}>
              <Controller
                as={TextField}
                name="path"
                label="Path"
                helperText="Path to template from repository root."
                fullWidth
                required
                control={control}
                rules={{ required: true }}
                error={!!errors.path}
                defaultValue={formDefaultValues.path}
                InputProps={{
                  startAdornment: <InputAdornment position="start">tests/</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                as={TextField}
                name="desc"
                label="Description"
                helperText="Short description explaining the purpose of the template."
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
            <Grid item xs={12}>
              <Controller
                as={JsonEditorHook}
                name="template"
                label="Template"
                helperText={
                  formDefaultValues._id &&
                  "Note: If the template configuration changes the template version will increase and this template will be incompatible with any previous version that are already in use."
                }
                required
                rules={{
                  required: true,
                  validate: { json: (value) => validateJson(value) },
                }}
                error={!!errors.template}
                control={control}
                defaultValue={JSON.stringify(formDefaultValues.template, null, 2)}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                as={TextField}
                name="guide"
                label="Guide"
                helperText="Describe how the template works, how to use it and the template configuration."
                multiline
                rows={4}
                fullWidth
                required
                control={control}
                rules={{ required: true }}
                error={!!errors.guide}
                defaultValue={formDefaultValues.guide}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider className={classes.divider} />
              <DialogContentText>
                Is the template written in such a way that it can publish data to Business
                Dashboard?
              </DialogContentText>
              <FormControl component="fieldset">
                <RadioGroup
                  name="dashboard"
                  value={dashboardCompatible}
                  onChange={(event) => setDashboardCompatible(event.target.value)}
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio />}
                    label="Yes"
                    inputRef={register}
                  />
                  <FormControlLabel value="no" control={<Radio />} label="No" inputRef={register} />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          {(templates.isSaving || templates.isDeleting) && <CircularProgress size={15} />}
          <Button
            onClick={() => dispatch(closeTemplateForm())}
            color="secondary"
            disabled={templates.isSaving || templates.isDeleting}
          >
            Close
          </Button>
          <Button
            type="submit"
            color="primary"
            disabled={
              templates.isSaving ||
              templates.isDeleting ||
              !formState.isValid ||
              (!formState.dirty && !formDefaultValues.clone)
            }
          >
            Save
          </Button>
        </DialogActions>
        {!templates.isSaving && templates.saveError && (
          <Alert severity="error">Could not save template: {templates.saveError}.</Alert>
        )}
        {!templates.isDeleting && templates.deleteError && (
          <Alert severity="error">Could not delete template: {templates.deleteError}.</Alert>
        )}
        {!templates.isSaving && templates.saveIssues.length !== 0 && (
          <Alert severity="error">
            Error saving field "{templates.saveIssues[0].name}": {templates.saveIssues[0].message}.
          </Alert>
        )}
      </form>
    </Dialog>
  );
};

export default TemplateForm;
