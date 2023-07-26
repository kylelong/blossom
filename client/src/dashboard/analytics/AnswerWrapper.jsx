import React from "react";
import styled from "styled-components";
import QuestionTypes from "../../questionTypes";
export const Emoji = styled.div`
  position: relative;
  bottom: 6px;
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

export const AnswerContainer = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 0.375rem;
  border: 1px solid black;
  padding: 12px;
  margin-bottom: 12px;
  -webkit-box-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  align-items: center;
  text-align: left;
`;

export const AnswerContainerCenter = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 0.375rem;
  border: 1px solid black;
  padding: 12px;
  margin-bottom: 12px;
  -webkit-box-pack: justify;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  text-align: left;
`;
const AnswerWrapper = ({type, answers}) => {
  //use ENUMS
  switch (type) {
    case QuestionTypes.EMOJI_SENTIMENT:
      return (
        <AnswerContainerCenter>
          <Emoji>{String.fromCodePoint(answers[0])}</Emoji>
        </AnswerContainerCenter>
      );
    case QuestionTypes.MULTI_SELECT:
      return (
        <AnswerContainer>
          <ul>
            {answers.map((answer, index) => {
              return <li key={index}>{answer}</li>;
            })}
          </ul>
        </AnswerContainer>
      );
    default:
      return <AnswerContainer>{answers[0]}</AnswerContainer>;
  }
};

export default AnswerWrapper;
