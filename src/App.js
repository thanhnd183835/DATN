import React from "react";
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Router,
  Navigate,
} from "react-router-dom";
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
import Dashboard from "./Pages/Admin/Dashboard";
import RegisterSell from "./Pages/RegisterSell/RegisterSell";
import OrderDetail from "./Pages/OrderDetail/OrderDetail";

function App(props) {
  const socket = io.connect(BASE_URL);

  const dispatch = useDispatch();
  const infoUser = useSelector((state) => state?.auth?.user?.data?.data);

  const isAuthenticated =
    useSelector((state) => state?.auth?.user?.data?.token) ||
    localStorage.getItem("token");

  useEffect(() => {
    dispatch(hideModalMessage());
  }, []);
  useEffect(() => {
    dispatch(setSocket(socket));
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(getMe());
    }
  }, [props.location]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {isAuthenticated ? (
            <>
              <Route
                path="/"
                element={infoUser?.role === 3 ? <Dashboard /> : <HomePage />}
              />
              <Route path="/createPost" element={<CreatePost />} />
              <Route path="/profile/" element={<Profile />} />
              <Route path="/profile-friend/:id" element={<ProfileFriend />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/cart-detail" element={<CartDetail />} />
              <Route path="/order-by" element={<BuyOrder />} />
              <Route path="/order" element={<OrderOfSeller />} />
              <Route path="/register-sell" element={<RegisterSell />} />
              <Route path="/order-detail/:id" element={<OrderDetail />} />
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
