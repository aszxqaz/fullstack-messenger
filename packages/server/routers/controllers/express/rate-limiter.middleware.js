const redisClient = require("../../../redis")

const rateLimiter = (secondsLimit, countLimit) => async (req, res, next) => {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress
    const [response] = await redisClient
        .multi()
        .incr(ip)
        .expire(ip, secondsLimit)
        .exec()
    if (response[1] > countLimit) {
        return res.json({
            loggedIn: false,
            status: "Too many attempts to log in. Try again in a minute."
        })
    }
    next()
}

module.exports = rateLimiter
