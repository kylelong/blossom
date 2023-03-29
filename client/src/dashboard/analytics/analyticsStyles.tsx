import styled from "styled-components";

export const AnalyticsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  top: 50px;
  width: 100%;
`;
export const SurveyTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #525f7f;
  margin-bottom: 50px;
`;

export const SurveyRow = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 50px;
  justify-content: space-between;
  align-items: flex-start;
  height: 100vh;
  width: 70vw;
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
  @media (max-width: 1100px) {
    flex: 0.5;
    margin-bottom: 24px;
  }
`;

export const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  @media (max-width: 1100px) {
    flex: 0.5;
    margin-bottom: 24px;
  }
`;
export const AnswerChoiceContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  @media (max-width: 1100px) {
    flex: unset;
    margin-bottom: 24px;
  }
`;
export const ContainerHeader = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #525f7f;
  margin-bottom: 12px;
`;
export const Question = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 0.375rem;
  border: 1px solid black;
  padding: 12px;
  margin-bottom: 12px;
  text-align: left;
  &:hover {
    background-color: #525f7f;
    color: white;
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
  margin-left: 24px;
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
