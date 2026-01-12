import WeatherCard from './WeatherCard';


function Forecast({ forecast }) {
// console.log("Forecast component loaded");
// console.log("--------------------------");
// console.log(forecast);
// console.log("--------------------------");
  return (
    <div className="forecast">
      <h2 style={{marginTop:"16px",marginBottom:"0px",fontSize:"1.1rem"}}>Weather forecast </h2>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px'
        }}>
        {forecast.map((day, index) => (
          <WeatherCard key={index} day={day} />
        ))}
      </div>
    </div>
  );
}

export default Forecast;
