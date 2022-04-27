const redisClient = require("../redis")
const session = require("express-session")
const RedisStore = require("connect-redis")(session)

const sessionMiddleware = session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.COOKIE_SECRET,
    name: "sid-maxapp",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
})

module.exports = sessionMiddleware
