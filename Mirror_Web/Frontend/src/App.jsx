import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Blog from "./pages/blog";
import Plans from "./pages/plans";
import TextPrediction from "./pages/TextPrediction";
import FERPredictions from "./pages/FERPredictions";
import Header from "./components/Header";
import LoggedInHeader from "./components/LoggedInHeader";
import Footer from "./components/footer";
import DepressionPredictions from "./pages/DepressionPredictions";


const App = () => {
  const [isLogged, setIsLogged] = useState(
    localStorage.getItem("LoggedIn") === "true"
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLogged(localStorage.getItem("LoggedIn") === "true");
    };

    window.addEventListener("storage", handleStorageChange);

   return () => {
     window.removeEventListener("storage", handleStorageChange);
   };
 }, []);  

 const isTextPredictionPage = location.pathname === "/predictions/text";

  return (
    <div style={{ background: "linear-gradient(to right, rgba(243, 232, 222, 0.5), rgba(231, 245, 247, 0.5))"}}>
    <>
      {isLogged ? <LoggedInHeader /> : <Header />}

      <Routes>
        <Route path="/" element={isLogged ? <Dashboard /> : <Home />} />

        {/* Public Routes */}
        {!isLogged && (
          <>
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/blog" element={<Blog />} />

          </>
        )}

        {/* Protected Routes (Only accessible when logged in) */}
        {isLogged ? (
          <>
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/predictions/text" element={<TextPrediction />} />
            <Route path="/predictions/fer" element={<FERPredictions />} />
            <Route path="/predictions/dep" element={<DepressionPredictions />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/plans" element={<Plans />} />
          </>
        ) : (
          <>
            {/* Redirect users trying to access protected routes */}
            <Route path="/dashboard" element={<Navigate to="/login" replace />} />
            <Route path="/profile" element={<Navigate to="/profile" replace />} />
          </>
        )}

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {/* <Footer /> */}
       {!isTextPredictionPage && <Footer />}
    </>
    </div>
  );
};

export default App;
