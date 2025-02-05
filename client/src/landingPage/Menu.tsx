import React, {useContext} from "react";
import styled from "styled-components";
import {Link} from "react-router-dom";
import {ArrowRightIcon} from "@radix-ui/react-icons";
import axios from "axios";
import {AccountContext} from "../context/AccountContext";
export const MenuContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: 24px;
  width: 100%;
  position: fixed;
  right: 18px;
  justify-content: flex-end;
  @media (max-width: 745px) {
    position: unset;
    right: unset;
    justify-content: center;
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
  display: "flex",
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
            style={{marginRight: "24px"}}
          >
            sign out
          </MenuItem>
        </MenuContainer>
      );
    } else {
      return (
        <MenuContainer>
          <Link to="/login" style={linkStyle}>
            <MenuItem style={{marginRight: "24px", fontSize: "22px"}}>
              login
            </MenuItem>
            <ArrowRightIcon
              style={{
                width: "20px",
                height: "20px",
                position: "relative",
                right: "17px",
                top: "5px",
                color: "#355e3b",
              }}
            />
          </Link>
        </MenuContainer>
      );
    }
  };
  return <>{menuToShow()}</>;
};
export default Menu;
