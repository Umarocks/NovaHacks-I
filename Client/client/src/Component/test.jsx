import React from "react";
import Globe from "react-globe.gl";
import Clouds from "./Clouds";
import "../CSS/test.css";
const { useState, useEffect, useRef } = React;
const World = (props) => {
  const globeEl = useRef();
  const [countries, setCountries] = useState({ features: [] });
  // const [altitude, setAltitude] = useState(0.1);
  const [transitionDuration, setTransitionDuration] = useState(1000);
  const [paramName, setParamName] = useState("Population");
  const [showClouds, setShowClouds] = useState(false);
  const [showDayLight, setShowDayLight] = useState(false);
  const [dataInput, setDataInput] = useState([
    {
      Country: "Canada",
      parameter: 100,
    },
  ]);
  const [countryNames, setCountryNames] = useState(["Canada"]);
  useEffect(() => {
    // load data
    setDataInput(props.dataInput2);
    const fetchCountries = async () => {
      try {
        const res = await fetch("/datasets/ne_110m_admin_0_countries.geojson");
        const countries = await res.json();
        setCountries(countries);
        if (dataInput) {
          const countryNames = dataInput.map((entry) => entry.Country);
          setCountryNames(countryNames);
          const filteredFeatures = countries.features.filter((feature) => {
            return countryNames.includes(feature.properties.NAME);
          });

          // Update the POP_EST property for the filtered features
          const updatedFeatures = filteredFeatures.map((feature) => {
            const dataObj = dataInput.find(
              (entry) => entry.Country === feature.properties.NAME
            );
            return {
              ...feature,
              properties: {
                ...feature.properties,
                POP_EST: dataObj
                  ? dataObj.parameter
                  : feature.properties.POP_EST, // Change POP_EST or use the existing value
              },
            };
          });

          // Set the updated features into the state
          setCountries({
            ...countries, // Keep other properties of the GeoJSON
            features: updatedFeatures, // Replace features with the updated ones
          });

          setParamName(dataInput[0].parameterName);
        }
        setTimeout(() => {
          setTransitionDuration(2000);
        }, 3000);
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, [props.dataInput2]);
  // afaf
  useEffect(() => {
    // Auto-rotate
    globeEl.current.controls().autoRotate = true;
    globeEl.current.controls().autoRotateSpeed = 0.3;
    globeEl.current.pointOfView({ altitude: 4 }, 5000);
  }, []);

  return (
    <>
      <Globe
        ref={globeEl}
        globeImageUrl={
          showDayLight
            ? "//unpkg.com/three-globe/example/img/earth-night.jpg"
            : "//unpkg.com/three-globe/example/img/earth-day.jpg"
        }
        backgroundImageUrl={"//unpkg.com/three-globe/example/img/night-sky.png"}
        polygonsData={countries.features.filter(
          ((d) => d.properties.ISO_A2 !== "AQ") &&
            ((d) => countryNames.includes(d.properties.NAME))
        )}
        polygonAltitude={({ properties: d }) =>
          d.POP_EST > 100000000
            ? ((d.POP_EST - dataInput[0].parameter_min) /
                (dataInput[0].parameter_max - dataInput[0].parameter_min)) *
              10
            : 0.06
        }
        polygonCapColor={() => "rgba(0, 100, 0, 0.8)"}
        polygonSideColor={() => "rgba(198, 252, 3, 0.6)"}
        polygonLabel={({ properties: d }) => `
              <b>${d.ADMIN} (${d.ISO_A2})</b> <br />
              <i>${paramName}": "${Math.round(+d.POP_EST)}</i>
            `}
        polygonsTransitionDuration={transitionDuration}
      />
      <label className="switch">
        <p>Show Clouds</p>

        <div className="spanSlider">
          <input
            type="checkbox"
            checked={showClouds}
            onChange={() => setShowClouds((prev) => !prev)}
          />
          <span className="slider"></span>
        </div>
      </label>
      <label className="Dayswitch">
        <p>Day Light</p>
        <div className="spanSlider">
          <input
            type="checkbox"
            checked={showDayLight}
            onChange={() => setShowDayLight((prev) => !prev)}
          />
          <span className="slider"></span>
        </div>
      </label>
      <Clouds globeRef={globeEl} showClouds={showClouds} />
    </>
  );
};

export default World;
