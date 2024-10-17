import React from "react";
import Globe from "react-globe.gl";
import Clouds from "./Clouds";
import "../CSS/test.css";
import * as THREE from "three";
import useScript from "./useScript"; // Import the custom hook
import MultiSelect from "./MultipleSelect";
import data from "./data.json";
import Button from "@mui/material/Button";
import * as d3 from "d3"; // Import d3-dsv
import indexBy from "index-array-by";

const { useState, useEffect, useRef, useMemo } = React;
const EARTH_RADIUS_KM = 6371; // km
const SAT_SIZE = 80; // km
const TIME_STEP = 3 * 100; // per frame

const OPACITY = 0.22;

const airportParse = ([
  airportId,
  name,
  city,
  country,
  iata,
  icao,
  lat,
  lng,
  alt,
  timezone,
  dst,
  tz,
  type,
  source,
]) => ({
  airportId,
  name,
  city,
  country,
  iata,
  icao,
  lat,
  lng,
  alt,
  timezone,
  dst,
  tz,
  type,
  source,
});
const routeParse = ([
  airline,
  airlineId,
  srcIata,
  srcAirportId,
  dstIata,
  dstAirportId,
  codeshare,
  stops,
  equipment,
]) => ({
  airline,
  airlineId,
  srcIata,
  srcAirportId,
  dstIata,
  dstAirportId,
  codeshare,
  stops,
  equipment,
});

