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
const MultipleChoiceInput = ({amount}) => {
  const [items, setItems] = useState([]);
  const removeItem = (index) => {
    setItems((prevState) => {
      const items = [...prevState];
      items.splice(index, 1);
      return items;
    });
  };
  useEffect(() => {
    let inputs = [];
    for (let i = 0; i < amount; i++) {
      inputs.push(
        <Input
          placeholder={`Choice #${i + 1}`}
          onChange={() => {
            console.log(`typing in ${i}`);
          }}
        />
      );
    }
    setItems(inputs);
  }, [amount]);
  return (
    <>
      {items.map((item, index) => {
        return (
          <MultipleChoiceInputContainer key={index}>
            {item}
            <MinusCircledIcon
              onClick={() => {
                removeItem(index);
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
