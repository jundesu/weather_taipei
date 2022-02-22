import Image from 'next/image';
import {handleWeatherIcon} from './Dashboard';

function WeatherIcon(props) {
  return (
    <Image
        alt="weatherIcon"
        src={handleWeatherIcon(
          props.dayOrNight,
          Number(props.weatherType || 0)
        )}
    />
  );
}

export default WeatherIcon;
