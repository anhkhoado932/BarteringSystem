const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connectDB = require('./dbConnection');
const viewRoutes = require('./routes/viewRoutes');
const userRoutes = require('./routes/userRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const messageRoutes = require('./routes/messageRoutes');
const Message = require('./models/message');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

connectDB();

const sessionMiddleware = session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
});
app.use(sessionMiddleware);
io.engine.use(sessionMiddleware);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use('/', viewRoutes);
app.use('/users', userRoutes);
app.use('/feedback', feedbackRoutes);
app.use('/transaction', transactionRoutes);
app.use('/message', messageRoutes);

// Static files
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

const PORT = 3000;
http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

io.on("connection", (socket) => {
    socket.on("start-message", () => {
        const room = socket.request.session.selectedTransactionId;
        socket.join(room);
    });
    socket.on("message", async (data) => {
        const user = socket.request.session.user;
        const room = socket.request.session.selectedTransactionId;
        if (user && room && data.length) {
            const newMessage = new Message({
                transactionId: room,
                userId: user._id,
                messageType: "text",
                content: data,
                parentId: null,
            });
            newMessage.save().then((message) => {
                socket.to(room).emit("message", { message });
            });
        }
    });
    socket.on("disconnect", async (message) => {});
});
