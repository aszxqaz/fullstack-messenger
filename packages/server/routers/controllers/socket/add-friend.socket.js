const redisClient = require("../../../redis")

const addFriend = async (socket, friendName, callback) => {
    /* adding yourseld is not allowed */
    if (friendName === socket.user.username) {
        callback({
            done: false,
            errorMsg: "You can't add yourself as a friend."
        })
        return
    }

    /* getting the user object of the user being added */
    const newFriend = await redisClient.hgetall(`userid:${friendName}`)

    /* if the user being added doesnt' exist */
    if (!newFriend.userid) {
        callback({
            done: false,
            errorMsg: `User with the username ${friendName} doesn't exist.`
        })
        return
    }
    /* getting the friendlist */
    const friendlist = await redisClient.lrange(`friends:${socket.user.username}`, 0, -1)
    const friendNames = friendlist?.map(_ => _.split(".")[0])
    /* if already in the friend list */
    if (friendNames?.includes(friendName)) {
        callback({
            done: false,
            errorMsg: `${friendName} is already in your friend list.`
        })
        return
    }
    /* success */
    /* friends:_username_ : _friend_.dfdfwoeir2orieffwieo */
    await redisClient.lpush(`friends:${socket.user.username}`, [friendName, newFriend.userid].join("."))
    callback({
        done: true,
        newFriend: {
            ...newFriend,
            username: friendName
        }
    })
}

module.exports = addFriend
