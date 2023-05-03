import React from "react";
import "./App.css";
import LandingPage from "./landingPage/LandingPage";
import Login from "./login/Login";
import SignUp from "./signup/SignUp";
// import ForgotPassword from "./forgotPassword/ForgotPassword";
import AccountManagement from "./accountManagment/AccountManagement";
import Dashboard from "./dashboard/Dashboard";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import AuthRoute from "./util/AuthRoute";
import AuthRouteLoggedOut from "./util/AuthRouteLoggedOut";
import Create from "./dashboard/Create";
import Surveys from "./dashboard/surveys/Surveys";
import Analytics from "./dashboard/analytics/Analytics";
import Account from "./dashboard/Account";
import Survey from "./survey/Survey";
import Payment from "./stripe/Payment";
import UserContext from "./context/AccountContext";

function App() {
  return (
    <div className="App">
      <UserContext>
        <Router>
          <Routes>
            <Route element={<AuthRoute />}>
              <Route path="/" element={<LandingPage />}></Route>
              <Route path="/signup" element={<SignUp />}></Route>
              <Route path="/login" element={<Login />}></Route>
            </Route>

            <Route element={<AuthRouteLoggedOut />}>
              <Route path="/dashboard" element={<Dashboard />}></Route>
              <Route path="/create" element={<Create />}></Route>
              <Route path="/surveys" element={<Surveys />}></Route>
              <Route path="/analytics" element={<Analytics />}></Route>
              <Route path="/account" element={<Account />}></Route>
            </Route>

            {/* <Route path="/reset" element={<ForgotPassword />}></Route> */}
            <Route path="/survey/:id" element={<Survey />}></Route>
            <Route path="/payment" element={<Payment />}></Route>
            <Route
              path="/account_management/*"
              element={<AccountManagement />}
            ></Route>
          </Routes>
        </Router>
      </UserContext>
    </div>
  );
}

export default App;
