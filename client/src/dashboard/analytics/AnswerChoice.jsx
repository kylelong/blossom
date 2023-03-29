import React from "react";
import styled from "styled-components";
export const Answer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 0.375rem;
  border: 1px solid black;
  padding: 12px;
  margin-bottom: 12px;
  text-align: left;
`;
export const StatContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 5px;
  color: rgb(60, 66, 87);
  background: rgb(247, 250, 252);
  border: 1px solid #efefef;
  padding: 2px;
  font-size: 16px;
  border-radius: 5px;
  width: fit-content;
  padding: 2px 5px;
`;
export const Stat = styled.div`
  margin-right: 3px;
  margin-left: 3px;
`;
export const Dot = styled.span`
  height: 5px;
  width: 5px;
  background-color: #525f7f;
  border-radius: 50%;
  display: inline-block;
  margin-right: 3px;
`;
const AnswerChoice = ({choice, answerChoiceAnalytics}) => {
  let index = answerChoiceAnalytics.findIndex((ac) => ac.choice === choice);
  const analytics = index > -1 ? answerChoiceAnalytics[index] : null;
  return (
    <Answer>
      <div>{choice}</div>
      {analytics && (
        <StatContainer>
          <Stat>{`${analytics.count}/${analytics.total}`}</Stat>
          <Dot />
          <Stat style={{marginLeft: "2px"}}>{`${analytics.avg * 100}%`}</Stat>
        </StatContainer>
      )}
    </Answer>
  );
};

export default AnswerChoice;
