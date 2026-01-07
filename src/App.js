import { useState, useEffect } from 'react';
import CurrentWeather from './components/CurrentWeather';
import CurrentDay from './components/CurrentDay';
import Forecast from './components/Forecast';
import AllDayView from './components/AllDayView';

function App() {
  const [weatherData, setWeatherData] = useState(null);

  const [city, setCity] = useState(
    () => localStorage.getItem('city')
  );

  const [locationAllowed, setLocationAllowed] = useState(
    () => localStorage.getItem('locationAllowed')
  );

  const [view, setView] = useState('today'); // 'today' ou 'allDay'

  const [showCityInput, setShowCityInput] = useState(false); // affiche le champ
  const [manualCity, setManualCity] = useState(''); // ce que l'utilisateur tape

  // 📍 Demande de localisation (une seule fois)
  const askForLocation = () => {
    if (!navigator.geolocation) {
      setCity('Paris');
      setLocationAllowed('false');
      localStorage.setItem('locationAllowed', 'false');
      return;
    }

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

        setLocationAllowed('true');
        localStorage.setItem('locationAllowed', 'true');
      },
      () => {
        setCity('Paris');
        setLocationAllowed('false');
        localStorage.setItem('locationAllowed', 'false');
      }
    );
  };

  // 🔁 Mise à jour auto de la ville au refresh si autorisé
  useEffect(() => {
    if (locationAllowed !== 'true') return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=fr`
        )
          .then(res => res.json())
          .then(data => {
            const detectedCity = data.city || data.locality;
            if (detectedCity && detectedCity !== city) {
              setCity(detectedCity);
              localStorage.setItem('city', detectedCity);
            }
          });
      }
    );
    console.log("location validated !") ;
  }, []);

  // 🌦️ Récupération météo
  useEffect(() => {
    if (!city) return;

    fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=f9cc340e26b240188b2195245242805&q=${city}&days=7&aqi=no&alerts=no`
    )
      .then(res => res.json())
      .then(data => setWeatherData(data))
      .catch(err => console.error(err));
  }, [city]);

  // 🔄 Bouton refresh
  const refreshWeather = () => {
    if (!city) return;

    if (locationAllowed === 'true') {
      askForLocation(); // remet à jour la ville si on a bougé
    } else {
      fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=f9cc340e26b240188b2195245242805&q=${city}&days=7&aqi=no&alerts=no`
      )
        .then(res => res.json())
        .then(data => setWeatherData(data));
        
    }
    console.log("data refresh !") ;
  };

  // 🛑 Écran d’autorisation AVANT l’app
  if (locationAllowed === null) {
    return (
      <div className="permission-screen">
        <h2>📍 Weather Or Not</h2>
        <p>
          Autoriser la localisation pour afficher automatiquement
          la météo là où vous êtes.
        </p>

        <button onClick={askForLocation}>
          Autoriser la localisation
        </button>

        <button
          onClick={() => {
            setCity('Paris');
            setLocationAllowed('false');
            localStorage.setItem('locationAllowed', 'false');
          }}
        >
          Continuer sans localisation
        </button>
      </div>
    );
  }

  if (!weatherData) return <p>Chargement...</p>;

  // return (
  //   <div>
  //     <div className="bottom-head">
  //       <button onClick={refreshWeather}>🔄 Refresh</button>
  //       <button onClick={askForLocation}>📍 Locate</button>
  //     </div>

  //     <CurrentWeather
  //       current={weatherData.current}
  //       location={weatherData.location}
  //     />

  //     <CurrentDay
  //       current={weatherData.current}
  //       location={weatherData.location}
  //       astro={weatherData.forecast.forecastday[0].astro}
  //     />

  //     <Forecast forecast={weatherData.forecast.forecastday} />

  //     <div className="bottom-buttons">
  //       <button onClick={() => setView('today')}>Today</button>
  //       <button onClick={() => setView('allDay')}>All day</button>
  //     </div>
  //   </div>
  // );

return (
  <div>
    {/* 🟢 Boutons pour refresh et localisation */}
    <div className="bottom-head">
      <button onClick={refreshWeather}>🔄 Refresh</button>
      <button onClick={askForLocation}>📍 </button>
      <button onClick={() => {
        setManualCity(''); 
        setShowCityInput(true);}
        }>✏️ Where ?</button>
    </div>

    {/* {showCityInput && (
  <div style={{ marginTop: '10px' }}>
    <input
      type="text"
      placeholder="Entrez une ville"
      value={manualCity}
      onChange={(e) => setManualCity(e.target.value)}
      style={{ padding: '4px', marginRight: '4px' }}
    />
    <button
      onClick={() => {
        if (!manualCity.trim()) return;
        setCity(manualCity.trim());
        localStorage.setItem('city', manualCity.trim());
        setLocationAllowed('false'); // pas de géoloc
        setShowCityInput(false); // cache le champ après validation
      }}
    >
      Valider
    </button>
  </div>
)} */}

  {showCityInput && (
  <div className="city-input-container">
    <input
      type="text"
      placeholder="Entrez une ville"
      value={manualCity}
      onChange={(e) => setManualCity(e.target.value)}
    />
    <button
      onClick={() => {
        if (!manualCity.trim()) return;
        setCity(manualCity.trim());
        localStorage.setItem('city', manualCity.trim());
        setLocationAllowed('false'); // désactive géoloc
        setShowCityInput(false);
      }}
    >
       ✅   </button>
  </div>
)}



    

    {/* 🛑 RENDER CONDITIONNEL SELON LA VUE */}
    {view === 'today' && (
      <>
        <CurrentWeather
          current={weatherData.current}
          location={weatherData.location}
        />

        <CurrentDay
          current={weatherData.current}
          location={weatherData.location}
          astro={weatherData.forecast.forecastday[0].astro}
        />

        <Forecast forecast={weatherData.forecast.forecastday} />

        {/* 🔘 Boutons pour switch de vue */}
        <div className="bottom-buttons">

          <button onClick={() => setView('allDay')}>All day</button>
          {/* <button onClick={() => setView('3Day')}>3 Days</button> */}
        </div>
      </>
    )}

    {view === 'allDay' && (
      <>
        {/* Vue journée complète */}
        <AllDayView hours={weatherData.forecast.forecastday[0].hour} />

        {/* 🔘 Boutons pour revenir à la vue Today */}
        <div className="bottom-buttons">
          <button onClick={() => setView('today')}>Today</button>
          {/* <button onClick={() => setView('3Day')}>3 Days</button> */}
        </div>
      </>
    )}
  </div>
);


}



export default App;
