const itemURL : string = "http://localhost:3001/api/items/"


/*------------------GET Requests-----------------*/

// Get ALL items
export const getItems = async () => {
    return await fetch(itemURL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(async (res) => {
        const items = await res.json()
        if(!res.ok){ // check server response
            throw new Error(res.status + "-" + res.statusText);
        }
        console.log(items)
        return items
    })
    .catch(error => console.error("Error: ", error)) // handle error
}

// Get AN item by "itemID"
export const getItemByID = async (itemID : string) => {
    return await fetch(itemURL + "itemId/" + itemID, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(async (res) => {
        const item = await res.json()
        if(!res.ok){ // check server response
            throw new Error(res.status + "-" + res.statusText);
        }
        console.log(item)
        return item
    })
    .catch(error => console.error("Error: ", error)) // handle error
}

// Get ALL items with matching "name"
export const getItemsByName = async (name : string) => {
    return await fetch(itemURL + "name/" + name, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(async (res) => {
        const items = await res.json()
        if(!res.ok){ // check server response
            throw new Error(res.status + "-" + res.statusText);
        }
        console.log(items)
        return items
    })
    .catch(error => console.error("Error: ", error)) // handle error
}

// Get ALL items with matching "location"
export const getItemsByLocation = async (address : string, city : string) => {
    return await fetch(itemURL + "location/" + city + "/" + address, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(async (res) => {
        const items = await res.json()
        if(!res.ok){ // check server response
            throw new Error(res.status + "-" + res.statusText);
        }
        console.log(items)
        return items
    })
    .catch(error => console.error("Error: ", error)) // handle error
}

// Get ALL items with matching "donorID"
export const getItemsByDonorID = async (donorID : string) => {
    return await fetch(itemURL + "donorId/" + donorID, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(async (res) => {
        const items = await res.json()
        if(!res.ok){ // check server response
            throw new Error(res.status + "-" + res.statusText);
        }
        console.log(items)
        return items
    })
    .catch(error => console.error("Error: ", error)) // handle error
}