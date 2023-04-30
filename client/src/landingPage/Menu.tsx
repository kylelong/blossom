import React, {useContext} from "react";
import styled from "styled-components";
import {Link} from "react-router-dom";
import axios from "axios";
import {AccountContext} from "../context/AccountContext";
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
  const {user, setUser} = useContext(AccountContext);

  const logout = async () => {
    await axios.post(`${endpoint}/logout`);

    setUser({loggedIn: false});
  };
  const menuToShow = () => {
    if (user.loggedIn) {
      return (
        <MenuContainer>
          <MenuItem
            onClick={() => {
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
  };
  return <>{menuToShow()}</>;
};
export default Menu;
