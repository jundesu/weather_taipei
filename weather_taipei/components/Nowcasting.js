import Image from 'next/image';
import styles from '../styles/nowcasting.module.css';

import windSpeed from '../public/img/weather_wind.png';
import humidity from '../public/img/weather_humidity.png';

function Nowcasting(props) {
  return (
    <div className={styles.weatherInfo}>
      <div className={styles.location}>{props.observation.location || ''}</div>
      <div className={styles.temperature}>
        <span className={styles.currentTemp}>{Math.round(props.observation.temperature || 0)}</span>
        <span className={styles.celsius}>&#8451;</span>
      </div>
      <div className={styles.description}>{props.weatherDescription || ''}</div>
      <div className={styles.windSpeed}>
        <Image src={windSpeed} width={30} height={30} />
        <span>{props.observation.windSpeed + 'm/s'}</span>
      </div>
      <div className={styles.humidity}>
        <Image src={humidity} width={30} height={30} />
        <span>{Math.round((props.observation.humidity || 0) * 100) + '%'}</span>
      </div>
    </div>
  );
}

export default Nowcasting;
