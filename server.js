const express = require('express')
const sqlite3 = require('sqlite3')
const app = new express()
const db = new sqlite3.Database('./db/classolympics.db')

app.use(express.static('public'))
app.use(express.json())

app.get("/events", (req, res) => {
    const eventSQL = `SELECT
    events.id, title, location, capacity,
    teachers.id, teachers.first_name, teachers.last_name
    FROM events
    LEFT JOIN teachers
    ON events.id = teachers.event_id`
    db.all(eventSQL, [], (err, rows) => {
        if (err) console.error(err)
        res.send(rows)
    })
})

app.post("/register", (req,res)=> {
    const reg = req.body;
    const sql = "INSERT INTO registrations (event_id, student_id) VALUES (?, ?)"
    db.run(sql, [reg.event_id, reg.user_id], (err) => {
        if (err) console.error(err)
        res.send({
            message: "Registration successfully saved"
        })
    })
})

app.post("/login", (req, res) => {
    const user = req.body
    const loginSQL = "SELECT id, first_name, last_name FROM users WHERE username = ? AND password = ?"
    db.all(loginSQL, [user.username, user.password], (err, rows) => {
        if (rows && rows.length > 0) {
            res.send({
                message: "Successful login!",
                user: rows[0]
            })
        }
        else {
            if (user.username.length >= 4 && user.password.length >= 4) {
                const sql = "INSERT INTO users (username, password, first_name, last_name) VALUES (?, ?, ?, ?)"
                db.run(sql,[user.username, user.password, user.firstName, user.lastName],(err) => {
                    if (err) console.error(err)
                    res.send({
                        message: "Your account was successfully created.",
                        userId: this.lastID
                    })
                })
            }
            else {
                res.status(401)
                res.send({
                    message: "Username or password is invalid."
                })
            }
        }
    })
})

app.listen(3000, () => console.log("Server started"))