const World = (props) => {
  const globeEl = useRef();

  // Main function to fetch countries and update the GeoJSON  For polygon data

  const [countries, setCountries] = useState({ features: [] });
  const [transitionDuration, setTransitionDuration] = useState(1000);
  const [paramName, setParamName] = useState("Population");
  const [showClouds, setShowClouds] = useState(false);
  const [showDayLight, setShowDayLight] = useState(false);
  const [dataInput, setDataInput] = useState([]);
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
          setTransitionDuration(500);
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
    globeEl.current.controls().autoRotate = false;
    globeEl.current.controls().autoRotateSpeed = 0.3;
    globeEl.current.pointOfView({ altitude: 2.5 }, 5000);
  }, []);

  const commonParams = {
    ref: globeEl,
    globeImageUrl: showDayLight
      ? "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
      : "//unpkg.com/three-globe/example/img/earth-night.jpg",
    backgroundImageUrl: "//unpkg.com/three-globe/example/img/night-sky.png",
    bumpImageUrl: "//unpkg.com/three-globe/example/img/earth-topology.png",
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

  //Submarine Cables

  const [cablePaths, setCablePaths] = useState([]);
  const [showCables, setShowCables] = useState(false);
  const [cableParams, setCableParams] = useState({});
  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/curran/www.submarinecablemap.com/master/web/public/api/v3/cable/cable-geo.json"
    )
      .then((r) => r.json())
      .then((cablesGeo) => {
        let cablePaths = [];
        cablesGeo.features.forEach(({ geometry, properties }) => {
          geometry.coordinates.forEach((coords) =>
            cablePaths.push({ coords, properties })
          );
        });

        // setCablePaths(cablePaths);
        if (!showCables) {
          setCablePaths(cablePaths);
        } else {
          setCablePaths();
        }
      });
    const cableParams = setCableParams({
      pathsData: cablePaths,
      pathPoints: "coords",
      pathPointLat: (p) => p[1],
      pathPointLng: (p) => p[0],
      pathColor: (path) => path.properties.color,
      pathLabel: (path) => path.properties.name,
      pathDashLength: 0.1,
      pathDashGap: 0.008,
      pathDashAnimateTime: 13000,
    });
  }, [showCables]);

  // Airline Routes
  const [selectedCountries, setSelectedCountries] = useState([]);
  var counter = 0;
  const getAirData = () => {
    // selectedCountries.forEach((country) => console.log(country.name));
    const updatedCountries = selectedCountries.map((country) => country.name);
    console.log(updatedCountries);
    setCOUNTRY(updatedCountries);
    setTimeout(() => {
      if (counter === 0) {
        counter++;
        getAirData();
      }
    }, 1000);
  };
  const [airports, setAirports] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [airDataParam, setAirDataParam] = useState({});
  const [COUNTRY, setCOUNTRY] = useState([]);
  const fetchData = async () => {
    try {
      const [airports, routes] = await Promise.all([
        fetch(
          "https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat"
        )
          .then((res) => res.text())
          .then((d) => d3.csvParseRows(d, airportParse)),
        fetch(
          "https://raw.githubusercontent.com/jpatokal/openflights/master/data/routes.dat"
        )
          .then((res) => res.text())
          .then((d) => d3.csvParseRows(d, routeParse)),
      ]);

      const byIata = indexBy(airports, "iata", false);

      const filteredRoutes = routes
        .filter(
          (d) =>
            byIata.hasOwnProperty(d.srcIata) && byIata.hasOwnProperty(d.dstIata)
        ) // exclude unknown airports
        .filter((d) => d.stops === "0") // non-stop flights only
        .map((d) =>
          Object.assign(d, {
            srcAirport: byIata[d.srcIata],
            dstAirport: byIata[d.dstIata],
          })
        )
        .filter(
          (d) =>
            COUNTRY.includes(d.srcAirport.country) &&
            !COUNTRY.includes(d.dstAirport.country)
        ); // international routes from country

      setAirports(airports);
      setRoutes(filteredRoutes);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (!COUNTRY) return;
    fetchData();
    const AirData = {
      arcsData: routes,
      arcLabel: (d) => `${d.airline}: ${d.srcIata} &#8594; ${d.dstIata}`,
      arcStartLat: (d) => +d.srcAirport.lat,
      arcStartLng: (d) => +d.srcAirport.lng,
      arcEndLat: (d) => +d.dstAirport.lat,
      arcEndLng: (d) => +d.dstAirport.lng,
      arcDashLength: 0.25,
      arcDashGap: 1,
      arcDashInitialGap: () => Math.random(),
      arcDashAnimateTime: 4000,
      arcColor: (d) => [
        `rgba(0, 255, 0, ${OPACITY})`,
        `rgba(255, 0, 0, ${OPACITY})`,
      ],
      arcsTransitionDuration: 0,
      pointsData: airports,
      pointColor: () => "orange",
      pointAltitude: 0,
      pointRadius: 0.02,
      pointsMerge: true,
    };
    setAirDataParam(AirData);
    console.log("EFFECT");
  }, [COUNTRY]);
  useEffect(() => {}, counter);
  return (
    <>
      <Globe
        {...commonParams}
        {...satelliteParams}
        {...cableParams}
        {...airDataParam}
      />
      <div className="AirCountry">
        <MultiSelect
          countries={data.data.countries}
          labelFor={"Select Country for Outbound International Air Traffic"}
          selected={selectedCountries}
          setSelectedOptions={setSelectedCountries}
        />
        <br />
        <Button variant="outlined" id="AirData" onClick={getAirData}>
          Generate Visualization
        </Button>
      </div>
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
      <label className="Cableswitch">
        <p>Submarine Cables</p>
        <div className="spanSlider">
          <input
            type="checkbox"
            checked={showCables}
            onChange={() => {
              setShowCables((prev) => !prev);
            }}
          />
          <span className="slider"></span>
        </div>
      </label>
      <label className="AutoRotate">
        <p>AutoRotate</p>
        <div className="spanSlider">
          <input
            type="checkbox"
            checked={globeEl.current.controls().autoRotate}
            onChange={() => {
              globeEl.current.controls().autoRotate =
                !globeEl.current.controls().autoRotate;
            }}
          />
          <span className="slider"></span>
        </div>
      </label>
      {showSatellites && <div id="time-log">{time.toString()}</div>}
      <Clouds globeRef={globeEl} showClouds={showClouds} />
    </>
  );
};

export default World;
