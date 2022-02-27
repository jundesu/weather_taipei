import Image from 'next/image';
import styles from '../styles/nowcasting.module.css';

import windSpeed from '../public/img/weather_wind.png';
import humidity from '../public/img/weather_humidity.png';

function Nowcasting({observation, weatherDescription}) {
  return (
    <div className={styles.weatherInfo}>
      <div className={styles.location}>{observation.location || ''}</div>
      <div className={styles.temperature}>
        <span className={styles.currentTemp}>{Math.round(observation.temperature || 0)}</span>
        <span className={styles.celsius}>&#8451;</span>
      </div>
      <div className={styles.description}>{weatherDescription || ''}</div>
      <div className={styles.windSpeed}>
        <Image src={windSpeed} width={30} height={30} />
        <span>{observation.windSpeed + 'm/s'}</span>
      </div>
      <div className={styles.humidity}>
        <Image src={humidity} width={30} height={30} />
        <span>{Math.round((observation.humidity || 0) * 100) + '%'}</span>
      </div>
    </div>
  );
}

export default Nowcasting;
