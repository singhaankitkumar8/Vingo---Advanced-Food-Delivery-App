import { useEffect, useRef } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import getCurrentUser from "./hooks/getCurrentUser";
import { useSelector } from "react-redux";
import Home from "./pages/Home";
import getCity from "./hooks/getCity";
import EditShop from "./pages/EditShop";
// import { setSocket } from './redux/userSlice' // socket removed from Redux
import getCurrentShop from "./hooks/getCurrentShop";

import AddItem from "./pages/AddItem";
// import EditItem from "./pages/EditItem";

import EditItem from "./pages/EditItem";

import getShopsByCity from "./hooks/getShopsByCity";
// import getItemsByCity from './hooks/getItemsByCity'
import getItemsByCity from "./hooks/getItemsByCity";

import CartPage from "./pages/CartPage";
// import CheckoutPage from './pages/CheckOutPage'

import CheckoutPage from "./pages/CheckoutPage";
import OrderPlaced from "./pages/OrderPlaced";
import MyOrders from "./pages/MyOrders";
import getOwnerPendingOrders from "./hooks/getOwnerPendingOrders";
import PendingOrders from "./pages/PendingOrders";
import { io } from "socket.io-client";
import updateLocation from "./hooks/updateLocation";
import TrackOrderPage from "./pages/TrackOrderPage";
import MyDeliveredOrders from "./pages/MyDeliveredOrders";
import ShopItems from "./pages/ShopItems";
import Reels from "./pages/Reels.jsx";
import Profile from "./pages/Profile.jsx";
import SavedReels from "./pages/SavedReels.jsx"

// import {ToastContainer} from 'react-toastify'

export const serverUrl = import.meta.env.VITE_BACKEND_URL;

function App() {
  const { userData } = useSelector((state) => state.user);
  getCurrentUser();
  getCity();
  getCurrentShop();
  getShopsByCity();
  getItemsByCity();
  getOwnerPendingOrders();
  updateLocation();

  // dispatch removed (no longer needed)
  // Socket instance managed outside Redux
  const socketRef = useRef(null);
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(serverUrl, { withCredentials: true });
    }
    const socketInstance = socketRef.current;
    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
      if (userData?._id) {
        socketInstance.emit("identify", { userId: userData._id });
      }
    });
    return () => {
      socketInstance.disconnect();
      socketRef.current = null;
    };
  }, [userData?._id]);

  return (

    <Routes>
      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to={"/"} />}
      />
      <Route
        path="/signin"
        element={!userData ? <SignIn /> : <Navigate to={"/"} />}
      />
      <Route
        path="/forgot-password"
        element={!userData ? <ForgotPassword /> : <Navigate to={"/"} />}
      />
      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/editshop"
        element={userData ? <EditShop /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/additem"
        element={userData ? <AddItem /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/edititem/:itemId"
        element={userData ? <EditItem /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/cart"
        element={userData ? <CartPage /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/checkout"
        element={userData ? <CheckoutPage /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/order-placed"
        element={userData ? <OrderPlaced /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/my-orders"
        element={userData ? <MyOrders /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/pending-orders"
        element={userData ? <PendingOrders /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/my-delivered-orders"
        element={userData ? <MyDeliveredOrders /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/track-order/:orderId"
        element={userData ? <TrackOrderPage /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/shop-items/:shopId"
        element={userData ? <ShopItems /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/reels"
        element={userData ? <Reels /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/owner-profile/:id"
        element={userData ? <Profile /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/saved-food"
        element={userData ? <SavedReels/> : <Navigate to={"/signin"} />}
      />
    </Routes>
   
  );
}

export default App;
