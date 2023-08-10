import React from "react";
import styled from "styled-components";

export const NumberInput = styled.input`
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
const Number = () => {
  return (
    <div>
      <NumberInput type="number" />
    </div>
  );
};

export default Number;
