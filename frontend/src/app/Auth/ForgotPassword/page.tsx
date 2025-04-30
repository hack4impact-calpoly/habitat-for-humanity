"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";

require("../../../App.css");

function ForgotPasswordPage(): React.ReactNode {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirm_password, setConfirmPassword] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [successfulCreation, setSuccessfulCreation] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const router = useRouter();
  const { signIn, setActive } = useSignIn();

  // Send the password reset code to the user's email
  async function create(e: React.FormEvent) {
    e.preventDefault();
    await signIn
      ?.create({
        strategy: "reset_password_email_code",
        identifier: email,
      })
      .then((_) => {
        setSuccessfulCreation(true);
        setError("");
      })
      .catch((err) => {
        console.error("error", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  }

  // Reset the user's password.
  // Upon successful reset, the user will be
  // signed in and redirected to the home page
  async function reset(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm_password) {
      setError("Passwords do not match. Try again.");
      return;
    }
    await signIn
      ?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      })
      .then((result) => {
        // Check if 2FA is required
        if (result.status === "complete") {
          // Set the active session to
          // the newly created session (user is now signed in)
          setActive({ session: result.createdSessionId });
          setError("");
        } else {
          console.log(result);
        }
      })
      .catch((err) => {
        console.error("error", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  }

  // HTML Body
  return (
    <div>
      <div id="forgotPasswordBox">
        <p id="forgotPasswordText">Forgot Password</p>
        {!successfulCreation && (
          <>
            <p className="forgotPasswordMessage">
              Please enter the email associated with your account to receive a
              confirmation code.
            </p>
            <p className="emailInput">Email</p>
            <input
              className="inputBox"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e?.target?.value)
              }
            />
          </>
        )}

        {successfulCreation && (
          <>
            <p className="forgotPasswordMessage">Enter your new password</p>
            <input
              className="inputBox"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e?.target?.value)
              }
            />
            <p className="forgotPasswordMessage">Confirm password</p>
            <input
              className="inputBox"
              type="password"
              value={confirm_password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(e?.target?.value)
              }
            />
            <p className="forgotPasswordMessage">
              Enter the reset code that was sent to your email
            </p>
            <input
              type="code"
              className="inputBox"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </>
        )}
        <button
          value="sendButton"
          id="sendButton"
          onClick={!successfulCreation ? create : reset}
          type="submit"
        >
          Submit
        </button>
        {error && <p>{error}</p>}
        <p onClick={() => router.push("/Auth/Login")} className="toLogin">Back to Login</p>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
