import React, { useEffect } from "react";
import { batch, useDispatch, useSelector } from "react-redux";
import { Alert } from "@material-ui/lab";
import { Add, Edit, FilterNone as Clone } from "@material-ui/icons";
import _ from "lodash";
import MaterialTable from "material-table";
import tableIcons from "../shared/tableIcons";
import { loadVariables, openVariableForm } from "../actions/variablesActions";
import { loadSettings } from "../actions/settingsActions";
import VariableForm from "./VariableForm";

const initialValues = {
  key: "",
  value: "",
  env: "",
  desc: "",
};

const VariablesListView = (props) => {
  const dispatch = useDispatch();
  const variables = useSelector((state) => state.variables);

  useEffect(() => {
    batch(() => {
      dispatch(loadVariables());
      dispatch(loadSettings());
    });
  }, [dispatch]);

  const columns = [
    { title: "Key", field: "key" },
    { title: "Value", field: "value" },
    { title: "Environment", field: "env" },
    { title: "Description", field: "desc" },
  ];

  const actions = [
    {
      icon: () => <Clone />,
      tooltip: "Clone",
      onClick: (event, rowData) => dispatch(openVariableForm(_.omit(rowData, "_id"))),
    },
    {
      icon: () => <Edit />,
      tooltip: "Edit",
      onClick: (event, rowData) => dispatch(openVariableForm(rowData)),
    },
    {
      icon: () => <Add />,
      tooltip: "Add new variable",
      isFreeAction: true,
      onClick: () => dispatch(openVariableForm(initialValues)),
    },
  ];

  return (
    <div>
      <VariableForm />
      {!variables.isFetching && variables.loadError && (
        <Alert severity="error">Could not fetch variables: {variables.loadError}.</Alert>
      )}
      <MaterialTable
        title="Variables"
        columns={columns}
        data={variables.items.map((o) => ({ ...o }))}
        icons={tableIcons}
        isLoading={variables.isFetching}
        options={{
          pageSize: 15,
          pageSizeOptions: [10, 15, 20, 100],
          actionsColumnIndex: -1,
        }}
        actions={actions}
      />
      {!variables.isSaving && variables.saveSuccess && (
        <Alert severity="success">Variable saved successfully.</Alert>
      )}
      {!variables.isDeleting && variables.deleteSuccess && (
        <Alert severity="success">Variable deleted successfully.</Alert>
      )}
    </div>
  );
};

export default VariablesListView;
