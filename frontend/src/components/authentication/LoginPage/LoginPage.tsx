import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOffOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';
import IconButton from '@mui/material/IconButton';

import logo from "images/logo.png";
import "./LoginPage.css";

const LoginPage = (): JSX.Element => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState({
                                                    value: "",
                                                    showPassword: false});
    let navigate = useNavigate();

    const forgotPasswordPath = "/ForgotPassword";
    const createAccountPath = "/CreateAccount";

    const login = () : void => {
        let valid = checkCredentials();
        if (valid /*&& donator*/){
            navigate("/Donor");
        }
        /*
        else if (valid && admin){
            navigate("/Admin/Home");
        }
        else if (valid && volunteer){
            navigate("/Donator/Home");
        }
        else{
            alert("Sorry an unexpected error occured while logging you in");
        }
        */
    }
    const checkCredentials = () : boolean => {
        if (email === "") {
            alert("Email is blank. Please try again.")
            return false;
        } else if (password.value === "") {
            alert("Password is blank. Please try again.");
            return false;
        } // check other invalid errors
        else{
            return true;
        }
        // if no errors/valid login -> redirect to logged in page
    }

    return (
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
                    <Link to={forgotPasswordPath} id="loginForgotPassword">Forgot Password?</Link>
                </div>
                <Input
                    className="loginInput"
                    id="passwordBox"
                    value={password.value}
                    type={password.showPassword ? "text" : "password"}
                    disableUnderline={true}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword({...password, "value": event?.target?.value})}
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
                <button id="loginSubmit" onClick={login}>Log In</button>
            </form>
            <div style={{ textAlign: "right", marginTop: "10px" }}>
                <p className="loginCreateAccount">Don't have an account? </p>
                <Link to={createAccountPath} className="loginCreateAccount" id="createAccountLink">Create Account</Link>
            </div>
        </div>
    );
};

export default LoginPage;