const expressToIO = expressMiddleware => (socket, next) =>
    expressMiddleware(socket.request, {}, next)

module.exports = expressToIO
