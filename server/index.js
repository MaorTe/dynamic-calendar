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

app.get('/users', async function (req, res) {
   try {
      if (Object.keys(req.query).length === 0) res.send(await User.find({}));
      const { category, term } = req.query;
      const filter = {};
      filter[category] = { $regex: term, $options: 'i' };
      return res.send(await User.find(filter));
   } catch (e) {
      return res.status(500).send();
   }
});

// app.post('/users', async function (req, res) {
//    try {
//       const { user } = req.body;
//       if (!userValidator(user)) return res.send({ msg: 'bad credentials' });
//       const userDB = await new User(user).save();
//       res.send({ msg: 'added new user', IP: userDB.IP });
//    } catch (e) {
//       res.status(500).send({ msg: 'there were some errors' });
//    }
// });

app.post('/events/update', async function (req, res) {
   try {
      const { Id, Subject, Location, StartTime, EndTime } = req.body;

      const dbEvent = await Event.find({
         Id: { $in: Id },
      });
      dbEvent[0].Subject = Subject;
      dbEvent[0].Location = Location;
      dbEvent[0].StartTime = StartTime;
      dbEvent[0].EndTime = EndTime;
      const updateEventInDB = await dbEvent[0].save();

      res.send({ updateEventInDB });
      // res.send({ msg: 'event updated' });
   } catch (e) {
      res.status(500).send();
   }
});

app.post('/users/delete', async function (req, res) {
   try {
      const { ids } = req.body;
      await User.deleteMany({
         ID: { $in: ids },
      });
      res.send({ msg: 'deleted selected user/users' });
   } catch (e) {
      res.status(500).send();
   }
});

app.listen(port, () => {
   console.log(`Listening on ${port}`);
});

//deploy to heroku
// app.use(express.static(path.join(__dirname, '../client/build')));
// app.get('/*', (req, res) => {
//    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
// });
