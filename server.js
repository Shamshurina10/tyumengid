const express = require('express');
const http = require('http');
const io = require('socket.io');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

const server = http.createServer(app);
const serverPort = 21;
const wss = io(server);

app.use(cookieParser());
// support parsing of application/json type post data
app.use(bodyParser.json());
// support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

// app.use('/', serveStatic(path.join(__dirname, './public')));

app.get('/', (req, res) => {
    // console.log(req);
    var sess = req.session;
    console.log(sess);
    if (sess.username) {
        console.log(sess.username);
        res.sendFile(__dirname + '/public/index.html');
    }
    else {
        console.log('/login');
        res.redirect('/login');
    }
});

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/public/chat.html');
});

app.get('/embankment', (req, res) => {
    res.sendFile(__dirname + '/public/sights/embankment.html');
});

app.get('/bridge', (req, res) => {
    res.sendFile(__dirname + '/public/sights/bridge.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

var username;
app.post('/login', (req, res) => {
    username = req.session.username = req.body.username;
    res.send("done");
    res.end(req.session.username);
});

app.get('/logout', (req, res) => {
    console.log('logout')
    var sess = req.session;
    console.log(sess);
    sess.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/');
    });
    console.log(sess)
});


app.use('/', express.static('./public'));
app.use(function (req, res, next) {
    res.status(404).sendFile(__dirname + '/public/notfound.html')
});

wss.on('connection', (socket) => {
    console.log("Connection");

    socket.on('newMessage', (message) => {
        if (message != '' && message) {
            console.log('New message: ', message);
            wss.emit('message', { message: message, username: username});
        }
    });

    socket.on('disconnect', (connection) => {
        console.log("Disconnect");
    });
});

server.listen(serverPort, () => {
    console.log("http://localhost:" + serverPort);
});