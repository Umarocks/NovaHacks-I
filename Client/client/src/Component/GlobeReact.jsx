import Globe from "react-globe.gl";
import React, { useState, useEffect } from "react";
import "../CSS/GlobeReact.css";
import ChatIcon from "./ChatIcon";
import ChatInput from "./ChatInput";
import Input from "./Input";

const GlobeReact = () => {
  const [isChatIcon, setIsChatIcon] = useState(true);
  // const [apiData, setApiData] = useState(null);

  // useEffect(() => {
  //   fetch("https://api.example.com/data")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setApiData(data);
  //       console.log(data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // }, []);

  return (
    <div className="Globe">
      <ChatIcon isChatIcon={isChatIcon} setIsChatIcon={setIsChatIcon} />
      {!isChatIcon && <ChatInput />}
      <Input />

      <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        lineHoverPrecision={0}
        polygonsTransitionDuration={300}
        showAtmosphere={true}
      />
    </div>
  );
};

export default GlobeReact;
