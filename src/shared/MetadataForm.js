import React from "react";
import { Grid, MenuItem, TextField } from "@material-ui/core";
import { useSelector } from "react-redux";
import { Controller } from "react-hook-form";

const MetadataForm = (props) => {
  const metadataSettings = useSelector((state) => state.settings.settings.metadata);
  const { control, errors, metadata } = props;
  const {
    area = "",
    system = "",
    category = "",
    type = "",
  } = metadata;

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Controller
          as={TextField}
          select
          name="type"
          label="Type"
          fullWidth
          required
          rules={{ required: true }}
          control={control}
          error={!!errors.type}
          defaultValue={type}
        >
          <MenuItem value="" />
          {metadataSettings.types.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Controller>
      </Grid>
      <Grid item xs={6}>
        <Controller
          as={TextField}
          select
          name="category"
          label="Category"
          fullWidth
          required
          rules={{ required: true }}
          control={control}
          error={!!errors.category}
          defaultValue={category}
        >
          <MenuItem value="" />
          {metadataSettings.categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Controller>
      </Grid>
      <Grid item xs={6}>
        <Controller
          as={TextField}
          select
          name="area"
          label="Area"
          fullWidth
          required
          rules={{ required: true }}
          control={control}
          error={!!errors.area}
          defaultValue={area}
        >
          <MenuItem value="" />
          {metadataSettings.areas.map((area) => (
            <MenuItem key={area} value={area}>
              {area}
            </MenuItem>
          ))}
        </Controller>
      </Grid>
      <Grid item xs={6}>
        <Controller
          as={TextField}
          select
          name="system"
          label="System"
          fullWidth
          required
          rules={{ required: true }}
          control={control}
          error={!!errors.system}
          defaultValue={system}
        >
          <MenuItem value="" />
          {metadataSettings.systems.map((system) => (
            <MenuItem key={system} value={system}>
              {system}
            </MenuItem>
          ))}
        </Controller>
      </Grid>
    </Grid>
  );
};

export default MetadataForm;
