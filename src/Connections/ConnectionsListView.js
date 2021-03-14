import React, { useEffect } from "react";
import { batch, useDispatch, useSelector } from "react-redux";
import { Alert } from "@material-ui/lab";
import MaterialTable from "material-table";
import { Add, Edit, FilterNone as Clone, Refresh as RefreshIcon } from "@material-ui/icons";
import { Grid, Paper, Typography } from "@material-ui/core";
import { loadConnections, openConnectionForm } from "../actions/connectionsActions";
import tableIcons from "../shared/tableIcons";
import ConnectionForm from "./ConnectionForm";
import { JsonViewer } from "../shared/JsonViewer";
import { loadSettings } from "../actions/settingsActions";
import { makeStyles } from "@material-ui/core/styles";

const initialValues = {
  type: "",
  system: "",
  env: "",
  config: {
    key: "value",
  },
  desc: "",
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

const ConnectionsListView = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const connections = useSelector((state) => state.connections);

  useEffect(() => {
    batch(() => {
      dispatch(loadConnections());
      dispatch(loadSettings());
    });
  }, [dispatch]);

  const handleEditOpen = (row) => {
    let parts = row.name.split("-");
    let values = {
      _id: row._id,
      _etag: row._etag,
      type: parts[0],
      system: parts.slice(1, parts.length - 1).join("-"),
      env: parts[parts.length - 1],
      config: row.config,
      desc: row.desc,
    };
    if (row.user_config) {
      values.userConfig = row.user_config
    }
    dispatch(openConnectionForm(values));
  };

  const handleCloneOpen = (row) => {
    let parts = row.name.split("-");
    let values = {
      type: parts[0],
      system: parts.slice(1, parts.length - 1).join("-"),
      env: parts[parts.length - 1],
      config: row.config,
      desc: row.desc,
    };
    if (row.user_config) {
      values.userConfig = row.user_config
    }
    dispatch(openConnectionForm(values));
  };

  const configSlice = (config) => {
    let configPreview = JSON.stringify(config, null, 2);
    if (configPreview.length > 60) {
      configPreview = configPreview.slice(0, 55) + "...}";
    }
    return <div className={classes.config}>{configPreview}</div>;
  };

  const columns = [
    { title: "Name", field: "name" },
    { title: "Description", field: "desc" },
    { title: "Environment", field: "env" },
    {
      title: "Config",
      field: "config",
      render: (rowData) => configSlice(rowData.config),
    },
  ];

  const actions = [
    {
      icon: () => <Clone />,
      tooltip: "Clone",
      onClick: (event, rowData) => handleCloneOpen(rowData),
    },
    {
      icon: () => <Edit />,
      tooltip: "Edit",
      onClick: (event, rowData) => handleEditOpen(rowData),
    },
    {
      icon: () => <RefreshIcon />,
      tooltip: "Refresh",
      isFreeAction: true,
      onClick: () => dispatch(loadConnections()),
    },
    {
      icon: () => <Add />,
      tooltip: "Add new connection",
      isFreeAction: true,
      onClick: () => dispatch(openConnectionForm(initialValues)),
    },
  ];

  const detailView = (row) => {
    return (
      <div className={classes.container}>
        <Grid container spacing={6}>
          <Grid item>
            <Paper className={classes.container}>
              <Typography variant="h6">Config</Typography>
              <JsonViewer value={JSON.stringify(row.config, null, 2)} />
            </Paper>
          </Grid>
          {row.user_config && (
            <Grid item>
              <Paper className={classes.container}>
                <Typography variant="h6">User Config</Typography>
                <JsonViewer value={JSON.stringify(row.user_config, null, 2)} />
              </Paper>
            </Grid>
          )}
        </Grid>
      </div>
    );
  };

  return (
    <div>
      <ConnectionForm />
      {!connections.isFetching && connections.loadError && (
        <Alert severity="error">Could not fetch connections: {connections.loadError}.</Alert>
      )}
      <MaterialTable
        title="Connections"
        columns={columns}
        data={connections.items.map((o) => ({ ...o }))}
        icons={tableIcons}
        isLoading={connections.isFetching}
        options={{
          pageSize: 15,
          pageSizeOptions: [10, 15, 20, 100],
          actionsColumnIndex: -1,
        }}
        detailPanel={detailView}
        onRowClick={(event, rowData, togglePanel) => togglePanel()}
        actions={actions}
      />
      {!connections.isSaving && connections.saveSuccess && (
        <Alert severity="success">Connection saved successfully.</Alert>
      )}
      {!connections.isDeleting && connections.deleteSuccess && (
        <Alert severity="success">Connection deleted successfully.</Alert>
      )}
    </div>
  );
};

export default ConnectionsListView
