import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Divider, List, ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";
import {
  AccountTree as AccountTreeIcon,
  Assessment,
  Description,
  Link as LinkIcon,
  Schedule,
  Settings,
  ViewList,
} from "@material-ui/icons";

const MainMenu = (props) => {
  const { pathname } = useLocation();

  return (
    <List>
      <MenuItem button component={Link} to="/" selected={pathname === "/"}>
        <ListItemIcon>
          <Assessment />
        </ListItemIcon>
        <ListItemText primary="Overview" />
      </MenuItem>
      <Divider />
      <MenuItem button component={Link} to="/runs" selected={pathname === "/runs"}>
        <ListItemIcon>
          <Schedule />
        </ListItemIcon>
        <ListItemText primary="Runs" />
      </MenuItem>
      <MenuItem button component={Link} to="/scenarios" selected={pathname.includes("/scenarios")}>
        <ListItemIcon>
          <ViewList />
        </ListItemIcon>
        <ListItemText primary="Scenarios" />
      </MenuItem>
      <MenuItem button component={Link} to="/templates" selected={pathname === "/templates"}>
        <ListItemIcon>
          <Description />
        </ListItemIcon>
        <ListItemText primary="Templates" />
      </MenuItem>
      <Divider />
      <MenuItem button component={Link} to="/connections" selected={pathname === "/connections"}>
        <ListItemIcon>
          <LinkIcon />
        </ListItemIcon>
        <ListItemText primary="Connections" />
      </MenuItem>
      <MenuItem button component={Link} to="/variables" selected={pathname === "/variables"}>
        <ListItemIcon>
          <AccountTreeIcon />
        </ListItemIcon>
        <ListItemText primary="Variables" />
      </MenuItem>
      <MenuItem button component={Link} to="/settings" selected={pathname === "/settings"}>
        <ListItemIcon>
          <Settings />
        </ListItemIcon>
        <ListItemText primary="Settings" />
      </MenuItem>
      <Divider />
    </List>
  );
};

export default MainMenu;
