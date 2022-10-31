import styled from "styled-components";

/* 
green:  background-color: #355e3b;
red: color: #FA5F55;
*/
export const LandingPageContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  height: 100vh;
  position: relative;
  top: 15px;
`;

export const LogoContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export const FlowerImage = styled.img`
  position: relative;
  bottom: 4px;
`;

export const FlowerImageLeft = styled.img`
  position: absolute;
  top: 10px;
  left: 25px;
`;
export const FlowerImageRight = styled.img`
  position: absolute;
  top: 10px;
  right: 25px;
`;
export const FlowerImageBottomLeft = styled.img`
  position: absolute;
  bottom: 15px;
  left: 25px;
`;
export const FlowerImageBottomRight = styled.img`
  position: absolute;
  bottom: 15px;
  right: 25px;
`;

export const SloganContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Slogan = styled.div`
  font-weight: bold;
  color: #355e3b;
  font-size: 32px;
  width: 350px;
  margin-bottom: 15px;
`;

export const SloganDetail = styled.div`
  color: #fa5f55;
  font-weight: bold;
  font-family: Helvetica Neue, Arial, sans-serif;
  margin-right: 5px;
`;

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: end;
  width: 100%;
  justify-content: space-around;
  position: relative;
`;

export const Image = styled.img`
  height: 250px;
`;

export const BenefitsItem = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 28px;
`;

export const BenefitsContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 30px;
  justify-content: space-evenly;
`;

export const BenefitLabel = styled.div`
  color: #355e3b;
  font-weight; bold;
  font-size: 18px;
  font-family: Helvetica Neue, Arial, sans-serif;
`;

export const SectionHeader = styled.div`
  font-weight: bold;
  color: #355e3b;
  font-size: 25px;
`;

export const BenefitsListItem = styled.li`
  text-align: left;
  width: 250px;
  margin-bottom: 5px;
`;
