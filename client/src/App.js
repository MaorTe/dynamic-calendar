import React from 'react';
import Calendar from './pages/Calendar';
import { registerLicense } from '@syncfusion/ej2-base';
import './App.css';

const licenseKey =
   'ORg4AjUWIQA/Gnt2VVhiQlFadVlJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxRdkJjUX5ZcXJURGddUkI=';
// Registering Syncfusion license key
registerLicense(licenseKey);

function App() {
   return (
      <div className="App">
         <Calendar />
      </div>
   );
}

export default App;
