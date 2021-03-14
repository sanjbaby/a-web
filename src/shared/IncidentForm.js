import React from "react";
import { Checkbox, FormControlLabel, Grid, MenuItem, TextField } from "@material-ui/core";
import { Controller } from "react-hook-form";

const IncidentForm = (props) => {
  const {
    control,
    register,
    errors,
    incident,
    enabled,
    toggleEnabled,
    required = false,
    watch,
  } = props;
  const {
    severity = 4,
    create = "Daily",
    assignment_group = "",
    service = "",
    level = "Test Case",
    customKey = "",
  } = incident;
  const watchLevel = watch("level", level);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              name="incidentEnabled"
              checked={enabled}
              onClick={() => toggleEnabled(!enabled)}
              inputRef={register}
            />
          }
          label="Enable incidents"
        />
      </Grid>
      {enabled && (
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Controller
                as={TextField}
                select
                name="severity"
                label="Severity"
                fullWidth
                required={required}
                rules={{ required: required }}
                control={control}
                error={!!errors.severity}
                defaultValue={severity}
              >
                <MenuItem value="1">1. Critical</MenuItem>
                <MenuItem value="2">2. Major</MenuItem>
                <MenuItem value="3">3. Minor</MenuItem>
                <MenuItem value="4">4. Warning</MenuItem>
              </Controller>
            </Grid>
            <Grid item xs={3}>
              <Controller
                as={TextField}
                select
                name="create"
                label="Create"
                fullWidth
                required={required}
                rules={{ required: required }}
                control={control}
                error={!!errors.create}
                defaultValue={create}
              >
                <MenuItem value="Always">Always</MenuItem>
                <MenuItem value="Daily">Daily</MenuItem>
                <MenuItem value="Weekly">Weekly</MenuItem>
                <MenuItem value="Monthly">Monthly</MenuItem>
                <MenuItem value="Once">Once</MenuItem>
              </Controller>
            </Grid>
            <Grid item xs={3}>
              <Controller
                as={TextField}
                select
                name="level"
                label="Level"
                fullWidth
                required={required}
                rules={{ required: required }}
                control={control}
                error={!!errors.level}
                defaultValue={level}
              >
                <MenuItem value="Node">Node</MenuItem>
                <MenuItem value="Test Case">Test Case</MenuItem>
                <MenuItem value="Scenario">Scenario</MenuItem>
                <MenuItem value="Custom">Custom</MenuItem>
              </Controller>
            </Grid>
            {watchLevel === "Custom" && (
              <Grid item xs={3}>
                <Controller
                  as={TextField}
                  name="customKey"
                  label="Custom key"
                  fullWidth
                  required={required}
                  rules={{ required: required }}
                  control={control}
                  error={!!errors.customKey}
                  defaultValue={customKey}
                />
              </Grid>
            )}
            <Grid item xs={6}>
              <Controller
                as={TextField}
                name="assignment_group"
                label="Assignment group"
                fullWidth
                required={required}
                rules={{ required: required }}
                control={control}
                error={!!errors.assignment_group}
                defaultValue={assignment_group}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                as={TextField}
                name="service"
                label="Service"
                fullWidth
                required={required}
                rules={{ required: required }}
                control={control}
                error={!!errors.service}
                defaultValue={service}
              />
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default IncidentForm;
