import React, { useEffect, useState } from "react";
import { batch, useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { loadRun } from "../actions/runsActions";
import { useParams } from "react-router";
import { CircularProgress, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { CheckCircleRounded } from "@material-ui/icons";
import { red } from "@material-ui/core/colors";
import MaterialTable from "material-table";
import { loadScenarios } from "../actions/scenariosActions";
import tableIcons from "../shared/tableIcons";
import StatusIcons from "../shared/StatusIcons";
import RunDetails from "./RunDetails";
import { Page404 } from "../Router";
import { loadInstances } from "../actions/instancesActions";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  detail: {
    padding: theme.spacing(1),
    whiteSpace: "pre-wrap",
    wordWrap: "normal",
  },
}));

const InstancesTable = React.memo(
  ({ instances }) => {
    const [failedFilter, setFailedFilter] = useState(false);
    const classes = useStyles();
    const columns = [
      {
        title: "Test case",
        render: (rowData) =>
          `${rowData.index ? rowData.index + 1 : rowData.tableData.id + 1}. ${rowData.desc}`,
      },
      { title: "Template", field: "name" },
      {
        title: "Result",
        render: (rowData) => StatusIcons[rowData.status],
      },
    ];

    const actions = [
      {
        icon: () => <CheckCircleRounded style={{ color: failedFilter ? red[500] : red[100] }} />,
        tooltip: failedFilter ? "Show all" : "Show failed",
        isFreeAction: true,
        onClick: () => setFailedFilter(!failedFilter),
      },
    ];

    const detailView = (row) => {
      return <pre className={classes.detail}>{row.log}</pre>;
    };

    return (
      <MaterialTable
        title="Test cases"
        columns={columns}
        actions={actions}
        icons={tableIcons}
        data={instances
          .filter((instance) => !failedFilter || instance.status === "failed")
          .map((o) => ({ ...o }))}
        options={{
          pageSize: 15,
          pageSizeOptions: [10, 15, 20, 100],
          emptyRowsWhenPaging: false,
        }}
        detailPanel={detailView}
        onRowClick={(event, rowData, togglePanel) => togglePanel()}
      />
    );
  },
  (prevProps, nextProps) => {
    // Only rerender table if status has actually changed, avoids rerender on isFetching.
    return _.isEqual(
      prevProps.instances.map((instance) => instance.status),
      nextProps.instances.map((instance) => instance.status)
    );
  }
);

const RunView = (props) => {
  const { id } = useParams();
  const runs = useSelector((state) => state.runs);
  const instances = useSelector((state) => state.instances);
  const run = runs.runDetails;
  const dispatch = useDispatch();

  useEffect(() => {
    if (_.isEmpty(run) || id !== run._id) {
      batch(() => {
        dispatch(loadRun(id));
        dispatch(loadScenarios());
      });
    }

    if (instances.items.length === 0 || instances.items[0].run !== id) {
      dispatch(loadInstances(id));
    }

    const fetcher = setInterval(
      () =>
        batch(() => {
          dispatch(loadRun(id));
          dispatch(loadInstances(id));
        }),
      3000
    );

    // Stop fetcher if run has completed
    run &&
      !["queued", "starting", "running", "manual"].includes(run.status) &&
      (!instances.items.some((instance) => ["queued", "running"].includes(instance.status)) ||
        moment(run._updated).isBefore(moment().subtract(5, "minutes"))) &&
      clearInterval(fetcher);

    return () => clearInterval(fetcher);
  }, [id, dispatch, run, instances]);

  return (
    <div>
      {runs.runDetailsFetching && (_.isEmpty(run) || id !== run._id) ? (
        <CircularProgress />
      ) : !_.isEmpty(run) ? (
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <RunDetails run={run} instances={instances.items} />
          </Grid>
          <Grid item xs={8}>
            {(instances.items.length === 0 || id !== instances.items[0].run) &&
            instances.isFetching ? (
              <CircularProgress />
            ) : (
              <InstancesTable instances={instances.items} />
            )}
          </Grid>
        </Grid>
      ) : (
        <Page404 />
      )}
    </div>
  );
};

export default RunView;
