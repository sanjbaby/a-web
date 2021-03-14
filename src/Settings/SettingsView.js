import React from "react";
import { Typography } from "@material-ui/core";

const SettingsView = () => {
  return (
    <>
      <Typography variant="h2">Coming soon</Typography>
      <Typography>
        The settings section is under development. In the meantime, please contact the CTS team if
        settings need to be changed. Settings includes:
      </Typography>
      <ul>
        <li>Teams and team names</li>
        <li>Repositories</li>
        <li>Environments</li>
        <li>Connection types</li>
        <li>Incident and dashboard metadata options</li>
      </ul>
    </>
  );
};

export default SettingsView;