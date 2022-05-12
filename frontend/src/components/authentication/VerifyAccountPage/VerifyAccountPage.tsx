import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOffOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';
import IconButton from '@mui/material/IconButton';
import { Auth } from "aws-amplify";

require("./VerifyAccountPage.css");


const VerifyAccountPage = (): JSX.Element => {
    const [email, setEmail] = useState<string>("");
    const [verificationCode, setVerificationCode] = useState<string>("");

    let navigate = useNavigate();
    const mainScreenPath: string = "/"; // Main screen (login)
    const successPath: string = "/CreateAccount/Success"

    // function for submitting new password
    let awsConfirmSignup = async (): Promise<void> => {
        let response = await Auth.confirmSignUp(email, verificationCode).catch(
            error => {
                const code = error.code;
                console.log(error);
                switch (code) {
                    case 'UserNotFoundException':
                        alert('Please enter a valid email');
                        break;
                    case 'NotAuthorizedException':
                        alert('User is already confirmed');
                        break;
                    case 'CodeMismatchException':
                        alert('Please enter a valid code');
                        break;
                    case 'InvalidParameterException':
                        alert('User is already confirmed');
                        break;
                }
            }
        );
        console.log(response);
    }

    let awsSendNewCode = async (): Promise<void> => {
        let response = await Auth.resendSignUp(email).catch(
            error => {
                const code = error.code;
                console.log(error);
                switch (code) {
                    case 'AuthError':
                        alert('Please enter a valid email');
                        break;
                    case 'LimitExceededException':
                        alert("Too many tries, please try again later");
                        break;
                }
            }
        );
        console.log(response);
    }

    const sendNewCode = () => {
        awsSendNewCode();
    }

    const buttonNavigation = (e: React.MouseEvent<HTMLButtonElement>): void => {
        awsConfirmSignup();
        if (e.currentTarget.value === "submitButton") {
            if (submitData()) {
                navigate(successPath);
            }
        }

        // TODO: navigate to success page when credentials are valid
    }

    const submitData = (): boolean => {
        const validData = validateForm();
        if (validData) {
            const JSONstring = getFormData();
            //connect to backend code
            return true;
        }
        return false;
    }

    const getFormData = (): string => {
        /*
        Desc: Gets all form data and coverts it into JSON
        Return: JSON string
        */
        const accountData = {
            "email": email,
            "verificationCode": verificationCode,
        };
        return JSON.stringify(accountData);
    }


    //Form Validation Functions
    const validateForm = (): boolean => {
        /*
        Desc: Validates all the form fields
        Return: boolean (true if all are valid, false if one is not)
        */
        const valid: boolean =
            (
                validateEmail() &&
                validateCode()
            )
        return valid;
    }

    const validateCode = (): boolean => {
        /*
        Desc: Validates phone number
        Return: boolean (true if valid, false if not)
        */
        if (verificationCode === "") {
            alert("Please add a phone number");
            return false;
        }
        return true;
    }

    const validateEmail = (): boolean => {
        /*
        Desc: Validates email
        Return: boolean (true if valid, false if not)
        */
        if (email === "") {
            alert("Please add email");
            return false;
        }
        else if (!email.includes("@")) {
            alert("Please enter a valid email address");
            return false;
        }
        //else if (check if email already exists)
        //alert("Account with this email already exists") 
        return true;
    }


    //HTML Body
    return (
        <div>
            <div id="newPasswordBox">
                <p id="newPasswordText">Verify Account</p>
                <form id="createAccountForm">
                    <p className="forgotPasswordMessage">Please check your email for a verification code, and fill out the fields accordingly.</p>

                    <div className="labelInputBox">
                        <p className="formLabel">Email</p>
                        <input className="inputBox"
                            type="text"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="labelInputBox">
                        <div id="codeLine">
                            <p className="formLabel">Verification Code</p>
                            <p className="formLabel clickable" onClick={sendNewCode}>Get new code</p>
                        </div>
                        <input className="inputBox"
                            type="text"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVerificationCode(e.target.value)}
                        />
                    </div>

                </form>
                <button value="submitButton" id="submitButton" onClick={buttonNavigation}>Submit</button>
            </div>
        </div>);
}

export default VerifyAccountPage;