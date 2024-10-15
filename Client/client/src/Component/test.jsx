import React from "react";
import Globe from "react-globe.gl";
import ReactDOM from "react-dom";
const { useState, useEffect, useRef } = React;

const World = (props) => {
  const globeEl = useRef();
  const [countries, setCountries] = useState({ features: [] });
  const [altitude, setAltitude] = useState(0.1);
  const [transitionDuration, setTransitionDuration] = useState(1000);
  const dataInput = props.dataInput;
  const [filteredCountries2, setFilteredCountries2] = useState([]);

  useEffect(() => {
    // Load data
    fetch("/datasets/ne_110m_admin_0_countries.geojson")
      .then((res) => res.json())
      .then((countries) => {
        setCountries(countries);
        setTimeout(() => {
          setTransitionDuration(4000);
        }, 3000);
      });

    if (dataInput) {
      // Step 1: Convert parameter values to numbers
      const parameters = dataInput.map((country) => +country.parameter); // Convert string to number

      // Step 2: Find min and max of parameters
      const minValue = Math.min(...parameters);
      const maxValue = Math.max(...parameters);

      // Step 3: Normalize the parameter values
      const altitudeSetting = dataInput.map((country) => {
        const countryName = country.Country; // Access the country name
        const parameterValue = +country.parameter; // Convert string to number

        // Apply min-max normalization
        const normalizedValue =
          ((parameterValue - minValue + 50) / (maxValue - minValue)) * 7e-2;
        return { normalizedValue: normalizedValue, countryName: countryName }; // Adding normalized value to each country object
      });
      // This will now contain the normalized values
      setAltitude(altitudeSetting);
    }

    // Filter countries based on dataInput
    if (dataInput) {
      const filteredCountries = dataInput.map((country) => {
        const countryName = country.Country;
        console.log("FILTERING");
        console.log(
          countries.features.filter(
            (d) => d.properties.BRK_NAME === countryName
          )
        );
        return countries.features.filter(
          (d) => d.properties.BRK_NAME === countryName
        );
      });
      const filCountAns = {
        type: "FeatureCollection",
        features: filteredCountries,
        bbox: [-180, -90, 180, 83.64513],
      };
      console.log("Filtered Countries:", filCountAns);
      setFilteredCountries2(filCountAns);
    }
    console.log("Altitude Setting:", altitude);
  }, [dataInput]);

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
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        polygonsData={[filteredCountries2]}
        polygonAltitude={altitude.normalizedValue}
        polygonCapColor={() => "rgba(200, 0, 0, 0.6)"}
        polygonSideColor={() => "rgba(255, 255, 255, 0.15)"}
        polygonStrokeColor={() => "#111"}
        // polygonLabel={({ properties: d }) => `
        //   <b>${d.ADMIN} (${d.ISO_A2})</b> <br />
        //   Population: ${d.POP_EST}
        // `}
        transitionDuration={transitionDuration}
      />
    </>
  );
};

export default World;
