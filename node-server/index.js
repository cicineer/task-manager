const express = require('express');
const app = express();
const cors = require('cors');
const jwtAuth = require('./jwt');

const userRouter = require('./routes/user');
const projectRouter = require('./routes/project');
const authRouter = require('./routes/auth');
const taskListRouter = require('./routes/task-list');
const taskRouter = require('./routes/task');

// mongoose configuration
const mongoose = require('mongoose');
//Set up default mongoose connection
const mongoDB = 'mongodb://127.0.0.1/angular_taskmgr';
mongoose.connect(mongoDB, {useNewUrlParser: true});
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
const db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
// app.use(jwtAuth);

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/projects', projectRouter);
app.use('/tasks', taskRouter);
app.use('/task-lists', taskListRouter);

app.listen('3000');
