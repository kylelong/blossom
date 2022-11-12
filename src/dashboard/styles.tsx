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
    flex-direction: row;
    width: 100%;
    align-items: center;
  }
`;

export const DashboardHeaderText = styled.div`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 10px;
`;
