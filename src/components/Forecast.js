import WeatherCard from './WeatherCard';

function Forecast({ forecast }) {
  return (
    <div className="forecast">
      <h2>Prévisions</h2>
      <div style={{ display: 'flex', gap: '10px' }}>
        {forecast.map((day, index) => (
          <WeatherCard key={index} day={day} />
        ))}
      </div>
    </div>
  );
}

export default Forecast;
