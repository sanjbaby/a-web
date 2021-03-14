import React from "react";
import { Divider, List, ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";
import { BarChart, Help, MenuBook } from "@material-ui/icons";
import externalLinks from "./shared/externalLinks";

const BottomMenu = (props) => {
  return (
    <List>
      <Divider />
      <MenuItem button component="a" href={externalLinks.reports} target="_blank">
        <ListItemIcon>
          <BarChart />
        </ListItemIcon>
        <ListItemText primary="Reports" />
      </MenuItem>
      <MenuItem button component="a" href={externalLinks.documentation} target="_blank">
        <ListItemIcon>
          <MenuBook />
        </ListItemIcon>
        <ListItemText primary="Documentation" />
      </MenuItem>
      <MenuItem button component="a" href={externalLinks.support} target="_blank">
        <ListItemIcon>
          <Help />
        </ListItemIcon>
        <ListItemText primary="Support" />
      </MenuItem>
    </List>
  );
};

export default BottomMenu;
