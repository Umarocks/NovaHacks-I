import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { palette } from "@mui/system";

const Tags = (countries) => {
  console.log(countries.countries);
  const country = countries.countries;
  const formattedCountries = country.map((country) => ({ name: country }));

  console.log(formattedCountries);
  return (
    <div className="multiInput">
      <Stack spacing={3} sx={{ width: 400, zIndex: 1 }}>
        <Autocomplete
          sx={{ bgcolor: "#3c3c3c" }}
          multiple
          id="tags-outlined"
          options={formattedCountries}
          getOptionLabel={(options) => options.name}
          defaultValue={[]}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Countries"
              placeholder="Favorites"
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

export default Tags;
