import { useState } from 'react/cjs/react.production.min';
import './App.css';

function Dashboard() {
  const [observation, setObservation] = useState({
    location:'',
    temperature:'',
    wind:'',
    humidity:'',
  });
  const [weatherType, setWeatherType] = useState({
    description:'',
    type:'',
  });

  const [forecast, setForecast] = useState([]);

  return (
    <div className="dashboard">
      <button className="button"></button>
      <div className="weatherObservation">
        <Nowcasting />
        <WeatherIcon />
        <Forecast />
      </div>
    </div>
  );
}



function App() {
  return (
    <div>
      <Dashboard/>
    </div>
  );
}

export default App;
