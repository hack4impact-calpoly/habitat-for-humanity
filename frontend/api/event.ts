const eventURL : string = "" + "/"

/*
1. How to return data?
4. How to test (use local host and then change?)
*/

// Get ALL events
const getEvents = () : void => {
    fetch(eventURL)
    .then(res => {
        if(!res.ok){ // check server response
            throw new Error(res.status + "-" + res.statusText)
        }
        res.json()
    })
    .then(events => console.log(events))
    .catch(error => console.error("Error: ", error)) // handle error
}

// Get AN event by its ID
const getEventByID = (ID : string) : void => {
    fetch(eventURL + ID)
    .then(res => {
        if(!res.ok){ // check server response
            throw new Error(res.status + "-" + res.statusText)
        }
        res.json()
    })
    .then(event => console.log(event))
    .catch(error => console.error("Error: ", error)) // handle error
}

// Get ALL events with matching "title"
const getEventsByTitle = (title : string) : void => {
    fetch(eventURL + title)
    .then(res => {
        if(!res.ok){ // check server response
            throw new Error(res.status + "-" + res.statusText)
        }
        res.json()
    })
    .then(events => console.log(events))
    .catch(error => console.error("Error: ", error)) // handle error
}

// Get ALL events with matching "startDate"
const getEventsByStartDate = (startDate : string) : void => {
    fetch(eventURL + startDate)
    .then(res => {
        if(!res.ok){ // check server response
            throw new Error(res.status + "-" + res.statusText)
        }
        res.json()
    })
    .then(events => console.log(events))
    .catch(error => console.error("Error: ", error)) // handle error
}

// Get ALL events with matching "endDate"
const getEventsByEndDate = (endDate : string) : void => {
    fetch(eventURL + endDate)
    .then(res => {
        if(!res.ok){ // check server response
            throw new Error(res.status + "-" + res.statusText)
        }
        res.json()
    })
    .then(events => console.log(events))
    .catch(error => console.error("Error: ", error)) // handle error
}

// Get ALL events with matching "endDate"
const getEventsByLocation = (location : string) : void => {
    fetch(eventURL + location)
    .then(res => {
        if(!res.ok){ // check server response
            throw new Error(res.status + "-" + res.statusText)
        }
        res.json()
    })
    .then(events => console.log(events))
    .catch(error => console.error("Error: ", error)) // handle error
}


/*------------------Post Requests -------------------------- */

// Format for an event
interface Event {
    title : string,
    start_date : string,
    end_date : string,
    location : string
}

// Add a new Event to the Event DB
const addEvent = (event: Event) : void => {
    fetch(eventURL, {
        headers : {
            'Content-Type' : 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            "title" : event.title,
            "start_date" : event.start_date,
            "end_date" : event.end_date,
            "location" : event.location
        })
    })
    .then(res => {
        if(!res.ok){ // check server response for errors
            throw new Error(res.status + "-" + res.statusText)
        }
    })
    .catch(error => console.error("Error: ", error)) // handle error
}