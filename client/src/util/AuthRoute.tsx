import React, {useContext} from "react";
import {Outlet, Navigate} from "react-router-dom";
import {AccountContext} from "../context/AccountContext";
import Loader from "../loader";

const useAuth = () => {
  const {user} = useContext(AccountContext);
  return user;
};

const AuthRoute: React.FC = () => {
  const user = useAuth();

  if (user.loggedIn === null) {
    return <Loader />;
  }

  if (user && user.loggedIn) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default AuthRoute;
