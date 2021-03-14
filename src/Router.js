import React from "react";
import { Route, Switch } from "react-router";
import { Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Overview from "./Overview";
import ScenariosListView from "./Scenarios/ScenariosListView";
import ScenarioView from "./Scenarios/ScenarioView";
import TemplateView from "./Templates/TemplatesListView";
import ConnectionsListView from "./Connections/ConnectionsListView";
import VariablesListView from "./Variables/VariablesListView";
import RunsListView from "./Runs/RunsListView";
import RunView from "./Runs/RunView";
import SettingsView from "./Settings/SettingsView";

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

export const Page404 = () => {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Typography variant="h6" className={classes.title}>
        404: This page does not exist
      </Typography>
    </Container>
  );
};

const Router = () => (
  <Switch>
    <Route exact path="/" render={() => <Overview />} />
    <Route path="/runs/:id" render={() => <RunView />} />
    <Route exact path="/runs" render={() => <RunsListView />} />
    <Route path="/scenarios/:id" render={() => <ScenarioView />} />
    <Route exact path="/scenarios" render={() => <ScenariosListView />} />
    <Route exact path="/templates" render={() => <TemplateView />} />
    <Route exact path="/connections" render={() => <ConnectionsListView />} />
    <Route exact path="/variables" render={() => <VariablesListView />} />
    <Route exact path="/settings" render={() => <SettingsView />} />
    <Route render={() => <Page404 />} />
  </Switch>
);

export default Router;
