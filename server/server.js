const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const path = require('path');
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game');
const adminRoutes = require('./routes/admin');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/steal-a-brainrot')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.log('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/admin', adminRoutes);

// Serve client
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Socket.IO Events
io.on('connection', (socket) => {
  console.log(`👤 Player connected: ${socket.id}`);

  socket.on('join_game', (data) => {
    socket.username = data.username;
    socket.emit('welcome', { message: 'Welcome to Steal a Brainrot Online!' });
    io.emit('player_joined', { username: data.username, count: io.engine.clientsCount });
  });

  socket.on('move', (data) => {
    socket.broadcast.emit('player_move', { 
      username: socket.username,
      position: data.position,
      rotation: data.rotation
    });
  });

  socket.on('chat', (message) => {
    io.emit('chat_message', { 
      username: socket.username, 
      message: message,
      timestamp: new Date()
    });
  });

  socket.on('global_message', (message) => {
    io.emit('global_notification', { message: message, timestamp: new Date() });
  });

  socket.on('disconnect', () => {
    console.log(`👤 Player disconnected: ${socket.id}`);
    io.emit('player_left', { username: socket.username });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🎮 Steal a Brainrot Online server running on http://localhost:${PORT}`);
});

module.exports = { app, io };
