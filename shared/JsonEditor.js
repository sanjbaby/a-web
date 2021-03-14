import React, { Fragment } from "react";

import Editor from "react-simple-code-editor";
import Highlight, { defaultProps } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/nightOwl";
import { makeStyles } from "@material-ui/core/styles";
import { validateJsonError } from "./validators";

const styles = {
  root: {
    boxSizing: "border-box",
    fontFamily: '"Dank Mono", "Fira Code", monospace',
    ...theme.plain,
  },
};

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
  },
  label: {
    display: "flex",
    fontSize: "small",
  },
  error: {
    color: "red",
  },
  warning: {
    color: "orange",
  },
  info: {
    fontSize: "small",
  },
}));

const JsonEditor = (props) => {
  const classes = useStyles();

  const { error, label, helperText, required, value, onChange, onFocus, onBlur } = props;

  const highlight = (code) => (
    <Highlight {...defaultProps} theme={theme} code={code} language="json">
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <Fragment>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </Fragment>
      )}
    </Highlight>
  );
  return (
    <div className={classes.container}>
      <label className={classes.label} style={error ? { color: "red" } : { color: "grey" }}>
        {label} {required && <span>*</span>}
      </label>
      <Editor
        value={value}
        onValueChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        highlight={highlight}
        padding={10}
        style={styles.root}
      />
      {helperText && <div className={classes.info}>{helperText}</div>}
      {error && <span className={classes.error}>{validateJsonError(value)}</span>}
    </div>
  );
};

export default JsonEditor;
