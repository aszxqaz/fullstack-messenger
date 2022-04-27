const { SOCKET_EVENTS } = require("@maxapp/common")
const redisClient = require("../../../redis")
const parseFriendlist = require("./parse-friendlist.helper")

const initializeUser = async socket => {
    /* populating socket with user meta data */
    socket.user = { ...socket.request.session.user }

    /* make socket joined to his room */
    socket.join(socket.user.userid)

    /* sending user meta data to Redis */
    await redisClient.hset(
        `userid:${socket.user.username}`,
        "userid",
        socket.user.userid,
        "connected",
        true
    )

    /* getting the friendlist with userid's and connection statuses */
    const unparsedFriendlist = await redisClient.lrange(`friends:${socket.user.username}`, 0, -1)
    const friendlist = await parseFriendlist(unparsedFriendlist)

    /* getting the array of friends' userid's */
    const friendRooms = friendlist.map(_ => _.userid)

    /* letting friends know that the user has been connected */
    if (friendRooms.length > 0) {
        socket.to(friendRooms).emit(SOCKET_EVENTS.USER_CONNECTED, true, socket.user.username)
        console.log(socket.user.username)
    }

    /* send friendlist to the client */
    socket.emit(SOCKET_EVENTS.GET_FRIENDLIST, friendlist)

    /* array of strings in format < to >.< from >.< content > */
    const msgQuery = await redisClient.lrange(`chat:${socket.user.userid}`, 0, -1)

    if (msgQuery.length > 0) {
        const messages = msgQuery.map(s => {
            const [to, from, content] = s.split(".")
            return { to, from, content }
        })

        socket.emit(SOCKET_EVENTS.GET_MESSAGES, messages)
    }
}

module.exports = initializeUser
