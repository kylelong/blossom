import * as React from "react";
import styled from "styled-components";

export const Blossom = styled.div`
  font-size: 36px;
  font-weight: 900;
  color: #fa5f55;
  font-family: Helvetica Neue, Arial, sans-serif;
`;
interface Props {
  mobile?: boolean;
}
const Logo: React.FunctionComponent<Props> = ({ mobile }) => {
  return (
    <div>
      <Blossom style={{ fontSize: mobile ? "22px" : "36px" }}>blossom</Blossom>
    </div>
  );
};

export default Logo;
