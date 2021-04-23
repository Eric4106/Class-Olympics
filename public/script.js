const $eventsContainer = document.getElementById("events")

document.getElementById("login").onsubmit = login

spawnEvents()

let user_id


function login(e) {
    e.preventDefault()
    fetch("/login", {
        body: JSON.stringify({
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
        }),
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => res.json())
        .then(res => {
            user_id = res.userId
        })
        .catch(error => console.error(error))
}

function spawnEvents() {
    fetch("/events")
        .then(res => res.json())
        .then(events => {
            const eventsHTML = events.map( event => `
            <div class="event" data-eventid=${event.id}>
                <p>${event.title}</p>
                <div class="details">
                    <div>Advised by ${event.teacher}</div>
                    <div>At ${event.location}</div>
                    <div>Capacity of ${event.capacity}</div>
                </div>
                <button onclick="e => {signUp(e);}">Sign Up!</button>
            </div>
            ` ).join("")
            $eventsContainer.innerHTML = eventsHTML
        })
        .catch(err => console.error(err))
}

function signUp(e) {
    const $eventDiv = e.target.parentElement
    const event_id = $eventDiv.eventid

    fetch("/register", {
        body: JSON.stringify({
            user_id: user_id,
            event_id: event_id
        }),
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => res.json())
        .then(res => console.log(res.body))
        .catch(error => console.error(error))
}