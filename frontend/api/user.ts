const userURL = "http://localhost:3001/api/users/"

/*------------------GET Requests-----------------*/

// Get ALL users
const getUsers = () : void => {
    fetch(userURL)
    .then(res => {
        if(!res.ok){ // check server response
            throw new Error(res.status + "-" + res.statusText);
        }
        res.json()
    })
    .then(users => console.log(users)) 
    .catch(error => console.error("Error: ", error)) // handle error
}

// Get A user by "userID"
const getUserByID = (userID : string) : void => {
    fetch(userURL + userID)
    .then(res => {
        if(!res.ok){ // check server response
            throw new Error(res.status + "-" + res.statusText)
        }
        res.json()
    })
    .then(user => console.log(user))
    .catch(error => console.error("Error: ", error)) // handle error
}

// Get ALL volunteers
const getVolunteers = () : void => {
    fetch(userURL + "volunteers")
    .then(res => {
        if(!res.ok){ // check server response
            throw new Error(res.status + "-" + res.statusText)
        }
        res.json()
    })
    .then(volunteers => console.log(volunteers))
    .catch(error => console.error("Error: ", error)) // handle error
}

// Get ALL donors
const getDonors = () : void => {
    fetch(userURL + "donors")
    .then(res => {
        if(!res.ok){ // check server response
            throw new Error(res.status + "-" + res.statusText)
        }
    })
    .then(donors => console.log(donors))
    .catch(error => console.error("Error: ", error)) // handle error
}

// Get ALL admins
const getAdmins = () : void => {
    fetch(userURL + "admins")
    .then(res => {
        if(!res.ok){ // check server response
            throw new Error(res.status + "-" + res.statusText)
        }
    })
    .then(admins => console.log(admins))
    .catch(error => console.error("Error: ", error)) // handle error
}

/*----------------------POST/PUT Requests---------------------------*/

// User data model
interface User {
    userType : string,
    firstName : string,
    lastName : string,
    email : string,
    phone : number
}

// Add a new User to User DB
const addUser = (user: User) : void => {
    fetch(userURL, {
        headers : {
            'Content-Type' : 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            "userType" : user.userType,
            "firstName" : user.firstName,
            "lastName" : user.lastName,
            "email" : user.email,
            "phone" : user.phone
        })
    })
    .then(res => {
        if(!res.ok){ // check server response
            throw new Error(res.status + "-" + res.statusText)
        }
    })
    .catch(error => console.error("Error: ", error)); // handle error
}

// Update User "firstName" (given userID)
const updateUserFirstName = (userID : string, firstName : string) : void => {
    fetch(userURL + userID + "/firstName", {
        headers : {
            'Content-Type' : 'application/json'
        },
        method: 'PUT',
        body: JSON.stringify({
            "firstName" : firstName
        })
    })
    .then(res => {
        if(!res.ok){ // check server response
            throw new Error(res.status + "-" + res.statusText)
        }
    })
    .catch(error => console.error("Error: ", error)); // handle error
}

// Update User "lastName" (given userID)
const updateUserLastName = (userID : string, lastName : string) : void => {
    fetch(userURL + userID + "/lastName", {
        headers : {
            'Content-Type' : 'application/json'
        },
        method: 'PUT',
        body: JSON.stringify({
            "lastName" : lastName
        })
    })
    .then(res => {
        if(!res.ok){ // check server response
            throw new Error(res.status + "-" + res.statusText)
        }
    })
    .catch(error => console.error("Error: ", error)); // handle error
}

// Update User "email" (given userID)
const updateUserEmail = (userID : string, email : string) : void => {
    fetch(userURL + userID + "/email", {
        headers : {
            'Content-Type' : 'application/json'
        },
        method: 'PUT',
        body: JSON.stringify({
            "email" : email
        })
    })
    .then(res => {
        if(!res.ok){ // check server response
            throw new Error(res.status + "-" + res.statusText)
        }
    })
    .catch(error => console.error("Error: ", error)); // handle error
}

// Update User "phone" (given userID)
const updateUserPhone = (userID : string, phone : number) : void => {
    fetch(userURL + userID + "/phone", {
        headers : {
            'Content-Type' : 'application/json'
        },
        method: 'PUT',
        body: JSON.stringify({
            "phone" : phone
        })
    })
    .then(res => {
        if(!res.ok){ // check server response
            throw new Error(res.status + "-" + res.statusText)
        }
    })
    .catch(error => console.error("Error: ", error)); // handle error
}