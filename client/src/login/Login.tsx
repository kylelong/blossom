import React, {useState, useContext} from "react";
import Logo from "../Logo";
import flower from "../images/scandi-373.svg";
import * as yup from "yup";
import {Link} from "react-router-dom";
import {HiOutlineEye, HiOutlineEyeOff} from "react-icons/hi";
import axios from "axios";
import {AccountContext} from "../context/AccountContext";

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
} from "./styles";
// ForgotPassword

interface LoginInfo {
  email: string;
  password: string;
}
const endpoint =
  process.env.REACT_APP_NODE_ENV === "production"
    ? process.env.REACT_APP_LIVE_SERVER_URL
    : process.env.REACT_APP_LOCALHOST_URL;
const Login: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginInfo>({
    email: "",
    password: "",
  });
  const {setUser} = useContext(AccountContext);

  const [loginErrors, setLoginErrors] = useState<string[]>([]);
  const [eyeIcon, setEyeIcon] = useState<boolean>(true);
  const options = {
    withCredentials: true,
    crossDomain: true,
  };

  const login = async () => {
    try {
      const response = await axios.post(
        `${endpoint}/login/`,
        {
          email: loginData.email,
          password: loginData.password,
        },
        options
      );
      setUser({...response.data});
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  };

  const validEmail = async () => {
    try {
      const response = await axios.get(
        `${endpoint}/email_exists/${loginData.email}/`,
        options
      );
      return parseInt(response.data.count) === 1;
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  };

  const validPassword = async () => {
    try {
      const response = await axios.post(
        `${endpoint}/validPassword/`,
        {
          email: loginData.email,
          password: loginData.password,
        },
        options
      );
      return response.data.verified;
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  };

  const loginUser = async () => {
    // user-not-found if email does not exists
    const isValidEmail = await validEmail();
    let valid = true;
    if (!isValidEmail) {
      setLoginErrors((loginErrors) => [
        ...loginErrors,
        "invalid email, please try again",
      ]);
      valid = false;
    }
    const isValidPassword = await validPassword();
    if (!isValidPassword) {
      setLoginErrors((loginErrors) => [
        ...loginErrors,
        "wrong password, please try again",
      ]);
      valid = false;
    }
    if (valid) {
      setLoginErrors([]);
    }

    //  auth/wrong-password

    // const ERRORS = [
    //   ["auth/wrong-password", "wrong password, please try again"],
    //   ["auth/user-not-found", "invalid credentials, please try again"],
    //   ["auth/invalid-email", "invalid email, please try again"],
    //   [
    //     "auth/user-disabled",
    //     "the account you are trying to update has been disabled",
    //   ],
    //   [
    //     "too-many-requests",
    //     "too many failed attempts, try again later or reset your password",
    //   ],
    // ];
    // const ERROR_CODES = ERRORS.map((item) => item[0]);
    // const errorCode = error.code;
    // if (ERROR_CODES.includes(errorCode)) {
    //   let error_array: string[][] = ERRORS.filter(
    //     (item) => item[0] === errorCode
    //   );
    //   let error_message: string = error_array[0][1];
    //   setLoginErrors((loginErrors) => [...loginErrors, error_message]);
    // }
    // no errors then login
    if (valid) {
      await login();
    }
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
      {/* <Link to="/reset" style={linkStyle}>
        {" "}
        <ForgotPassword>Forgot Password?</ForgotPassword>
      </Link> */}
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
