import React from "react";
import logo from "./../../images/logo.png";
require("./LoginPage.css");

const LoginPage = (): JSX.Element => {
    const [email, setEmail] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");

    const checkCredentials = () => {
        if (email === "") {
            alert("Email is blank. Please try again.")
        } else if (password === "") {
            alert("Passowrd is blank. Please try again.")
        } // check other invalid errors
        // if no errors/valid login -> redirect to logged in page
    }

    return (
        <body>
            <div id="loginBox">
                <img src={logo} alt="logo" id="loginLogo" />
                <form id="loginForm">
                    <p className="loginLabel">Email</p>
                    <input
                        className="loginInput"
                        type="text"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event?.target?.value)}
                    />
                    <div id="loginPassword">
                        <p className="loginLabel">Password</p>
                        <p id="loginForgotPassword">Forgot Password?</p>
                    </div>
                    <input
                        className="loginInput"
                        type="text"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event?.target?.value)}
                    />
                    <button id="loginSubmit" onClick={checkCredentials}>Log In</button>
                </form>
                <div style={{ textAlign: "right", marginTop: "10px" }}>
                    <p className="loginCreateAccount">Don't have an account? </p>
                    <p className="loginCreateAccount" id="createAccountLink">Create Account</p>
                </div>
            </div>
        </body>
    );
};

export default LoginPage;
