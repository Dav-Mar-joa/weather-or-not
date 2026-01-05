function WeatherCard({ day }) {
  return (
    <div className="weather-card">
      <p>{day.date}</p>
      <p>{day.day.mintemp_c}°C / {day.day.maxtemp_c}°C</p>
      {/* <p>{day.day.condition.text}</p> */}
      <img src={'https:' + day.day.condition.icon} alt={day.day.condition.text} />
    </div>
  );
}

export default WeatherCard;
