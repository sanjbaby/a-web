import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AppBar,
  Chip,
  CssBaseline,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { AccountCircle } from "@material-ui/icons";
import { grey } from "@material-ui/core/colors";
import Router from "./Router";
import MainMenu from "./MainMenu";
import BottomMenu from "./BottomMenu";
import { loadSettings, setTeamFilter } from "./actions/settingsActions";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import moment from "moment-timezone";

// Set up moment with CET timezone
moment.tz.setDefault("Europe/Stockholm");

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
  grow: {
    flexGrow: 1,
  },
  logo: {
    marginRight: 10,
  },
  a: {
    textDecoration: "none",
  },
  spacer: {
    width: theme.spacing(2),
  },
  bottomPush: {
    width: drawerWidth,
    position: "fixed",
    bottom: 0,
    textAlign: "center",
    paddingBottom: 10,
  }
}));

// Set up color theme with HM colors
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#D6001C",
    },
    secondary: grey,
  },
});

const Main = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings);
  const [anchorEl, setAnchorEl] = React.useState(null);

  useEffect(() => {
    dispatch(loadSettings());
  }, [dispatch]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const renderMenu = (
    <Menu
      id="account-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <MenuItem onClick={handleClose}>
        <a
          href="/oauth2/sign_out?rd=https://login.microsoftonline.com/common/oauth2/v2.0/logout"
          className={classes.a}
        >
          Logout
        </a>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <img src="/logo.png" alt="HM" className={classes.logo} />
          <Typography variant="h6" noWrap>
            Test Automation & Monitoring
          </Typography>
          <div className={classes.grow} />
          <div>
            Quick filters:&nbsp;
            {settings.settings.teams.map((team) => (
              <Chip
                key={team}
                label={team}
                color={settings.filter.includes(team) ? "secondary" : "default"}
                onClick={() => dispatch(setTeamFilter(team))}
                size="small"
              />
            ))}
          </div>
          <div className={classes.spacer} />
          <IconButton
            edge="end"
            aria-controls="account-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            <AccountCircle style={{ color: "white" }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolbar} />
        <MainMenu />
        <div className={classes.bottomPush}>
          <BottomMenu />
        </div>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Router />
      </main>
      {renderMenu}
    </div>
  );
};

// Main entry point
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
        <Main />
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
};

export default App;
