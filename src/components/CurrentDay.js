import './CurrentWeather.css';
import sunriseImg from './assets/icon/sunrise.PNG';
import sunsetImg from './assets/icon/sunset.PNG'

function CurrentWeather({ current, location ,astro}) {
  if (!current) return null;

  const date = current.last_updated.split(" ")[[0]];
  const hour =current.last_updated.split(" ")[[1]];
  // console.log("data : ",current);

  return (
    <div className="current-weather-infos" style={{ background: 'transparent' }}>
      <div className = "condition-infos" style={{ background: 'transparent' }}>
        <p> Sunrise 🌅 </p>  
        <p>Sunset 🌇</p >
        {/* <img src={sunriseImg} alt="sunrise" />
        <img src={sunsetImg} alt="sunset" /> */}
      </div>
      <div className = "condition-infos">
        <p>{astro.sunrise} </p>  
        <p>{astro.sunset}</p>  
      </div>

    </div>
  );
}

export default CurrentWeather;
