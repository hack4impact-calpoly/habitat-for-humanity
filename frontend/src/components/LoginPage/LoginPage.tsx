import React from "react";
import logo from "./../../images/logo.png";

import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOffOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';
import IconButton from '@mui/material/IconButton';

require("./LoginPage.css");

const LoginPage = (): JSX.Element => {
    const [email, setEmail] = React.useState<string>("");
    const [password, setPassword] = React.useState({
                                                    value: "",
                                                    showPassword: false});

    const checkCredentials = () => {
        if (email === "") {
            alert("Email is blank. Please try again.")
        } else if (password.value === "") {
            alert("Password is blank. Please try again.")
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
                    <Input
                        className="loginInput"
                        id="passwordBox"
                        value={password.value}
                        type={password.showPassword ? "text" : "password"}
                        disableUnderline={true}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword({...password, ["value"]: event?.target?.value})}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setPassword({...password, showPassword: !password.showPassword})}
                                    onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) => event?.preventDefault()}
                                    edge="end">
                                        {password.showPassword ? <VisibilityIcon className="passwordIcon"/> : <VisibilityOffIcon className="passwordIcon" />}
                                    </IconButton>
                            </InputAdornment>
                        }
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