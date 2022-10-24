import * as React from 'react';
import styled from "styled-components";

export const Blossom = styled.div`
    font-size: 36px;
    font-weight: 900;
    color: #FA5F55;
    font-family: Helvetica Neue,Arial,sans-serif;
`;

const Logo: React.FunctionComponent = () => {
  return (
      <div>
          <Blossom>blossom</Blossom>
      </div>
  )
};

export default Logo;
