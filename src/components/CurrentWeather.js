function CurrentWeather({ current, location }) {
  if (!current) return null;

  return (
    <div className="current-weather">
      <h2>Météo à {location.name}</h2>
      <p>{current.temp_c}°C</p>
      <p>{current.condition.text}</p>
      <p>Vent : {current.wind_kph} km/h</p>
      <p>Humidité : {current.humidity}%</p>
      {current.condition.icon && <img src={'https:' + current.condition.icon} alt={current.condition.text} />}
    </div>
  );
}

export default CurrentWeather;
