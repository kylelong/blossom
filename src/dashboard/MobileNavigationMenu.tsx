import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { auth } from "../firebase-config";
import styled from "styled-components";
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
  @media (min-width: 631px) {
    display: none;
  }
`;

const MobileNavigationMenu: React.FC = () => {
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
            <DropdownMenu.Item className="DropdownMenuItem">
              <div className="RightSlot">
                <DashboardIcon />
              </div>
              dashboard
            </DropdownMenu.Item>
            <DropdownMenu.Item className="DropdownMenuItem">
              <div className="RightSlot">
                <ImageIcon />
              </div>
              create
            </DropdownMenu.Item>
            <DropdownMenu.Item className="DropdownMenuItem">
              <div className="RightSlot">
                <Pencil2Icon />
              </div>
              surveys
            </DropdownMenu.Item>
            <DropdownMenu.Item className="DropdownMenuItem">
              <div className="RightSlot">
                <CubeIcon />
              </div>{" "}
              analytics
            </DropdownMenu.Item>

            <DropdownMenu.Separator className="DropdownMenuSeparator" />
            <DropdownMenu.Item className="DropdownMenuItem">
              <div className="RightSlot">
                <GearIcon />
              </div>
              account
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="DropdownMenuItem"
              onClick={() => {
                auth.signOut();
              }}
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
