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
const MultipleChoiceInput = ({
  amount,
  updateQuestion,
  questionHash,
  questions,
}) => {
  const [items, setItems] = useState([]);
  // const [amount, setAmount] = useState(amount);
  // console.log(JSON.stringify(questions, null, 2));
  let qindex = questions.findIndex((element) => element.hash === questionHash);
  const randomHash = () => {
    return Math.random().toString(36).substr(2, 10);
  };
  const removeItem = (hash) => {
    updateQuestion(questionHash, "numberOfAnswerChoices", items.length - 1);
    setItems((prevState) => {
      const items = [...prevState];
      let index = items.findIndex((element) => element === hash);
      updateQuestion(questionHash, "removeAnswerChoice", null, index);
      items.splice(index, 1);
      return items;
    });
  };
  useEffect(() => {
    let inputs = [];
    for (let i = 0; i < amount; i++) {
      inputs.push(randomHash());
    }
    setItems(inputs);
  }, [amount]);
  return (
    <>
      {items.map((hash, index) => {
        return (
          <MultipleChoiceInputContainer key={index}>
            <Input
              placeholder={`Choice #${index + 1}`}
              value={
                questions.length > 0 && questions[qindex].answerChoices[index]
              }
              onChange={(e) => {
                updateQuestion(
                  questionHash,
                  "addAnswerChoice",
                  e.target.value,
                  index
                );
              }}
            />
            <MinusCircledIcon
              onClick={() => {
                removeItem(hash);
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
