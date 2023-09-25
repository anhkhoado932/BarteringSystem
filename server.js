require('dotenv').config();
const express = require('express');
const session = require("express-session");
const app = express();
const bodyParser = require('body-parser');
const connectDB = require('./dbConnection');
const productRoutes = require('./routes/productRoutes');
const publicRoutes = require('./routes/publicRoutes');
const viewRoutes = require('./routes/viewRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const userRoutes = require('./routes/userRoutes');
const Message = require('./models/message');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const authMiddleware = require('./middlewares/auth')

//Session Configuration
const sessionMiddleware = session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
});
app.use(sessionMiddleware);
io.engine.use(sessionMiddleware);

//body parser configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

// Static files
app.use(express.static(__dirname + '/public'));

// Public routes does not require authentication
app.use('/', publicRoutes);

app.use(authMiddleware);
app.use('/notifications', notificationRoutes);
app.use('/product', productRoutes);
app.use('/feedback', feedbackRoutes);
app.use('/transaction', transactionRoutes);
app.use('/message', messageRoutes);
app.use('/user', userRoutes);
app.use('/', viewRoutes);

app.set('view engine', 'ejs');

http.listen(process.env.PORT, async () => {
    await connectDB();
    console.log(`Server is running on port ${process.env.PORT}`);
});


io.on("connection", (socket) => {
    socket.on("start-message", () => {
        const room = socket.request.session.selectedTransactionId;
        socket.join(room);
    });
    socket.on("new-message", async (data) => {
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
                socket.to(room).emit("new-message", { message });
            });
        }
    });
    socket.on("disconnect", async (message) => { });
});

module.exports = app;