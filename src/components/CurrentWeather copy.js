import './CurrentWeather.css';
// function CurrentWeather({ current, location, quality }) {
//   if (!current) return null;

//   const date = current.last_updated.split(" ")[[0]];
//   const hour =current.last_updated.split(" ")[[1]];
//   console.log("data : ",current);

//   return (
//     <div className="current-weather">
//       <h2> {hour} - {location.name} ({location.country})</h2>

//       <p>🌡{current.temp_c}°C</p>
//       <p>Feels like : {current.feelslike_c}°C</p>
      
//       <p>Wind : {current.wind_kph} km/h</p>
//       <p>Humidity : {current.humidity}%</p>
//       <p>UV : {current.uv} / 12 - Quality air : {quality && quality.list && quality.list[0]?.main?.aqi} / 5</p>

//       <div className='condition'>
//         <p>{current.condition.text}</p> {current.condition.icon && <img src={'https:' + current.condition.icon} alt={current.condition.text} />}  
//       </div>
      
      
//       <p>Update : {current.last_updated}</p>
//     </div>
//   );
// }

function CurrentWeather({ current, location, quality, departement, postalCode, country }) {
  if (!current) return null;

  const date = current.last_updated.split(" ")[0];
  const hour = current.last_updated.split(" ")[1];

  // 🟢 Récupération de l'indice AQI
  const aqi = quality && quality.list && quality.list[0]?.main?.aqi;

  // console.log("AQI value :", aqi);
  const aqiOverFive = parseFloat (5 -aqi); // Inverser l'échelle pour correspondre à 5 (meilleur) à 1 (pire)

  // 🔴 Définir la couleur et le label
  let aqiColor, aqiLabel;
  switch(aqiOverFive) {
    case 4:
    case 5:
      aqiColor = "green";
      // aqiLabel = "Good";
      break;
    case 3:
      aqiColor = "orange";
      // aqiLabel = "Moderate";
      break;
    case 1:
    case 2:
      aqiColor = "red";
      // aqiLabel = "Poor";
      break;
    default:
      aqiColor = "gray";
      // aqiLabel = "-";
  }

  return (
    <div className="current-weather">
      <h2>  {location.name} {postalCode ? `( ${postalCode} )` : ''}</h2>
      {/* <h4>Dept : {departement} ({country})</h4> */}
      <h4>
        {departement 
          ? ` ${departement} (${country})`
          : ` ${country}`}
      </h4>
      <p>🌡 Temp : {current.temp_c}°C </p>
      <p>Feels like : {current.feelslike_c}°C - Humidity : {current.humidity}%</p>
      <p>Wind : {current.wind_kph} km/h</p>
      
      {/* <p>UV : {current.uv} / 12</p> */}

      {/* AQI avec badge coloré */}
      <p> UV : {current.uv} / 12 - 
        Quality air :{" "}
       
        <span style={{ 
          display: 'inline-block', 
          width: '16px', 
          height: '16px', 
          borderRadius: '50%', 
          backgroundColor: aqiColor, 
          marginRight: '6px',
          marginLeft: '6px',
          verticalAlign: 'middle',
          marginBottom: '1px'
        }}></span>
         ( {aqiOverFive} / 5 {aqiLabel})
        
      </p>

      <div className='condition'>
        <p>{current.condition.text}</p> 
        {current.condition.icon && <img src={'https:' + current.condition.icon} alt={current.condition.text} />}  
      </div>

      <p>Update : {current.last_updated}</p>
    </div>
  );
}


export default CurrentWeather;
