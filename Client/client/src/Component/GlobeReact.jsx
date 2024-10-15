import Globe from "react-globe.gl";
import React, { useState, useEffect, useRef } from "react";
import "../CSS/GlobeReact.css";
import ChatIcon from "./ChatIcon";
import ChatInput from "./ChatInput";
import Input from "./Input";
import World from "./test";

const GlobeReact = () => {
  const [isChatIcon, setIsChatIcon] = useState(true);
  const [dataInput, setDataInput] = useState();
  const [countries, setCountries] = useState({ features: [] });
  const [altitude, setAltitude] = useState(0.1);
  const [transitionDuration, setTransitionDuration] = useState(1000);
  const globeEl = useRef();

  useEffect(() => {
    // load data
    fetch("../datasets/ne_110m_admin_0_countries.geojson")
      .then((res) => res.json())
      .then((countries) => {
        setCountries(countries);
      });
    console.log("USE EFFECT GLOBE REACT ");
  }, [dataInput]);

  return (
    <div className="Globe">
      <ChatIcon isChatIcon={isChatIcon} setIsChatIcon={setIsChatIcon} />
      {!isChatIcon && <ChatInput />}
      <Input dataInput={dataInput} setDataInput={setDataInput} />

      {console.log("Data Input:", dataInput)}
      <World dataInput2={dataInput} />
    </div>
  );
};

export default GlobeReact;
