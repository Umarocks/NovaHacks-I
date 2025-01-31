import React, { useState } from "react";
import "../CSS/Input.css";
import { useEffect } from "react";
import data from "./data.json";
import MultiSelect from "./MultipleSelect";
import SingleSelect from "./SingleSelect";
import Button from "@mui/material/Button";

const Input = (props) => {
  const yearsString = Array.from(
    { length: 2023 - 2000 + 1 },
    (_, i) => 2000 + i
  ).join(", ");
  const yearsObject = yearsString.split(", ");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedParameter, setSelectedParameter] = useState("");
  const [selectedCountries, setSelectedCountries] = useState([]);
  var counter = 0;
  const getData = async () => {
    const requestData = {
      territories: selectedCountries.map((country) => country.name),
      year: selectedYear,
      parameter: selectedParameter,
    };
    console.log("Request Data:", requestData);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/territories", // Change this URL to the correct one
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      props.setDataInput(responseData);
      console.log("Response Data:", responseData);

      if (counter === 0) {
        counter++;
        getData();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="InputClass">
      <div className="country">
        <MultiSelect
          countries={data.data.countries}
          labelFor={"Select Country"}
          selected={selectedCountries}
          setSelectedOptions={setSelectedCountries}
        />
        ;
      </div>
      <div className="parameters">
        <SingleSelect
          countries={data.data.parameters}
          labelFor={"Select Parameter"}
          selected={selectedParameter}
          setSelected={setSelectedParameter}
        />
        ;
      </div>
      <div className="Year">
        {" "}
        <SingleSelect
          countries={yearsObject}
          labelFor={"Select Year"}
          selected={selectedYear}
          setSelected={setSelectedYear}
        />
        ;
      </div>
      <Button variant="outlined" onClick={getData}>
        Generate Visualization
      </Button>
    </div>
  );
};

export default Input;
