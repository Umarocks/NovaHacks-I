import Globe from "react-globe.gl";
import React, { useState } from "react";
import "../CSS/GlobeReact.css";
import ChatIcon from "./ChatIcon";
import ChatInput from "./ChatInput";

const GlobeReact = () => {
  const [isChatIcon, setIsChatIcon] = useState(true);

  return (
    <div className="Globe">
      <ChatIcon isChatIcon={isChatIcon} setIsChatIcon={setIsChatIcon} />

      {!isChatIcon && <ChatInput />}

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
