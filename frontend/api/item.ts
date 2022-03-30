const itemURL : string = "http://localhost:3001/api/items/"


/*------------------GET Requests-----------------*/

// Get ALL items
const getItems = () : void => {
    fetch(itemURL)
    .then(res => {
        if(!res.ok){ // check server response
            throw new Error(res.status + "-" + res.statusText);
        }
        res.json()
    })
    .then(items => console.log(items))
    .catch(error => console.error("Error: ", error)) // handle error
}

// Get AN item by "itemID"
const getItemByID = (itemID : string) : void => {
    fetch(itemURL + itemID)
    .then(res => {
        if(!res.ok){ // check server response
            throw new Error(res.status + "-" + res.statusText);
        }
        res.json()
    })
    .then(item => console.log(item))
    .catch(error => console.error("Error: ", error)) // handle error
}

// Get ALL items with matching "name"
const getItemsByName = (name : string) : void => {
    fetch(itemURL + name)
    .then(res => {
        if(!res.ok){ // check server response
            throw new Error(res.status + "-" + res.statusText);
        }
        res.json()
    })
    .then(items => console.log(items))
    .catch(error => console.error("Error: ", error)) // handle error
}

// Get ALL items with matching "location"
const getItemsByLocation = (location : string) : void => {
    fetch(itemURL + location)
    .then(res => {
        if(!res.ok){ // check server response
            throw new Error(res.status + "-" + res.statusText);
        }
        res.json()
    })
    .then(items => console.log(items))
    .catch(error => console.error("Error: ", error)) // handle error
}

// Get ALL items with matching "donorID"
const getItemsByDonorID = (donorID : string) : void => {
    fetch(itemURL + donorID)
    .then(res => {
        if(!res.ok){ // check server response
            throw new Error(res.status + "-" + res.statusText);
        }
        res.json()
    })
    .then(items => console.log(items))
    .catch(error => console.error("Error: ", error)) // handle error
}