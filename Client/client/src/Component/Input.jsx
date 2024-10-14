import React, { useState } from "react";
import "../CSS/Input.css";
import { useEffect } from "react";
import data from "./data.json";
import MultiSelect from "./MultipleSelect";
import SingleSelect from "./SingleSelect";
const Input = () => {
  const years = Array.from({ length: 2023 - 1990 + 1 }, (_, i) => 1990 + i);
  const yearsString = years.join(", ");
  const yearsObject = yearsString.split(", ");
  const [parameters, setParameters] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedParameter, setSelectedParameter] = useState("");
  const [selectedCountries, setSelectedCountries] = useState([]);

  useEffect(() => {
    setParameters(data.data.parameters);
    setCountries(data.data.countries);
  }, []);

  const handleCountryChange = (event) => {
    const value = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedCountries(value);
  };

  return (
    <div className="InputClass">
      <div className="country">
        <MultiSelect
          countries={data.data.countries}
          labelFor={"Select Country"}
        />
        ;
      </div>
      <div className="parameters">
        <SingleSelect
          countries={data.data.parameters}
          labelFor={"Select Parameter"}
        />
        ;
      </div>
      <div className="Year">
        {" "}
        <SingleSelect countries={yearsObject} labelFor={"Select Year"} />;
      </div>
    </div>
  );
};

export default Input;
