import { useEffect, useState } from 'react';
import './App.css';
import windSpeed from './img/weather_wind.png';
import humidity from './img/weather_humidity.png';
import sunny from './img/wd_sunny.png';
import sunnyNight from './img/wn_sunny.png';
import cloudy from './img/wd_cloudy.png';
import cloudyNight from './img/wn_cloudy.png';
import afternoonTs from './img/wd_afternoon_ts.png';
import afternoonTsNight from './img/wn_afternoon_ts.png';
import rain from './img/w_rain.png';
import fog from './img/wd_fog.png';
import fogNight from './img/wn_fog.png';
import snow from './img/w_snow.png';

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

function fetchWeeklyForecast() {
  return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-063?Authorization=${process.env.REACT_APP_CWB_API_KEY}&format=JSON`).then((response) => {
    return response.json();
  })
  .then((data) => {
    const locationsTp = data.records?.locations?.find(e => e.locationsName === '臺北市');
    const locationNg = locationsTp?.location?.find(e => e.locationName === '南港區');
    const fcData = locationNg?.weatherElement?.find(e => e.elementName === 'T');
    const fcWeatherType = locationNg?.weatherElement?.find(e => e.elementName === 'Wx');

    const now = new Date();
    const todayString = yearMonthDayString(now);
    const newForecast = [];
    const sevenDays = {};
    
   fcData.time.filter(e => !e.startTime?.startsWith(todayString)).forEach((e, index) => {
      const fcStartTime = e?.startTime?.split(' ')[0];
      const fcDate = fcStartTime.substring(5);
      const fcNormalizedDate = fcDate.replace('-', '/');
      const fcTemp = e?.elementValue?.[0].value;
      if(!sevenDays[fcNormalizedDate]) {
        sevenDays[fcNormalizedDate] = true;
        newForecast.push({
          date:fcNormalizedDate,
          temp:fcTemp,
          type:fcWeatherType?.time?.[index].elementValue?.[1].value,
        });
      }
    });
    return newForecast
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
  const [dayOrNight, setDayOrNight] = useState(true);
  const [forecast, setForecast] = useState([]);

  const handleClick = () => {
    Promise.all([
      fetchCurrentObservation(), fetchCurrentWeatherType(), fetchSunriseSunset(), fetchWeeklyForecast()
    ]).then(([currentObservation, currentWeatherType, sunriseSunset, weeklyForecast]) =>{
        setObservation(currentObservation);
        setWeatherType(currentWeatherType);
        setDayOrNight(sunriseSunset);
        setForecast(weeklyForecast);
      });
  }

  useEffect(() => {
    handleClick();
  }, []);

  return (
    <div className="dashboard">
      <button className="button" onClick={handleClick}></button>
      <div className="weatherObservation">
        <Nowcasting observation={observation} weatherType={weatherType} />
        <WeatherIcon weatherType={weatherType} dayOrNight={dayOrNight}/>
        <Forecast forecast={forecast} dayOrNight={dayOrNight}/>
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
        <span>{props.observation.windSpeed + 'm/s'}</span>
      </div>
      <div className="humidity">
        <img src={humidity}/>
        <span>{Math.round((props.observation.humidity || 0)*100) + '%'}</span>
        </div>
    </div>
  );
}

function WeatherIcon(props) {
  return (
    <div>
      <img src={handleWeatherIcon(props.dayOrNight, Number(props.weatherType.type || 0))} className="weatherIcon"/>
    </div>
  );
}

function Forecast(props) {
  return (
    <div className="forecast">
      {props.forecast.map(({date, temp, type}) => {
        return(
          <div className="day" key={date}>
            <div className="date">{date || 0 }</div>
            <div className="fcTemp">{temp || 0} <span>&#8451;</span></div>
            <div>
              <img className="fcIcon" src={handleWeatherIcon(props.dayOrNight, Number(type || 0))}/>
            </div>
          </div>
        )
      })}
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

function handleWeatherIcon(isDay, code){
  const dayImage = {
    sunny: sunny,
    cloudy: cloudy,
    afternoonTs: afternoonTs,
    rain: rain,
    fog: fog,
    snowing: snow,
  };
  const nightImage = {
    sunny: sunnyNight,
    cloudy: cloudyNight,
    afternoonTs: afternoonTsNight,
    rain: rain,
    fog: fogNight,
    snowing: snow,
  };
  const weatherCode = {
    sunnyCode: [0, 1],
    cloudyCode: [2, 3, 4, 5, 6, 7],
    afternoonTsCode: [11, 15, 16, 18, 19, 21, 30, 34],
    rainCode: [8, 9, 10, 12, 13, 14, 17, 20, 22, 29, 31, 32, 33, 35, 36, 38, 39, 41],
    fogCode: [24, 25, 26, 27, 28],
    snowingCode: [23, 37, 42],
  };
  const dayOrNightIcon = isDay? dayImage : nightImage;

  if(weatherCode.sunnyCode.find(e => e === code) !== undefined) {
    return dayOrNightIcon.sunny
  }
  if(weatherCode.cloudyCode.find(e => e === code) !== undefined) {
    return dayOrNightIcon.cloudy
  }
  if(weatherCode.afternoonTsCode.find(e => e === code) !== undefined) {
    return dayOrNightIcon.afternoonTs
  }
  if(weatherCode.rainCode.find(e => e === code) !== undefined) {
    return dayOrNightIcon.rain
  }
  if(weatherCode.fogCode.find(e => e === code) !== undefined) {
    return dayOrNightIcon.fog
  }
  if(weatherCode.snowingCode.find(e => e === code) !== undefined) {
    return dayOrNightIcon.snowing
  }
}


function App() {
  return (
    <div>
      <Dashboard/>
    </div>
  );
}

export default App;
