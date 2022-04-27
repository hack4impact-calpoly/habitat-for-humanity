import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOffOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';
import IconButton from '@mui/material/IconButton';

import { getItemsByLocation } from '../../../api/item';
import { User, addUser, updateUserFirstName, updateUserLastName, updateUserEmail, updateUserPhone} from '../../../api/user';

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

        console.log(getItemsByLocation("1 Grand Av", "San Luis Obispo"))
        const testUser : User = {
            userType : "Donor",
            firstName : "Sebastien",
            lastName : "Callait",
            email : "scallait@calpoly.edu",
            phone : "0123456789"
        }
        //console.log(addUser(testUser));
        //console.log(updateUserFirstName("6268f27a7d69a87e528b0740", "Josh"));
        //console.log(updateUserLastName("6268f27a7d69a87e528b0740", "Wong"));
        //console.log(updateUserEmail("6268f27a7d69a87e528b0740", "hack4impact@calpoly.edu"));
        //console.log(updateUserPhone("6268f27a7d69a87e528b0740", "9324342434"));
        if (valid /*&& donator*/){
            //navigate("/Donor");
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
                <button type="button" id="loginSubmit" onClick={login}>Log In</button>
            </form>
            <div style={{ textAlign: "right", marginTop: "10px" }}>
                <p className="loginCreateAccount">Don't have an account? </p>
                <Link to={createAccountPath} className="loginCreateAccount" id="createAccountLink">Create Account</Link>
            </div>
        </div>
    );
};

export default LoginPage;