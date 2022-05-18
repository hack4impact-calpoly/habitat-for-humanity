const userURL = "http://localhost:3001/api/users/";

/*------------------GET Requests-----------------*/

// Get ALL users
export const getUsers = async () => {
    return await fetch(userURL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(async (res) => {
        const user = await res.json()
        if(!res.ok){ // check server response
            throw new Error(res.status + "-" + res.statusText);
        }
        //console.log(user)
        return user
    })
    .catch(error => console.error("Error: ", error)) // handle error
}

// Get A user by "userID"
export const getUserByID = async (userID : string) => {
    return await fetch(userURL + "id/" + userID, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(async (res) => {
        const user = await res.json()
        if(!res.ok){ // check server response
            throw new Error(res.status + "-" + res.statusText)
        }
        //console.log(user)
        return user
    })
    .catch(error => console.error("Error: ", error)) // handle error
}

// Get ALL volunteers
export const getVolunteers = async () => {
    return await fetch(userURL + "volunteers", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(async (res) => {
        const users = await res.json()
        if(!res.ok){ // check server response
            throw new Error(res.status + "-" + res.statusText)
        }
        // console.log(users)
        return users
    })
    .catch(error => console.error("Error: ", error)) // handle error
}

// Get ALL donors
export const getDonors = async () => {
    return await fetch(userURL + "donors", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(async (res) => {
        const users = await res.json()
        if(!res.ok){ // check server response
            throw new Error(res.status + "-" + res.statusText)
        }
        // console.log(users)
        return users
    })
    .catch(error => console.error("Error: ", error)) // handle error
}

// Get ALL admins
export const getAdmins = async () => {
    return await fetch(userURL + "admins", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(async (res) => {
        const users = await res.json()
        if(!res.ok){ // check server response
            throw new Error(res.status + "-" + res.statusText)
        }
        // console.log(users)
        return users
    })
    .catch(error => console.error("Error: ", error)) // handle error
}

/*----------------------POST/PUT Requests---------------------------*/

// User data model
export interface User {
    userType : string,
    firstName : string,
    lastName : string,
    email : string,
    phone : string,
    id: string,
}

// Add a new User to User DB
export const addUser = async (user: User) => {
    return await fetch(userURL, {
        headers : {
            'Content-Type' : 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            "userType" : user.userType,
            "firstName" : user.firstName,
            "lastName" : user.lastName,
            "email" : user.email,
            "phone" : user.phone,
            "id": user.id
        })
    })
    .then(async (res) => {
        const response = await res.json()
        if(!res.ok){ // check server response
            throw new Error(res.status + "-" + res.statusText)
        }
        return response
    })
    .catch(error => console.error("Error: ", error)); // handle error
}

// Update User "firstName" (given userID)
export const updateUserFirstName = async (userID : string, firstName : string) => {
    return await fetch(userURL + "firstName/" + userID, {
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
export const updateUserLastName = async (userID : string, lastName : string) => {
    return await fetch(userURL + "lastName/" + userID , {
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
export const updateUserEmail = async (userID : string, email : string) => {
    return await fetch(userURL + "email/" + userID, {
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
export const updateUserPhone = async (userID : string, phone : string) => {
    return await fetch(userURL + "phone/" + userID, {
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