import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Auth } from "aws-amplify";

import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOffOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';
import IconButton from '@mui/material/IconButton';
import { v4 as uuidv4 } from 'uuid';
/* Backend */
import { addUser, User } from 'api/user';



require("./CreateAccountPage.css");

const CreateAccountPage = (): JSX.Element => {
    // const { uuid } = require('uuidv4');
    const [userType, setUserType] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [password, setPassword] = useState({
        value: "",
        showPassword: false
    });
    const [id, setID] = useState<string>(uuidv4());
    let processedPhoneNumber: number; //Phone number converted from string

    let navigate = useNavigate();
    const mainScreenPath: string = "/"; // Main screen (login)
    const successPath: string = "/VerifyAccountPage"

    const buttonNavigation = async (e: React.MouseEvent<HTMLButtonElement>): Promise<any> => {
        e.preventDefault();
        let checkAWS = false;
        let valid = validateForm();

        if (valid) {
            checkAWS = await awsSignUp();
            console.log(checkAWS);
            if (checkAWS) {
                const user = await getFormData();
                addUser(user);
                navigate(successPath);
            }
        }
    }


    // awsSignUp to create an account for authentication, called in buttonNavigation
    let awsSignUp = async (): Promise<any> => {
        const username = email;
        let p = password.value;
        // let userID = ;
        // setID(userID);
        // console.log(userID)
        console.log(id);
        let response = await Auth.signUp({username, password: p,
            attributes: {
                'custom:id': id,
            }
        // const id = uuid.v4();
        // let response = await Auth.signUp(email, password.value, id): Observable<any> {
        //     const signUpParams: any = {
        //         email,
        //         password,
        //         attributes: {
        //             'custom:id': id,
        //         }
        //     };
        // return fromPromise(Auth.signUp(
        //     signUpParams
        // )
        }).catch(
            error => {
                const code = error.code;
                console.log(error);
                switch (code) {
                    case 'UsernameExistsException':
                        alert("Account already exists");
                        return false;
                }
            }
        );
        return response;
    }

    async function getFormData() {
        /*
        Desc: Gets all form data and coverts it into JSON
        Return: JSON string
        */
        // let userAuth = await Auth.currentUserInfo();
        // console.log(userAuth);
        let userAuth2 = await Auth.currentAuthenticatedUser();
        console.log(userAuth2.username);
        console.log(id);

        const accountData = {
            userType: userType,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phoneNumber, //number(int) in form: 8057562501
            id: id,
            // password: password.value
        };
        return accountData as User;
    }


    //Form Validation Functions
    const validateForm = (): boolean => {
        /*
        Desc: Validates all the form fields
        Return: boolean (true if all are valid, false if one is not)
        */
        const valid: boolean =
            (
                validateUserType() &&
                validateName() &&
                validateEmail() &&
                validatePhoneNumber() &&
                processPhoneNumber() &&
                validatePassword()
            )
        return valid;
    }

    const validateUserType = (): boolean => {
        /*
        Desc: Validates userTypes (donor, volunteer, administrator)
        Return: boolean (true if valid, false if not)
        */
        if (userType === "") {
            alert("Please select an account type");
            return false;
        }
        return true;
    }

    const validateName = (): boolean => {
        /*
        Desc: Validates firstName and lastName
        Return: boolean (true if valid, false if not)
        */
        if (firstName === "" || lastName === "") {
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
        if (phoneNumber === "") {
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

    const validatePassword = (): boolean => {
        /*
        Desc: Validates password
        Return: boolean (true if valid, false if not)
        */
        const MIN_PASSWORD_LENGTH = 6;
        if (password.value === "") {
            alert("Please add password");
            return false;
        }
        else if (password.value.length < MIN_PASSWORD_LENGTH) {
            alert(`Please choose a password at least ${MIN_PASSWORD_LENGTH} characters long`);
            return false;
        }
        return true;
    }

    function processPhoneNumber(): boolean {
        /*
        Desc: Converts phoneNumber string to number. Saves it in global variable processedPhoneNumber
        Return: boolean (true if number successfuly processed, false if not)
        */
        try {
            const processedString = phoneNumber.replace(/[^0-9]/g, "");
            if (processedString === "") {
                alert("Please enter your phone number in the form XXX-XXX-XXXX")
                return false;
            }
            // processedPhoneNumber = parseInt(processedString);
            setPhoneNumber(processedString);

        }
        catch (error) {
            console.error(error);
            alert("Sorry there was an error processing your phone number. Please enter it in the form XXX-XXX-XXXX");
            return false;
        }
        return true;
    }

    //HTML Body
    return (
        <div>
            <div id="createAccountBox">
                <p id="createAccountText">Create an Account</p>
                <form id="createAccountForm">

                    {/*Div for the user type section*/}
                    <div id="accountTypeBox">
                        <p id="userTypeLabel"> I am a </p>
                        <div className="accountLabel">
                            <input type="radio"
                                className="userTypeButton"
                                value="donor" //Specifies the value for the useState
                                name="userType" //connects all options under group "userType" -> only one can be selected at a time
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserType(e.target.value)} />donor

                            <input type="radio"
                                className="userTypeButton"
                                value="volunteer"
                                name="userType"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserType(e.target.value)} />volunteer

                            <input type="radio"
                                className="userTypeButton"
                                value="administrator"
                                name="userType"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserType(e.target.value)} />administrator
                        </div>
                    </div>


                    <div id="nameBox">
                        <div className="labelInputBox" id="firstNameBox">
                            <p className="formLabel">First Name</p>
                            <input className="inputBox"
                                type="text"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="labelInputBox" id="lastNameBox">
                            <p className="formLabel">Last Name</p>
                            <input className="inputBox"
                                type="text"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="labelInputBox">
                        <p className="formLabel">Email</p>
                        <input className="inputBox"
                            type="text"
                            autoComplete="email"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="labelInputBox">
                        <p className="formLabel">Phone Number</p>
                        <input className="inputBox"
                            type="text"
                            autoComplete="phone"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
                        />
                    </div>

                    <div className="labelInputBox">
                        <p className="formLabel">Password</p>
                        <Input className="inputBox"
                            id="passwordBox"
                            value={password.value}
                            type={password.showPassword ? "text" : "password"}
                            disableUnderline={true}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword({ ...password, "value": e.target.value })}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setPassword({ ...password, showPassword: !password.showPassword, })}
                                        onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault()}
                                        edge="end">
                                        {password.showPassword ? <VisibilityIcon className="passwordIcon" /> : <VisibilityOffIcon className="passwordIcon" />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </div>

                </form>
                <button value="signUpButton" id="signUpButton" onClick={buttonNavigation}>Sign Up</button>
                <div className="logInBox">
                    <p className="createAccountLogin">Already have an account?</p>
                    <Link to={mainScreenPath} className="createAccountLogin" id="logInLink">Log In</Link>
                </div>
            </div>
        </div>);
}

export default CreateAccountPage;