import styles from '../styles/weeklyForecast.module.css';
import WeatherIcon from './WeatherIcon';

function WeeklyForecast({forecast, isDay}) {
  return (
    <div className={styles.forecast}>
      {forecast.map(({ date, temperature, type }) => {
        return (
          <div className={styles.day} key={date}>
            <div className={styles.date}>{date || 0}</div>
            <div className={styles.fcTemp}>
              {temperature || 0} <span>&#8451;</span>
            </div>
            <div className={styles.weatherIcon}>
              <WeatherIcon weatherType={type} isDay={isDay}/>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default WeeklyForecast;
