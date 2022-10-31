import React from "react";
import Logo from "../Logo";
import Menu from "./Menu";
import flower from "../scandi-373.svg";
// import flower2 from "../scandi-331.svg"; // *
// import flower3 from "../scandi-334.svg"; // *
// import flower6 from "../scandi-360.svg"; // *
// import flower7 from "../scandi-370.svg"; // *
// import increase_profits from "../increase_profits.svg";
import happy_customer from "../happy_customer.svg";
import team from "../team.svg";
import money from "../purse.svg";

import {
  LandingPageContainer,
  LogoContainer,
  FlowerImage,
  Slogan,
  SloganDetail,
  FlowerImageLeft,
  FlowerImageRight,
  FlowerImageBottomLeft,
  FlowerImageBottomRight,
  HeaderContainer,
  SloganContainer,
  Image,
  BenefitsContainer,
  BenefitsItem,
  BenefitLabel,
  SectionHeader,
  SectionContainer,
  BenefitsListItem,
} from "./styles";
const LandingPage: React.FC = () => {
  return (
    <LandingPageContainer>
      {/* <FlowerImageLeft src={flower2} /> */}
      {/* <FlowerImageRight src={flower6} /> */}
      {/* <FlowerImageBottomLeft src={flower7} />
      <FlowerImageBottomRight src={flower3} /> */}
      <HeaderContainer>
        <LogoContainer>
          <Logo />
          <FlowerImage src={flower} />
        </LogoContainer>
        <Menu />
      </HeaderContainer>
      <SloganContainer>
        <Slogan>Understand the people you want to reach</Slogan>
        <SloganDetail>
          Create beautiful surveys that help grow your business.
        </SloganDetail>
      </SloganContainer>

      <SectionContainer>
        <SectionHeader>Benefits</SectionHeader>
        <BenefitsContainer>
          <BenefitsItem>
            <Image src={team} />
            <BenefitLabel>Team efficiency</BenefitLabel>
            <ul>
              <BenefitsListItem>
                Save engineering time by not having teams build surveys
              </BenefitsListItem>
              <BenefitsListItem>
                Spend time building features based on survey data
              </BenefitsListItem>
              <BenefitsListItem>
                Solid understanding of the company - user relationship
              </BenefitsListItem>
            </ul>
          </BenefitsItem>
          <BenefitsItem>
            <Image src={happy_customer} />
            <BenefitLabel>Satisfy customers</BenefitLabel>
            <ul>
              <BenefitsListItem>
                Build relevant features based on user feedback
              </BenefitsListItem>
              <BenefitsListItem>
                Understand your target audience to make informed business
                decisions
              </BenefitsListItem>
            </ul>
          </BenefitsItem>
          <BenefitsItem>
            <Image src={money} />
            <BenefitLabel>Increase revenue</BenefitLabel>
            <ul>
              <BenefitsListItem>
                Learn how to convert users to premium customers
              </BenefitsListItem>
              <BenefitsListItem>
                Get insights on products and services that users actually want
              </BenefitsListItem>
            </ul>
          </BenefitsItem>
        </BenefitsContainer>
      </SectionContainer>
    </LandingPageContainer>
  );
};

export default LandingPage;
