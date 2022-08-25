import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOffOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';
import IconButton from '@mui/material/IconButton';
import { Auth } from "aws-amplify";
import isEmail from 'validator/lib/isEmail';

require("./VerifyAccountPage.css");


const VerifyAccountPage = (): JSX.Element => {
    interface Location {
        state: { 
            email: string 
            verificationError: string
        } // passed in from previous pages
      }
    let location = useLocation() as Location;

    const [email, setEmail] = useState<string>(location.state === null ? "" : location.state.email);
    const [verificationCode, setVerificationCode] = useState<string>("");
    const [verificationError, setVerificationError] = useState<string>(location.state === null ? "" : location.state.verificationError);
    
    const [sendNewCodeText, setSendNewCodeText] = useState<string>("Get new code");
    const [countdown, setCountdown] = useState<number>(-1);
    const [newCodeDisabled, setNewCodeDisabled] = useState<boolean>(false);
    useEffect(() => {
        const timer = setTimeout(codeCountdown, 1000);
        return () => clearTimeout(timer);
    });
      

    let navigate = useNavigate();
    const mainScreenPath: string = "/"; // Main screen (login)
    const successPath: string = "/CreateAccount/Success"

    // function for submitting new password
    let awsConfirmSignup = async (): Promise<boolean> => {
        let success = true;
        let response = await Auth.confirmSignUp(email, verificationCode).catch(
            error => {
                const code = error.code;
                console.log(error);
                switch (code) {
                    case 'UserNotFoundException':
                        setVerificationError('Please enter a valid email');
                        break;
                    case 'NotAuthorizedException':
                        setVerificationError('User is already confirmed');
                        break;
                    case 'CodeMismatchException':
                        setVerificationError('Incorrect code. Please enter a valid code.');
                        break;
                    case 'InvalidParameterException':
                        setVerificationError('Please make sure all inputs contain no spaces, tabs, etc.');
                        break;
                    default:
                        setVerificationError(error.message);
                        break;
                }
                success = false;
            }
        );
        return success;
    }

    const sendNewCode = async () => {
        if (!newCodeDisabled && validateEmail()) {
            // prevent double clicks from calling sendNewCode twice
            setNewCodeDisabled(true); 

            let disableButton = await awsSendNewCode();
            if (disableButton) {
                disableCodeButton(10);
            } else {
                setNewCodeDisabled(false);
            }
        }
    }

    let awsSendNewCode = async (): Promise<boolean> => {
        let disableButton = true; // do not disable button if code not sent and limit not exceeded
        let response = await Auth.resendSignUp(email).catch(
            error => {
                const code = error.code;
                console.log(error);
                switch (code) {
                    case 'AuthError':
                        setVerificationError('Please enter a valid email');
                        disableButton = false;
                        break;
                    case 'LimitExceededException':
                        setVerificationError("Too many tries, please try again in a couple minutes");
                        break;
                    case 'UserNotFoundException':
                        setVerificationError("Please enter a valid email")
                        disableButton = false;
                        break;
                    default:
                        setVerificationError(error.message);
                        disableButton = false;
                        break;
                }
            }
        );
        return disableButton;
    }

    // auto updates when countdown > 0, called in useEffect
    const codeCountdown = () => {
        if (countdown > 0) {
            setCountdown(countdown - 1);
            setSendNewCodeText("Wait to send again: " + countdown);
        } else if (countdown === 0) {
            setSendNewCodeText("Send again");
            enableCodeButton();
        }
    }

    const disableCodeButton = (secs: number) => {
        let link = document.getElementById("sendNewCodeLink");
        link?.classList.replace("clickable", "unclickable");

        setCountdown(secs);
        setSendNewCodeText("Wait to send again: " + secs);
        setNewCodeDisabled(true);
    }

    const enableCodeButton = () => {
        let link = document.getElementById("sendNewCodeLink");
        link?.classList.replace("unclickable", "clickable");

        setNewCodeDisabled(false);
    }

    const buttonNavigation = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        if (e.currentTarget.value === "submitButton") {
            let sucessfulSubmit = validateForm() && await awsConfirmSignup();
            if(sucessfulSubmit) {
                navigate(successPath);
            }
        }

        // TODO: navigate to success page when credentials are valid
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
        Desc: Validates verification code
        Return: boolean (true if valid, false if not)
        */
        if (verificationCode === "") {
            setVerificationError("Code cannot be empty");
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
            setVerificationError("Email cannot be empty");
            return false;
        }
        else if (!isEmail(email)) {
            setVerificationError("Please enter a valid email address");
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
                            defaultValue={email} 
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="labelInputBox">
                        <div id="codeLine">
                            <p className="formLabel">Verification Code</p>
                            <p className="formLabel clickable" id="sendNewCodeLink" onClick={sendNewCode}>{sendNewCodeText}</p>
                        </div>
                        <input className="inputBox"
                            type="text"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVerificationCode(e.target.value)}
                        />
                        <div className="inputError">{verificationError}</div>
                    </div>

                </form>
                <button value="submitButton" id="submitButton" onClick={buttonNavigation}>Submit</button>
            </div>
        </div>);
}

export default VerifyAccountPage;