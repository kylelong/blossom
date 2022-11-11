import React from "react";
import Logo from "../Logo";
import Menu from "./Menu";
import { CheckCircledIcon, DotIcon } from "@radix-ui/react-icons";
import flower from "../images/scandi-373.svg";
import flower2 from "../images/scandi-331.svg"; // *
import flower3 from "../images/scandi-334.svg"; // *
import flower6 from "../images/scandi-360.svg"; // *
import flower7 from "../images/scandi-370.svg"; // *
import happy_customer from "../images/happy_customer.svg";
import team from "../images/team.svg";
import money from "../images/purse.svg";

import {
  LandingPageContainer,
  LogoContainer,
  FlowerImage,
  Slogan,
  SloganDetail,
  FlowerImageSection,
  HeaderContainer,
  SloganContainer,
  Image,
  BenefitsContainer,
  BenefitsItem,
  BenefitLabel,
  SectionHeader,
  SectionContainer,
  FAQSectionContainer,
  PricingSectionContainer,
  BenefitsListItem,
  FAQContainer,
  QuestionLabel,
  QuestionContainer,
  AnswerLabel,
  PricingLabel,
  PricingLabelContainer,
  AnswerLabelItem,
  Price,
  Month,
  PriceContainer,
  PricingHeader,
  Footer,
} from "./styles";

const LandingPage: React.FC = () => {
  const pricingBenefits = [
    "Unlimited Surveys",
    "Release surveys to users in minutes",
    "No coding required",
    "Advanced analytics",
    "AB test different user groups",
    "Fast support",
  ];

  return (
    <LandingPageContainer>
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
      <FlowerImageSection src={flower6} />
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
                Solid understanding of your company - user relationship
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
        <FlowerImageSection src={flower2} />
      </SectionContainer>

      <PricingSectionContainer id="pricing">
        <SectionHeader>Pricing</SectionHeader>
        <PriceContainer>
          <Price>
            $49<Month>/month</Month>
          </Price>
          <PricingHeader>
            All you need to create beautiful surveys
          </PricingHeader>
          <PricingLabelContainer>
            {pricingBenefits.map((benefit, index) => {
              return (
                <div key={index}>
                  <PricingLabel key={index}>
                    <CheckCircledIcon key={index} /> {benefit}
                  </PricingLabel>
                </div>
              );
            })}
          </PricingLabelContainer>
        </PriceContainer>
        <FlowerImageSection src={flower3} />
      </PricingSectionContainer>

      <FAQSectionContainer>
        <SectionHeader>FAQs</SectionHeader>
        <FAQContainer>
          <QuestionContainer>
            <QuestionLabel>
              Why not have my engineering team build surveys?
            </QuestionLabel>
            <AnswerLabel>
              <DotIcon />
              Release a survey in minutes as opposed to weeks or months of
              engineering time
            </AnswerLabel>
            <AnswerLabel>
              <DotIcon />
              Spend time building products / feature core to your business while
              we handle surveys
            </AnswerLabel>
          </QuestionContainer>
          <QuestionContainer>
            <QuestionLabel>Why Blossom?</QuestionLabel>

            <AnswerLabelItem>
              <DotIcon />
              Unlimited surveys for all of your needs
            </AnswerLabelItem>
            <AnswerLabelItem>
              <DotIcon />
              No coding required
            </AnswerLabelItem>
            <AnswerLabelItem>
              <DotIcon />
              Advanced analytics including a/b testing, completion rate, and
              much more
            </AnswerLabelItem>
          </QuestionContainer>
          <QuestionContainer>
            <QuestionLabel>How much does this cost?</QuestionLabel>
            <AnswerLabel>
              $49 / month. Start today with a 2 week free trial. Cancel anytime
            </AnswerLabel>
          </QuestionContainer>
        </FAQContainer>
      </FAQSectionContainer>

      <FlowerImageSection src={flower7} style={{ marginBottom: "20px" }} />
      <Footer>Copyright {new Date().getFullYear()} &copy; Blossom</Footer>
    </LandingPageContainer>
  );
};

export default LandingPage;
