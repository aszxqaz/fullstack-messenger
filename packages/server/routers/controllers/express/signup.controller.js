const pool = require("../../../db")
const bcrypt = require("bcrypt")
const { v4: uuid } = require("uuid")

const signupPostHandler = async (req, res) => {
    try {
        console.log(req.body)
        const existing = await pool.query("SELECT username from users WHERE username = $1", [
            req.body.username
        ])
        if (existing.rowCount !== 0) return res.json({ loggedIn: false, status: "Username taken" })

        const passhash = await bcrypt.hash(req.body.password, 10)
        const newUserQueryResult = await pool.query(
            "INSERT INTO users(username, passhash, userid) values($1, $2, $3) RETURNING id, username, userid",
            [req.body.username, passhash, uuid()]
        )

        /* saving the user object in the req.session */
        const { id, username, userid } = newUserQueryResult.rows[0]
        req.session.user = { username, id, userid }

        res.json({ loggedIn: true, username: req.body.username })
    } catch (e) {
        console.log(e)
    }
}

module.exports = signupPostHandler