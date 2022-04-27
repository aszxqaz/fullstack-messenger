require("dotenv").config()

const corsConfig = {
    origin: process.env.NODE_ENV === "production" ? process.env.CLIENT_URL : process.env.LOCALHOST,
    credentials: true
}

module.exports = corsConfig
