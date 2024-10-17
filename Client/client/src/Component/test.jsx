import React from "react";
import Globe from "react-globe.gl";
import Clouds from "./Clouds";
import "../CSS/test.css";
import * as THREE from "three";
import useScript from "./useScript"; // Import the custom hook

const { useState, useEffect, useRef, useMemo } = React;
const EARTH_RADIUS_KM = 6371; // km
const SAT_SIZE = 80; // km
const TIME_STEP = 3 * 10; // per frame
const World = (props) => {
  const globeEl = useRef();

  const [countries, setCountries] = useState({ features: [] });
  const [transitionDuration, setTransitionDuration] = useState(1000);
  const [paramName, setParamName] = useState("Population");
  const [showClouds, setShowClouds] = useState(false);
  const [showDayLight, setShowDayLight] = useState(false);
  const [dataInput, setDataInput] = useState([
    // {
    //   Country: "Canada",
    // },
  ]);
  const [countryNames, setCountryNames] = useState(["Canada"]);
  const [showSatellites, setShowSatellites] = useState(false);

  useEffect(() => {
    // Main function to fetch countries and update the GeoJSON
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

  useEffect(() => {
    // Auto-rotate
    setGlobeRadius(globeEl.current.getGlobeRadius());
    globeEl.current.controls().autoRotate = true;
    globeEl.current.controls().autoRotateSpeed = 0.3;
    globeEl.current.pointOfView({ altitude: 2.5 }, 5000);
  }, []);

  const commonParams = {
    ref: globeEl,
    globeImageUrl: showDayLight
      ? "//unpkg.com/three-globe/example/img/earth-day.jpg"
      : "//unpkg.com/three-globe/example/img/earth-night.jpg",
    backgroundImageUrl: "//unpkg.com/three-globe/example/img/night-sky.png",
    polygonsData: countries.features.filter(
      (d) =>
        d.properties.ISO_A2 !== "AQ" && countryNames.includes(d.properties.NAME)
    ),
    polygonAltitude: ({ properties: d }) =>
      d.POP_EST > 100000000
        ? ((d.POP_EST - dataInput[0].parameter_min) /
            (dataInput[0].parameter_max - dataInput[0].parameter_min)) *
          10
        : 0.06,
    polygonCapColor: () => "rgba(0, 100, 0, 0.8)",
    polygonSideColor: () => "rgba(198, 252, 3, 0.6)",
    polygonLabel: ({ properties: d }) => `
    <b>${d.ADMIN} (${d.ISO_A2})</b> <br />
    <i>${paramName}: ${Math.round(+d.POP_EST)}</i>
  `,
    polygonsTransitionDuration: transitionDuration,
  };

  // SATELLITE IMPLEMENTATION

  const [satData, setSatData] = useState();
  const [globeRadius, setGlobeRadius] = useState();
  const [time, setTime] = useState(new Date());
  const satelliteLoaded = useScript(
    "//unpkg.com/satellite.js/dist/satellite.min.js"
  );

  useEffect(() => {
    // time ticker
    (function frameTicker() {
      requestAnimationFrame(frameTicker);
      setTime((time) => new Date(+time + TIME_STEP));
    })();
  }, []);

  useEffect(() => {
    if (!satelliteLoaded) return;

    // load satellite data
    fetch("//unpkg.com/globe.gl/example/datasets/space-track-leo.txt")
      .then((r) => r.text())
      .then((rawData) => {
        const tleData = rawData
          .replace(/\r/g, "")
          .split(/\n(?=[^12])/)
          .filter((d) => d)
          .map((tle) => tle.split("\n"));
        const satData = tleData
          .map(([name, ...tle]) => ({
            satrec: window.satellite.twoline2satrec(...tle),
            name: name.trim().replace(/^0 /, ""),
          }))
          // exclude those that can't be propagated
          .filter(
            (d) => !!window.satellite.propagate(d.satrec, new Date()).position
          )
          .slice(0, 1500);

        setSatData(satData);
      });
  }, [satelliteLoaded]);

  const objectsData = useMemo(() => {
    if (!satData) return [];

    // Update satellite positions
    const gmst = window.satellite.gstime(time);
    return satData.map((d) => {
      const eci = window.satellite.propagate(d.satrec, time);
      if (eci.position) {
        const gdPos = window.satellite.eciToGeodetic(eci.position, gmst);
        const lat = window.satellite.radiansToDegrees(gdPos.latitude);
        const lng = window.satellite.radiansToDegrees(gdPos.longitude);
        const alt = gdPos.height / EARTH_RADIUS_KM;
        if (showSatellites) return { ...d, lat, lng, alt };
        else return {};
      }
      return d;
    });
  }, [satData, time]);

  const satObject = useMemo(() => {
    if (!globeRadius) return undefined;

    const satGeometry = new THREE.OctahedronGeometry(
      (SAT_SIZE * globeRadius + 1000) / EARTH_RADIUS_KM / 2,
      0
    );
    const satMaterial = new THREE.MeshLambertMaterial({
      color: "lightgreen",
      transparent: true,
      opacity: 0.7,
    });
    return new THREE.Mesh(satGeometry, satMaterial);
  }, [globeRadius]);

  const satelliteParams = {
    objectsData: objectsData,
    objectLabel: "name",
    objectLat: "lat",
    objectLng: "lng",
    objectAltitude: "alt",
    objectFacesSurface: false,
    objectThreeObject: satObject,
  };

  return (
    <>
      <Globe {...commonParams} {...satelliteParams} />
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
      <label className="Satelliteswitch">
        <p>Satellite Tracking</p>
        <div className="spanSlider">
          <input
            type="checkbox"
            checked={showSatellites}
            onChange={() => {
              setShowSatellites((prev) => !prev);
            }}
          />
          <span className="slider"></span>
        </div>
      </label>
      <Clouds globeRef={globeEl} showClouds={showClouds} />
    </>
  );
};

export default World;
