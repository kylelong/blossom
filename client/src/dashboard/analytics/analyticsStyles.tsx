import styled from "styled-components";

export const AnalyticsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  top: 50px;
`;
export const SurveyTitle = styled.div`
  font-size: 25px;
  font-weight: bold;
  color: #525f7f;
  margin-bottom: 50px;
`;

export const SurveyRow = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 50px;
  @media (max-width: 1100px) {
    flex-direction: column;
    align-items: center;
    justify-content: unset;
  }
`;
export const SurveyContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  @media (max-width: 1100px) {
    flex: unset;
    margin-bottom: 24px;
  }
  @media (min-width: 769px) {
    flex-direction: row;
  }
`;
export const ResponsesHeader = styled.div`
  margin-left: 24px;
  font-size: 18px;
  color: rgb(184, 184, 184);
  font-weight: bold;
  margin-top: 24px;
  @media (min-width: 769px) {
    margin-top: unset;
  }
`;

export const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  @media (max-width: 1100px) {
    flex: unset;
    margin-bottom: 24px;
    width: 287px;
  }
`;
export const QuestionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 550px;
  // border: 1.8px solid #525f7f;
  padding: 5px;
  border-radius: 4px;
  margin-bottom: 24px;
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
  height: 50px;
  font-size: 17px;
  width: auto;
  background-color: #355e3b;
  color: white;
  box-shadow: 0 2px 10px var(--blackA7);
  &:hover {
    cursor: pointer;
    background-color: rgb(0, 100, 0);
  }
`;

export const AnswerWrapper = styled.div`
  @media (max-width: 1100px) {
    margin: unset;
    width: 287px;
  }
`;
export const AnswerChoiceContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  @media (max-width: 1100px) {
    flex: unset;
    margin-bottom: 24px;
    max-width: 320px;
  }
`;
export const ContainerHeader = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #525f7f;
  margin-bottom: 12px;
`;
export const Question = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 0.375rem;
  border: 1px solid black;
  background-color: hsl(300, 7.7%, 97.5%);
  padding: 12px;
  margin-bottom: 12px;
  text-align: left;
  &:hover {
    cursor: pointer;
  }
`;
export const QuestionType = styled.div`
  color: rgb(60, 66, 87);
  background: rgb(247, 250, 252);
  border: 1px solid #efefef;
  padding: 2px;
  font-size: 13px;
  border-radius: 5px;
  width: fit-content;
  padding: 2px 5px;
  margin-top: 12px;
`;
export const SelectedQuestion = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  background-color: #525f7f;
  color: white;
  border-radius: 0.375rem;
  border: 1px solid black;
  padding: 12px;
  margin-bottom: 12px;
`;

// old
export const AnalyticsSection = styled.div``;
export const AnalyticsHeader = styled.div`
  font-size: 20px;
  margin-bottom: 12px;
  padding: 10px;
  border: 1px transparent solid;
  text-align: left;
  font-weight: bold;
  color: #525f7f;
`;
export const AnalyticsSurveyName = styled.div`
  text-align: left;
  margin-bottom: 7px;
  font-weight: bold;
  color: #525f7f;
  font-size: 16px;
  &:hover {
    cursor: pointer;
    color: #fa5f55;
  }
`;
export const AnalyticsSurveyNameSelected = styled.div`
  text-align: left;
  margin-bottom: 7px;
  font-weight: bold;
  color: #fa5f55;
  font-size: 16px;
  &:hover {
    cursor: pointer;
    color: #525f7f;
  }
`;
export const QuestionItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 12px;
`;
export const QuestionTitle = styled.div`
  margin-bottom: 5px;
  &:hover {
    cursor: pointer;
    color: #fa5f55;
  }
`;
export const QuestionTitleSelected = styled.div`
  margin-bottom: 8px;
  color: #fa5f55;
  &:hover {
    cursor: pointer;
    color: #525f7f;
  }
`;
export const AnswerChoice = styled.div`
  text-align: center;
  margin-bottom: 5px;
`;
export const EmojiContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  @media (min-width: 1101px) {
  }
`;
export const EmojiRow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
export const Emoji = styled.div`
  position: relative;
  bottom: 20px;
  border-radius: 0;
  border: none;
  border-image-width: 0;
  box-sizing: border-box;
  color: #000;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 1%;
  font-size: 30px;
  margin: 1%;
  height: 50px;
`;

export const NoResponses = styled.div`
  margin-top: 32px;
  font-size: 18px;
`;
export const OpenEndedContainer = styled.div`
  border: 1px solid #d3d3d3;
  padding: 10px;
  border-radius: 4px;
`;
