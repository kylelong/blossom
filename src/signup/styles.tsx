import styled from "styled-components";

export const LogoContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

export const FlowerImage = styled.img`
    position: relative;
    bottom: 4px;
`;
export const SignUpContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100vh;
    position: relative;
    bottom: 50px;
`;
export const Slogan = styled.div`
    font-weight: bold;
    color: #c4c4c4;
    margin-bottom: 24px;
    margin-right: 12px;
`;
export const SignUpForm = styled.form`
    display: flex;
    flex-direction: column;
`;

export const PasswordContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

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
export const SubmitButton = styled.button`
    height: 38px;
    border: 0;
    width: 257px;
    border-radius: 3px;
    background: transparent;
    color: white;
    background-color:#355E3B;
    font-family: sans-serif;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 15px;

    &:hover{
        cursor: pointer;
    }
`;

export const linkStyle = {
    textDecoration: 'none',
    color:'black'
};

export const eyeStyle = {
    position: 'relative' as 'relative',
    right: 29,
    bottom: 5
}

export const ErrorList = styled.ul`
    text-align: left;
    margin-left: 21px;
    font-weight: bold;
`;
export const LoginLink = styled.a`
    text-decoration: none;
    color: black;
    display: flex;
    
`;

export const Login = styled.div`
    color: #FA5F55;
    font-weight: bold;
    margin-left: 5px;
`;
