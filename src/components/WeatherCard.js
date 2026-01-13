function WeatherCard({ day }) {
    const days=day.date.split("-")[2]+" / "+day.date.split("-")[1];
    // console.log("day :",day);
  return (
    <div className="weather-card">
      <div >
        <p style={{fontWeight:"bold",fontSize:"0.85rem",paddingBottom : "2px",borderBottom: '2px solid white'}}>{days}</p>
      </div> 
      
      <p>{day.day.mintemp_c}°C / {day.day.maxtemp_c}°C</p>
      {/* <p>{day.day.condition.text}</p> */}
      <p>☔ {day.day.daily_chance_of_rain} %</p>
      <p> {day.day.totalprecip_mm} mm</p>
      <img src={'https:' + day.day.condition.icon} alt={day.day.condition.text} />
    </div>
  );
}

export default WeatherCard;
