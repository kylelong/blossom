import React from "react";
import styled from "styled-components";

const AnswerChoice = ({choice, answerChoiceAnalytics}) => {
  return (
    <Answer>
      <div>{choice}</div>
    </Answer>
  );
};

export default AnswerChoice;
