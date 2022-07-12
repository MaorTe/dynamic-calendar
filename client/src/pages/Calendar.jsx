import React, { useEffect, useState } from 'react';
import './calendar.css';
import {
   ScheduleComponent,
   ViewsDirective,
   ViewDirective,
   Day,
   Week,
   Month,
   Agenda,
   Inject,
   Resize,
   DragAndDrop,
} from '@syncfusion/ej2-react-schedule';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { client } from '../utils/api-client';

const PropertyPane = (props) => <div>{props.children}</div>;

const Scheduler = () => {
   const [scheduleObj, setScheduleObj] = useState();
   const [events, setEvents] = useState([]);
   const [updateEvent, setUpdateEvent] = useState(null);
   console.log(window.innerHeight);
   useEffect(() => {
      async function fetchData() {
         const eventsData = await client('/events');
         setEvents(eventsData);
      }
      fetchData();
   }, [events.length]);

   const onCalendarEventChanged = (data) => {
      const updatedEvent = {
         Id: data.Id,
         Subject: data.Subject,
         Location: data.Location,
         StartTime: data.StartTime,
         EndTime: data.EndTime,
      };
      setUpdateEvent(updatedEvent);
   };

   useEffect(() => {
      const onDragStopUpdateEvent = async () => {
         const a = await client('/event/update', { data: updateEvent });
         console.log(a);
      };
      updateEvent && onDragStopUpdateEvent();
   }, [updateEvent]);

   const change = (args) => {
      scheduleObj.selectedDate = args.value;
      scheduleObj.dataBind();
   };
   const onDragStart = (e) => {
      e.navigation.enable = true;
   };

   // const onResizeStop = (e) => {
   //    console.log(e.event.target.setAttribute('disabled', true));
   //    console.log(e.event.target.removeAttribute('aria-selected'));
   //    document.removeEventListener('click', onClick('a'));
   // };

   const onActionComplete = (args) => {
      if (args.requestType === 'eventCreated') {
         // This block is execute after an appointment create
      }
      if (args.requestType === 'eventChanged' && args.name === 'actionComplete') {
         // This block is execute after an appointment change
         onCalendarEventChanged(args.data[0]);
      }
      if (args.requestType === 'eventRemoved') {
         // This block is execute after an appointment remove
      }
   };

   return (
      <div className="calendar-container">
         <h2>Calendar</h2>
         <ScheduleComponent
            height={window.innerHeight - 160}
            ref={(schedule) => setScheduleObj(schedule)}
            selectedDate={new Date(2021, 0, 10)}
            eventSettings={{ dataSource: events.map((item) => item) }}
            dragStart={onDragStart}
            actionComplete={onActionComplete}
            // dragStop={onDragOrResizeStop}
            // resizeStop={onDragOrResizeStop}
            // popupOpen={onActionComplete}
            // popupClose={onActionComplete}
         >
            <ViewsDirective>
               {['Day', 'Week', 'Month', 'Agenda'].map((item) => (
                  <ViewDirective key={item} option={item} />
               ))}
            </ViewsDirective>
            <Inject services={[Day, Week, Month, Agenda, Resize, DragAndDrop]} />
         </ScheduleComponent>

         <PropertyPane>
            <table style={{ width: '100%', background: 'white' }}>
               <tbody>
                  <tr style={{ height: '50px' }}>
                     <td style={{ width: '100%' }}>
                        <DatePickerComponent
                           value={new Date(2021, 0, 10)}
                           showClearButton={false}
                           placeholder="Current Date"
                           floatLabelType="Always"
                           change={change}
                        />
                     </td>
                  </tr>
               </tbody>
            </table>
         </PropertyPane>
      </div>
   );
};

export default Scheduler;
