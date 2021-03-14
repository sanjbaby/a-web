import React, { useEffect } from "react";
import { Grid } from "@material-ui/core";
import RunsList from "./RunsList";
import ScenarioRunList from "../Scenarios/ScenarioRunList";
import { batch, useDispatch } from "react-redux";
import { loadScenarios } from "../actions/scenariosActions";
import { loadRuns } from "../actions/runsActions";
import { loadSettings } from "../actions/settingsActions";

const RunsListView = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    batch(() => {
      dispatch(loadScenarios());
      dispatch(loadRuns());
      dispatch(loadSettings());
    });
    const fetcher = setInterval(() => dispatch(loadRuns(10)), 2000);
    return () => clearInterval(fetcher);
  }, [dispatch]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <ScenarioRunList />
      </Grid>
      <Grid item xs={8}>
        <RunsList />
      </Grid>
    </Grid>
  );
};

export default RunsListView;
