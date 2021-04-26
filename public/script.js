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

    const input_user_id = document.getElementById("user_id").value
    fetch(`/register/${input_user_id}`)
        .then(res => res.json())
        .then(reg => {
            $registrationContainer.innerHTML = `
            <div class="registration" data-regid=${reg.id}></div>
            <p>Student id (sql): ${reg.student_id}</p>
            <p>Event id: ${reg.event_id}</p>
            `
        })
        .catch(error => console.error(error))
}

function spawnEvents() {
    fetch("/events")
        .then(res => res.json())
        .then(events => {
            $eventsContainer.innerHTML = events.map( event => `
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