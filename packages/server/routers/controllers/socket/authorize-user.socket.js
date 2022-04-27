const authorizeUser = (socket, next) => {
    if (!socket.request.session?.user) return next(new Error("Not authorized"))
    next()
}
module.exports = authorizeUser