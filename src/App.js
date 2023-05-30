import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Component/LoginPage/LoginPage";
import RegisterPage from "./Component/RegisterPage/RegisterPage";
import { useSelector } from "react-redux";
import HomePage from "./Component/HomePage/HomePage";
import ModalMessage from "./Component/ModelMessage/ModelMessage";

function App() {
  const infoUser = useSelector((state) => state?.auth?.user?.data?.data);
  const isAuthenticated = localStorage.getItem("token") && infoUser.role !== 2;
  console.log(infoUser.role);
  console.log(isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {!isAuthenticated | true ? (
          <Route path="/homePage" element={<HomePage />} />
        ) : (
          <Route path="/login" element={<LoginPage />} />
        )}
      </Routes>
      <ModalMessage />
    </BrowserRouter>
  );
}

export default App;
