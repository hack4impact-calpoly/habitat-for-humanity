import React, { useState } from "react";
require("./CreateAccountPage.css");

const CreateAccountPage = (): JSX.Element => {
    const [userType, setUserType] = React.useState("");
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [phoneNumber, setPhoneNumber] = React.useState("");
    const [password, setPassword] = React.useState("");

    //Form Validation Functions
    const validateAccountInfo = (): boolean => {
        /*
        Desc: Validates all the form fields
        Return: boolean (true if all are valid, false if one is not)
        */
        const valid: boolean = 
        (
            validateUserType() &&
            validateName() &&
            validatePhoneNumber() &&
            validateEmail() &&
            validatePassword()
        )
        return valid;
    }

    const validateUserType = (): boolean => {
        /*
        Desc: Validates userTypes (donator, volunteer, administrator)
        Return: boolean (true if valid, false if not)
        */
        if (userType === "")
        {
            alert("Please select an account type");
            return false;
        }
        return true;
    }

    const validateName = (): boolean =>{
        /*
        Desc: Validates firstName and lastName
        Return: boolean (true if valid, false if not)
        */
        if (firstName === "" || lastName === "")
        {
            alert("Please add your first and last name");
            return false;
        }
        return true;
    }
    
    const validatePhoneNumber = (): boolean => {
        /*
        Desc: Validates phone number
        Return: boolean (true if valid, false if not)
        */
        if (phoneNumber === "")
        {
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
        //else if (check if email already exists)
            //alert("Account with this email already exists") 
        return true;    
    }

    const validatePassword = (): boolean => {
        /*
        Desc: Validates password
        Return: boolean (true if valid, false if not)
        */
        const MIN_PASSWORD_LENGTH = 6;  
        if (password === "")
        {
            alert("Please add password");
            return false;
        }
        else if (password.length < MIN_PASSWORD_LENGTH)
        {
            alert(`Please choose a password at least ${MIN_PASSWORD_LENGTH} characters long`);
            return false;
        }
        return true;
    }
    
    //HTML Body
    return(
    <body>
        <div id="createAccountBox">
            <p id="createAccountText">Create an Account</p>
            <form id="createAccountForm">
                
                {/*Div for the user type section*/}
                <div id="accountTypeBox">
                    <p id="formLabel"> I am a </p>
                    <div className="accountLabel">
                        <input type="radio"
                                className="userTypeButton" 
                                value="donator" //Specifies the value for the useState
                                name="userType" //connects all options under group "userType" -> only one can be selected at a time
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserType(e.target.value)}/>donator

                        <input type="radio"
                                className="userTypeButton" 
                                value="volunteer" 
                                name="userType" 
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserType(e.target.value)}/>volunteer

                        <input type="radio"
                                className="userTypeButton"  
                                value="administrator" 
                                name="userType"    
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserType(e.target.value)}/>administrator
                    </div>
                </div>

                <p className="formLabel">First Name</p>
                <div id="nameBox">
                    <input className="inputBox"
                            type="text"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                    />

                    <p className="formLabel">Last Name</p>
                    <input className="inputBox"
                            type="text"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                    />
                </div>
                <p className="formLabel">Email</p>
                <input className="inputBox"
                        type="text"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                />
                
                <p className="formLabel">Phone Number</p>
                <input className="inputBox"
                        type="text"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
                />
                <p className="formLabel">Password</p>
                <input className="inputBox"
                        type="text"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                />

            </form>
            <button id="signUpButton" onClick={validateAccountInfo}>Sign Up</button>
            <p className="createAccountLogin">Already have an account?</p>
            <p className="createAccountLogin" id="logInLink">Log In</p>
        </div>
    </body>);
}

export default CreateAccountPage;