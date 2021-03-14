import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Link,
  CircularProgress,
} from "@material-ui/core";
import { batch, useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { loadScenarios } from "./actions/scenariosActions";
import { loadRuns } from "./actions/runsActions";
import { loadTemplates } from "./actions/templatesActions";
import externalLinks from "./shared/externalLinks";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  media: {
    height: 140,
  },
}));

export default function Overview() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const runs = useSelector((state) => state.runs);
  const scenarios = useSelector((state) => state.scenarios);
  const templates = useSelector((state) => state.templates);
  const runDayCount = runs.items.filter((run) =>
    moment(run._created).isAfter(moment().startOf("day"))
  ).length;
  const runMonthCount = runs.items.filter((run) =>
    moment(run._created).isAfter(moment().startOf("month"))
  ).length;
  const scenarioCount = scenarios.items.length;
  const templateCount = templates.items.length;

  useEffect(() => {
    batch(() => {
      dispatch(loadScenarios());
      dispatch(loadRuns());
      dispatch(loadTemplates());
    });
    const fetcher = setInterval(() => dispatch(loadRuns(10)), 10000);
    return () => clearInterval(fetcher);
  }, [dispatch]);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Paper className={classes.paper}>
            Runs today
            <Typography variant="h1" color="textPrimary">
              {runDayCount === 0 && runs.isFetching ? <CircularProgress /> : runDayCount}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>
            Runs this month
            <Typography variant="h1" color="textPrimary">
              {runMonthCount === 0 && runs.isFetching ? <CircularProgress /> : runMonthCount}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>
            Scenarios
            <Typography variant="h1" color="textPrimary">
              {scenarioCount === 0 && scenarios.isFetching ? <CircularProgress /> : scenarioCount}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>
            Templates
            <Typography variant="h1" color="textPrimary">
              {templateCount === 0 && templates.isFetching ? <CircularProgress /> : templateCount}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <Link href={externalLinks.reports} target="_blank">
              <CardActionArea>
                <CardMedia image="/powerbi.png" title="Power BI" className={classes.media} />
              </CardActionArea>
            </Link>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Reports
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Check out the{" "}
                <Link href={externalLinks.reports} target="_blank">
                  reports
                </Link>
                , or deep dive into the{" "}
                <Link
                  href={`${externalLinks.documentation}reporting.html#result-database`}
                  target="_blank"
                >
                  data
                </Link>
                .
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <Link href={externalLinks.documentation} target="_blank">
              <CardActionArea>
                <CardMedia
                  image="/documentation.png"
                  title="Documentation"
                  className={classes.media}
                />
              </CardActionArea>
            </Link>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Documentation
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Read more about TAM in the{" "}
                <Link href={externalLinks.documentation} target="_blank">
                  documentation
                </Link>
                .
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <Link href={externalLinks.support} target="_blank">
              <CardActionArea>
                <CardMedia image="/teams.png" title="Support" className={classes.media} />
              </CardActionArea>
            </Link>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Support
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Get support or discuss solutions in the{" "}
                <Link href={externalLinks.support} target="_blank">
                  teams channel
                </Link>
                .
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
