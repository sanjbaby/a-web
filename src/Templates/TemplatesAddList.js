import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { AddCircle as AddCircleIcon, FindInPage as FindInPageIcon } from "@material-ui/icons";
import { openTestCaseForm } from "../actions/testCasesActions";
import { makeStyles } from "@material-ui/core/styles";
import { loadTemplates, setTemplateFilter } from "../actions/templatesActions";
import TemplateDetails from "./TemplateDetails";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(1),
  },
  header: {
    display: "flex",
    width: "100%",
  },
  headerText: {
    padding: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
  grow: {
    flexGrow: 1,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
}));

const TemplatesAddList = (props) => {
  const classes = useStyles();
  const templates = useSelector((state) => state.templates);
  const filter = useSelector((state) => state.settings.filter);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [viewTemplate, setViewTemplate] = useState({});

  const handleClickOpen = (template) => {
    setViewTemplate(template);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenTestCaseForm = (template) =>
    dispatch(
      openTestCaseForm({
        name: template.name,
        team: template.team,
        repo: template.repo,
        path: template.path,
        desc: "",
        guide: template.guide,
        config: template.template,
        version: template.version,
        scenario: props.scenario,
        metadata: template.metadata,
        dashboard: template.dashboard,
      })
    );

  return (
    <Paper className={classes.container}>
      <div className={classes.header}>
        <Typography variant="h5" className={classes.headerText}>
          Available templates
        </Typography>
        <div className={classes.grow} />
        <TextField
          label="Search..."
          type="search"
          onChange={(event) => dispatch(setTemplateFilter(event.target.value))}
        />
      </div>
      <TemplateDetails template={viewTemplate} open={open} handleClose={handleClose} />
      <Divider />
      {!templates.items.length ? (
        <span>No templates found.</span>
      ) : (
        <List>
          {templates.items
          .filter((item) => (filter.length ? filter.includes(item.team) : true))
          .filter(
              (item) =>
                item.name.toLowerCase().includes(templates.filter.toLowerCase()) ||
                item.team.toLowerCase().includes(templates.filter.toLowerCase()) ||
                item.owner.toLowerCase().includes(templates.filter.toLowerCase())
            )
            .map((template) => (
              <ListItem key={template._id}>
                <ListItemText>{template.name}</ListItemText>
                <ListItemSecondaryAction>
                  <Tooltip title="Test case details">
                    <Button onClick={() => handleClickOpen(template)}>
                      <FindInPageIcon color="secondary" />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Add test case to scenario">
                    <Button onClick={() => handleOpenTestCaseForm(template)}>
                      <AddCircleIcon color="primary" />
                    </Button>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
        </List>
      )}
      <Divider />
      <div className={classes.header}>
        <div className={classes.grow} />
        {(templates.isSaving || templates.isFetching) && <CircularProgress size={20} />}
        <Button color="secondary" onClick={() => dispatch(loadTemplates())}>
          Refresh
        </Button>
      </div>
    </Paper>
  );
};

export default TemplatesAddList;
