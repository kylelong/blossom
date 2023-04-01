import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {login} from "../features/userSlice";
import Logo from "../Logo";
import flower from "../images/scandi-373.svg";
import * as yup from "yup";
import {Link} from "react-router-dom";
import {HiOutlineEye, HiOutlineEyeOff} from "react-icons/hi";
import {signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../firebase-config";
import axios, {AxiosResponse} from "axios";

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
  eyeStyle,
  ForgotPassword,
} from "./styles";

interface LoginInfo {
  email: string;
  password: string;
}
interface User {
  id: number;
  company: string;
  email: string;
}
const endpoint = process.env.REACT_APP_LOCALHOST_URL;

const Login: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginInfo>({
    email: "",
    password: "",
  });

  const [loginErrors, setLoginErrors] = useState<string[]>([]);
  const [eyeIcon, setEyeIcon] = useState<boolean>(true);
  const dispatch = useDispatch();
  const getUser = async (email: string | null) => {
    const response: AxiosResponse = await axios.get(
      `${endpoint}/user_info/${email}`
    );
    const data: User = response.data;
    return data;
  };
  const loginUser = () => {
    signInWithEmailAndPassword(auth, loginData.email, loginData.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        const {uid, email} = user;
        getUser(email).then((response) => {
          const {company, id} = response;
          dispatch(
            login({
              email: email,
              hash: uid,
              loggedIn: true,
              id: id,
              company: company,
            })
          );
        });

        // ...
      })
      .catch((error) => {
        /**
                auth/user-not-found Firebase: Error (auth/user-not-found). 
                auth/wrong-password Firebase: Error (auth/wrong-password).
            **/
        const ERRORS = [
          ["auth/wrong-password", "wrong password, please try again"],
          ["auth/user-not-found", "invalid credentials, please try again"],
          ["auth/invalid-email", "invalid email, please try again"],
          [
            "auth/user-disabled",
            "the account you are trying to update has been disabled",
          ],
          [
            "too-many-requests",
            "too many failed attempts, try again later or reset your password",
          ],
        ];
        const ERROR_CODES = ERRORS.map((item) => item[0]);
        const errorCode = error.code;
        if (ERROR_CODES.includes(errorCode)) {
          let error_array: string[][] = ERRORS.filter(
            (item) => item[0] === errorCode
          );
          let error_message: string = error_array[0][1];
          setLoginErrors((loginErrors) => [...loginErrors, error_message]);
        }
      });
  };

  let loginSchema = yup.object().shape({
    email: yup.string().email().required("email is required"),
    password: yup.string().min(8).required("password is required"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    loginSchema
      .isValid({
        email: loginData.email,
        password: loginData.password,
      })
      .then((response) => {
        if (!response) {
          loginSchema
            .validate(
              {
                email: loginData.email,
                password: loginData.password,
              },
              {abortEarly: false}
            )
            .catch((err) => {
              setLoginErrors(err.errors);
            });
        } else {
          setLoginErrors([]);
          loginUser();
        }
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setLoginData({...loginData, [name]: value});
  };

  return (
    <LoginContainer>
      <LogoContainer>
        <Logo />
        <FlowerImage src={flower} />
      </LogoContainer>

      <Slogan>welcome back &#x1F60A;</Slogan>
      <LoginForm onSubmit={(e) => handleSubmit(e)}>
        <InputBox
          type="text"
          placeholder="Email"
          name="email"
          onChange={handleChange}
        ></InputBox>
        <PasswordContainer>
          <InputBox
            type={eyeIcon ? "password" : "text"}
            placeholder="Password"
            name="password"
            onChange={handleChange}
          ></InputBox>
          {eyeIcon ? (
            <HiOutlineEye
              style={eyeStyle}
              onClick={() => setEyeIcon(!eyeIcon)}
            />
          ) : (
            <HiOutlineEyeOff
              style={eyeStyle}
              onClick={() => setEyeIcon(!eyeIcon)}
            />
          )}
        </PasswordContainer>
        <SubmitButton type="submit">Login</SubmitButton>
      </LoginForm>
      <SignUpLink>
        Need an account?{" "}
        <Link to="/signup" style={linkStyle}>
          {" "}
          <SignUp>Sign up</SignUp>
        </Link>
      </SignUpLink>
      <Link to="/reset" style={linkStyle}>
        {" "}
        <ForgotPassword>Forgot Password?</ForgotPassword>
      </Link>
      {
        <ErrorList>
          {" "}
          {loginErrors &&
            loginErrors.map((error, item) => {
              return <li key={item}>{error}</li>;
            })}
        </ErrorList>
      }
    </LoginContainer>
  );
};
export default Login;
