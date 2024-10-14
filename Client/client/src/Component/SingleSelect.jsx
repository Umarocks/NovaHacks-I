import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";

const SingleSelect = (props) => {
  const [value, setValue] = useState();
  const { countries, labelFor, setSelected } = props;
  const country = countries;

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSelected(newValue);
  };

  useEffect(() => {
    console.log("Selected value:", value);
  }, [value]);

  return (
    <div className="multiInput">
      <Autocomplete
        disablePortal
        options={country}
        onChange={handleChange}
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
