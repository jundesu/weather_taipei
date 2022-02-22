import styles from '../styles/weeklyForecast.module.css';
import WeatherIcon from './WeatherIcon';

function WeeklyForecast(props) {
  return (
    <div className={styles.forecast}>
      {props.forecast.map(({ date, temp, type }) => {
        return (
          <div className={styles.day} key={date}>
            <div className={styles.date}>{date || 0}</div>
            <div className={styles.fcTemp}>
              {temp || 0} <span>&#8451;</span>
            </div>
            <div className={styles.weatherIcon}>
              <WeatherIcon weatherType={type} dayOrNight={props.dayOrNight}/>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default WeeklyForecast;
