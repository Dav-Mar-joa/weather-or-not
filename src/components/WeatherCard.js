function WeatherCard({ day }) {
    const days=day.date.split("-")[2]+" / "+day.date.split("-")[1];
    // console.log("day :",day);
  return (
    <div className="weather-card">
        
      <p>{days}</p>
      <p>{day.day.mintemp_c}°C / {day.day.maxtemp_c}°C</p>
      {/* <p>{day.day.condition.text}</p> */}
      <p>☔ {day.day.daily_chance_of_rain} %</p>
      <p> {day.day.totalprecip_mm} mm</p>
      <img src={'https:' + day.day.condition.icon} alt={day.day.condition.text} />
    </div>
  );
}

export default WeatherCard;
