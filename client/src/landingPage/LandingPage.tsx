import React from "react";
import Logo from "../Logo";
import Menu from "./Menu";
import {CheckCircledIcon, DotIcon} from "@radix-ui/react-icons";
import flower from "../images/scandi-373.svg";
import flower2 from "../images/scandi-331.svg"; // *
import flower3 from "../images/scandi-334.svg"; // *
import flower6 from "../images/scandi-360.svg"; // *
import flower7 from "../images/scandi-370.svg"; // *
import happy_customer from "../images/happy_customer.svg";
import team from "../images/team.svg";
import money from "../images/purse.svg";
import {Link} from "react-router-dom";
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
  Trial,
  StartTrialContainer,
  TrialButton,
  linkStyle,
  NoCard,
  Video,
  VideoContainer,
  VideoDescription,
} from "./styles";

const LandingPage: React.FC = () => {
  // "AB test different user groups"
  const pricingBenefits = [
    "Unlimited Surveys",
    "Unlimited Responses",
    "Release surveys to users in seconds",
    "No coding required",
    "Advanced analytics",
    "Fast support",
  ].sort((a, b) => a.length - b.length);
  const price = 25;

  return (
    <LandingPageContainer>
      <HeaderContainer>
        <LogoContainer>
          <div style={{display: "flex", flexDirection: "row"}}>
            <Logo />
            <FlowerImage src={flower} />
          </div>
          <Menu />
        </LogoContainer>
      </HeaderContainer>
      <SloganContainer>
        <Slogan>Understand the people you want to reach</Slogan>
        <SloganDetail>
          Create beautiful surveys that help you understand your audience.
        </SloganDetail>
      </SloganContainer>

      <StartTrialContainer>
        <Link to="/signup" style={linkStyle}>
          <TrialButton>Create a Survey</TrialButton>
        </Link>
      </StartTrialContainer>

      <SectionContainer>
        <FlowerImageSection src={flower6} style={{marginBottom: "12px"}} />
        <SectionHeader>Benefits</SectionHeader>
        <BenefitsContainer>
          <BenefitsItem>
            <Image src={team} style={{position: "relative", top: "25px"}} />
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
                Understand your target audience to make better informed business
                decisions
              </BenefitsListItem>
            </ul>
          </BenefitsItem>
          <BenefitsItem>
            <Image src={money} style={{position: "relative", top: "25px"}} />
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

      <VideoContainer>
        <SectionHeader>Easily create surveys</SectionHeader>
        <VideoDescription>
          Use Blossom's easy-to-use interface to create a beautiful survey in no
          time
        </VideoDescription>

        <Video autoPlay muted playsInline loop controls>
          <source src="https://blossomsurveys.s3.amazonaws.com/blossom_create.MP4"></source>
        </Video>
      </VideoContainer>

      <PricingSectionContainer id="pricing">
        <FlowerImageSection src={flower2} style={{marginBottom: "5px"}} />
        <SectionHeader>Pricing</SectionHeader>
        <PriceContainer>
          <Price>
            ${price}
            <Month>/month</Month>
          </Price>
          <Trial>start with a 2 week trial. no credit card required.</Trial>
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
      </PricingSectionContainer>

      <StartTrialContainer>
        <Link to="/signup" style={linkStyle}>
          <TrialButton>Start Free Trial</TrialButton>
          <NoCard>No Credit Card Required</NoCard>
        </Link>
      </StartTrialContainer>

      <FAQSectionContainer>
        <FlowerImageSection src={flower3} style={{marginBottom: "8px"}} />
        <SectionHeader>FAQs</SectionHeader>
        <FAQContainer>
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
            <QuestionLabel>
              Why not have my engineering team build surveys?
            </QuestionLabel>
            <AnswerLabel>
              <DotIcon />
              Release a survey in seconds compared to after weeks or months of
              engineering time
            </AnswerLabel>
            <AnswerLabel>
              <DotIcon />
              Spend time building core products & feature for your business
              while we handle surveys
            </AnswerLabel>
          </QuestionContainer>

          <QuestionContainer>
            <QuestionLabel>How much does this cost?</QuestionLabel>
            <AnswerLabel>
              ${price} / month. Start today with a 2 week free trial. No credit
              card required to signup.
            </AnswerLabel>
          </QuestionContainer>

          <QuestionContainer>
            <QuestionLabel>Who do I contact if I need help?</QuestionLabel>
            <AnswerLabel>Email: contact@blossomsurveys.io</AnswerLabel>
          </QuestionContainer>
        </FAQContainer>
      </FAQSectionContainer>

      <FlowerImageSection src={flower7} style={{marginBottom: "20px"}} />
      <Footer>
        Copyright {new Date().getFullYear()} &copy; Blossom |
        contact@blossomsurveys.io
      </Footer>
    </LandingPageContainer>
  );
};

export default LandingPage;
