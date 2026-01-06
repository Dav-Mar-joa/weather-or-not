import { useState, useEffect } from 'react';
import CurrentWeather from './components/CurrentWeather';
import CurrentDay from './components/CurrentDay';
import Forecast from './components/Forecast';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  // const [city, setCity] = useState('Paris');
  const [city, setCity] = useState(
  () => localStorage.getItem('city') || null
);

  //   useEffect(() => {
  //   if (!navigator.geolocation) return;

  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       const { latitude, longitude } = position.coords;
  //       console.log("latitude :",latitude);
  //       console.log("longitude :",longitude);

  //       fetch(
  //         `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=fr`
  //       )
  //         .then(res => res.json())
  //         .then(data => {
  //           const detectedCity = data.city || data.locality;
  //           console.log("detectedCity :",detectedCity);
  //           if (detectedCity) {
  //             setCity(detectedCity);
  //             localStorage.setItem('city', detectedCity);
  //           }
              
  //         })
  //         .catch(() => setCity('Paris'));
  //     },
  //     () => setCity('Paris')
  //   );
  // }, []);

  useEffect(() => {
  if (city !== null) return; // 🛑 on a déjà une ville

  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=fr`
      )
        .then(res => res.json())
        .then(data => {
          const detectedCity = data.city || data.locality;
          if (detectedCity) {
            setCity(detectedCity);
            localStorage.setItem('city', detectedCity);
          }
        });
    }
  );
}, [city]);


  useEffect(() => {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=f9cc340e26b240188b2195245242805&q=${city}&days=7&aqi=no&alerts=no`)
      .then(res => res.json())
      .then(data => {
        setWeatherData(data); // on garde toute la data brute
      })
      
      .catch(err => console.error(err));
  }, [city]);

    const refreshWeather = () => {
    if (!city) return;

    fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=f9cc340e26b240188b2195245242805&q=${city}&days=7&aqi=no&alerts=no`
    )
      .then(res => res.json())
      .then(data => {
        setWeatherData(data);
      })
      .catch(err => console.error(err));
  };


  if (!weatherData) return <p>Chargement...</p>;

  return (
    <div>
      {/* Passe seulement les données actuelles au composant CurrentWeather */}

      <div className="bottom-head">
        <button onClick={refreshWeather}>🔄 Refresh</button>
        <button onClick={() => alert("Bouton 2 !")}>📍 Locate</button>

    </div>
      <CurrentWeather current={weatherData.current} location={weatherData.location} />

      <CurrentDay current={weatherData.current} location={weatherData.location} astro={weatherData.forecast.forecastday[0].astro}/>

      {/* Passe seulement les prévisions au composant Forecast */}
      <Forecast forecast={weatherData.forecast.forecastday} />
      <div className="bottom-buttons">
        <button onClick={() => alert("Bouton 1 !")}>All day</button>
        <button onClick={() => alert("Bouton 2 !")}>On 3 days</button>

    </div>
    </div>
  );
}

export default App;
