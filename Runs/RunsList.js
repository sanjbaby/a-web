import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { cancelRun } from "../actions/runsActions";
import StatusIcons from "../shared/StatusIcons";
import MaterialTable from "material-table";
import tableIcons from "../shared/tableIcons";
import { useHistory } from "react-router";

const sortArr = ["scheduled", "queued", "starting", "running"];

const ConfirmDialog = (props) => {
  const {open, handleClose} = props;
  return (
    <Dialog
      onClose={() => handleClose(false)}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle id="customized-dialog-title" onClose={() => handleClose(false)}>
        Cancel run
      </DialogTitle>
      <DialogContent dividers>Are you sure you want to cancel the run?</DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => handleClose(false)} color="secondary">
          No
        </Button>
        <Button autoFocus onClick={() => handleClose(true)} color="primary">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const RunsList = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const runs = useSelector((state) => state.runs);
  const filter = useSelector((state) => state.settings.filter);

  const [openConfirm, setConfirmOpen] = useState(false);
  const [id, setId] = useState("");

  const handleConfirmOpen = (id) => {
    setId(id);
    setConfirmOpen(true);
  };

  const handleConfirmClose = (confirm) => {
    confirm && dispatch(cancelRun(id));
    setConfirmOpen(false);
  };

  const columns = [
    {
      title: "Result",
      field: "status",
      render: (rowData) => StatusIcons[rowData.status],
    },
    { title: "Team", field: "team" },
    { title: "Scenario", field: "scenario" },
    { title: "Environment", field: "env" },
    {
      title: "Added",
      field: "_created",
      render: (rowData) => moment(rowData._created).fromNow(),
    },
  ];

  const actions = [
    (rowData) => {
      return {
        icon: () => <Close />,
        tooltip: "Cancel",
        onClick: (event, rowData) => handleConfirmOpen(rowData._id),
        hidden: !["scheduled", "queued", "starting", "running"].includes(rowData.status),
      };
    },
  ];

  return (
    <div>
      <ConfirmDialog open={openConfirm} handleClose={handleConfirmClose} />
      <MaterialTable
        title="Runs"
        isLoading={runs.items.length === 0 && runs.isFetching}
        columns={columns}
        actions={actions}
        icons={tableIcons}
        data={runs.items.filter(
          (item) => (filter.length ? filter.includes(item.team) : true))
          .sort((a, b) => moment(b._created) - moment(a._created)) // Sort by _created desc
          .sort((a, b) => {
            // Always show queued, starting and running first
            a = sortArr.indexOf(a.status);
            b = sortArr.indexOf(b.status);
            if (a === -1) a = 3;
            if (b === -1) b = 3;
            return a - b;
          })
          .map((o) => ({ ...o }))}
        options={{
          pageSize: 15,
          pageSizeOptions: [10, 15, 20, 100],
          emptyRowsWhenPaging: false,
          actionsColumnIndex: -1,
        }}
        onRowClick={(event, rowData) => history.push("/runs/" + rowData._id)}
      />
    </div>
  );
};
export default RunsList;
