import WeatherCard from './WeatherCard';

function Forecast({ forecast }) {
  return (
    <div className="forecast">
      <h2 style={{marginTop:"25px",marginBottom:"0px"}}>Prévisions </h2>
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
