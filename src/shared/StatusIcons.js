import React from "react";
import { CircularProgress, Tooltip } from "@material-ui/core";
import {
  Cancel,
  CheckCircleRounded,
  Error,
  Schedule as ScheduleIcon,
  HourglassEmptyRounded as HourglassEmptyRoundedIcon,
  Person as PersonIcon,
  Block,
} from '@material-ui/icons'
import { green, red } from "@material-ui/core/colors";

export default {
  scheduled: (
    <Tooltip title="Scheduled">
      <ScheduleIcon />
    </Tooltip>
  ),
  queued: (
    <Tooltip title="Queued">
      <HourglassEmptyRoundedIcon />
    </Tooltip>
  ),
  starting: (
    <Tooltip title="Starting">
      <CircularProgress color="secondary" size={20} />
    </Tooltip>
  ),
  running: (
    <Tooltip title="Running">
      <CircularProgress color="primary" size={20} />
    </Tooltip>
  ),
  passed: (
    <Tooltip title="Finished: All tests passed">
      <CheckCircleRounded style={{ color: green[500] }} />
    </Tooltip>
  ),
  failed: (
    <Tooltip title="Finished: One or more tests failed">
      <CheckCircleRounded style={{ color: red[500] }} />
    </Tooltip>
  ),
  error: (
    <Tooltip title="Error">
      <Error style={{ color: red[500] }} />
    </Tooltip>
  ),
  cancelled: (
    <Tooltip title="Cancelled">
      <Cancel />
    </Tooltip>
  ),
  skipped: (
    <Tooltip title="Skipped">
      <Block />
    </Tooltip>
  ),
  manual: (
    <Tooltip title="Manual">
      <PersonIcon />
    </Tooltip>
  )
};
