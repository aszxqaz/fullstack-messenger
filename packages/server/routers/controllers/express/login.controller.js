const pool = require("../../../db")
const bcrypt = require("bcrypt")
const { v4: uuid } = require("uuid")

module.exports = {
    loginGetHandler: async (req, res) => {
        /* checking the user field in the session in the request */
        const username = req.session.user?.username
        if (username) {
            res.json({ loggedIn: true, username })
        } else {
            res.json({ loggedIn: false })
        }
    },
    loginPostHandler: async (req, res) => {
        const existing = await pool.query(
            "SELECT username, passhash, userid from users WHERE username = $1",
            [req.body.username]
        )
        if (existing.rowCount === 0) {
            return res.json({
                loggedIn: false,
                status: "Wrong username or password"
            })
        }
        const { id, username, passhash, userid } = existing.rows[0]

        const isSamePass = await bcrypt.compare(req.body.password, passhash)
        if (isSamePass) {
            req.session.user = { username, id, userid }
            res.json({ loggedIn: true, username: req.body.username })
        } else {
            res.json({ loggedIn: false, status: "Wrong username or password" })
        }
    }
}
