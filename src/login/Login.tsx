import React, { useState } from 'react';
import Logo from '../Logo';
import flower from '../scandi-373.svg';
import * as yup from 'yup';
import { Link } from "react-router-dom";
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

import {
    LoginContainer,
    LogoContainer,
    FlowerImage,
    Slogan,
    LoginForm,
    InputBox,
    SubmitButton,
    SignUpLink,
    SignUp,
    ErrorList,
    linkStyle,
    PasswordContainer,
    eyeStyle
} from './styles'

interface LoginInfo {
    email: string,
    password: string;
}


const Login : React.FC = () => {

    const [loginData, setLoginData] = useState<LoginInfo>({ email:'', password:'' })
    const [loginErrors, setLoginErrors] = useState<string[]>();
    const [eyeIcon, setEyeIcon] = useState<boolean>(true);

    let loginSchema = yup.object().shape({
        email: yup.string().email().required("email is required"),
        password: yup.string().min(8).required("password is required")
    });
   
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginSchema.isValid({
            email: loginData.email,
            password: loginData.password
        })
        .then((response) => {
            if(!response){
                loginSchema.validate({
                    email: loginData.email,
                    password: loginData.password,
                }, {abortEarly: false})
                .catch((err) => {
                    setLoginErrors(err.errors);
                } )
            } else{
                setLoginErrors([]);
                console.log("valid");
            }
        })

    }
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData({...loginData, [name]: value})    
    }
    
 return (
     <LoginContainer>
         <LogoContainer>
            <Logo />
            <FlowerImage src={flower} />
         </LogoContainer>    

         <Slogan>welcome back &#x1F60A;</Slogan>
         <LoginForm>
             <InputBox type="text" placeholder="Email" name="email" onChange={handleChange}></InputBox>
             <PasswordContainer>
             <InputBox type={eyeIcon ? "password" : "text"} placeholder="Password" name="password" onChange={handleChange}></InputBox>
                {
                    eyeIcon ? 
                    <HiOutlineEye style={eyeStyle} onClick={() => setEyeIcon(!eyeIcon)} /> : 
                    <HiOutlineEyeOff style={eyeStyle} onClick={() => setEyeIcon(!eyeIcon)} />
                }
             </PasswordContainer>
             <SubmitButton onClick={onSubmit}>Login</SubmitButton>
         </LoginForm>
         <SignUpLink>
         Need an account? <Link to="/signup" style={linkStyle}> <SignUp>Sign up</SignUp></Link>
         </SignUpLink>
         {
             <ErrorList> {
             loginErrors?.map((error, item) => {

                 return (
                     <li key={item}>{error}</li>
                 )
             })
            }
             </ErrorList>
         }
     </LoginContainer>
 )
}
export default Login;