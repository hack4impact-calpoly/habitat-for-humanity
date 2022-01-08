import React, { useState } from "react";
require("./CreateAccount.css");

const CreateAccountPage = (): JSX.Element => {
    const [userType, setUserType] = React.useState();
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [phoneNumber, setPhoneNumber] = React.useState("");
    const [password, setPassword] = React.useState("");

    //Form Validation
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

        //Need to implement
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
                <div id="accountTypeBox">
                    <p id="accountTypeLabel"> I am a </p>
                    <p className="accountType">donator</p>
                    <p className="accountType">volunteer</p>
                    <p className="accountType">administrator</p>
                </div>
                <p className="formLabel">First Name</p>
                <p className="formLabel">Last Name</p>
                <p className="formLabel">Email</p>
                <p className="formLabel">Phone Number</p>
                <p className="formLabel">Password</p>
            </form>
            <button id="signUpButton" onClick={validateAccountInfo}>Sign Up</button>
        </div>
    </body>);
}

