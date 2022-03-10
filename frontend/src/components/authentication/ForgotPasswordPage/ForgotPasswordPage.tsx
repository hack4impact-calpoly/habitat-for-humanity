import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
require("./ForgotPasswordPage.css");

const ForgotPasswordPage = (): JSX.Element => {
    const [email, setEmail] = useState<string>("");
    
    let navigate = useNavigate();

    const buttonNavigation = (e : React.MouseEvent<HTMLButtonElement>) : void => {
        const mainScreenPath : string = "/"; // Main screen (login)
        
        if(e.currentTarget.value === "sendButton"){
            if(submitData()){
                navigate(mainScreenPath);
            }
        }
    }

    const submitData = () : boolean => {
        if (validateEmail())
        {
            const JSONstring = getFormData();
            console.log(JSONstring);
            //connect to backend code
            return true;
        }
        return false;
    }

    const getFormData = () : string => {
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
        if (email === "")
        {
            alert("Please add email");
            return false;
        }
        else if (!email.includes("@"))
        {
            alert("Please enter a valid email address");
            return false;
        }
        //else if (check if email does NOT exist)
            //alert("There is no account associated with this email") 
        return true;    
    }
    
    //HTML Body
    return(
    <body>
        <div id="forgotPasswordBox">
            <p id="forgotPasswordText">Forgot Password</p>
            <p className="forgotPasswordMessage">Please enter the email associated with your account to receieve a reset link.</p>
                <p className="emailInput">Email</p>
                <input className="inputBox"
                    type="text"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e?.target?.value)}
                />
            <button value="sendButton" id="sendButton" onClick={buttonNavigation}>Send</button>

        </div>
    </body>);
}

export default ForgotPasswordPage;