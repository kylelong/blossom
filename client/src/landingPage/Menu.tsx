import React, {useState} from "react";
import styled from "styled-components";
import {Link} from "react-router-dom";
import {auth} from "../firebase-config";
import axios from "axios";
export const MenuContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 24px;
  width: 155px;
  position: fixed;
  right: 14px;
  justify-content: space-around;
  @media (max-width: 745px) {
    position: unset;
    right: unset;
  }
`;

export const MenuItem = styled.div`
  display: flex;
  font-weight: bold;
  color: #355e3b;
  font-size: 18px;
  &:hover {
    color: #fa5f55;
    cursor: pointer;
  }
`;

export const linkStyle = {
  textDecoration: "none",
};
const endpoint =
  process.env.REACT_APP_NODE_ENV === "production"
    ? process.env.REACT_APP_LIVE_SERVER_URL
    : process.env.REACT_APP_LOCALHOST_URL;

const Menu: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  auth.onAuthStateChanged((user) => {
    if (user) {
      setLoggedIn(true);
      setLoading(false);
    } else {
      setLoggedIn(false);
      setLoading(false);
    }
  });
  const logout = () => {
    axios.post(`${endpoint}/logout`).then((response) => {});
  };
  const menuToShow = () => {
    if (loading) {
      return <div></div>;
    } else {
      if (loggedIn) {
        return (
          <MenuContainer>
            <MenuItem
              onClick={() => {
                auth.signOut();
                logout();
              }}
            >
              sign out
            </MenuItem>
            <Link to="/account" style={linkStyle}>
              <MenuItem>account</MenuItem>
            </Link>
          </MenuContainer>
        );
      } else {
        return (
          <MenuContainer>
            <Link to="/login" style={linkStyle}>
              <MenuItem>login</MenuItem>
            </Link>
            <Link to="/signup" style={linkStyle}>
              <MenuItem>sign up</MenuItem>
            </Link>
          </MenuContainer>
        );
      }
    }
  };
  return <>{menuToShow()}</>;
};
export default Menu;
