import React, { useState } from "react";
import Logo from "../Logo";
import flower from "../scandi-373.svg";
import * as yup from "yup";
import { Link } from "react-router-dom";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  User,
  UserCredential,
} from "firebase/auth";
import { auth, app } from "../firebase-config";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";

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

interface SignUpInfo {
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const [signUpData, setSignUpData] = useState<SignUpInfo>({
    email: "",
    password: "",
  });
  const [signUpErrors, setSignUpErrors] = useState<string[]>([]);
  const [eyeIcon, setEyeIcon] = useState<boolean>(true);

  let signUpSchema = yup.object().shape({
    email: yup
      .string()
      .email()
      .required("email is required"),
    password: yup
      .string()
      .min(8)
      .required("password is required"),
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

  const addUser = async (userCredential: UserCredential) => {
    const email = signUpData.email;
    await addDoc(collection(db, "users"), {
      company: "",
      email: email,
      uid: userCredential.user.uid,
      confirmed: false,
      contact: { firstName: "", lastName: "" },
      createdAt: serverTimestamp(),
    });
  };

  const registerUser = async () => {
    await createUserWithEmailAndPassword(
      auth,
      signUpData.email,
      signUpData.password
    )
      .then((userCredential) => {
        // Signed in
        addUser(userCredential);
        sendConfirmationEmail(userCredential.user);
      })
      .catch((error) => {
        const ERRORS = [
          ["auth/email-already-in-use", "email is alreay in use"],
          ["auth/invalid-email", "invalid email, please try again"],
          [
            "auth/operation-not-allowed",
            "operation not allowed, double check and try again",
          ],
          [
            "auth/weak-password",
            "password is too weak, please add more complexity",
          ],
        ];
        const ERROR_CODES = ERRORS.map((item) => item[0]);
        const errorCode = error.code;
        if (ERROR_CODES.includes(errorCode)) {
          let error_array: string[][] = ERRORS.filter(
            (item) => item[0] === errorCode
          );
          let error_message: string = error_array[0][1];
          setSignUpErrors((signUpErrors) => [...signUpErrors, error_message]);
        }
      });
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
              { abortEarly: false }
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
    const { name, value } = e.target;
    setSignUpData({ ...signUpData, [name]: value });
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
