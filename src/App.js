import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import LoginPage from "./Pages/LoginPage/LoginPage";
import RegisterPage from "./Pages/RegisterPage/RegisterPage";
import { useSelector, useDispatch } from "react-redux";
import HomePage from "./Pages/HomePage/HomePage";
import ModalMessage from "./Component/ModelMessage/ModelMessage";
import CreatePost from "./Pages/CreatePost/CreatePost";
import Profile from "./Pages/Profile/Profile";
import EditProfile from "./Pages/EditProfile/EditProfile";
import PostDetail from "./Pages/PostDetail/PostDetail";
import CartDetail from "./Pages/CartDetail/CartDetail";
import ProfileFriend from "./Pages/Profile/ProfileFriend";
import io from "socket.io-client";
import { setSocket } from "./Redux/socket/socket.slice";
import { BASE_URL } from "./Ultils/constant";
import { hideModalMessage } from "./Redux/message/message.slice";
import { getMe } from "./Redux/auth/auth.slice";
import { useEffect } from "react";

import BuyOrder from "./Pages/Order/BuyOrder";
import OrderOfSeller from "./Pages/Order/OrderOfSeller";

const socket = io.connect(BASE_URL);
function App(props) {
  const dispatch = useDispatch();
  const infoUser = useSelector((state) => state?.auth?.user?.data?.data);
  const isAuthenticated = localStorage.getItem("token");
  useEffect(() => {
    dispatch(setSocket(socket));
  }, []);

  useEffect(() => {
    dispatch(hideModalMessage());
  }, []);

  useEffect(() => {
    dispatch(getMe());
  }, [props.location]);

  return (
    <>
      <BrowserRouter style={{ position: "absolute" }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {!isAuthenticated | true ? (
            <>
              <Route path="/" element={<HomePage />} />
              <Route path="/createPost" element={<CreatePost />} />
              <Route path="/profile/" element={<Profile />} />
              <Route path="/profile-friend/:id" element={<ProfileFriend />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/cart-detail" element={<CartDetail />} />
              <Route path="/order-by" element={<BuyOrder />} />
              <Route path="/order" element={<OrderOfSeller />} />
            </>
          ) : (
            <Route path="/login" element={<LoginPage />} />
          )}
        </Routes>
        <ModalMessage />
      </BrowserRouter>
    </>
  );
}

export default App;
