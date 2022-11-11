import styled from "styled-components";

export const DashboardContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  position: relative;
  top: 10px;
  width: 100vw;
`;

// logo and menu
export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: row;
  width: 100vw;
`;

export const LogoContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export const FlowerImage = styled.img`
  position: relative;
  bottom: 4px;
`;
