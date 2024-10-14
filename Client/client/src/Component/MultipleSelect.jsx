import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

const MultiSelect = (props) => {
  const { countries, labelFor } = props;
  const country = countries;
  const formattedCountries = country.map((country) => ({ name: country }));
  const label = labelFor;
  return (
    <div className="multiInput">
      <Stack spacing={3} sx={{ width: 400, zIndex: 1 }}>
        <Autocomplete
          sx={{ bgcolor: "#3c3c3c" }}
          multiple
          id="tags-outlined"
          options={formattedCountries}
          getOptionLabel={(options) => options.name}
          defaultValue={["All"]}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              placeholder={label}
              sx={{
                "& .MuiInputBase-input": {
                  color: "white", // Change font color here
                },
                "& .MuiInputLabel-root": {
                  color: "white", // Change label color here
                },
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#707070", // Change border color here
                },
                "& .MuiChip-root": {
                  color: "white", // Change font color of selected inputs here
                },
              }}
            />
          )}
        />
      </Stack>
    </div>
  );
};

export default MultiSelect;
