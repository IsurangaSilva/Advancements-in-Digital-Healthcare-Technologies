import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import LoggedInHeader from "./components/LoggedInHeader";
import Register from "./pages/Register";

const App = () => {
  //--------------------Delete this part after creating the login functionality (Begin)--------------------
  useEffect(() => {
    localStorage.setItem("isLogged", "false"); // Change to "true" for a logged-in user
  }, []);
  //--------------------Delete this part after creating the login functionality (End)----------------

  const isLogged = localStorage.getItem("isLogged") === "true";

  return (
    <>
      {/* Dynamic Header */}
      {isLogged ? <LoggedInHeader /> : <Header />}

      <Routes>
        {/* Home Route (Changes based on login state) */}
        <Route path="/" element={isLogged ? <Dashboard /> : <Home />} />

        {/* Public Routes */}
        {!isLogged && (
          <>
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </>
        )}

        {/* Protected Routes (Only accessible when logged in) */}
        {isLogged ? (
          <>
            <Route path="/profile" element={<Profile />} />
          </>
        ) : (
          <>
            {/* Redirect users trying to access protected routes */}
            <Route path="/dashboard" element={<Navigate to="/login" replace />} />
            <Route path="/profile" element={<Navigate to="/login" replace />} />
          </>
        )}

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
