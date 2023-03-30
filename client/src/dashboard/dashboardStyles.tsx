import styled from "styled-components";
/* styling for Dashboard.tsx */

export const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
`;
/** justify-content: spave-between;   */
export const DashboardSectionContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: column;
  text-align: center;
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    align-items: center;
    padding: 10px;
  }
`;
export const DashboardSectionContainerCenter = styled.div`
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
  color: #525f7f;
`;
export const DashboardHeaderTextDesktop = styled.div`
  font-size: 30px;
  color: #525f7f;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
  display: flex;
  align-items: center;
  @media (max-width: 768px) {
    display: none;
  }
`;
export const DashboardHeaderDetail = styled.div`
  font-weight: bold;
  font-size: 16px;
  @media (max-width: 768px) {
    margin-top: 12px;
  }
`;

/** overview */
export const DashboardOverviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  height: 30vh;
  margin-left: 50px;
  margin-top: 48px;
`;
export const DashboardStatContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 32px;

  justify-content: space-between;
`;
export const DashboardOverviewHeader = styled.div`
  color: #525f7f;
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 12px;
  margin-right: 23px;
`;
export const DashboardStatHeader = styled.div`
  color: #b8b8b8;
  font-weight: bold;
  margin-right: 12px;
`;

export const DashboardStat = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-right: 32px;
`;

export const DashboardNumber = styled.div`
  font-size: 30px;
  color: #525f7f;
  font-weight: bold;
`;

export const SurveyButton = styled.button`
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-weight: 500;
  font-size: 15px;
  padding: 0 18px;
  line-height: 38px;
  height: 38px;
  width: auto;
  background-color: white;
  color: #355e3b;
  box-shadow: 0 2px 10px var(--blackA7);
`;

export const QuestionTypeBreakdown = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 32px;
`;

export const QuestionTypeItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
export const QuestionTypeLabel = styled.div`
  color: #b8b8b8;
  font-weight: bold;
  margin-right: 7px;
`;

export const QuestionTypeNumber = styled.div`
  color: #525f7f;
  font-weight: bold;
  text-align: right;
`;
