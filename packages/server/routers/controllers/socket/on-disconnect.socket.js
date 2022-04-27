const { SOCKET_EVENTS } = require("@maxapp/common")
const redisClient = require("../../../redis")
const parseFriendlist = require("./parse-friendlist.helper")

const onDisconnect = async socket => {
    await redisClient.hset(`userid:${socket.user.username}`, "connected", false)
    /* getting the friendlist of the user disconnected */
    const friendlist = await redisClient.lrange(`friends:${socket.user.username}`, 0, -1)
    /* getting array of userid's of friends */
    const friendRooms = await parseFriendlist(friendlist).then(friends => friends.map(f => f.userid))
    /* emit to all friends that gone offline */
    socket.to(friendRooms).emit(SOCKET_EVENTS.USER_CONNECTED, false, socket.user.username)
}

module.exports = onDisconnect