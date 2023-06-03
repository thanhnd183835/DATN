import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./Component/LoginPage/LoginPage";
import RegisterPage from "./Component/RegisterPage/RegisterPage";
import { useSelector } from "react-redux";
import HomePage from "./Component/HomePage/HomePage";
import ModalMessage from "./Component/ModelMessage/ModelMessage";
import CreatePost from "./Component/CreatePost/CreatePost";
import Profile from "./Component/Profile/Profile";
function App() {
  const infoUser = useSelector((state) => state?.auth?.user?.data?.data);
  const isAuthenticated = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {!isAuthenticated | true ? (
          <>
            <Route path="/homePage" element={<HomePage />} />
            <Route path="/createPost" element={<CreatePost />} />
            <Route path="/profile" element={<Profile />} />
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
