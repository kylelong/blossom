import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {auth} from "../firebase-config";
import styled from "styled-components";
import {Link} from "react-router-dom";
import {useDispatch} from "react-redux";
import {logout} from "../features/userSlice";
import {
  HamburgerMenuIcon,
  DashboardIcon,
  ImageIcon,
  CubeIcon,
  Pencil2Icon,
  ExitIcon,
  GearIcon,
} from "@radix-ui/react-icons";
import "./mobile.css";

export const MobileMenu = styled.div`
  @media (min-width: 769px) {
    display: none;
  }
`;

const linkStyle = {
  textDecoration: "none",
  color: "black",
};

const MobileNavigationMenu = () => {
  const dispatch = useDispatch();
  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    auth.signOut();
  };
  return (
    <MobileMenu>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="IconButton" aria-label="Customise options">
            <HamburgerMenuIcon />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
            <Link to="/dashboard" style={linkStyle}>
              <DropdownMenu.Item className="DropdownMenuItem">
                <div className="RightSlot">
                  <DashboardIcon />
                </div>
                dashboard
              </DropdownMenu.Item>
            </Link>

            <Link to="/create" style={linkStyle}>
              <DropdownMenu.Item className="DropdownMenuItem">
                <div className="RightSlot">
                  <ImageIcon />
                </div>
                create
              </DropdownMenu.Item>
            </Link>

            <Link to="/surveys" style={linkStyle}>
              <DropdownMenu.Item className="DropdownMenuItem">
                <div className="RightSlot">
                  <Pencil2Icon />
                </div>
                surveys
              </DropdownMenu.Item>
            </Link>
            <Link to="/analytics" style={linkStyle}>
              <DropdownMenu.Item className="DropdownMenuItem">
                <div className="RightSlot">
                  <CubeIcon />
                </div>{" "}
                analytics
              </DropdownMenu.Item>
            </Link>

            <DropdownMenu.Separator className="DropdownMenuSeparator" />
            <Link to="/account" style={linkStyle}>
              <DropdownMenu.Item className="DropdownMenuItem">
                <div className="RightSlot">
                  <GearIcon />
                </div>
                account
              </DropdownMenu.Item>
            </Link>
            <DropdownMenu.Item
              className="DropdownMenuItem"
              onClick={(e) => handleLogout(e)}
            >
              <div className="RightSlot">
                <ExitIcon />
              </div>
              sign out
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </MobileMenu>
  );
};

export default MobileNavigationMenu;
