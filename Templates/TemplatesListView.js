import React, { useEffect } from "react";
import { batch, useDispatch, useSelector } from "react-redux";
import { Alert } from "@material-ui/lab";
import MaterialTable from "material-table";
import { Add, Edit, FilterNone as Clone } from "@material-ui/icons";
import { Grid, Paper, Typography } from "@material-ui/core";
import { loadTemplates, openTemplateForm } from "../actions/templatesActions";
import { loadSettings } from "../actions/settingsActions";
import tableIcons from "../shared/tableIcons";
import TemplateForm from "./TemplateForm";
import { JsonViewer } from "../shared/JsonViewer";
import { makeStyles } from "@material-ui/core/styles";
import _ from "lodash";

const initialValues = {
  name: "",
  owner: "",
  team: "",
  template: { key: "value" },
  desc: "",
  guide: "",
  dashboard: {
    compatible: false,
  },
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
  },
  config: {
    fontFamily: '"Fira code", "Fira Mono", monospace',
    fontSize: 12,
  },
}));

const TemplatesListView = (props) => {
  const classes = useStyles();
  const templates = useSelector((state) => state.templates);
  const filter = useSelector((state) => state.settings.filter);
  const dispatch = useDispatch();

  useEffect(() => {
    batch(() => {
      dispatch(loadTemplates());
      dispatch(loadSettings());
    });
  }, [dispatch]);

  const columns = [
    { title: "Name", field: "name" },
    { title: "Description", field: "desc" },
    { title: "Owner", field: "owner" },
    { title: "Team", field: "team" },
    { title: "Template version", field: "version" },
  ];

  const actions = [
    {
      icon: () => <Clone />,
      tooltip: "Clone",
      onClick: (event, rowData) => {
        let data = _.omit(rowData, "_id");
        data.name = rowData.name + " (cloned)";
        data.clone = true;
        dispatch(openTemplateForm(data));
      },
    },
    {
      icon: () => <Edit />,
      tooltip: "Edit",
      onClick: (event, row) => dispatch(openTemplateForm(row)),
    },
    {
      icon: () => <Add />,
      tooltip: "Add new template",
      isFreeAction: true,
      onClick: () => dispatch(openTemplateForm(initialValues)),
    },
  ];

  const detailView = (row) => {
    return (
      <div className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Paper className={classes.container}>
              <Typography variant="h6">Guide</Typography>
              {row.guide}
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.container}>
              <Typography variant="h6">Template</Typography>
              <JsonViewer value={JSON.stringify(row.template, null, 2)} />
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  };

  return (
    <div>
      <TemplateForm />
      {!templates.isFetching && templates.error && (
        <Alert severity="error">Could not fetch templates: {templates.error}.</Alert>
      )}
      <MaterialTable
        title="Templates"
        columns={columns}
        data={templates.items
          .filter((item) => (filter.length ? filter.includes(item.team) : true))
          .map((o) => ({ ...o }))}
        icons={tableIcons}
        isLoading={templates.isFetching}
        options={{
          pageSize: 15,
          pageSizeOptions: [10, 15, 20, 100],
          actionsColumnIndex: -1,
        }}
        detailPanel={detailView}
        onRowClick={(event, rowData, togglePanel) => togglePanel()}
        actions={actions}
      />
      {!templates.isSaving && templates.saveSuccess && (
        <Alert severity="success">Test case saved successfully.</Alert>
      )}
      {!templates.isDeleting && templates.deleteSuccess && (
        <Alert severity="success">Test case deleted successfully.</Alert>
      )}
    </div>
  );
};

export default TemplatesListView;
