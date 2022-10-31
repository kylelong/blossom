import React, { useState } from 'react';
import { auth } from '../firebase-config';
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import * as yup from 'yup';

import Logo from '../Logo';
import flower from '../scandi-373.svg';

import {
    FlowerImage,
    ForgotPasswordContainer,
    LogoContainer,
    Slogan,
    ResetPasswordForm,
    SubmitButton,
    Login,
    LoginLink,
    InputBox,
    linkStyle,
    ErrorList,
    EmailSent
} from './styles';

interface ResetPasswordInfo {
    email: string
}

// form to request to signal forgot password
const ForgotPassword : React.FC = () => {


    const [resetPasswordData, setResetPasswordData] = useState<ResetPasswordInfo>({ email:'' })
    const [resetPasswordErrors, setResetPasswordErrors] = useState<string[]>([]);
    const [emailSent, setEmailSent] = useState<boolean>(false);

    /** 
     * call this onSubmit with no email errors
     * email errors: invalid fromat via yup or email does not exists in the backend
     * check firebase
     **/

    const sendResetPasswordEmail = (email: string) => {
        sendPasswordResetEmail(
            auth, email)
            .then(function() {
              // Password reset email sent.
              setEmailSent(true);
            })
            .catch(function(error) {
              // Error occurred. Inspect error.code.
              const ERRORS = [
                ["auth/user-not-found", "there is not an account with this email"],
                ["auth/invalid-email", "invalid email, please try again"],
                ["too-many-requests", "too many failed attempts, try again later"]
            ];
            const ERROR_CODES = ERRORS.map(item => item[0]);
             const errorCode = error.code;
             if(ERROR_CODES.includes(errorCode)){
                 let error_array:string[][] = ERRORS.filter(item => item[0] === errorCode);
                 let error_message:string = error_array[0][1];
                 setResetPasswordErrors(resetPasswordErrors => [...resetPasswordErrors, error_message]);
             }
             setEmailSent(false);
            });
    }

    let resetPasswordSchema = yup.object().shape({
        email: yup.string().email().required("email is required")
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        resetPasswordSchema.isValid({
            email: resetPasswordData.email,
        })
        .then((response) => {
            if(!response){
                resetPasswordSchema.validate({
                    email: resetPasswordData.email,
                }, {abortEarly: false})
                .catch((err) => {
                    setResetPasswordErrors(err.errors);
                } )
            } else{
                setResetPasswordErrors([]);
                sendResetPasswordEmail(resetPasswordData.email);
                /**
                 * if email exists in firebase send email
                 * if not append to error
                 */
                
            }
        })

    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setResetPasswordData({...resetPasswordData, [name]: value}) ;
        console.log(resetPasswordData.email);
    }
return (
    <ForgotPasswordContainer>
        <LogoContainer>
        <Logo />
        <FlowerImage src={flower} />
        </LogoContainer>    

        <Slogan>reset your password</Slogan>
        <ResetPasswordForm>
            <InputBox type="text" placeholder="Email" name="email" onChange={handleChange}></InputBox>
        
            <SubmitButton onClick={onSubmit}>Reset Password</SubmitButton>
        </ResetPasswordForm>
        <LoginLink>
            <Link to="/login" style={linkStyle}> <Login>Login</Login></Link>
        </LoginLink>
        {
            emailSent && 
            <EmailSent>
                password reset info has been sent to your email
            </EmailSent>
        }
        {
             <ErrorList> {
                resetPasswordErrors && resetPasswordErrors.map((error, item) => {

                 return (
                     <li key={item}>{error}</li>
                 )
             })
            }
             </ErrorList>
         }
     
    </ForgotPasswordContainer>
   ) 
}

export default ForgotPassword;