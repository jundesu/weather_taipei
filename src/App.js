import { useState } from 'react';
import './App.css';
import windSpeed from './img/weather_wind.png';
import humidity from './img/weather_humidity.png';

const locationName = '臺北'

function fetchCurrentObservation() {
  return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${process.env.REACT_APP_CWB_API_KEY}&locationName=${locationName}&format=JSON`).then((response) =>{
    return response.json();
  })
  .then((data) => {
    const weatherInfo = data.records?.location?.find(element => element.locationName === '臺北');
    const weatherTemp = weatherInfo?.weatherElement?.find(e => e.elementName === "TEMP");
    const weatherWind = weatherInfo?.weatherElement?.find(e => e.elementName === "WDSD");
    const weatherHumd = weatherInfo?.weatherElement?.find(e => e.elementName === "HUMD");

    return {
      location: weatherInfo?.locationName,
      temperature: weatherTemp?.elementValue,
      windSpeed: weatherWind?.elementValue,
      humidity: weatherHumd?.elementValue,
    };
  });
}

function Dashboard() {
  const [observation, setObservation] = useState({
    location:'',
    temperature:'',
    windSpeed:'',
    humidity:'',
  });

  const handleClick = () => {
    Promise.all([
      fetchCurrentObservation()
    ]).then(([currentObservation]) =>{

        setObservation(currentObservation);
      });

  }

  // const [weatherType, setWeatherType] = useState({
  //   description:'',
  //   type:'',
  // });

  // const [forecast, setForecast] = useState([]);

  return (
    <div className="dashboard">
      <button className="button" onClick={handleClick}></button>
      <div className="weatherObservation">
        <Nowcasting observation={observation}/>
        {/* <WeatherIcon />
        <Forecast /> */}
      </div>
    </div>
  );
}

function Nowcasting(props) {
  return (
    <div className="weatherInfo">
      <div className="location">{props.observation.location || ''}</div>
      <div className="temperature">{Math.round(props.observation.temperature || 0)}<span>&#8451;</span></div>
      <div className="description"></div>
      <div className="windSpeed">
        <img src={windSpeed}/>
        <span>{props.observation.windSpeed} m/s</span>
      </div>
      <div className="humidity">
        <img src={humidity}/>
        <span>{Math.round((props.observation.humidity || 0)*100)} &#37;</span>
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
