import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
require("./ForgotPasswordPage.css");

const ForgotPasswordPage = (): JSX.Element => {
    const [email, setEmail] = useState<string>("");

    let navigate = useNavigate();

    // Function for calling Auth.forgotPassword, called in buttonNavigation
    let awsForgotPassword = async (): Promise<any> => {
        let response = await Auth.forgotPassword(email).catch(
            error => {
                const code = error.code;
                console.log(error);
                switch (code) {
                    case 'UserNotFoundException':
                        alert("Please enter a valid email");
                        return false;
                    case 'LimitExceededException':
                        alert("Too many tries, please wait and try again in a couple minutes");
                        return false;
                }
            }
        );
        return true;
    }
    const buttonNavigation = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> => {
        const mainScreenPath: string = "/"; // Main screen (login)
        const successPath: string = "/NewPasswordPage"
        let checkAWS = await awsForgotPassword();
        const target = e.target as HTMLTextAreaElement;
        if (target.value === "sendButton") {
            if (submitData() && checkAWS) {
                navigate(successPath);
            }
        }
    }

    const submitData = (): boolean => {
        if (validateEmail()) {
            const JSONstring = getFormData();
            console.log(JSONstring);
            //connect to backend code
            return true;
        }
        return false;
    }

    const getFormData = (): string => {
        const forgotEmail = {
            "email": email
        };
        return JSON.stringify(forgotEmail);
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
        //else if (check if email does NOT exist)
        //alert("There is no account associated with this email") 
        return true;
    }

    //HTML Body
    return (
        <div>
            <div id="forgotPasswordBox">
                <p id="forgotPasswordText">Forgot Password</p>
                <p className="forgotPasswordMessage">Please enter the email associated with your account to receive a confirmation code.</p>
                <p className="emailInput">Email</p>
                <input className="inputBox"
                    type="text"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e?.target?.value)}
                />
                <button value="sendButton" id="sendButton" onClick={buttonNavigation}>Send</button>

            </div>
        </div>);
}

export default ForgotPasswordPage;