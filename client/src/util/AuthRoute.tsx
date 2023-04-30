import React, {useContext} from "react";
import {Outlet, Navigate} from "react-router-dom";
import {AccountContext} from "../context/AccountContext";

const useAuth = () => {
  const {user} = useContext(AccountContext);
  return user;
};

const AuthRoute: React.FC = () => {
  const user = useAuth();

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
