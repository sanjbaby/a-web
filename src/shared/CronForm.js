import React, { useEffect } from "react";
import { Button, Grid, MenuItem, Switch, TextField } from "@material-ui/core";
import { Controller, useFieldArray } from "react-hook-form";
import { isValidCron } from "cron-validator";
import { useSelector } from "react-redux";

const CronForm = (props) => {
  const envs = useSelector((state) => state.settings.settings.connections.envs);
  const { control, errors, crons, register } = props;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "crons",
  });

  useEffect(() => {
    append(
      crons.map((cron) => ({
        enabled: cron.enabled ? cron.enabled : false,
        expression: cron.expression ? cron.expression : "* * * * *",
        env: cron.env ? cron.env : "",
      }))
    );
  }, [crons, append]);

  return (
    <>
      {fields.map((item, idx) => (
        <Grid container spacing={2} key={item.id} alignItems="flex-end">
          <Grid item xs={1}>
            <Switch
              name={`crons[${idx}].enabled`}
              inputRef={register()}
              defaultChecked={item.enabled}
            />
          </Grid>
          <Grid item xs={4}>
            <Controller
              as={TextField}
              name={`crons[${idx}].expression`}
              label="Cron expression"
              fullWidth
              required
              control={control}
              rules={{
                required: true,
                validate: (input) => isValidCron(input),
              }}
              error={
                !!errors.crons?.find(
                  (error) => error?.expression?.ref.name === `crons[${idx}].expression`
                )
              }
              defaultValue={item.expression}
            />
          </Grid>
          <Grid item xs={3}>
            <Controller
              as={TextField}
              select
              name={`crons[${idx}].env`}
              label="Environment"
              fullWidth
              required
              control={control}
              rules={{ required: true }}
              error={!!errors.crons?.find((error) => error?.env?.ref.name === `crons[${idx}].env`)}
              defaultValue={item.env}
            >
              {envs.map((env) => (
                <MenuItem key={env} value={env}>
                  {env}
                </MenuItem>
              ))}
            </Controller>
          </Grid>
          <Grid item xs={2}>
            <Button onClick={() => remove(idx)}>Delete</Button>
          </Grid>
        </Grid>
      ))}
      <Grid container spacing={2} alignItems="flex-end">
        <Grid item xs={2}>
          <Button
            onClick={() =>
              append({
                expression: "* * * * *",
                env: "",
                enabled: true,
              })
            }
          >
            Add
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default CronForm;
