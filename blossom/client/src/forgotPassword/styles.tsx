import styled from "styled-components";

export const ForgotPasswordContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  position: relative;
  bottom: 50px;
`;

export const LogoContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export const Slogan = styled.div`
  font-weight: bold;
  color: #c4c4c4;
  margin-bottom: 24px;
  margin-right: 50px;
`;

export const ResetPasswordForm = styled.form`
  display: flex;
  flex-direction: column;
`;

export const FlowerImage = styled.img`
  position: relative;
  bottom: 4px;
`;

export const SubmitButton = styled.button`
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
  margin-bottom: 15px;
  text-align: center;

  &:hover {
    cursor: pointer;
  }
`;

export const SignUpLink = styled.a`
  text-decoration: none;
  color: black;
  display: flex;
`;

export const LoginLink = styled.a`
  text-decoration: none;
  color: black;
  display: flex;
`;

export const Login = styled.div`
  color: #fa5f55;
  font-weight: bold;
  margin-left: 5px;
  margin-bottom: 8px;
`;

export const linkStyle = {
  textDecoration: "none",
  color: "black",
};
export const InputBox = styled.input`
  margin-bottom: 10px;
  width: 250px;
  height: 38px;
  font-family: sans-serif;
  font-size: 14px;
  font-weight: 400;
  border: 1px solid #c4c4c4;
  border-radius: 3px;
  padding-left: 5px;
`;

export const ErrorList = styled.ul`
  text-align: left;
  font-weight: bold;
`;

export const EmailSent = styled.div`
  color: #355e3b;
  font-family: sans-serif;
  font-size: 14px;
  font-weight: bold;
`;
