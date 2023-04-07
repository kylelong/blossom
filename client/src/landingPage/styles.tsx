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

  @media (max-width: 900px) {
    justify-content: center;
    align-items: center;
    height: unset;
  }
`;

export const LogoContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export const FlowerImage = styled.img`
  position: relative;
  bottom: 4px;
`;

export const FlowerImageSection = styled.img`
  height: 50px;
`;

export const SloganContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
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
  margin-bottom: 24px;
  font-size: 20px;
`;

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: end;
  width: 100%;
  justify-content: space-around;
  position: relative;

  @media (max-width: 745px) {
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

export const Image = styled.img`
  height: 250px;
`;

export const BenefitsItem = styled.div`
  display: flex;
  flex-direction: column;
  //   margin-right: 100px;
`;

export const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 28px;
  text-align: center;
`;

export const BenefitsContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 30px;
  justify-content: space-evenly;
  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

export const BenefitLabel = styled.div`
  color: #355e3b;
  font-weight: bold;
  font-size: 20px;
  font-family: Helvetica Neue, Arial, sans-serif;
  font-weight: bold;
  margin-top: 18px;
`;

export const SectionHeader = styled.div`
  font-weight: bold;
  color: #355e3b;
  font-size: 25px;
  text-align: center;
`;

export const BenefitsListItem = styled.li`
  text-align: left;
  width: 275px;
  margin-bottom: 5px;
  color: #525f7f;
  font-size: 18px;
  line-height: 145%;
`;

/* FAQContainer */

export const FAQSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 28px;
  align-items: center;
  justify-content: center;
`;

export const FAQContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  margin-bottom: 28px;
  align-items: flex-start;
  @media (max-width: 900px) {
    margin-left: 15px;
    padding: 10px;
  }
  box-shadow: 5px 5px 10px #c4c4c4;
  border-radius: 5px;

  padding: 25px 50px;
  background-color: #faf9f6;
`;

export const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
  align-items: flex-start;
`;
export const QuestionLabel = styled.div`
  color: #355e3b;
  font-weight: bold;
  font-size: 20px;
  font-family: Helvetica Neue, Arial, sans-serif;
  margin-bottom: 7px;
  text-align: left;
`;

export const AnswerLabel = styled.div`
  color: #525f7f;
  line-height: 25px;
  font-size: 17.5px;
`;

export const AnswerLabelItem = styled.div`
  color: #525f7f;
  line-height: 25px;
  margin-bottom: 5px;
  font-size: 17.5px;
`;

/* Price */

export const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 28px;
  align-items: center;
  box-shadow: 5px 5px 10px #c4c4c4;
  border-radius: 5px;
  max-width: 350px;
  padding: 25px 50px;
  margin-bottom: 24px;
  background-color: #faf9f6;
`;

export const PricingLabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin-top: 16px;
  margin-left: 38px;
`;

export const PricingLabel = styled.div`
  color: #525f7f;
  line-height: 25px;
  margin-bottom: 7px;
  font-size: 17px;
  font-weight: bold;
`;

export const PricingHeader = styled.div`
  color: #355e3b;
  font-weight: bold;
  font-size: 18px;
  font-family: Helvetica Neue, Arial, sans-serif;
  margin-bottom: 10px;
`;

export const Price = styled.div`
  font-size: 36px;
  font-weight: 900;
  color: #fa5f55;
  font-family: Helvetica Neue, Arial, sans-serif;
  letter-spacing: 2px;
  margin-bottom: 10px;
`;

export const Month = styled.span`
  font-size: 15px;
  font-weight: 900;
  letter-spacing: 0px;
`;

export const PricingSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 28px;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  @media (max-width: 500px) {
    padding: 10px;
  }
`;

export const Trial = styled.div`
  color: #fa5f55;
  font-size: 13px;
  font-weight: bold;
  position: relative;
  bottom: 7px;
  right: 9px;
`;
export const Footer = styled.div`
  text-align: center;
  padding-bottom: 10px;
`;
