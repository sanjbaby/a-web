import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
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
import { closeScenarioForm, deleteScenario, saveScenario } from "../actions/scenariosActions";
import IncidentForm from "../shared/IncidentForm";
import { useHistory } from "react-router";
import EmailForm from "../shared/EmailForm";
import CronForm from "../shared/CronForm";

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
}));

const ScenarioForm = (props) => {
  const classes = useStyles();
  const { teams } = useSelector((state) => state.settings.settings);
  const scenarios = useSelector((state) => state.scenarios);
  const { formDefaultValues } = scenarios;
  const dispatch = useDispatch();
  const history = useHistory();
  const { handleSubmit, control, errors, formState, register, watch } = useForm({
    mode: "onChange",
  });

  const onSubmit = (values) => {
    let scenario = {
      name: values.name,
      owner: values.owner,
      team: values.team,
      desc: values.desc,
      dashboard: values.dashboardEnabled,
      results: values.resultsEnabled,
      crons: values.crons ? values.crons : [],
    };

    let incident = Object.assign(
      {},
      { enabled: values.incidentEnabled },
      values.severity && { severity: values.severity },
      values.create && { create: values.create },
      values.level && { level: values.level },
      values.customKey && { custom_key: values.customKey },
      values.assignment_group && { assignment_group: values.assignment_group },
      values.service && { service: values.service }
    );
    scenario = Object.assign(scenario, { incident: incident });

    let email = Object.assign(
      {},
      { enabled: values.emailEnabled },
      { always: values.always },
      { failure: values.failure },
      { custom_body: values.custom_body }
    );
    scenario = Object.assign(scenario, { email: email });

    if (!formDefaultValues.clone && formDefaultValues._id) {
      scenario._id = formDefaultValues._id;
      scenario._etag = formDefaultValues._etag;
    }

    formDefaultValues.clone
      ? dispatch(saveScenario(scenario, formDefaultValues._id))
      : dispatch(saveScenario(scenario));
  };

  const [openConfirm, setConfirmOpen] = useState(false);
  const [dashboardEnabled, setDashboardEnabled] = useState(false);
  const [incidentEnabled, setIncidentEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [resultsEnabled, setResultsEnabled] = useState(true);

  useEffect(() => {
    formDefaultValues.incident
      ? setIncidentEnabled(formDefaultValues.incident.enabled)
      : setIncidentEnabled(false);
    formDefaultValues.email
      ? setEmailEnabled(formDefaultValues.email.enabled)
      : setEmailEnabled(false);
    setDashboardEnabled(formDefaultValues.dashboard);
    setResultsEnabled(formDefaultValues.results);
  }, [formDefaultValues]);

  const handleConfirmOpen = () => {
    setConfirmOpen(true);
  };

  const handleConfirmClose = (confirm) => {
    confirm && dispatch(deleteScenario(formDefaultValues._id, formDefaultValues._etag, history));
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
          Delete scenario
        </DialogTitle>
        <DialogContent dividers>
          Are you sure you want to delete scenario? All template configuration will be lost.
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
    <Dialog
      open={scenarios.formOpen}
      onClose={() => dispatch(closeScenarioForm())}
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
            {!formDefaultValues.clone && formDefaultValues._id ? (
              <span>Edit scenario</span>
            ) : (
              <span>Add scenario</span>
            )}
          </Typography>
          <div className={classes.grow} />
          {!formDefaultValues.clone && formDefaultValues._id && (
            <IconButton onClick={handleConfirmOpen}>
              <DeleteIcon />
            </IconButton>
          )}
        </div>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Controller
                as={TextField}
                name="name"
                label="Name"
                required
                fullWidth
                control={control}
                rules={{ required: true }}
                error={!!errors.name}
                defaultValue={formDefaultValues.name}
              />
            </Grid>
            <Grid item xs={3}>
              <Controller
                as={TextField}
                name="owner"
                label="Owner"
                fullWidth
                required
                control={control}
                rules={{ required: true }}
                error={!!errors.owner}
                defaultValue={formDefaultValues.owner}
              />
            </Grid>
            <Grid item xs={3}>
              <Controller
                as={TextField}
                select
                name="team"
                label="Team"
                fullWidth
                required
                control={control}
                rules={{ required: true }}
                error={!!errors.team}
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
            <Grid item xs={12}>
              <Controller
                as={TextField}
                name="desc"
                label="Description"
                helperText="Describe the purpose of the scenario."
                multiline
                rows={4}
                fullWidth
                required
                control={control}
                rules={{ required: true }}
                error={!!errors.desc}
                defaultValue={formDefaultValues.desc}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider className={classes.divider} />
              <IncidentForm
                errors={errors}
                control={control}
                register={register}
                incident={formDefaultValues.incident ? formDefaultValues.incident : {}}
                enabled={incidentEnabled}
                toggleEnabled={setIncidentEnabled}
                watch={watch}
              />
              <DialogContentText>
                This will allow incident creation. Incident creation also need to be enabled on test
                case level for an incident to be created. Data here will only be used to prefill
                configuration and can be changed according to preference.
              </DialogContentText>
            </Grid>
            <Grid item xs={12}>
              <Divider className={classes.divider} />
              <FormControlLabel
                control={
                  <Checkbox
                    name="dashboardEnabled"
                    checked={dashboardEnabled}
                    onClick={() => setDashboardEnabled(!dashboardEnabled)}
                    inputRef={register}
                  />
                }
                label="Publish to dashboard"
              />
              <DialogContentText>
                Enabled this will allow publishing of results to Business dashboard. The template
                need to be compatible and the test case configured.
              </DialogContentText>
            </Grid>
            <Grid item xs={12}>
              <Divider className={classes.divider} />
              <EmailForm
                errors={errors}
                control={control}
                register={register}
                email={formDefaultValues.email ? formDefaultValues.email : {}}
                enabled={emailEnabled}
                toggleEnabled={setEmailEnabled}
              />
              <DialogContentText>
                Enabled this will send emails. Always is on every run, failures is on failures or
                errors. A custom body can also be supplied with extra information.
              </DialogContentText>
            </Grid>
            <Grid item xs={12}>
              <Divider className={classes.divider} />
              <CronForm
                errors={errors}
                control={control}
                register={register}
                crons={formDefaultValues.crons ? formDefaultValues.crons : []}
              />
              <DialogContentText>
                Enabled this will execute the scenario according to the supplied{" "}
                <a href="https://crontab.guru" target="_blank" rel="noopener noreferrer">
                  cron
                </a>{" "}
                expression. Any times are in CET.
              </DialogContentText>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Divider className={classes.divider} />
            <FormControlLabel
              control={
                <Checkbox
                  name="resultsEnabled"
                  checked={resultsEnabled}
                  onClick={() => setResultsEnabled(!resultsEnabled)}
                  inputRef={register}
                />
              }
              label="Enable results"
            />
            <DialogContentText>
              Enabled this will publish test results for later analysis in Power BI. (Results will
              always be saved within TAM regardless of this option).
            </DialogContentText>
          </Grid>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          {(scenarios.isSaving || scenarios.isDeleting) && <CircularProgress size={15} />}
          <Button
            onClick={() => dispatch(closeScenarioForm())}
            color="secondary"
            disabled={scenarios.isSaving || scenarios.isDeleting}
          >
            Close
          </Button>
          <Button
            type="submit"
            color="primary"
            disabled={
              scenarios.isSaving ||
              scenarios.isDeleting ||
              !formState.isValid
            }
          >
            Save
          </Button>
        </DialogActions>
        {!scenarios.isSaving && scenarios.saveError && (
          <Alert severity="error">Could not save scenario: {scenarios.saveError}.</Alert>
        )}
        {!scenarios.isDeleting && scenarios.deleteError && (
          <Alert severity="error">Could not delete scenario: {scenarios.deleteError}.</Alert>
        )}
        {!scenarios.isSaving && scenarios.saveIssues.length !== 0 && (
          <Alert severity="error">
            Error saving field "{scenarios.saveIssues[0].name}": {scenarios.saveIssues[0].message}.
          </Alert>
        )}
      </form>
    </Dialog>
  );
};

export default ScenarioForm;
