const data = require('./data');
const Event = require('../db/models/Event');

// function rawDataToObjectArray() {
//    return data.scheduleData.map((item) => {
//       return {
//          Id: item.Id,
//          subject: item.Subject,
//          location: item.Location,
//          startTime: item.StartTime,
//          endTime: item.EndTime,
//          categoryColor: item.CategoryColor,
//       };
//    });
// }
module.exports = () => {
   // const events = rawDataToObjectArray();
   data.scheduleData.map(async (event) => {
      await new Event(event).save();
   });
};
