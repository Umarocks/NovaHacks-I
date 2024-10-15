import React from "react";
import Globe from "react-globe.gl";
import ReactDOM from "react-dom";
const { useState, useEffect, useRef } = React;

const World = (props) => {
  const globeEl = useRef();
  const [countries, setCountries] = useState({ features: [] });
  const [altitude, setAltitude] = useState(0.1);
  const [transitionDuration, setTransitionDuration] = useState(1000);
  const [paramName, setParamName] = useState("Population");
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
          // Filter the features to only include those that match a country name in dataInput
          //   const filteredFeatures = countries.features.filter((feature) => {
          //     return countryNames.includes(feature.properties.NAME);
          //   });
          //   // Set the filtered features into the state
          //   setCountries({
          //     ...countries, // Keep other properties of the GeoJSON
          //     features: filteredFeatures, // Replace features with the filtered ones
          //   });
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
          console.log(paramName);
          console.log(dataInput[0].parameterName);
          setParamName(dataInput[0].parameterName);
        }
        setTimeout(() => {
          setTransitionDuration(2000);
        }, 3000);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
    console.log("Data Input:", dataInput);
    console.log("USE EFFECT TEST");
  }, [props.dataInput2]);
  // afaf
  useEffect(() => {
    // Auto-rotate
    globeEl.current.controls().autoRotate = true;
    globeEl.current.controls().autoRotateSpeed = 0.3;
    globeEl.current.pointOfView({ altitude: 4 }, 5000);
  }, [props.dataInput2]);
  {
    console.log("rendering globe");
  }
  return (
    <>
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
              <i>${paramName}": "${Math.round(+d.POP_EST)}</i>
            `}
        polygonsTransitionDuration={transitionDuration}
      />
      `${console.log("rendering globe2")}`;
    </>
  );
};

export default World;
