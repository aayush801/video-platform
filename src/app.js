const express = require('express')
const passport = require('passport')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const socketio = require('socket.io');
const {v4: uuidv4} = require('uuid');
const auth = require('../config/auth')

const app = express();
const server = require('http').createServer(app);

require('../config/passport')(passport)


const db = require('../config/keys').MongoURI

//connecting to mongoose
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('mongoDB connected')
}).catch((e) => console.log(e))

//setting the view engine
app.set('view engine', 'ejs')
app.use(express.static('public'));

//to obtain login data
app.use(express.urlencoded({extended: false}))

//creating a session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);


//enabling passport authentication
app.use(passport.initialize());
app.use(passport.session())


app.use(flash());
//GLOBAL VARS
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

//routes used
app.use('/users', require('./routes/users.js'))
app.use('/', require('./routes/index.js'))

app.get('/invite', (req, res) => {
    res.render('invite')
})

app.get('/', auth, (req, res) => {
    res.redirect(`/${uuidv4()}`)
});

app.get('/:room', auth, (req, res) => {
    res.render('room', {
        username: req.user.name,
        roomId: req.params.room
    })
});

//socket.io server
const io = socketio(server);
io.on('connection', (socket) => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)

        socket.on('message', (message) => {
            io.to(roomId).emit('createMessage', message)
        })

        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })

})

const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log(`server is up and running on ${port}`);
})

