import styled from "styled-components";

export const AnalyticsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 50vw;
`;
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
`;
export const EmojiRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;
export const Emoji = styled.div`
  margin-right: 5px;
`;
