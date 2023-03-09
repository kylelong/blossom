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
const MultipleChoiceInput = ({updateQuestion, questionId, questions}) => {
  const [question, setQuestion] = useState([]);
  const removeItem = (id) => {
    updateQuestion(questionId, "removeAnswerChoice", null, id);
  };
  useEffect(() => {
    setQuestion(questions.filter((q) => q.id === questionId)[0]);
  }, [questions, questionId]);
  return (
    <>
      {question.answerChoices
        ? question.answerChoices.map((answer, index) => {
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
          })
        : null}
    </>
  );
};

export default MultipleChoiceInput;
