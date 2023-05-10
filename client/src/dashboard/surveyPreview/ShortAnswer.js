import React, {useState} from "react";
import styled from "styled-components";

export const Input = styled.input`
  margin-top: 32px;
  width: 275px;
  height: 38px;
  font-family: sans-serif;
  font-size: 16px;
  font-weight: 400;
  border: 1.5px solid #c4c4c4;
  border-radius: 3px;
  padding-left: 5px;
`;
const ShortAnswer = () => {
  // eslint-disable-next-line
  const [response, setResponse] = useState("");
  const handleChange = (input) => {
    setResponse(input);
  };
  return (
    <>
      <Input
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Enter your answer..."
      />
    </>
  );
};
export default ShortAnswer;
