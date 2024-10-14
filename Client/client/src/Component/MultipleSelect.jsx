import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

const MultiSelect = (props) => {
  const { countries, labelFor, setSelectedOptions, selectedCountries } = props;
  const country = countries;
  const formattedCountries = country.map((country) => ({ name: country }));
  const label = labelFor;

  const handleChange = (event, newValue) => {
    setSelectedOptions(newValue);
  };

  return (
    <div className="multiInput">
      <Stack spacing={3} sx={{ width: 400, zIndex: 1 }}>
        <Autocomplete
          sx={{
            "& .MuiSvgIcon-root": {
              color: "rgb(25, 118, 210,  0.5)", // Change font color here
            },
          }}
          multiple
          id="tags-outlined"
          options={formattedCountries}
          getOptionLabel={(option) => option.name}
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
      </Stack>
    </div>
  );
};

export default MultiSelect;
