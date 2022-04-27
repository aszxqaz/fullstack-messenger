const redisClient = require("../../../redis")

const parseFriendlist = async friendlist => {
    const newFriendlist = []
    for (let friend of friendlist) {
        const [username, userid] = friend.split(".")
        const connected = await redisClient.hget(`userid:${username}`, "connected")
        newFriendlist.push({
            username,
            userid,
            connected
        })
    }
    return newFriendlist
}

module.exports = parseFriendlist