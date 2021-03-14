import React from "react";
import { Checkbox, FormControlLabel, Grid, TextField } from "@material-ui/core";
import { Controller } from "react-hook-form";
import { validateEmailList } from "./validators";

const EmailForm = (props) => {
  const { control, register, errors, email, enabled, toggleEnabled, required = false } = props;
  const { always = "", failure = "", custom_body = "" } = email;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              name="emailEnabled"
              checked={enabled}
              onClick={() => toggleEnabled(!enabled)}
              inputRef={register}
            />
          }
          label="Enable emails"
        />
      </Grid>
      {enabled && (
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                as={TextField}
                name="always"
                label="Always"
                fullWidth
                required={required}
                rules={{
                  required: required,
                  validate: (input) => validateEmailList(input),
                }}
                control={control}
                error={!!errors.always}
                defaultValue={always}
                helperText="Comma separated list"
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                as={TextField}
                name="failure"
                label="Only on failures"
                fullWidth
                required={required}
                rules={{
                  required: required,
                  validate: (input) => validateEmailList(input),
                }}
                control={control}
                error={!!errors.failure}
                defaultValue={failure}
                helperText="Comma separated list"
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                as={TextField}
                name="custom_body"
                label="Custom body"
                fullWidth
                required={required}
                rules={{ required: required }}
                control={control}
                error={!!errors.custom_body}
                defaultValue={custom_body}
              />
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default EmailForm;
