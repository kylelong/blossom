import React, {useState, useContext} from "react";
import axios from "axios";
import Logo from "../Logo";
import flower from "../images/scandi-373.svg";
import * as yup from "yup";
import {Link} from "react-router-dom";
import {HiOutlineEye, HiOutlineEyeOff} from "react-icons/hi";
import {AccountContext} from "../context/AccountContext";
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
  eyeStyle,
} from "./styles";

const endpoint =
  process.env.REACT_APP_NODE_ENV === "production"
    ? process.env.REACT_APP_LIVE_SERVER_URL
    : process.env.REACT_APP_LOCALHOST_URL;

interface SignUpInfo {
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  // const ERRORS = [
  //   ["auth/email-already-in-use", "email is alreay in use"],
  //   ["auth/invalid-email", "invalid email, please try again"],
  //   [
  //     "auth/operation-not-allowed",
  //     "operation not allowed, double check and try again",
  //   ],
  //   ["auth/weak-password", "password is too weak, please add more complexity"],
  // ];

  const [signUpData, setSignUpData] = useState<SignUpInfo>({
    email: "",
    password: "",
  });
  const [signUpErrors, setSignUpErrors] = useState<string[]>([]);
  const [eyeIcon, setEyeIcon] = useState<boolean>(true);
  const {setUser} = useContext(AccountContext);

  const options = {
    withCredentials: true,
    crossDomain: true,
    headers: {
      "Access-Control-Allow-Credentials": true,
      "Content-Type": "application/json",
    },
  };

  let signUpSchema = yup.object().shape({
    email: yup.string().email().required("email is required"),
    password: yup.string().min(8).required("password is required"),
  });

  function generateRandomString(length: number) {
    const characters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const registerPostgres = async (hash: string) => {
    try {
      const response = await axios.post(
        `${endpoint}/create_user`,
        {
          email: signUpData.email,
          password: signUpData.password,
          hash: hash,
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

  const validateEmail = async () => {
    try {
      const response = await axios.get(
        `${endpoint}/email_exists/${signUpData.email}`,
        options
      );
      return parseInt(response.data.count) === 1;
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  };

  const registerUser = async () => {
    const randomString = generateRandomString(28);
    let valid = true;
    const emailExists = await validateEmail();
    if (emailExists) {
      setSignUpErrors((signUpErrors) => [
        ...signUpErrors,
        "email already in use, please log in",
      ]);
      valid = false;
    }
    if (valid) {
      await registerPostgres(randomString);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    signUpSchema
      .isValid({
        email: signUpData.email,
        password: signUpData.password,
      })
      .then((response) => {
        if (!response) {
          signUpSchema
            .validate(
              {
                email: signUpData.email,
                password: signUpData.password,
              },
              {abortEarly: false}
            )
            .catch((err) => {
              setSignUpErrors(err.errors);
            });
        } else {
          setSignUpErrors([]);
          registerUser();
        }
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setSignUpData({...signUpData, [name]: value});
  };

  return (
    <SignUpContainer>
      <LogoContainer>
        <Logo />
        <FlowerImage src={flower} />
      </LogoContainer>

      <Slogan>understand the audience you want to reach</Slogan>
      <SignUpForm>
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
        <SubmitButton onClick={onSubmit}>Next</SubmitButton>
      </SignUpForm>
      <LoginLink>
        Already have an account?{" "}
        <Link to="/login" style={linkStyle}>
          {" "}
          <Login>Login</Login>
        </Link>
      </LoginLink>
      {
        <ErrorList>
          {" "}
          {signUpErrors &&
            signUpErrors.map((error, item) => {
              return <li key={item}>{error}</li>;
            })}
        </ErrorList>
      }
    </SignUpContainer>
  );
};
export default SignUp;
