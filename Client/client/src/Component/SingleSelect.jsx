import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const SingleSelect = (props) => {
  const { countries, labelFor, setSelected } = props;
  const country = countries;

  const handleChange = (event, newValue) => {
    setSelected(newValue);
  };

  return (
    <div className="multiInput">
      <Autocomplete
        disablePortal
        options={country}
        onChange={handleChange}
        sx={{ width: 400 }}
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
