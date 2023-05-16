import React, {useState, useEffect} from "react";
import styled from "styled-components";
import {Link} from "react-router-dom";
import {InfoCircledIcon} from "@radix-ui/react-icons";
import axios from "axios";
import {
  DashboardIcon,
  ImageIcon,
  CubeIcon,
  Pencil2Icon,
  GearIcon,
} from "@radix-ui/react-icons";
import Logo from "../Logo";
import flower from "../images/scandi-373.svg";

export const LogoContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export const FlowerImage = styled.img`
  position: relative;
  bottom: 4px;
`;

const NavigationContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  @media (max-width: 768px) {
    width: unset;
  }
`;

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: -12px;
  border-right: 1.8px solid #f3f3f3;
  height: 100vh;
  width: 250px;
  @media (max-width: 768px) {
    display: none;
  }
`;

const MenuIcon = styled.span`
  margin-right: 3px;
  position: relative;
  top: 2px;
`;

const MenuItem = styled.div`
  disiplay: flex;
  flex-direction: row;
  font-size: 20px;
  margin-bottom: 12px;
  padding: 10px;
  border: 1px transparent solid;
  text-align: left;
  font-weight: bold;
  color: #525f7f;
  height: 50%;
  &:hover {
    background-color: #fa5f55;
    border: 1px white solid;
    border-radius: 5px;
    cursor: pointer;
    color: white;
    padding: 10px;
    font-weight: bold;
  }
`;
const SelectedMenuItem = styled.div`
  disiplay: flex;
  flex-direction: row;
  font-size: 20px;
  margin-bottom: 12px;
  padding: 10px;
  height: 50%;
  border-radius: 5px;
  border: 1px transparent solid;
  text-align: left;
  font-weight: bold;
  color: white;
  background-color: #fa5f55;
`;

const TrialContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-top: 12px;
  margin-right: 10px;
  background-color: #eff5fb;
  color: rgb(250, 95, 85);
  padding: 1.25rem 0.5rem 1.25rem 1.5rem;
  border-radius: 4px;
`;
const TrialMessage = styled.div`
  font-size: 16px;
  font-weight: bold;
  line-height: 22px;
`;

const linkStyle = {
  textDecoration: "none",
  color: "rgb(250, 95, 85)",
};
const endpoint =
  process.env.REACT_APP_NODE_ENV === "production"
    ? process.env.REACT_APP_LIVE_SERVER_URL
    : process.env.REACT_APP_LOCALHOST_URL;

const NavigationMenu: React.FC = () => {
  const [item, setItem] = useState<string | null>(
    window.location.pathname.replace("/", "")
  );
  const [trialData, setTrialData] = useState({
    msg: "",
    access: false,
    premium: true,
  });

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setItem((e.target as HTMLElement).textContent);
  };

  useEffect(() => {
    const getTrialMessage = async () => {
      const response = await axios.get(`${endpoint}/trial_info`);
      setTrialData(response.data);
    };
    getTrialMessage();
  }, []);

  return (
    <NavigationContainer>
      <MenuContainer>
        <Link to="/dashboard" style={linkStyle}>
          <LogoContainer>
            <Logo />
            <FlowerImage src={flower} />
          </LogoContainer>
        </Link>
        <Link to="/dashboard" style={linkStyle}>
          {item === "dashboard" ? (
            <SelectedMenuItem onClick={handleClick}>
              <MenuIcon>
                <DashboardIcon />
              </MenuIcon>
              dashboard
            </SelectedMenuItem>
          ) : (
            <MenuItem onClick={handleClick}>
              <MenuIcon>
                <DashboardIcon />
              </MenuIcon>
              dashboard
            </MenuItem>
          )}
        </Link>
        <Link to="/create" style={linkStyle}>
          {item === "create" ? (
            <SelectedMenuItem onClick={handleClick}>
              <MenuIcon>
                <ImageIcon />
              </MenuIcon>
              create
            </SelectedMenuItem>
          ) : (
            <MenuItem onClick={handleClick}>
              <MenuIcon>
                <ImageIcon />
              </MenuIcon>
              create
            </MenuItem>
          )}
        </Link>
        <Link to="/surveys" style={linkStyle}>
          {item === "surveys" ? (
            <SelectedMenuItem onClick={handleClick}>
              <MenuIcon>
                <Pencil2Icon />
              </MenuIcon>
              surveys
            </SelectedMenuItem>
          ) : (
            <MenuItem onClick={handleClick}>
              <MenuIcon>
                <Pencil2Icon />
              </MenuIcon>
              surveys
            </MenuItem>
          )}
        </Link>
        <Link to="/analytics" style={linkStyle}>
          {item === "analytics" ? (
            <SelectedMenuItem onClick={handleClick}>
              <MenuIcon>
                <CubeIcon />
              </MenuIcon>
              analytics
            </SelectedMenuItem>
          ) : (
            <MenuItem onClick={handleClick}>
              <MenuIcon>
                <CubeIcon />
              </MenuIcon>
              analytics
            </MenuItem>
          )}
        </Link>
        <Link to="/account" style={linkStyle}>
          {item === "account" ? (
            <SelectedMenuItem onClick={handleClick}>
              <MenuIcon>
                <GearIcon />
              </MenuIcon>
              settings
            </SelectedMenuItem>
          ) : (
            <MenuItem onClick={handleClick}>
              <MenuIcon>
                <GearIcon />
              </MenuIcon>
              settings
            </MenuItem>
          )}
        </Link>

        {trialData.access && !trialData.premium && (
          <TrialContainer>
            <Link to="/account" style={linkStyle}>
              <TrialMessage>
                <InfoCircledIcon
                  style={{position: "relative", top: "2px", right: "3px"}}
                />
                {trialData.msg}
              </TrialMessage>
            </Link>
          </TrialContainer>
        )}
      </MenuContainer>
    </NavigationContainer>
  );
};

export default NavigationMenu;
