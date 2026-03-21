// import axios from 'axios'
// import React, { useEffect } from 'react'
// import { serverUrl } from '../App'
// import { useDispatch, useSelector } from 'react-redux'
// import {  setShopsOfCity, setUserData } from '../redux/userSlice'

// function updateLocation() {
// const {userData,socket}=useSelector(state=>state.user)
// useEffect(()=>{
 
// async function updateMyLocation(lat, lng) {
//   // API call
//   axios.post(serverUrl+"/api/user/update-location", {
//     latitude: lat,
//     longitude: lng
//   }, { withCredentials: true });

//   // Socket emit
//   socket?.emit("user:location:update", {
//     latitude: lat,
//     longitude: lng
//   });
// }

// // Har thodi der me location bhejna
// navigator.geolocation.watchPosition(
//   (pos) => {
//     updateMyLocation(pos.coords.latitude, pos.coords.longitude);
//   },
//   (err) => console.error(err),
//   { enableHighAccuracy: false }
// );
// },[userData])
// }

// export default updateLocation



import { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { serverUrl } from "../App";

const useUpdateLocation = () => {
  const { userData, socket } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userData) return;

    const updateMyLocation = async (lat, lng) => {
      try {
        await axios.post(
          `${serverUrl}/api/user/update-location`,
          { latitude:lat, longitude:lng }, // 🔹 Use the keys your backend expects
          { withCredentials: true }
        );

        socket?.emit("user:location:update", { lat, lng });
      } catch (err) {
        console.error("Update location error:", err.response?.data || err.message);
      }
    };

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        updateMyLocation(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [userData, socket]);
};

export default useUpdateLocation;