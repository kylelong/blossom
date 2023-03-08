import React, {useEffect, useState} from "react";
import {MinusCircledIcon} from "@radix-ui/react-icons";
import styled from "styled-components";

export const Input = styled.input`
  all: unset;
  width: 250px;
  display: inline-flex;
  text-align: left;
  border-radius: 4px;
  padding: 0 10px;
  height: 35px;
  font-size: 15px;
  line-height: 1;
  margin-bottom: 12px;
  color: black;
  background-color: white;
  box-shadow: 0 0 0 1px var(--blackA9);
`;
export const MultipleChoiceInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const MultipleChoiceInput = ({updateQuestion, questionId, question}) => {
  const [hasAnswerChoices, setHasAnswerChoices] = useState(
    question.answerChoices.length > 0
  );
  const removeItem = (id) => {
    updateQuestion(
      questionId,
      "numberOfAnswerChoices",
      question.answerChoices.length - 1
    );
    updateQuestion(questionId, "removeAnswerChoice", null, id);
  };
  useEffect(() => {
    console.log(question);
    setHasAnswerChoices(question.answerChoices.length > 0);
  }, [question, hasAnswerChoices]);
  return (
    <>
      {hasAnswerChoices &&
        question.answerChoices.map((answer, index) => {
          let {choice, id} = answer;

          return (
            <MultipleChoiceInputContainer key={id}>
              <Input
                placeholder={`Choice #${index + 1}`}
                value={choice}
                onChange={(e) => {
                  updateQuestion(
                    questionId,
                    "addAnswerChoice",
                    e.target.value,
                    id
                  );
                }}
              />
              <MinusCircledIcon
                onClick={() => {
                  removeItem(id);
                }}
                style={{
                  marginLeft: "7px",
                  width: "17px",
                  height: "17px",
                  marginBottom: "12px",
                }}
              />
            </MultipleChoiceInputContainer>
          );
        })}
    </>
  );
};

export default MultipleChoiceInput;
