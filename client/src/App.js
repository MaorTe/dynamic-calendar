import React from 'react';
import Calendar from './pages/Calendar';
import { registerLicense } from '@syncfusion/ej2-base';

const licenseKey = process.env.REACT_APP_SYNCFUSION_LICENSE;

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
