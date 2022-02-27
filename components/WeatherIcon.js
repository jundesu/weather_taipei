import Image from 'next/image';
import {handleWeatherIcon} from './Dashboard';

function WeatherIcon({weatherType, isDay}) {
  return (
    <Image
        alt="weatherIcon"
        src={handleWeatherIcon(
          isDay,
          Number(weatherType || 0)
        )}
    />
  );
}

export default WeatherIcon;
