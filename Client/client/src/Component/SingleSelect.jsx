import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { palette } from "@mui/system";

const SingleSelect = (props) => {
  const { countries, labelFor } = props;
  const country = countries;
  const formattedCountries = country.map((country) => ({ title: country }));
  const label = labelFor;

  const handleChange = (event, value) => {
    console.log("Selected values:", value);
  };
  return (
    <div className="multiInput">
      {/* <Stack spacing={3} sx={{ width: 400, zIndex: 1 }}>
        <Autocomplete
          sx={{ bgcolor: "#3c3c3c" }}
          id="tags-outlined"
          options={formattedCountries}
          getOptionLabel={(options) => options.name}
          defaultValue={[]}
          filterSelectedOptions
          onChange={handleChange}
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
      </Stack> */}
      <Autocomplete
        disablePortal
        options={country}
        sx={{ width: 400, bgcolor: "#3c3c3c" }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={labelFor}
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
    </div>
  );
};

export default SingleSelect;
