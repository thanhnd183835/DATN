import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import LoginPage from "./Pages/LoginPage/LoginPage";
import RegisterPage from "./Pages/RegisterPage/RegisterPage";
import { useSelector } from "react-redux";
import HomePage from "./Pages/HomePage/HomePage";
import ModalMessage from "./Component/ModelMessage/ModelMessage";
import CreatePost from "./Pages/CreatePost/CreatePost";
import Profile from "./Pages/Profile/Profile";
import EditProfile from "./Pages/EditProfile/EditProfile";
import PostDetail from "./Pages/PostDetail/PostDetail";
import NavBar from "./Component/NavBar/Navbar";
function App() {
  const infoUser = useSelector((state) => state?.auth?.user?.data?.data);
  const isAuthenticated = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
      <Routes>
        {!isAuthenticated | true ? (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/createPost" element={<CreatePost />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/post/:id" element={<PostDetail />} />
          </>
        ) : (
          <Route path="/login" element={<LoginPage />} />
        )}
      </Routes>
      <ModalMessage />
    </BrowserRouter>
  );
}

export default App;
