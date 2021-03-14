import React, { useEffect } from "react";
import { useHistory } from "react-router";
import { batch, useDispatch, useSelector } from "react-redux";
import { Alert } from "@material-ui/lab";
import MaterialTable from "material-table";
import { Add, Edit, FilterNone as Clone, ViewList } from "@material-ui/icons";
import { loadScenarios, openScenarioForm } from "../actions/scenariosActions";
import { loadSettings } from "../actions/settingsActions";
import tableIcons from "../shared/tableIcons";
import ScenarioAddForm from "./ScenarioForm";

const initialValues = {
  name: "",
  owner: "",
  team: "",
  desc: "",
  incident: {},
  email: {},
  cron: {},
  results: true,
  dashboard: false,
};

const ScenariosListView = (props) => {
  const dispatch = useDispatch();
  const scenarios = useSelector((state) => state.scenarios);
  const filter = useSelector((state) => state.settings.filter);
  const history = useHistory();

  useEffect(() => {
    batch(() => {
      dispatch(loadScenarios());
      dispatch(loadSettings());
    });
  }, [dispatch]);

  const columns = [
    { title: "Name", field: "name" },
    { title: "Description", field: "desc" },
    { title: "Owner", field: "owner" },
    { title: "Team", field: "team" },
  ];

  const actions = [
    {
      icon: () => <Clone />,
      tooltip: "Clone",
      onClick: (event, rowData) => {
        let data = { ...rowData, clone: true };
        data.name = data.name + " (cloned)";
        dispatch(openScenarioForm(data));
      },
    },
    {
      icon: () => <Edit />,
      tooltip: "Edit",
      onClick: (event, rowData) => dispatch(openScenarioForm(rowData)),
    },
    {
      icon: () => <ViewList />,
      tooltip: "Handle templates",
      onClick: (event, rowData) => history.push("/scenarios/" + rowData._id),
    },
    {
      icon: () => <Add />,
      tooltip: "Create new scenario",
      isFreeAction: true,
      onClick: () => dispatch(openScenarioForm(initialValues)),
    },
  ];

  return (
    <div>
      <ScenarioAddForm />
      {!scenarios.isFetching && scenarios.error && (
        <Alert severity="error">Could not fetch scenarios: {scenarios.error}.</Alert>
      )}
      <MaterialTable
        title="Scenarios"
        columns={columns}
        data={scenarios.items
          .filter((item) => (filter.length ? filter.includes(item.team) : true))
          .map((o) => ({ ...o }))}
        icons={tableIcons}
        isLoading={scenarios.isFetching}
        onRowClick={(event, rowData) => history.push("/scenarios/" + rowData._id)}
        options={{
          pageSize: 15,
          pageSizeOptions: [10, 15, 20, 100],
          actionsColumnIndex: -1,
        }}
        actions={actions}
      />
      {!scenarios.isSaving && scenarios.saveSuccess && (
        <Alert severity="success">Scenario saved successfully.</Alert>
      )}
      {!scenarios.isDeleting && scenarios.deleteSuccess && (
        <Alert severity="success">Scenario deleted successfully.</Alert>
      )}
    </div>
  );
};

export default ScenariosListView;
