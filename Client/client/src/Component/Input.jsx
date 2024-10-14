import React, { useState } from "react";
import "../CSS/Input.css";
import { useEffect } from "react";
import data from "./data.json";
import Tags from "./MultipleInput";

const Input = () => {
  const years = Array.from({ length: 2023 - 1990 + 1 }, (_, i) => 1990 + i);
  const [parameters, setParameters] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedParameter, setSelectedParameter] = useState("");
  const [selectedCountries, setSelectedCountries] = useState([]);

  useEffect(() => {
    setParameters(data.data.parameters);
    setCountries(data.data.countries);

    console.log(countries);
    console.log(parameters);
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
      <Tags countries={data.data.countries} />;
    </div>
  );
};

export default Input;
