import React, { useEffect, useState } from "react";
import { Checkbox, FormControlLabel, Grid, MenuItem, TextField } from "@material-ui/core";
import { useSelector } from "react-redux";
import { Controller } from "react-hook-form";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import Tooltip from "@material-ui/core/Tooltip";
import api from "../api";

const filter = createFilterOptions();

const DashboardForm = (props) => {
  const dashboardSettings = useSelector((state) => state.settings.settings.dashboard);
  const { register, control, errors, dashboard, enabled, toggleEnabled } = props;
  const { compatible, cadence = "", breakdown = "", corporate_brand = "", kpis = [] } = dashboard;
  const [kpiOptions, setKpiOptions] = useState([]);

  useEffect(() => {
    api
      .get('/test_cases?where={"dashboard.kpis":{"$exists":true}}&projection={"dashboard.kpis":1}')
      .then((response) => {
        if (response.status !== 200) {
          throw Error(response.statusText);
        }

        return response.data._items;
      })
      .then((testCases) => {
        setKpiOptions([...new Set(testCases.map((testCase) => testCase.dashboard.kpis).flat())]);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request);
        }
      });
  }, []);

  return (
    <Grid container spacing={2}>
      <Tooltip title={compatible ? "" : "Test case does not support dashboard publications."}>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                name="dashboardEnabled"
                checked={enabled}
                onClick={() => toggleEnabled(!enabled)}
                inputRef={register}
                disabled={!compatible}
              />
            }
            label="Publish to dashboard"
          />
        </Grid>
      </Tooltip>
      {enabled && (
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Controller
                as={TextField}
                select
                name="cadence"
                label="Cadence"
                fullWidth
                required
                rules={{ required: true }}
                control={control}
                error={!!errors.cadence}
                defaultValue={cadence}
              >
                <MenuItem value="" />
                {dashboardSettings.cadences.map((cadence) => (
                  <MenuItem key={cadence} value={cadence}>
                    {cadence}
                  </MenuItem>
                ))}
              </Controller>
            </Grid>
            <Grid item xs={4}>
              <Controller
                as={TextField}
                select
                name="breakdown"
                label="Breakdown"
                fullWidth
                required
                rules={{ required: true }}
                control={control}
                error={!!errors.breakdown}
                defaultValue={breakdown}
              >
                <MenuItem value="" />
                {dashboardSettings.breakdowns.map((breakdown) => (
                  <MenuItem key={breakdown} value={breakdown}>
                    {breakdown}
                  </MenuItem>
                ))}
              </Controller>
            </Grid>
            <Grid item xs={4}>
              <Controller
                as={TextField}
                select
                name="corporate_brand"
                label="Corporate brand"
                fullWidth
                required
                control={control}
                error={!!errors.corporate_brand}
                defaultValue={corporate_brand}
              >
                <MenuItem value="" />
                {dashboardSettings.corporate_brands.map((corporateBrand) => (
                  <MenuItem key={corporateBrand} value={corporateBrand}>
                    {corporateBrand}
                  </MenuItem>
                ))}
              </Controller>
            </Grid>
            <Grid item xs={12}>
              <Controller
                as={
                  <Autocomplete
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    multiple
                    freeSolo
                    options={kpiOptions}
                    filterOptions={(options, params) => {
                      const filtered = filter(options, params);

                      // Suggest the creation of a new value
                      if (params.inputValue !== "") {
                        filtered.push(`Add "${params.inputValue}"`);
                      }

                      return filtered;
                    }}
                    renderInput={(params) => (
                      <TextField
                        multiline
                        {...params}
                        label="Affected KPIs"
                        fullWidth
                        error={!!errors.kpis}
                        helperText="The main KPIs that would be affected if this test case fails"
                        InputLabelProps={{ required: true }}
                      />
                    )}
                  />
                }
                name="kpis"
                onChange={([, data]) =>
                  data.map((kpi) => (kpi.includes('Add "') ? kpi.match(/Add "(.+)"/)[1] : kpi))
                }
                control={control}
                rules={{
                  validate: (d) => {
                    return d.length > 0;
                  },
                }}
                defaultValue={kpis}
              />
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default DashboardForm;
