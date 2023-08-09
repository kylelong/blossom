import React from "react";
import styled from "styled-components";

export const NumberInput = styled.input`
  position: relative;
  top: 50px;
`;
const Number = () => {
  return (
    <div>
      <NumberInput type="number" />
    </div>
  );
};

export default Number;
