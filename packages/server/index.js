const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const { Server } = require("socket.io")
const authRouter = require("./routers/auth.router")
const session = require("./common/session.middleware")
const expressToIO = require("./helpers/express-to-io.helper")
const corsConfig = require("./config/cors")
const { SOCKET_EVENTS } = require("@maxapp/common")
const {
    addFriend,
    authorizeUser,
    initializeUser,
    onDisconnect,
    directMessage
} = require("./routers/controllers/socket")

require("dotenv").config()

const app = express()
const server = require("http").createServer(app)

const io = new Server(server, { cors: corsConfig })

/* Middlewares */
app.use(helmet())
app.use(cors(corsConfig))
app.use(express.json())

/* Setting the session middleware */
app.use(session)

/* Routers */
app.use("/auth", authRouter)
app.set("trust proxy", 1)

io.use(expressToIO(session))
io.use(authorizeUser)
io.on("connect", socket => {
    initializeUser(socket)

    socket.on(SOCKET_EVENTS.ADD_FRIEND, (friendName, callback) => {
        addFriend(socket, friendName, callback)
    })

    socket.on(SOCKET_EVENTS.DIRECT_MESSAGE, message => directMessage(socket, message))

    socket.on(SOCKET_EVENTS.USER_DISCONNECTING, () => onDisconnect(socket))
})

server.listen(4000, () => {
    console.log("Server listening on port 4000")
})
