import styled from "styled-components";
/* styling for Dashboard.tsx */

export const DashboardContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  width: 100vw;
  padding: 10px;
`;

// logo and menu
export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  width: 90vw;
  padding-top: 12px;
  @media (max-width: 630px) {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
  }
`;

export const SubLogoContainer = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 22px;
  @media (min-width: 631px) {
    display: none;
  }
`;

export const LogoContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export const FlowerImage = styled.img`
  position: relative;
  bottom: 4px;
  width: 33px;
`;

export const DashboardHeaderText = styled.div`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 10px;
`;
