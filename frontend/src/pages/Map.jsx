import React, { useEffect, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

const MapComponent = () => {
  // State to track if the script is loaded
  const [isLoaded, setIsLoaded] = useState(false);

  // Center coordinates for the map
  const position = { lat: 53.54, lng: 10 };

  useEffect(() => {
    // Dynamically add the Google Maps API script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAp186dG3rotmKj4wpvnMatgjl7kiLQpFE&libraries=places`;
    script.async = true;
    script.onload = () => setIsLoaded(true); // Set state to true once the script is loaded

    // Append the script to the document body
    document.body.appendChild(script);

    // Cleanup function to remove the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []); // Empty dependency array ensures this runs only once

  if (!isLoaded) {
    return <div>Loading...</div>; // Show loading message while the script is loading
  }

  return (
    <div style={{ height: "100vh" }}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        zoom={9}
        center={position}
      >
        <Marker position={position} />
      </GoogleMap>
    </div>
  );
};

export default MapComponent;
