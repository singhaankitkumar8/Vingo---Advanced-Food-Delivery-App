import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCity, setState } from "../redux/userSlice";

function getCity() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      console.log("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        console.log(`Latitude: ${lat}, Longitude: ${lon}`);

        try {
          // 🔑 USE Geoapify API key 
          const apiKey = import.meta.env.VITE_GEOAPI_KEY;

          const response = await fetch(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${apiKey}`
          );
          const data = await response.json();

          let city =
            data?.features?.[0]?.properties?.city ||
            data?.features?.[0]?.properties?.town ||
            data?.features?.[0]?.properties?.village ||
            data?.features?.[0]?.properties?.state ||
            "Unknown";
          let state = data?.features?.[0]?.properties?.state ||
            "Unknown";

          dispatch(setCity(city));
          dispatch(setState(state));
        } catch (err) {
          console.error("Error fetching city name:", err);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [dispatch]);
}

export default getCity;
