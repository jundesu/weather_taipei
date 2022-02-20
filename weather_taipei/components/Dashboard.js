import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '../styles/dashboard.module.css';

import Nowcasting from './Nowcasting';
import WeatherIcon from './WeatherIcon';
import WeeklyForecast from './WeeklyForecast';

import refreshIcon from '../public/img/icon_fresh.png';
import sunny from '../public/img/wd_sunny.png';
import sunnyNight from '../public/img/wn_sunny.png';
import cloudy from '../public/img/wd_cloudy.png';
import cloudyNight from '../public/img/wn_cloudy.png';
import afternoonTs from '../public/img/wd_afternoon_ts.png';
import afternoonTsNight from '../public/img/wn_afternoon_ts.png';
import rain from '../public/img/w_rain.png';
import fog from '../public/img/wd_fog.png';
import fogNight from '../public/img/wn_fog.png';
import snow from '../public/img/w_snow.png';

function fetchCurrentObservation() {
  return fetch(
    `/api/observation`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const weatherInfo = data.records?.location?.find(
        (element) => element.locationName === '臺北'
      );
      const weatherTemp = weatherInfo?.weatherElement?.find(
        (e) => e.elementName === 'TEMP'
      );
      const weatherWind = weatherInfo?.weatherElement?.find(
        (e) => e.elementName === 'WDSD'
      );
      const weatherHumd = weatherInfo?.weatherElement?.find(
        (e) => e.elementName === 'HUMD'
      );
      return {
        location: weatherInfo?.locationName,
        temperature: weatherTemp?.elementValue,
        windSpeed: weatherWind?.elementValue,
        humidity: weatherHumd?.elementValue,
      };
    });
}

function fetchCurrentWeatherType() {
  return fetch(
    `/api/weatherType`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const weatherRecords = data.records?.location?.find(
        (e) => e.locationName === '臺北市'
      );
      const weatherElement = weatherRecords?.weatherElement?.find(
        (e) => e.elementName === 'Wx'
      );
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

  return fetch(
    `/api/sunriseSunset`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const sunriseSunsetData = data.records?.locations?.location?.find(
        (e) => e.locationName === '臺北市'
      );
      const today = sunriseSunsetData?.time?.find(
        (e) => e.dataTime === nowString
      );
      const sunrise = today?.parameter?.find(
        (e) => e.parameterName === '日出時刻'
      );
      const sunriseTime = sunrise?.parameterValue;
      const sunset = today?.parameter?.find(
        (e) => e.parameterName === '日沒時刻'
      );
      const sunsetTime = sunset?.parameterValue;
      const sunriseDateAndTime = new Date(`${nowString}T${sunriseTime}+08:00`);
      const sunsetDateAndTime = new Date(`${nowString}T${sunsetTime}+08:00`);
      return isDay(now, sunriseDateAndTime, sunsetDateAndTime);
    });
}

function fetchWeeklyForecast() {
  return fetch(
    `/api/weeklyForecast`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const locationsTp = data.records?.locations?.find(
        (e) => e.locationsName === '臺北市'
      );
      const locationNg = locationsTp?.location?.find(
        (e) => e.locationName === '南港區'
      );
      const fcData = locationNg?.weatherElement?.find(
        (e) => e.elementName === 'T'
      );
      const fcWeatherType = locationNg?.weatherElement?.find(
        (e) => e.elementName === 'Wx'
      );

      const now = new Date();
      const todayString = yearMonthDayString(now);
      const newForecast = [];
      const sevenDays = {};

      fcData.time
        .filter((e) => !e.startTime?.startsWith(todayString))
        .forEach((e, index) => {
          const fcStartTime = e?.startTime?.split(' ')[0];
          const fcDate = fcStartTime.substring(5);
          const fcNormalizedDate = fcDate.replace('-', '/');
          const fcTemp = e?.elementValue?.[0].value;
          if (!sevenDays[fcNormalizedDate]) {
            sevenDays[fcNormalizedDate] = true;
            newForecast.push({
              date: fcNormalizedDate,
              temp: fcTemp,
              type: fcWeatherType?.time?.[index].elementValue?.[1].value,
            });
          }
        });
      return newForecast;
    });
}

function Dashboard() {
  const [observation, setObservation] = useState({
    location: '',
    temperature: '',
    windSpeed: '',
    humidity: '',
  });

  const [weatherType, setWeatherType] = useState({
    description: '',
    type: '',
  });

  const [dayOrNight, setDayOrNight] = useState(true);

  const [forecast, setForecast] = useState([]);

  const handleClick = () => {
    Promise.all([
      fetchCurrentObservation(),
      fetchCurrentWeatherType(),
      fetchSunriseSunset(),
      fetchWeeklyForecast(),
    ]).then(
      ([
        currentObservation,
        currentWeatherType,
        sunriseSunset,
        weeklyForecast,
      ]) => {
        setObservation(currentObservation);
        setWeatherType(currentWeatherType);
        setDayOrNight(sunriseSunset);
        setForecast(weeklyForecast);
      }
    );
  };

  useEffect(() => {
    handleClick();
  }, []);

  return (
    <div className={styles.dashboard}>
      <button className={styles.refreshBtn} onClick={handleClick}>
        <Image src={refreshIcon} />
      </button>
      <div className={styles.weatherObservation}>
        <Nowcasting observation={observation} weatherDescription={weatherType.description} />
        
        <div className={styles.weatherIcon}>
          <WeatherIcon weatherType={weatherType.type} dayOrNight={dayOrNight} />
        </div>
        
        <WeeklyForecast forecast={forecast} dayOrNight={dayOrNight} />
      </div>
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
  return newDate;
}

function isDay(now, sunrise, sunset) {
  return (
    sunrise.getTime() <= now.getTime() && now.getTime() <= sunset.getTime()
  );
}

function handleWeatherIcon(isDay, code) {
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
    rainCode: [
      8, 9, 10, 12, 13, 14, 17, 20, 22, 29, 31, 32, 33, 35, 36, 38, 39, 41,
    ],
    fogCode: [24, 25, 26, 27, 28],
    snowingCode: [23, 37, 42],
  };
  const dayOrNightIcon = isDay ? dayImage : nightImage;

  if (weatherCode.sunnyCode.find((e) => e === code) !== undefined) {
    return dayOrNightIcon.sunny;
  }
  if (weatherCode.cloudyCode.find((e) => e === code) !== undefined) {
    return dayOrNightIcon.cloudy;
  }
  if (weatherCode.afternoonTsCode.find((e) => e === code) !== undefined) {
    return dayOrNightIcon.afternoonTs;
  }
  if (weatherCode.rainCode.find((e) => e === code) !== undefined) {
    return dayOrNightIcon.rain;
  }
  if (weatherCode.fogCode.find((e) => e === code) !== undefined) {
    return dayOrNightIcon.fog;
  }
  if (weatherCode.snowingCode.find((e) => e === code) !== undefined) {
    return dayOrNightIcon.snowing;
  }
}


export default Dashboard;
export {handleWeatherIcon};
