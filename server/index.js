const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const cors = require('cors')

const { addUser, getUser, removeUser, getUsersInRoom } = require('./users')

const PORT = process.env.PORT || 5000


const router = require('./router')

const app = express()
app.use(cors())

const server = http.createServer(app)
const io = socketio(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
})
app.use(router)


io.on('connect', (socket) => {
    socket.on('join', ({ name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room });

        if (error) return callback(error);

        socket.join(user.room);

        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.` });
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
        console.log(getUsersInRoom(user.room));
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        //send message to array messages in front end
        //io.to mengarah ke room nya

        io.to(user.room).emit('message', { user: user.name, text: message });

        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
            //to know who is in the room
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
        }
    })
});


server.listen(PORT, () => { console.log("Server is Running " + PORT); })