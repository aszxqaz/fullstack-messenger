const {
    loginGetHandler,
    loginPostHandler,
    signupPostHandler,
    rateLimiter,
    validateForm
} = require("./controllers/express")
const router = require("express").Router()

router.route("/login").get(loginGetHandler).post(validateForm, rateLimiter(60, 10), loginPostHandler)

router.post("/signup", validateForm, rateLimiter(60, 10), signupPostHandler)

module.exports = router
