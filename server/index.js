const express = require('express');
const cors = require('cors');
const path = require('path');
const insertData = require('./data/insertDataToDb');

require('./db/mongoose');
const Event = require('./db/models/Event');

const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());
app.use(cors());

//insert data to db
// insertData();

app.get('/events', async function (req, res) {
   try {
      const allEvents = await Event.find({});
      return res.send(allEvents);
   } catch (e) {
      return res.status(500).send();
   }
});

app.post('/event/update', async function (req, res) {
   try {
      const { Id, Subject, Location, StartTime, EndTime, Description, CategoryColor } = req.body;

      const dbEvent = await Event.find({
         Id: { $in: Id },
      });
      // add new event otherwise update existing event
      if (!dbEvent.length) {
         const newEvent = await Event(req.body).save();
         res.send({ newEvent });
      } else {
         dbEvent[0].Subject = Subject;
         dbEvent[0].Location = Location;
         dbEvent[0].StartTime = StartTime;
         dbEvent[0].EndTime = EndTime;
         dbEvent[0].Description = Description;
         dbEvent[0].CategoryColor = CategoryColor;

         const updateEventInDB = await dbEvent[0].save();
         res.send({ updateEventInDB });
      }
   } catch (e) {
      res.status(500).send();
   }
});

// app.post('/event/delete', async function (req, res) {
//    try {
//       const { id } = req.body;
//       await User.delete({
//          Id: { $in: id },
//       });
//       res.send({ msg: 'deleted selected event' });
//    } catch (e) {
//       res.status(500).send();
//    }
// });

app.listen(port, () => {
   console.log(`Listening on ${port}`);
});

//deploy to heroku
app.use(express.static(path.join(__dirname, '../client/build')));
app.get('/*', (req, res) => {
   res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});
