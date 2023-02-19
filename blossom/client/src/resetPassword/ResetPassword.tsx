import React, { useState } from "react";
import flower from "../images/scandi-373.svg";
import * as yup from "yup";
import Logo from "../Logo";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { auth } from "../firebase-config";
import { confirmPasswordReset } from "firebase/auth";
import { Link } from "react-router-dom";

import {
  ResetPasswordContainer,
  ResetButton,
  Slogan,
  ResetForm,
  InputBox,
  PasswordContainer,
  eyeStyle,
  FlowerImage,
  LogoContainer,
  ErrorList,
  PasswordReset,
  LoginButton,
  linkStyle,
} from "./styles";

interface Props {
  oobCode: string | null;
}

// form to reset password
const ResetPassword: React.FC<Props> = ({ oobCode }) => {
  const [password, setPassword] = useState<string>("");
  const [eyeIcon, setEyeIcon] = useState<boolean>(true);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [passwordReset, setPasswordReset] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  let passwordSchema = yup.object().shape({
    password: yup.string().min(8).required("password is required"),
  });

  const changePassword = () => {
    if (oobCode) {
      confirmPasswordReset(auth, oobCode, password)
        .then((response) => {
          console.log(response);
          setPasswordReset(true);
        })
        .catch((error) => {
          const ERRORS = [
            ["auth/invalid-action-code", "invalid authorization code"],
            [
              "auth/expired-action-code",
              "action code expired, please request to change password again",
            ],
            ["auth/user-not-found", "invalid credentials, please try again"],
            [
              "auth/user-disabled",
              "the account you are trying to update has been disabled",
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
            setPasswordErrors((passwordErrors) => [
              ...passwordErrors,
              error_message,
            ]);
          }
        });
    }
  };
  const reset = (e: React.FormEvent) => {
    e.preventDefault();
    passwordSchema
      .isValid({
        password: password,
      })
      .then((response) => {
        if (!response) {
          passwordSchema
            .validate(
              {
                password: password,
              },
              { abortEarly: false }
            )
            .catch((err) => {
              setPasswordErrors(err.errors);
            });
        } else {
          setPasswordErrors([]);
          changePassword();
        }
      });
  };
  return (
    <ResetPasswordContainer>
      <LogoContainer>
        <Logo />
        <FlowerImage src={flower} />
      </LogoContainer>
      {!passwordReset && (
        <>
          <Slogan>update your password</Slogan>
          <ResetForm>
            <PasswordContainer>
              <InputBox
                type={eyeIcon ? "password" : "text"}
                placeholder="New Password"
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
            <ResetButton onClick={reset}>Update Password</ResetButton>
          </ResetForm>
        </>
      )}

      {passwordReset && (
        <>
          {" "}
          <PasswordReset>password successfully updated &#x1F60A;</PasswordReset>
          <Link to="/login" style={linkStyle}>
            {" "}
            <LoginButton>Login</LoginButton>
          </Link>
        </>
      )}

      {
        <ErrorList>
          {" "}
          {passwordErrors &&
            passwordErrors.map((error, item) => {
              return <li key={item}>{error}</li>;
            })}
        </ErrorList>
      }
    </ResetPasswordContainer>
  );
};
export default ResetPassword;
