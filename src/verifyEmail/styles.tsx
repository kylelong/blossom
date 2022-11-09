import styled from "styled-components";

export const VerifyEmailContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  position: relative;
  top: 10px;
`;

export const LogoContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export const FlowerImage = styled.img`
  position: relative;
  bottom: 4px;
`;

export const VerifiedMessaged = styled.div`
  color: #355e3b;
  font-family: sans-serif;
  font-size: 14px;
  font-weight: bold;
`;

export const linkStyle = {
  textDecoration: "none",
  color: "black",
};

export const LoginButton = styled.button`
  height: 38px;
  width: 257px;
  border: 0;
  border-radius: 3px;
  background: transparent;
  color: white;
  background-color: #355e3b;
  font-family: sans-serif;
  font-size: 14px;
  font-weight: bold;
  margin-top: 28px;

  &:hover {
    cursor: pointer;
  }
`;
