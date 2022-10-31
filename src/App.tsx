import React from "react";
import "./App.css";
import LandingPage from "./landingPage/LandingPage";
import Login from "./login/Login";
import SignUp from "./signup/SignUp";
import ForgotPassword from "./forgotPassword/ForgotPassword";
import AccountManagement from "./accountManagment/AccountManagement";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import flower from './scandi-330.svg';
// import flower2 from './scandi-331.svg'; // *
// import flower3 from './scandi-334.svg'; // *
// import flower4 from './scandi-340.svg';
// import flower5 from './scandi-353.svg';
// import flower6 from './scandi-360.svg';  // *
// import flower7 from './scandi-370.svg'; // *
// import flower8 from './scandi-373.svg';
// import flower9 from './scandi-376.svg';
// import flower10 from './scandi-380.svg';
// import flower11 from './scandi-387.svg';
// import flower12 from './scandi-392.svg';
// import flower13 from './scandi-393.svg';

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
