import React, { useEffect } from "react";
import { batch, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import {
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Switch,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { ArrowBack, Edit as EditIcon, PlayArrow as RunIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { loadScenarios, openScenarioForm, saveScenario } from "../actions/scenariosActions";
import { loadTemplates } from "../actions/templatesActions";
import { loadTestCases } from "../actions/testCasesActions";
import TestCaseList from "../TestCases/TestCasesList";
import TestCaseForm from "../TestCases/TestCaseForm";
import TemplatesAddList from "../Templates/TemplatesAddList";
import { loadSettings } from "../actions/settingsActions";
import { openRunForm } from "../actions/runsActions";
import ScenarioForm from "./ScenarioForm";
import RunsQueueForm from "../Runs/RunsQueueForm";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(1),
  },
  header: {
    display: "flex",
    width: "100%",
  },
  headerText: {
    padding: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
  grow: {
    flexGrow: 1,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
}));

const ScenarioView = (props) => {
  const { id } = useParams();
  const classes = useStyles();
  const dispatch = useDispatch();
  const scenarios = useSelector((state) => state.scenarios);
  const testCases = useSelector((state) => state.testCases);
  const scenario = scenarios.items.find((scenario) => scenario._id === id);

  useEffect(() => {
    batch(() => {
      dispatch(loadScenarios());
      dispatch(loadTestCases(id));
      dispatch(loadTemplates());
      dispatch(loadSettings());
    });
  }, [dispatch, id]);

  const handleToggleIncidents = (bool) => {
    let newScenario = {
      _id: scenario._id,
      _etag: scenario._etag,
      name: scenario.name,
      desc: scenario.desc,
      owner: scenario.owner,
      team: scenario.team,
      incident: scenario.incident,
    };
    newScenario = Object.assign({}, newScenario, {
      incident: {
        enabled: bool,
      },
    });
    dispatch(saveScenario(newScenario));
  };

  const handleToggleDashboard = (bool) => {
    let newScenario = {
      _id: scenario._id,
      _etag: scenario._etag,
      name: scenario.name,
      desc: scenario.desc,
      owner: scenario.owner,
      team: scenario.team,
      dashboard: bool,
    };
    dispatch(saveScenario(newScenario));
  };

  const handleToggleEmail = (bool) => {
    let newScenario = {
      _id: scenario._id,
      _etag: scenario._etag,
      name: scenario.name,
      desc: scenario.desc,
      owner: scenario.owner,
      team: scenario.team,
      email: scenario.email,
    };
    newScenario = Object.assign({}, newScenario, {
      email: {
        enabled: bool,
      },
    });
    dispatch(saveScenario(newScenario));
  };

  if (scenario) {
    const incidentChecked = scenario.incident && scenario.incident.enabled;
    const dashboardChecked = scenario.dashboard;
    const emailChecked = scenario.email && scenario.email.enabled;
    const cronChecked = scenario.crons?.some((cron) => cron.enabled === true);

    return (
      <div>
        <ScenarioForm />
        <RunsQueueForm />
        <TestCaseForm />
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.container}>
              <Grid container spacing={2}>
                <Grid item xs={1}>
                  <Tooltip title="Go to scenarios">
                    <IconButton component={Link} to="/scenarios">
                      <ArrowBack />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid item xs={11}>
                  <Grid container>
                    <Grid item xs={8}>
                      <Grid container>
                        <Grid item xs={12}>
                          <Typography variant="h6" component="h2">
                            {scenario.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography className={classes.title} color="textSecondary">
                            Team: {scenario.team}
                            <br />
                            Owner: {scenario.owner}
                          </Typography>
                        </Grid>
                        <Grid item xs={9}>
                          <Typography className={classes.title} color="textSecondary">
                            Description
                          </Typography>
                          <Typography variant="body2" component="p">
                            {scenario.desc}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={2}>
                      <Tooltip
                        title={
                          incidentChecked
                            ? "Disable incident creation for all test cases in scenario"
                            : "Enable incident creation for all test cases in scenario"
                        }
                      >
                        <FormControlLabel
                          control={
                            <Switch
                              checked={incidentChecked}
                              onChange={() => handleToggleIncidents(!incidentChecked)}
                              color="primary"
                              disabled={scenarios.isSaving || scenarios.isFetching}
                            />
                          }
                          label="Incidents"
                        />
                      </Tooltip>
                      <Tooltip
                        title={
                          dashboardChecked
                            ? "Disable dashboard publication for all test cases in scenario"
                            : "Enable dashboard publication for all test cases in scenario"
                        }
                      >
                        <FormControlLabel
                          control={
                            <Switch
                              checked={dashboardChecked}
                              onChange={() => handleToggleDashboard(!dashboardChecked)}
                              color="primary"
                              disabled={scenarios.isSaving || scenarios.isFetching}
                            />
                          }
                          label="Dashboard"
                        />
                      </Tooltip>
                    </Grid>
                    <Grid item xs={1}>
                      <Tooltip
                        title={
                          emailChecked
                            ? "Disable email alerts for scenario"
                            : "Enable email alerts for scenario"
                        }
                      >
                        <FormControlLabel
                          control={
                            <Switch
                              checked={emailChecked}
                              onChange={() => handleToggleEmail(!emailChecked)}
                              color="primary"
                              disabled={scenarios.isSaving || scenarios.isFetching}
                            />
                          }
                          label="Email"
                        />
                      </Tooltip>
                      <Tooltip
                        title={
                          cronChecked
                            ? "Cron jobs are enabled for this scenario, click edit to handle cron jobs."
                            : "Cron jobs are disabled for this scenario, click edit to handle cron jobs."
                        }
                      >
                        <FormControlLabel
                          control={<Switch checked={cronChecked} color="primary" disabled={true} />}
                          label="Cron"
                        />
                      </Tooltip>
                    </Grid>
                    <Grid item xs={1}>
                      <Tooltip title="Edit scenario">
                        <IconButton onClick={() => dispatch(openScenarioForm(scenario))}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Run scenario">
                        <IconButton onClick={() => dispatch(openRunForm(scenario))}>
                          <RunIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={5}>
            <TemplatesAddList scenario={scenario._id} />
          </Grid>
          <Grid item xs={7}>
            <Paper className={classes.container}>
              <div className={classes.header}>
                <Typography variant="h5" className={classes.headerText}>
                  Test cases
                </Typography>
                <div className={classes.grow} />
                {(testCases.isSaving || testCases.isFetching) && <CircularProgress />}
              </div>
              <Divider />
              {testCases.items.length ? (
                <TestCaseList testCases={testCases.items} />
              ) : (
                <span>No template has been added.</span>
              )}
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  } else if (scenarios.isFetching || testCases.isFetching) {
    return <CircularProgress />;
  } else {
    return <div>No such scenario exists.</div>;
  }
};

export default ScenarioView;
