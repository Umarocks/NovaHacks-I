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
  const [geoJsonData, setGeoJsonData] = useState(null);

  useEffect(() => {
    // Load data
    fetch("/datasets/ne_110m_admin_0_countries.geojson")
      .then((res) => res.json())
      .then((countries) => {
        setCountries(countries);
        console.log(countries);
        setTimeout(() => {
          setTransitionDuration(4000);
        }, 3000);
      });

    // Set altitude based on population estimate
    setAltitude(() => (feat) => {
      return Math.max(0.1, Math.sqrt(+feat.properties.POP_EST) * 7e-5);
    });

    // Log each param in dataInput
    if (Array.isArray(dataInput)) {
      dataInput.forEach((item) => {
        if (item && item.param) {
          console.log(item.param);
        }
      });
    }

    // Filter countries based on dataInput
    const filteredCountries = dataInput.map((country) => {
      const countryName = country.Country;
      return countries.features.filter(
        (d) => d.properties.BRK_NAME === countryName
      );
    });
    console.log(filteredCountries);
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
        polygonsData={countries.features}
        polygonAltitude={altitude}
        polygonCapColor={() => "rgba(200, 0, 0, 0.6)"}
        polygonSideColor={() => "rgba(255, 255, 255, 0.15)"}
        polygonStrokeColor={() => "#111"}
        polygonLabel={({ properties: d }) => `
          <b>${d.ADMIN} (${d.ISO_A2})</b> <br />
          Population: ${d.POP_EST}
        `}
        transitionDuration={transitionDuration}
      />
    </>
  );
};

export default World;
