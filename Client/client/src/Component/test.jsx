import React from "react";
import Globe from "react-globe.gl";
import ReactDOM from "react-dom";
const { useState, useEffect, useRef } = React;

const World = (props) => {
  const globeEl = useRef();
  const [countries, setCountries] = useState({ features: [] });
  const [altitude, setAltitude] = useState(0.1);
  const [transitionDuration, setTransitionDuration] = useState(1000);
  const [dataInput, setDataInput] = useState([
    {
      Country: "Canada",
      parameter: 100,
    },
    { parameterName: "CO2" },
  ]);
  const [countryNames, setCountryNames] = useState(["Canada"]);
  useEffect(() => {
    // load data
    setDataInput(props.dataInput);
    fetch("/datasets/ne_110m_admin_0_countries.geojson")
      .then((res) => res.json())
      .then((countries) => {
        setCountries(countries);
        if (dataInput) {
          const countryNames = dataInput.map((entry) => entry.Country);
          setCountryNames(countryNames);
          // Filter the features to only include those that match a country name in dataInput
          const filteredFeatures = countries.features.filter((feature) => {
            return countryNames.includes(feature.properties.NAME);
          });
          console.log("FILTERED FEATURES");
          console.log(filteredFeatures);
          // Set the filtered features into the state
          setCountries({
            ...countries, // Keep other properties of the GeoJSON
            features: filteredFeatures, // Replace features with the filtered ones
          });
          console.log("NEW COUNTRIES");
          console.log(countries);
          //   const updatedFeatures = countries.features.map((feature) => {
          //     if (feature.properties.BRK_NAME === dataInput.Country) {
          //       // Add new data to the feature's properties
          //       feature.properties.POP_EST = dataInput.parameter;
          //       feature.properties.parameterName = dataInput.parameterName;
          //     }
          //     return feature;
          //   });
          //   setCountries({
          //     ...countries,
          //     features: updatedFeatures,
          //   });
        }
        setTimeout(() => {
          setTransitionDuration(4000);
        }, 3000);
      });
  }, [dataInput]);

  useEffect(() => {
    // Auto-rotate
    globeEl.current.controls().autoRotate = true;
    globeEl.current.controls().autoRotateSpeed = 0.3;
    globeEl.current.pointOfView({ altitude: 4 }, 5000);
  }, []);

  return (
    <Globe
      ref={globeEl}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
      polygonsData={countries.features.filter(
        ((d) => d.properties.ISO_A2 !== "AQ") &&
          ((d) => countryNames.includes(d.properties.NAME))
      )}
      polygonAltitude={0.4}
      polygonCapColor={() => "rgba(200, 0, 0, 0.6)"}
      polygonSideColor={() => "rgba(0, 100, 0, 0.15)"}
      polygonLabel={({ properties: d }) => `
              <b>${d.ADMIN} (${d.ISO_A2})</b> <br />
              "Population": <i>${Math.round(+d.POP_EST / 1e4) / 1e2}M</i>
            `}
      polygonsTransitionDuration={transitionDuration}
    />
  );
};

export default World;
