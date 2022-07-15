const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
app.use(cors());

require('../db/mongoose');
const Event = require('../db/models/Event');

const server = http.createServer(app);
const io = new Server(server, {
   cors: {
      origin: [
         'http://localhost:3000',
         'http://dynamic-calendar.herokuapp.com',
         'https://dynamic-calendar.herokuapp.com',
         'http://dynamic-calendar.herokuapp.com:3000',
         'https://dynamic-calendar.herokuapp.com:3000',
         'http://dynamic-calendar.herokuapp.com:3001',
         'https://dynamic-calendar.herokuapp.com:3001',
         'dynamic-calendar.herokuapp.com',
         'ws://dynamic-calendar.herokuapp.com',
         'wss://dynamic-calendar.herokuapp.com',
      ],
      methods: ['GET', 'POST'],
      credentials: true,
   },
});

io.on('connection', (socket) => {
   console.log(`User Connected: ${socket.id}`);

   socket.on('update_object', async (data) => {
      data && (Object.keys(data)[0] === 'newEvent' || Object.keys(data)[0] === 'updateEventInDB')
         ? socket.broadcast.emit('object_updated', await Event.find({}))
         : socket.broadcast.emit('object_updated', { message: 'something went wrong' });
   });

   socket.on('disconnect', () => {
      console.log('User Disconnected', socket.id);
   });
});

server.listen(3001, () => {
   console.log(`Listening on ${3001}`);
});
