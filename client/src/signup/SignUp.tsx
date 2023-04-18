import React, {useState} from "react";
import axios from "axios";
import Logo from "../Logo";
import flower from "../images/scandi-373.svg";
import * as yup from "yup";
import {Link} from "react-router-dom";
import {HiOutlineEye, HiOutlineEyeOff} from "react-icons/hi";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  User,
  UserCredential,
} from "firebase/auth";
import {auth, app} from "../firebase-config";
import {getFirestore, serverTimestamp, setDoc, doc} from "firebase/firestore";

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

const db = getFirestore(app);
const endpoint =
  process.env.REACT_APP_NODE_ENV === "production"
    ? process.env.REACT_APP_LIVE_SERVER_URL
    : process.env.REACT_APP_LOCALHOST_URL;

interface SignUpInfo {
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const ERRORS = [
    ["auth/email-already-in-use", "email is alreay in use"],
    ["auth/invalid-email", "invalid email, please try again"],
    [
      "auth/operation-not-allowed",
      "operation not allowed, double check and try again",
    ],
    ["auth/weak-password", "password is too weak, please add more complexity"],
  ];
  const options = {
    withCredentials: true,
    crossDomain: true,
    headers: {
      "Access-Control-Allow-Origin":
        process.env.REACT_APP_NODE_ENV === "production"
          ? process.env.REACT_APP_LIVE_URL
          : process.env.REACT_APP_LOCAL_URL,
      "Access-Control-Allow-Credentials": "true",
      "Content-Type": "application/json",
    },
  };
  const [signUpData, setSignUpData] = useState<SignUpInfo>({
    email: "",
    password: "",
  });
  const [signUpErrors, setSignUpErrors] = useState<string[]>([]);
  const [eyeIcon, setEyeIcon] = useState<boolean>(true);

  let signUpSchema = yup.object().shape({
    email: yup.string().email().required("email is required"),
    password: yup.string().min(8).required("password is required"),
  });

  const sendConfirmationEmail = async (user: User) => {
    if (user) {
      // let actionCodeSettings = {
      //     url: "http://localhost:3000/confirm_email?email="+ user.email
      // }
      try {
        await sendEmailVerification(user);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const addUser = async (userCredential: UserCredential, id: number) => {
    const email = signUpData.email;
    // make doc id the user id
    const uid = userCredential.user.uid;
    await setDoc(doc(db, "users", uid), {
      id: id,
      company: "",
      email: email,
      uid: uid,
      confirmed: false,
      premium: false, // update to true on stripe confirmation page
      contact: {firstName: "", lastName: ""},
      createdAt: serverTimestamp(),
    });
  };

  const registerPostgres = async (
    userCredential: UserCredential,
    hash: string
  ) => {
    try {
      await axios
        .post(
          `${endpoint}/create_user`,
          {
            email: signUpData.email,
            password: signUpData.password,
            hash: hash,
          },
          options
        )
        .then((response) => {
          const id = response.data.id;
          addUser(userCredential, id);
          sendConfirmationEmail(userCredential.user);
        })
        .catch((err) => {
          if (err instanceof Error) {
            console.error(err.message);
          }
        });
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  };

  const registerUser = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signUpData.email,
        signUpData.password
      );
      const hash = userCredential.user.uid;
      await registerPostgres(userCredential, hash);
    } catch (error: any) {
      const ERROR_CODES = ERRORS.map((item) => item[0]);
      const errorCode = error.code;
      if (ERROR_CODES.includes(errorCode)) {
        let error_array: string[][] = ERRORS.filter(
          (item) => item[0] === errorCode
        );
        let error_message: string = error_array[0][1];
        setSignUpErrors((signUpErrors) => [...signUpErrors, error_message]);
      }
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: insert
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
