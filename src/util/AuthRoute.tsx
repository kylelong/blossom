import React from "react";
import { auth } from "../firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { Outlet, Navigate } from "react-router-dom";
import Loader from "../loader";

/**
 * if you hit these pages you should be redirected to the dashboard
 * if the user is logged in
 */
const AuthRoute: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  if (loading) {
    return <Loader />;
  }
  if (user) {
    return <Navigate to="/dashboard" />;
  }
  return (
    <>
      <Outlet />
    </>
  );
};
export default AuthRoute;
