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
export const RemoveIcon = styled.div`
  margin-left: 7px;
  width: 17px;
  height: 17px;
  margin-bottom: 12px;
  &:hover {
    cursor: pointer;
  }
`;
const MultipleChoiceInput = ({updateQuestion, questionId, questions}) => {
  const [question, setQuestion] = useState([]);
  const [answers, setAnswers] = useState([]);
  const removeItem = (id) => {
    updateQuestion(questionId, "removeAnswerChoice", null, id);
  };
  useEffect(() => {
    setQuestion(questions.filter((q) => q.id === questionId)[0]);
    setAnswers(question.answerChoices);
  }, [questions, questionId, question.answerChoices]);
  return (
    <>
      {question && answers
        ? answers.map((answer, index) => {
            let {choice, id} = answer;
            return (
              <MultipleChoiceInputContainer key={id}>
                <Input
                  placeholder={`Choice #${index + 1}`}
                  value={choice}
                  onChange={(e) => {
                    setAnswers(() => {
                      let copy = [...answers];
                      let index = answers.findIndex(
                        (answer) => answer.id === id
                      );
                      copy[index].choice = e.target.value;
                      return copy;
                    });
                    updateQuestion(
                      questionId,
                      "addAnswerChoice",
                      e.target.value,
                      id
                    );
                  }}
                />
                <RemoveIcon>
                  <MinusCircledIcon
                    onClick={() => {
                      removeItem(id);
                    }}
                  />
                </RemoveIcon>
              </MultipleChoiceInputContainer>
            );
          })
        : null}
    </>
  );
};

export default MultipleChoiceInput;
