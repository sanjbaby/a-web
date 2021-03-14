import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FindInPage as FindInPageIcon, PlayArrow } from "@material-ui/icons";
import _ from "lodash";
import ScenarioDetail from "./ScenarioDetails";
import RunsQueueForm from "../Runs/RunsQueueForm";
import { openRunForm } from "../actions/runsActions";
import MaterialTable from "material-table";
import tableIcons from "../shared/tableIcons";

const shortName = (name) => {
  if (name.split(" ").filter(word => word.length >= 25).length > 0) {
    return _.truncate(name, {"length": 25})
  }
  return name
}

const ScenarioRunList = (props) => {
  const scenarios = useSelector((state) => state.scenarios);
  const filter = useSelector((state) => state.settings.filter);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [viewScenario, setViewScenario] = useState({});

  const handleClickOpen = (scenario) => {
    setViewScenario(scenario);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    { title: "Scenario", field: "shortName" },
    { title: "Team", field: "team" },
  ];

  const actions = [
    {
      icon: () => <FindInPageIcon color="secondary" />,
      tooltip: "Details",
      onClick: (event, rowData) => handleClickOpen(rowData),
    },
    {
      icon: () => <PlayArrow color="primary" />,
      tooltip: "Run scenario",
      onClick: (event, rowData) => dispatch(openRunForm(rowData)),
    },
  ];

  return (
    <div>
      <ScenarioDetail scenario={viewScenario} open={open} handleClose={handleClose} />
      <RunsQueueForm />
      <MaterialTable
        title="Scenarios"
        isLoading={scenarios.isFetching && scenarios.items.length === 0}
        columns={columns}
        actions={actions}
        icons={tableIcons}
        data={scenarios.items
          .filter((item) => (filter.length ? filter.includes(item.team) : true))
          .map((o) => ({ ...o, shortName: shortName(o.name) }))}
        options={{
          pageSize: 15,
          pageSizeOptions: [10, 15, 20, 100],
          emptyRowsWhenPaging: false,
          actionsColumnIndex: -1,
        }}
      />
    </div>
  );
};

export default ScenarioRunList;
