const eventURL : string = "" + "/"

/*
1. How to return data?
4. How to test (use local host and then change?)
*/

// Get ALL events
const getEvents = () : void => {
    fetch(eventURL)
    .then(res => res.json())
    .then(events => console.log(events))
    .catch(error => console.error(error))
}

// Get AN event by its ID
const getEventByID = (ID : string) : void => {
    fetch(eventURL + ID)
    .then(res => res.json())
    .then(event => console.log(event))
    .catch(error=> console.error(error))
}

// Get ALL events with matching "title"
const getEventsByTitle = (title : string) : void => {
    fetch(eventURL + title)
    .then(res => res.json())
    .then(events => console.log(events))
    .catch(error => console.error(error))
}

// Get ALL events with matching "startDate"
const getEventsByStartDate = (startDate : string) : void => {
    fetch(eventURL + startDate)
    .then(res => res.json())
    .then(events => console.log(events))
    .catch(error => console.error(error))
}

// Get ALL events with matching "endDate"
const getEventsByEndDate = (endDate : string) : void => {
    fetch(eventURL + endDate)
    .then(res => res.json())
    .then(events => console.log(events))
    .catch(error => console.error(error))
}

// Get ALL events with matching "endDate"
const getEventsByLocation = (location : string) : void => {
    fetch(eventURL + location)
    .then(res => res.json())
    .then(events => console.log(events))
    .catch(error => console.error(error))
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
    .then(res => res.json()) //response to json
    .then(result => {
        console.log('Success:', result)
    })
    .catch(error => {
        console.error('Error:', error)
    });
}