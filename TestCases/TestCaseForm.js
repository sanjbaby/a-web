import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
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
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import { Delete as DeleteIcon } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import { validateJson } from "../shared/validators";
import { closeTestCaseForm, deleteTestCase, saveTestCase } from "../actions/testCasesActions";
import JsonEditorHook from "../shared/JsonEditor";
import IncidentForm from "../shared/IncidentForm";
import DashboardForm from "../shared/DashboardForm";
import MetadataForm from "../shared/MetadataForm";

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
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const TestCaseForm = (props) => {
  const classes = useStyles();
  const testCases = useSelector((state) => state.testCases);
  const { formDefaultValues } = testCases;
  const scenario = useSelector(
    (state) =>
      state.scenarios.items.filter((scenario) => scenario._id === formDefaultValues.scenario)[0]
  );
  const dispatch = useDispatch();
  const { handleSubmit, control, register, errors, formState, watch } = useForm({
    mode: "onBlur",
  });

  const onSubmit = (values) => {
    let testCase = {
      name: formDefaultValues.name,
      team: formDefaultValues.team,
      repo: formDefaultValues.repo,
      path: formDefaultValues.path,
      scenario: formDefaultValues.scenario,
      guide: formDefaultValues.guide,
      desc: values.desc,
      config: JSON.parse(values.config),
      version: formDefaultValues.version,
      index:
        "index" in values
          ? values.index
          : "index" in formDefaultValues
          ? formDefaultValues.index
          : Math.max(...testCases.items.map((o) => o.index), -1) + 1,
      blocker: values.blocker,
      incident: formDefaultValues.incident,
      metadata: formDefaultValues.metadata,
    };
    const dashboard = Object.assign(
      {},
      values.dashboardEnabled ? { enabled: true } : { enabled: false },
      formDefaultValues.dashboard.compatible ? { compatible: true } : { compatible: false },
      values.cadence && { cadence: values.cadence },
      values.breakdown && { breakdown: values.breakdown },
      values.corporate_brand && { corporate_brand: values.corporate_brand },
      values.kpis && {
        kpis: values.kpis.map((kpi) =>
          kpi
            .replace(/^\s\s*/, "")
            .replace(/\s\s*$/, "")
            .replace(/\s+/g, "_")
            .toUpperCase()
        ),
      }
    );
    const incident = Object.assign(
      {},
      values.incidentEnabled ? { enabled: true } : { enabled: false },
      values.severity && { severity: values.severity },
      values.create && { create: values.create },
      values.level && { level: values.level },
      values.customKey && { custom_key: values.customKey },
      values.assignment_group && { assignment_group: values.assignment_group },
      values.service && { service: values.service }
    );
    const metadata = Object.assign(
      {},
      values.area && { area: values.area },
      values.system && { system: values.system },
      values.category && { category: values.category },
      values.type && { type: values.type }
    );
    testCase = Object.assign(testCase, !_.isEmpty(incident) && { incident: incident });
    testCase = Object.assign(testCase, !_.isEmpty(metadata) && { metadata: metadata });
    testCase = Object.assign(testCase, !_.isEmpty(dashboard) && { dashboard: dashboard });

    formDefaultValues._id
      ? dispatch(saveTestCase(testCase, formDefaultValues._id, formDefaultValues._etag))
      : dispatch(saveTestCase(testCase));
  };

  const [openConfirm, setConfirmOpen] = React.useState(false);
  const [incidentEnabled, setIncidentEnabled] = useState(false);
  const [incident, setIncident] = useState({});
  const [dashboardEnabled, setDashboardEnabled] = useState(false);
  const [blocker, setBlocker] = useState(false);

  useEffect(() => {
    let incident = {};
    if (formDefaultValues.incident) {
      // Use testCase config, otherwise use from scenario
      formDefaultValues.incident.severity
        ? (incident.severity = formDefaultValues.incident.severity)
        : scenario.incident.severity && (incident.severity = scenario.incident.severity);
      formDefaultValues.incident.create
        ? (incident.create = formDefaultValues.incident.create)
        : scenario.incident.create && (incident.create = scenario.incident.create);
      formDefaultValues.incident.level
        ? (incident.level = formDefaultValues.incident.level)
        : scenario.incident.level && (incident.level = scenario.incident.level);
      formDefaultValues.incident.customKey
        ? (incident.customKey = formDefaultValues.incident.customKey)
        : scenario.incident.customKey && (incident.customKey = scenario.incident.customKey);
      formDefaultValues.incident.assignment_group
        ? (incident.assignment_group = formDefaultValues.incident.assignment_group)
        : scenario.incident.assignment_group &&
          (incident.assignment_group = scenario.incident.assignment_group);
      formDefaultValues.incident.service
        ? (incident.service = formDefaultValues.incident.service)
        : scenario.incident.service && (incident.service = scenario.incident.service);
    } else if (scenario) {
      scenario.incident.severity && (incident.severity = scenario.incident.severity);
      scenario.incident.create && (incident.create = scenario.incident.create);
      scenario.incident.level && (incident.level = scenario.incident.level);
      scenario.incident.customKey && (incident.customKey = scenario.incident.customKey);
      scenario.incident.assignment_group &&
        (incident.assignment_group = scenario.incident.assignment_group);
      scenario.incident.service && (incident.service = scenario.incident.service);
    }
    setIncident(incident);

    formDefaultValues.incident
      ? setIncidentEnabled(!!formDefaultValues.incident.enabled)
      : setIncidentEnabled(false);
    formDefaultValues.dashboard && setDashboardEnabled(!!formDefaultValues.dashboard.enabled);
    setBlocker(!!formDefaultValues.blocker);
  }, [formDefaultValues, scenario]);

  const handleConfirmOpen = () => {
    setConfirmOpen(true);
  };

  const handleConfirmClose = (confirm) => {
    confirm &&
      dispatch(
        deleteTestCase(formDefaultValues._id, formDefaultValues._etag, formDefaultValues.scenario)
      );
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
          Remove test case
        </DialogTitle>
        <DialogContent dividers>
          Are you sure you want to remove test case from scenario?
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => handleConfirmClose(false)} color="secondary">
            Cancel
          </Button>
          <Button autoFocus onClick={() => handleConfirmClose(true)} color="primary">
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Dialog
      open={testCases.formOpen}
      onClose={() => dispatch(closeTestCaseForm())}
      aria-labelledby="form-dialog-title"
      scroll="body"
      fullWidth
      maxWidth="md"
      disableBackdropClick
    >
      <ConfirmDialog />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={classes.container}>
          <div>
            <Typography variant="h6">
              {formDefaultValues._id ? (
                <span>Edit test case: {formDefaultValues.name}</span>
              ) : (
                <span>Add test case based on template: {formDefaultValues.name}</span>
              )}
            </Typography>
            <Typography color="secondary" variant="subtitle2">
              {formDefaultValues.path}
            </Typography>
          </div>
          <div className={classes.grow} />
          {formDefaultValues._id && (
            <IconButton onClick={handleConfirmOpen}>
              <DeleteIcon />
            </IconButton>
          )}
        </div>
        <DialogContent>
          <Controller
            as={TextField}
            name="desc"
            label="Test case"
            required
            control={control}
            rules={{ required: true }}
            error={!!errors.desc}
            placeholder="Description of test case"
            style={{ width: "100%" }}
            defaultValue={formDefaultValues.desc}
            multiline
          />
          <Controller
            as={JsonEditorHook}
            name="config"
            label="Config"
            required
            rules={{
              required: true,
              validate: { json: (value) => validateJson(value) },
            }}
            error={!!errors.config}
            control={control}
            defaultValue={JSON.stringify(formDefaultValues.config, null, 2)}
          />
          <DialogContentText>{formDefaultValues.guide}</DialogContentText>
          <Grid item xs={12}>
            <Divider className={classes.divider} />
            <FormControlLabel
              control={
                <Checkbox
                  name="blocker"
                  checked={blocker}
                  onClick={() => setBlocker(!blocker)}
                  inputRef={register}
                />
              }
              label="Blocker"
            />
          </Grid>
          <DialogContentText>
            Block further execution of scenario if test case fails.
          </DialogContentText>
          <Grid item xs={12}>
            <Divider className={classes.divider} />
            <IncidentForm
              errors={errors}
              control={control}
              register={register}
              enabled={incidentEnabled}
              toggleEnabled={setIncidentEnabled}
              incident={incident}
              required
              watch={watch}
            />
            <DialogContentText>
              This will enable incidents for this test case. Incidents also need to be enabled on
              scenario level for incidents to be created.
            </DialogContentText>
          </Grid>
          <Grid item xs={12}>
            <Divider className={classes.divider} />
            <DashboardForm
              errors={errors}
              control={control}
              register={register}
              dashboard={formDefaultValues.dashboard ? formDefaultValues.dashboard : {}}
              enabled={dashboardEnabled}
              toggleEnabled={setDashboardEnabled}
              testCases={testCases}
            />
            <DialogContentText>
              Enabled this will publish results to Business dashboard. Dashboard also need to be
              enabled on scenario level.
            </DialogContentText>
          </Grid>
          {(incidentEnabled || dashboardEnabled) && (
            <Grid item xs={12}>
              <Divider className={classes.divider} />
              <DialogContentText className={classes.divider}>
                Metadata config used for incidents and dashboard.
              </DialogContentText>
              <MetadataForm
                errors={errors}
                control={control}
                register={register}
                metadata={formDefaultValues.metadata ? formDefaultValues.metadata : {}}
                requiredIncident={incidentEnabled}
                requiredDashboard={dashboardEnabled}
              />
            </Grid>
          )}
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          {(testCases.isSaving || testCases.isDeleting) && <CircularProgress size={15} />}
          <Button
            onClick={() => dispatch(closeTestCaseForm())}
            color="secondary"
            disabled={testCases.isSaving || testCases.isDeleting}
          >
            Close
          </Button>
          <Button
            type="submit"
            color="primary"
            disabled={
              testCases.isSaving || testCases.isDeleting || !formState.isValid || !formState.dirty
            }
          >
            <span>Save</span>
          </Button>
        </DialogActions>
        {!testCases.isSaving && testCases.saveError && (
          <Alert severity="error">Could not save testCase of case: {testCases.saveError}.</Alert>
        )}
        {!testCases.isDeleting && testCases.deleteError && (
          <Alert severity="error">
            Could not remove template from scenario {testCases.deleteError}.
          </Alert>
        )}
      </form>
    </Dialog>
  );
};

export default TestCaseForm;
