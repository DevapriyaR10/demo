require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path'); 
const connectDB = require('./config/db');
const questionRoutes = require('./routes/questionRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});

connectDB();


app.use(cors());
app.use(express.json());

app.use('/api/questions', questionRoutes);


io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('request-question', async () => {
    const Question = require('./models/Question');
    const questions = await Question.find();
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    socket.emit('receive-question', randomQuestion);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
