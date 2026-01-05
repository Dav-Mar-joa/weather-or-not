import { useState, useEffect } from 'react';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const city = 'Paris';

  useEffect(() => {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=f9cc340e26b240188b2195245242805&q=${city}&days=7&aqi=no&alerts=no`)
      .then(res => res.json())
      .then(data => {
        setWeatherData(data); // on garde toute la data brute
        console.log("data : ",data)
      })
      
      .catch(err => console.error(err));
  }, []);

  if (!weatherData) return <p>Chargement...</p>;

  return (
    <div>
      {/* Passe seulement les données actuelles au composant CurrentWeather */}
      <CurrentWeather current={weatherData.current} location={weatherData.location} />

      {/* Passe seulement les prévisions au composant Forecast */}
      <Forecast forecast={weatherData.forecast.forecastday} />
    </div>
  );
}

export default App;
