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

function fetchCurrentWeatherType() {
  return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${process.env.REACT_APP_CWB_API_KEY}&format=JSON&locationName=臺北市`).then((response) => {
    return response.json();
  })
  .then((data) => {
    const weatherRecords = data.records?.location?.find(e => e.locationName === '臺北市');
    const weatherElement = weatherRecords?.weatherElement?.find(e => e.elementName === 'Wx');
    const weatherDes = weatherElement?.time?.[0].parameter?.parameterName;
    const weatherType = weatherElement?.time?.[0].parameter?.parameterValue;
    return {
      description: weatherDes,
      type: weatherType,
    };
  });
}

function fetchSunriseSunset() {
  const now = new Date();
  const nowString = yearMonthDayString(now);
  const tomorrow = addDays(now, 1);
  const tomorrowString = yearMonthDayString(tomorrow);

  return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/A-B0062-001?Authorization=${process.env.REACT_APP_CWB_API_KEY}&format=JSON&locationName=%E8%87%BA%E5%8C%97%E5%B8%82&timeFrom=${nowString}&timeTo=${tomorrowString}`).then((response) => {
    return response.json();
  })
  .then((data) => {
    const sunriseSunsetData = data.records?.locations?.location?.find(e => e.locationName ==='臺北市');
    const today = sunriseSunsetData?.time?.find(e => e.dataTime === nowString);
    const sunrise = today?.parameter?.find(e => e.parameterName  === '日出時刻');
    const sunriseTime = sunrise?.parameterValue;
    const sunset = today?.parameter?.find(e => e.parameterName  === '日沒時刻');
    const sunsetTime = sunset?.parameterValue;
    const sunriseDateAndTime = new Date(`${nowString}T${sunriseTime}+08:00`);
    const sunsetDateAndTime = new Date(`${nowString}T${sunsetTime}+08:00`);
    return isDay(now, sunriseDateAndTime, sunsetDateAndTime)
  });
}

function Dashboard() {
  const [observation, setObservation] = useState({
    location:'',
    temperature:'',
    windSpeed:'',
    humidity:'',
  });

  const [weatherType, setWeatherType] = useState({
    description: '',
    type: '',
  });

  const [isDay, setIsDay] = useState(true);

  const handleClick = () => {
    Promise.all([
      fetchCurrentObservation(),fetchCurrentWeatherType(),fetchSunriseSunset()
    ]).then(([currentObservation, currentWeatherType, sunriseSunset]) =>{
        setObservation(currentObservation);
        setWeatherType(currentWeatherType);
        setIsDay(sunriseSunset);
      });
  }

  return (
    <div className="dashboard">
      <button className="button" onClick={handleClick}></button>
      <div className="weatherObservation">
        <Nowcasting observation={observation} weatherType={weatherType} />
        <WeatherIcon weatherType={weatherType} />
        {/* <Forecast /> */}
      </div>
    </div>
  );
}

function Nowcasting(props) {
  return (
    <div className="weatherInfo">
      <div className="location">{props.observation.location || ''}</div>
      <div className="temperature">{Math.round(props.observation.temperature || 0)}<span>&#8451;</span></div>
      <div className="description">{props.weatherType.description || ''}</div>
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

function WeatherIcon() {
  return (
    <div>
      <img src="" className="weatherIcon"/>
    </div>
  );
}

function yearMonthDayString(d) {
  return Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  .format(d)
  .replace(/\//g, '-');
}

function addDays(date, days) {
  let newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate
}

function isDay(now, sunrise, sunset) {
  return sunrise.getTime() <= now.getTime() && now.getTime() <= sunset.getTime() 
}



function App() {
  return (
    <div>
      <Dashboard/>
    </div>
  );
}

export default App;
