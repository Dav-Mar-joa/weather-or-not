function WeatherCard({ day }) {
    const days=day.date.split("-")[2]+" / "+day.date.split("-")[1];
    console.log("day :",day);
    console.log("day :",day.hour);
    let tempFeelMin=day.hour[0].feelslike_c;
    let tempFeelMax=day.hour[0].feelslike_c;
    for (let i = 0; i < day.hour.length; i++) {
        if (day.hour[i].feelslike_c < tempFeelMin) {
            tempFeelMin = day.hour[i].feelslike_c;
        }
        if (day.hour[i].feelslike_c > tempFeelMax) {
            tempFeelMax = day.hour[i].feelslike_c;
        }
    }
  return (
    <div className="weather-card">
      <div >
        <p style={{fontWeight:"bold",fontSize:"0.85rem",paddingBottom : "2px",borderBottom: '2px solid white'}}>{days}</p>
      </div> 
      
      {/* <p>{day.day.mintemp_c}°C / {day.day.maxtemp_c}°C</p>
      <p>Feels like: {tempFeelMin}°C / {tempFeelMax}°C</p> */}
      {/* <p>{day.day.mintemp_c}°C (🌬️{tempFeelMin}°C)</p>
      <p>{day.day.maxtemp_c}°C (🌬️{tempFeelMax}°C)</p> */}
      <p>{day.day.mintemp_c}°C / {day.day.maxtemp_c}°C</p>
      <p style ={{fontSize : "0.65rem",background: 'lightgray', padding: '2px',color: 'black',border: '1px solid #ccc',borderRadius: '8px'}}>💨 {tempFeelMin}°C / {tempFeelMax}°C</p>
      {/* <p>{day.day.condition.text}</p> */}
      <p>☔ {day.day.daily_chance_of_rain} %</p>
      <p> {day.day.totalprecip_mm} mm</p>
      <img src={'https:' + day.day.condition.icon} alt={day.day.condition.text} />
    </div>
  );
}

export default WeatherCard;
