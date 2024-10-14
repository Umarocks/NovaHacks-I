import React, { useState } from "react";
import "../CSS/Input.css";
import { useEffect } from "react";
import data from "./data.json";
import MultiSelect from "./MultipleSelect";
import SingleSelect from "./SingleSelect";

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

  useEffect(() => {
    console.log("Selected Year:", selectedYear);
    console.log("Selected Parameter:", selectedParameter);
    console.log("Selected Countries:", selectedCountries);
  }, [selectedYear, selectedParameter, selectedCountries]);

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
    </div>
  );
};

export default Input;
