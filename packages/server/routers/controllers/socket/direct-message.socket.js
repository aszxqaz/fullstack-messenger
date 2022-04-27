const { SOCKET_EVENTS } = require("@maxapp/common")
const redisClient = require("../../../redis")

const directMessage = async (socket, msg) => {
    const { to, content } = msg
    const from = socket.user.userid

    const messageString = [to, from, content].join(".")
    await redisClient.lpush(`chat:${to}`, messageString)
    await redisClient.lpush(`chat:${from}`, messageString)

    socket.to(to).emit(SOCKET_EVENTS.DIRECT_MESSAGE, { to, from, content })
}

module.exports = directMessage
