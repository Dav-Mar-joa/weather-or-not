import './CurrentWeather.css';
function CurrentWeather({ current, location }) {
  if (!current) return null;

  const date = current.last_updated.split(" ")[[0]];
  const hour =current.last_updated.split(" ")[[1]];
  console.log("data : ",current);

  return (
    <div className="current-weather">
      <h2>{location.name} ({location.country})</h2>

      <p>🌡{current.temp_c}°C</p>
      <p>Feels like : {current.feelslike_c}°C</p>
      
      <p>Wind : {current.wind_kph} km/h</p>
      <p>Humidity : {current.humidity}%</p>
      <p> uv : {current.uv} / 12</p>
      <div className='condition'>
        <p>{current.condition.text}</p> {current.condition.icon && <img src={'https:' + current.condition.icon} alt={current.condition.text} />}  
      </div>
      
      
      <p>Update : {current.last_updated}</p>
    </div>
  );
}

export default CurrentWeather;
