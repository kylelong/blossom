import React, {useState, createContext, useEffect} from "react";
import axios from "axios";

export const AccountContext = createContext();
const endpoint =
  process.env.REACT_APP_NODE_ENV === "production"
    ? process.env.REACT_APP_LIVE_SERVER_URL
    : process.env.REACT_APP_LOCALHOST_URL;
const options = {
  withCredentials: true,
  crossDomain: true,
};

const UserContext = ({children}) => {
  const [user, setUser] = useState({
    loggedIn: null,
    confirmed: null,
    premium: null,
    access: null,
  });
  useEffect(() => {
    const loadUser = async () => {
      const response = await axios.get(`${endpoint}/isAuthenticated`, options);
      setUser({...response.data});
    };
    loadUser();
  }, []);
  return (
    <AccountContext.Provider value={{user, setUser}}>
      {children}
    </AccountContext.Provider>
  );
};

export default UserContext;
