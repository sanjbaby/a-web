import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";
import { closeRunForm, queueRun } from "../actions/runsActions";
import { DateTimePicker } from "@material-ui/pickers";
import moment from "moment-timezone";
import _ from "lodash";
import { loadTestCases } from "../actions/testCasesActions";
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
}));

const RunsQueueForm = (props) => {
  const classes = useStyles();
  const { envs } = useSelector((state) => state.settings.settings.connections);
  const runs = useSelector((state) => state.runs);
  const testCases = useSelector((state) => state.testCases);
  const { formDefaultValues } = runs;
  const dispatch = useDispatch();
  const history = useHistory();
  const [runType, setRunType] = useState("queued");
  const [selectedDate, setSelectedDate] = useState(moment().add(5, "minutes"));

  const { handleSubmit, control, errors, formState, register } = useForm({
    mode: "onBlur",
  });

  useEffect(() => {
    if (runs.formOpen && formDefaultValues._id !== testCases.items.find((e) => true)?.scenario) {
      dispatch(loadTestCases(formDefaultValues._id));
    }
  }, [dispatch, formDefaultValues, runs.formOpen, testCases.items]);

  const parameters = [
    ...new Set(
      testCases.items
        .filter((testCase) => {
          return testCase.enabled;
        })
        .map((testCase) => {
          return _.values(testCase.config);
        })
        .flat()
        .map((value) => {
          return  typeof value === "string" ? [...value.matchAll(/(\${.+?})/g)] : undefined;
        })
        .flat(Infinity)
        .filter((parameter) => parameter !== undefined)
    ),
  ];

  const onSubmit = (values) => {
    const run = {
      scenario_id: formDefaultValues._id,
      env: values.env,
      status: values.runType,
    };
    if (values.parameters) run.parameters = JSON.parse(values.parameters);
    if (run.status === "scheduled") run.scheduled_date = values.date.format("YYYY-MM-DD HH:mm:ss");
    dispatch(queueRun(run, history));
  };

  return (
    <Dialog
      open={runs.formOpen}
      onClose={() => dispatch(closeRunForm())}
      aria-labelledby="form-dialog-title"
      scroll="body"
      fullWidth
      maxWidth="xs"
      disableBackdropClick
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={classes.container}>
          <Typography variant="h6">
            <span>Run scenario</span>
          </Typography>
          <div className={classes.grow} />
        </div>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              Scenario:
              <br />
              <Typography variant="subtitle1">{formDefaultValues.name}</Typography>
            </Grid>
            <Grid item xs={12}>
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
                defaultValue=""
              >
                {envs.map((env) => (
                  <MenuItem value={env} key={env}>
                    {env}
                  </MenuItem>
                ))}
              </Controller>
            </Grid>
            <Grid item xs={12}>
              <RadioGroup name="runType" value={runType} onChange={(_, value) => setRunType(value)}>
                <FormControlLabel
                  control={<Radio value="queued" inputRef={register} />}
                  label="Normal"
                />
                <FormControlLabel
                  control={<Radio value="scheduled" inputRef={register} />}
                  label="Scheduled"
                />
                {runType === "scheduled" && (
                  <Controller
                    name="date"
                    as={
                      <DateTimePicker
                        label="Date"
                        required
                        fullWidth
                        error={!!errors?.date}
                        ampm={false}
                        disablePast
                        value={selectedDate}
                        onChange={setSelectedDate}
                        format="YYYY-MM-DD HH:mm"
                      />
                    }
                    rules={{
                      required: true,
                      validate: (input) => moment(input).isAfter(moment()),
                    }}
                    control={control}
                    label="CET"
                  />
                )}
                <FormControlLabel
                  control={
                    <Tooltip title="Used when running in PyCharm. Will be ignored by controller.">
                      <Radio value="manual" inputRef={register} />
                    </Tooltip>
                  }
                  label="Manual"
                />
              </RadioGroup>
            </Grid>
            {parameters.length !== 0 &&
              formDefaultValues._id === testCases.items.find((e) => true)?.scenario && (
                <Grid item xs={12}>
                  <Controller
                    as={JsonEditorHook}
                    name="parameters"
                    label="Parameters"
                    helperText="Parameters where found in configuration values and need to be filled in before running the test case."
                    required
                    rules={{
                      required: true,
                      validate: { json: (value) => validateJson(value) },
                    }}
                    error={!!errors.parameters}
                    control={control}
                    defaultValue={JSON.stringify(
                      parameters.reduce((o, key) => {
                        o[key] = "";
                        return o;
                      }, {}),
                      null,
                      2
                    )}
                  />
                </Grid>
              )}
          </Grid>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          {(runs.isSaving || runs.isDeleting) && <CircularProgress size={15} />}
          <Button
            onClick={() => dispatch(closeRunForm())}
            color="secondary"
            disabled={runs.isSaving || runs.isDeleting}
          >
            Close
          </Button>
          <Button
            type="submit"
            color="primary"
            disabled={runs.isSaving || runs.isDeleting || !formState.isValid || !formState.dirty}
          >
            Run
          </Button>
        </DialogActions>
        {!runs.isSaving && runs.saveError && (
          <Alert severity="error">Could not queue run: {runs.saveError}.</Alert>
        )}
      </form>
    </Dialog>
  );
};

export default RunsQueueForm;
