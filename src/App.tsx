import React from "react";
import "./App.css";
import LandingPage from "./landingPage/LandingPage";
import Login from "./login/Login";
import SignUp from "./signup/SignUp";
import ForgotPassword from "./forgotPassword/ForgotPassword";
import AccountManagement from "./accountManagment/AccountManagement";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/reset" element={<ForgotPassword />}></Route>
          <Route
            path="/account_management/*"
            element={<AccountManagement />}
          ></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
