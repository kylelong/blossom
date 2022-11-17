import styled from "styled-components";
/* styling for Dashboard.tsx */

export const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

export const DashboardSectionContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  text-align: center;
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    align-items: center;
  }
`;

export const MenuContainer = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

/**
 * make header display none when px < 630
 */

// logo and menu

// dashboard content
export const DashboardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding-top: 12px;
  @media (max-width: 768px) {
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
  @media (min-width: 769px) {
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

/* end of header menu */

export const DashboardHeaderText = styled.div`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 10px;
`;
export const DashboardHeaderTextDesktop = styled.div`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 10px;
  @media (max-width: 768px) {
    display: none;
  }
`;
