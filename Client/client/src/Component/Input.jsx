import React, { useState } from "react";
import "../CSS/Input.css";
import { useEffect } from "react";
import data from "./data.json";
import MultiSelect from "./MultipleSelect";
import SingleSelect from "./SingleSelect";
import Button from "@mui/material/Button";

const Input = () => {
  const yearsString = Array.from(
    { length: 2023 - 1990 + 1 },
    (_, i) => 1990 + i
  ).join(", ");
  const yearsObject = yearsString.split(", ");
  // const [parameters, setParameters] = useState([]);
  // const [countries, setCountries] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedParameter, setSelectedParameter] = useState("");
  const [selectedCountries, setSelectedCountries] = useState([]);

  // useEffect(() => {
  //   console.log("Selected Year:", selectedYear);
  //   console.log("Selected Parameter:", selectedParameter);
  //   console.log("Selected Countries:", selectedCountries);
  // }, [selectedYear, selectedParameter, selectedCountries]);

  const getData = async () => {
    const requestData = {
      territories: selectedCountries.map((country) => country.name),
      year: selectedYear,
      parameter: selectedParameter,
    };
    console.log("Request Data:", requestData);
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    };
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/territories",
        requestOptions
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      console.log("Response Data:", responseData);
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
