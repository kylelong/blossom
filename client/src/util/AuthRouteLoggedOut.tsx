import React, {useContext} from "react";
import {Outlet, Navigate} from "react-router-dom";
import Loader from "../loader";
import {AccountContext} from "../context/AccountContext";

/**
 * logged out: redirect to "/"
 */
const useAuth = () => {
  const {user} = useContext(AccountContext);
  return user;
};
const AuthRouteLoggedOut: React.FC = () => {
  const user = useAuth();
  if (user.loggedIn === null) {
    return <Loader />;
  }
  if (user && user.loggedIn) {
    return <Outlet />;
  }
  return (
    <>
      <Navigate to="/" />
    </>
  );
};
export default AuthRouteLoggedOut;
