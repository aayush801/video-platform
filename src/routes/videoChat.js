// const express = require('express')
// const socketio = require('socket.io');
// const {v4: uuidv4} = require('uuid');
//
//
// const app = express();
// const server = require('http').createServer(app);
//
// app.set('view engine', 'ejs')
//
// app.use(express.static('public'));
//
// //routes used
//
// app.get('/', (req, res) => {
//     res.redirect(`/chat/${uuidv4()}`)
// });
//
// app.get('/:room', (req, res) => {
//     res.render('room', {
//         roomId: req.params.room
//     })
// });
//
// const io = socketio(server);
//
// io.on('connection', (socket) => {
//     socket.on('join-room', (roomId, userId) => {
//         socket.join(roomId)
//         socket.to(roomId).broadcast.emit('user-connected', userId)
//
//         socket.on('message', (message) => {
//             io.to(roomId).emit('createMessage', message)
//         })
//
//         socket.on('disconnect', () => {
//             socket.to(roomId).broadcast.emit('user-disconnected', userId)
//         })
//     })
//
// })
//
//
//
// const port = process.env.PORT || 3000;
// server.listen(port, () => {
//     console.log(`server is up and running on ${port}`);
// });
//
