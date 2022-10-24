import React, { useState } from 'react';
import Logo from '../Logo';
import flower from '../scandi-373.svg';
import * as yup from 'yup';
import { Link } from "react-router-dom";
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

import {
    SignUpContainer,
    LogoContainer,
    FlowerImage,
    Slogan,
    SignUpForm,
    InputBox,
    SubmitButton,
    LoginLink,
    Login,
    ErrorList,
    linkStyle,
    PasswordContainer,
    eyeStyle
} from './styles'

interface SignUpInfo {
    email: string,
    password: string;
}


const SignUp : React.FC = () => {

    const [signUpData, setSignUpData] = useState<SignUpInfo>({ email:'', password:'' })
    const [signUpErrors, setSignUpErrors] = useState<string[]>();
    const [eyeIcon, setEyeIcon] = useState<boolean>(true);

    let signUpSchema = yup.object().shape({
        email: yup.string().email().required("email is required"),
        password: yup.string().min(8).required("password is required")
    });
   
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        signUpSchema.isValid({
            email: signUpData.email,
            password: signUpData.password
        })
        .then((response) => {
            if(!response){
                signUpSchema.validate({
                    email: signUpData.email,
                    password: signUpData.password,
                }, {abortEarly: false})
                .catch((err) => {
                    setSignUpErrors(err.errors);
                } )
            } else{
                setSignUpErrors([]);
                console.log("valid");
            }
        })

    }
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSignUpData({...signUpData, [name]: value})    
    }
    
 return (
     <SignUpContainer>
         <LogoContainer>
            <Logo />
            <FlowerImage src={flower} />
         </LogoContainer>    

         <Slogan>understand the audience you want to reach</Slogan>
         <SignUpForm>
             <InputBox type="text" placeholder="Email" name="email" onChange={handleChange}></InputBox>
             <PasswordContainer>
                <InputBox type={eyeIcon ? "password" : "text"} placeholder="Password" name="password" onChange={handleChange}></InputBox>
                {
                    eyeIcon ? 
                    <HiOutlineEye style={eyeStyle} onClick={() => setEyeIcon(!eyeIcon)} /> : 
                    <HiOutlineEyeOff style={eyeStyle} onClick={() => setEyeIcon(!eyeIcon)} />
                }
             </PasswordContainer>
             <SubmitButton onClick={onSubmit}>Next</SubmitButton>
         </SignUpForm>
         <LoginLink>
         Already have an account? <Link to="/login" style={linkStyle}> <Login>Login</Login ></Link>
         </LoginLink>
         {
             <ErrorList> {
             signUpErrors?.map((error, item) => {

                 return (
                     <li key={item}>{error}</li>
                 )
             })
            }
             </ErrorList>
         }
     </SignUpContainer>
 )
}
export default SignUp;