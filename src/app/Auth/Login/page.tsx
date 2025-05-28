"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
//import { CognitoUser } from "amazon-cognito-identity-js";

import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOffOutlined";
import InputAdornment from "@mui/material/InputAdornment";
import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";
import isEmail from "validator/lib/isEmail";

import "../../../App.css";
import { useSignIn } from "@clerk/nextjs";

function LoginPage(): React.ReactNode {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState({
    value: "",
    showPassword: false,
  });
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const router = useRouter();

  const forgotPasswordPath = "/Auth/ForgotPassword";
  const createAccountPath = "/Auth/CreateAccount";
  const verifyAccountPath: string = "/VerifyAccountPage";

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    const valid = checkCredentials();
    if (valid) {
      try {
        const signInAttempt = await signIn.create({
          identifier: email,
          password: password.value,
        });

        if (signInAttempt.status === "complete") {
          await setActive({ session: signInAttempt.createdSessionId });
          router.push("/");
        } else {
          console.error(JSON.stringify(signInAttempt, null, 2));
        }
      } catch (err: any) {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(err, null, 2));
              // Check for specific error related to email not found
        if (err.errors?.some((e: any) => e.code === 'form_identifier_not_found')) {
          setEmailError('Couldn\'t find your account, please create an account')
        } else if (err.errors?.some((e: any) => e.code === 'form_password_incorrect')) {
          setPasswordError('The password you entered is incorrect.')
        }
      }
    }
  };
  const checkCredentials = (): boolean => {
    // reset error messages
    setEmailError("");
    setPasswordError("");
    let noErrors = true;

    if (email === "") {
      setEmailError("Please enter an email");
      noErrors = false;
    } else if (!isEmail(email)) {
      setEmailError("Please enter a valid email (no spaces)");
      noErrors = false;
    }
    if (password.value === "") {
      setPasswordError("Please enter your password");
      noErrors = false;
    } // check other invalid errors
    return noErrors;
    // if no errors/valid login -> redirect to logged in page
  };

  return (
    <div id="loginBox">
      <img src="/images/ReStoreLogo.png" alt="logo" id="loginLogo" />
      <form id="loginForm">
        <p className="loginLabel">Email</p>
        <input
          className="loginInput"
          type="text"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(event?.target?.value)
          }
        />
        <div className="inputError">{emailError}</div>
        <div id="loginPassword">
          <p className="loginLabel">Password</p>
          <Link href={forgotPasswordPath} id="loginForgotPassword">
            Forgot Password?
          </Link>
        </div>
        <Input
          className="loginInput"
          id="passwordBox"
          value={password.value}
          type={password.showPassword ? "text" : "password"}
          disableUnderline
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setPassword({ ...password, value: event?.target?.value })
          }
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={() =>
                  setPassword({
                    ...password,
                    showPassword: !password.showPassword,
                  })
                }
                onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) =>
                  event?.preventDefault()
                }
                edge="end"
              >
                {password.showPassword ? (
                  <VisibilityIcon className="passwordIcon" />
                ) : (
                  <VisibilityOffIcon className="passwordIcon" />
                )}
              </IconButton>
            </InputAdornment>
          }
        />
        <div className="inputError">{passwordError}</div>
        <button type="button" id="loginSubmit" onClick={login}>
          Log In
        </button>
      </form>
      <div style={styles.createAccountText}>
        <p className="loginCreateAccount">{`Don't have an account? `}</p>
        <Link
          href={createAccountPath}
          className="loginCreateAccount"
          id="createAccountLink"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}

const styles = {
  createAccountText: {
    textAlign: "right",
    marginTop: "10px",
  },
} as const;

export default LoginPage;