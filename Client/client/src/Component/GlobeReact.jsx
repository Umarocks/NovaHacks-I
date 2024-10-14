import Globe from "react-globe.gl";
import React, { useState, useEffect, useRef } from "react";
import "../CSS/GlobeReact.css";
import ChatIcon from "./ChatIcon";
import ChatInput from "./ChatInput";
import Input from "./Input";

const GlobeReact = () => {
  const [isChatIcon, setIsChatIcon] = useState(true);
  const globeEl = useRef();

  useEffect(() => {
    // Auto-rotate
    globeEl.current.controls().autoRotate = true;
    globeEl.current.controls().autoRotateSpeed = 0.6;

    globeEl.current.pointOfView({ altitude: 2.5 }, 5000);
  }, []);
  return (
    <div className="Globe">
      <ChatIcon isChatIcon={isChatIcon} setIsChatIcon={setIsChatIcon} />
      {!isChatIcon && <ChatInput />}
      <Input />
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl={"//unpkg.com/three-globe/example/img/night-sky.png"}
      />
      ;
    </div>
  );
};

export default GlobeReact;
