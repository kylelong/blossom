import React from "react";
import styled from "styled-components";

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
const AnswerWrapper = ({type, answers}) => {
  //use ENUMS
  if (type === "emoji_sentiment") {
    return <Emoji>{String.fromCodePoint(answers[0])}</Emoji>;
  }
  if (type === "multi_select") {
    return (
      <ul>
        {answers.map((answer, index) => {
          return <li key={index}>{answer}</li>;
        })}
      </ul>
    );
  }
  if (type === "single_select") {
    return <div>{answers[0]}</div>;
  }
  if (type === "open_ended" || type === "short_answer") {
    return <div>{answers[0]}</div>;
  }
};

export default AnswerWrapper;
