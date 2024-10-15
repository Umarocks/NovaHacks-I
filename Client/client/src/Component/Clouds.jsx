import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const Clouds = ({ globeRef, showClouds }) => {
  const cloudsRef = useRef(null); // Reference for clouds

  useEffect(() => {
    const globe = globeRef.current;

    const CLOUDS_IMG_URL = "./clouds.png"; // Ensure this URL is accessible
    const CLOUDS_ALT = 0.004;
    const CLOUDS_ROTATION_SPEED = -0.006; // deg/frame

    // Load clouds texture and create clouds mesh
    const loadClouds = () => {
      new THREE.TextureLoader().load(CLOUDS_IMG_URL, (cloudsTexture) => {
        const clouds = new THREE.Mesh(
          new THREE.SphereGeometry(
            globe.getGlobeRadius() * (1 + CLOUDS_ALT),
            75,
            75
          ),
          new THREE.MeshPhongMaterial({ map: cloudsTexture, transparent: true })
        );
        cloudsRef.current = clouds; // Store clouds in ref
        globe.scene().add(clouds);
        console.log("Clouds texture loaded:", cloudsTexture);

        // Rotate clouds
        const rotateClouds = () => {
          if (cloudsRef.current) {
            cloudsRef.current.rotation.y +=
              (CLOUDS_ROTATION_SPEED * Math.PI) / 180;
            requestAnimationFrame(rotateClouds);
          }
        };
        rotateClouds();
      });
    };

    // Load clouds when component mounts
    if (showClouds) {
      loadClouds();
    }

    // Cleanup: remove clouds when component unmounts or when showClouds changes
    return () => {
      if (cloudsRef.current) {
        globe.scene().remove(cloudsRef.current);
        cloudsRef.current = null; // Clear the reference
        console.log("Clouds removed from the scene");
      }
    };
  }, [globeRef, showClouds]); // Re-run effect when globeRef or showClouds changes

  // If showClouds is true, return null, otherwise return null
  return null; // This component does not render anything directly
};

export default Clouds;
