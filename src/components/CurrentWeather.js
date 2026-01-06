import './CurrentWeather.css';
function CurrentWeather({ current, location }) {
  if (!current) return null;

  const date = current.last_updated.split(" ")[[0]];
  const hour =current.last_updated.split(" ")[[1]];

  return (
    <div className="current-weather">
      <h2>{location.name} ({location.country})</h2>
      <p className="datetime">
        <span>{hour}</span>
        {/* <span>{date}</span> */}
      </p>
      <p>🌡{current.temp_c}°C</p>
      <p>Feels like : {current.feelslike_c}°C</p>
      <p>{current.condition.text}</p>
      <p>Wind : {current.wind_kph} km/h</p>
      <p>Humidity : {current.humidity}%</p>
      {current.condition.icon && <img src={'https:' + current.condition.icon} alt={current.condition.text} />}
      <p>Update : {current.last_updated}</p>
    </div>
  );
}

export default CurrentWeather;
