import { useState, useEffect, use } from 'react';
import CurrentWeather from './components/CurrentWeather';
import CurrentDay from './components/CurrentDay';
import Forecast from './components/Forecast';
import AllDayView from './components/AllDayView';
// import AllDayViewPlus1 from './components/backUp/AllDayViewPlus1';
// import AllDayViewPlus2 from './components/backUp/AllDayViewPlus2';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [postalCode, setPostalCode] = useState(null);
  const [departement, setDepartement] = useState(null);

  const [city, setCity] = useState(
    () => localStorage.getItem('city')
  );

   const [quality, setQuality] = useState(
    () => localStorage.getItem('quality')
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
    const openWeatherApiKey = '2dec67f041a37a3333796cc816ca6b9e';

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("position",position)

        fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=fr`
        )
          .then(res => res.json())
          .then(data => {
            const detectedCity = data.city || data.locality;

            const postal = data.postcode
              || data.localityInfo?.informative?.find(i => i.description === "postcode")?.name;

            const dept = data.localityInfo?.administrative?.find(a =>
              a.adminLevel === 6 || a.description?.includes("department")
            )?.name;

            if (detectedCity) {
              setCity(detectedCity);
              localStorage.setItem('city', detectedCity);
            }

            if (postal) {
              setPostalCode(postal);
              localStorage.setItem('postalCode', postal);
            }

            if (dept) {
              setDepartement(dept);
              localStorage.setItem('departement', dept);
            }
          });

            
        fetch(`https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${latitude}&lon=${longitude}&appid=${openWeatherApiKey}&units=metric&lang=fr`)
        .then(res => res.json())
        .then(data => {
          setQuality(data);
          // console.log("data air quality :",data);
          localStorage.setItem('quality', JSON.stringify(data));
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
  // const refreshWeather = () => {
  //   if (!city) return;

  //   if (locationAllowed === 'true') {
  //     askForLocation(); // remet à jour la ville si on a bougé
  //   } else {
  //     fetch(
  //       `https://api.weatherapi.com/v1/forecast.json?key=f9cc340e26b240188b2195245242805&q=${city}&days=7&aqi=no&alerts=no`
  //     )
  //       .then(res => res.json())
  //       .then(data => setWeatherData(data));
        
  //   }
  //   console.log("data refresh !") ;
  // };

  const refreshWeather = () => {
  if (!city) return;
  setLoading(true);

  // Si la géoloc est activée, on récupère la ville actuelle
  if (locationAllowed === 'true') {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=fr`)
          .then(res => res.json())
          .then(data => {
            const detectedCity = data.city || data.locality;

  const postal = data.postcode
    || data.localityInfo?.informative?.find(i => i.description === "postcode")?.name;

  const dept = data.localityInfo?.administrative?.find(a =>
    a.adminLevel === 6 || a.description?.includes("department")
  )?.name;

  if (detectedCity) {
    setCity(detectedCity);
    localStorage.setItem('city', detectedCity);
  }

  if (postal) {
    setPostalCode(postal);
    localStorage.setItem('postalCode', postal);
  }

  if (dept) {
    setDepartement(dept);
    localStorage.setItem('departement', dept);
  }

            // ⚡ On fetch la météo **immédiatement** pour la ville détectée
            fetch(`https://api.weatherapi.com/v1/forecast.json?key=f9cc340e26b240188b2195245242805&q=${detectedCity}&days=7&aqi=no&alerts=no`)
              .then(res => res.json())
              .then(data => setWeatherData(data))
              .catch(err => console.error(err));

            // ⚡ On fetch la qualité de l'air
            const openWeatherApiKey = '2dec67f041a37a3333796cc816ca6b9e';
            fetch(`https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${latitude}&lon=${longitude}&appid=${openWeatherApiKey}&units=metric&lang=fr`)
              .then(res => res.json())
              .then(data => {
                setQuality(data);
                localStorage.setItem('quality', JSON.stringify(data));
                
              });
              
          });
          setLoading(false);
      },
      (err) => {
        console.error(err);
        // fallback : fetch météo pour la ville actuelle
        fetch(`https://api.weatherapi.com/v1/forecast.json?key=f9cc340e26b240188b2195245242805&q=${city}&days=7&aqi=no&alerts=no`)
          .then(res => res.json())
          .then(data => setWeatherData(data))
          
          .catch(err => console.error(err));
      }
    );
  } else {
    // Si pas de géoloc : fetch météo pour la ville actuelle
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=f9cc340e26b240188b2195245242805&q=${city}&days=7&aqi=no&alerts=no`)
      .then(res => res.json())
      .then(data => setWeatherData(data))
      .catch(err => console.error(err));
  }

  console.log("data refresh !");
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
    <div className="bottom-head" style={view === 'allDay' || view === 'allDayPlus1' || view === 'allDayPlus2'? { marginTop: '2rem' } : { marginTop: '0' }}>
      
      <button onClick={refreshWeather} disabled={loading}>
  {loading ? ' ⏳ Refreshing' : '🔄 Refresh !'}</button>
      <button onClick={askForLocation}>📍 </button>
      <button onClick={() => {
        setManualCity(''); 
        setShowCityInput(prev=>!prev);}
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
      onClick={async() => {
        if (!manualCity.trim()) return;

    const cityName = manualCity.trim();
    setCity(cityName);
    localStorage.setItem('city', cityName);
    setLocationAllowed('false');
    setShowCityInput(false);

    try {
      // 🔎 fetch infos depuis BigDataCloud avec le nom de la ville
      const res = await fetch(`https://api.bigdatacloud.net/data/geocode-client?city=${encodeURIComponent(cityName)}&localityLanguage=fr`);
      const data = await res.json();

      const postal = data.postcode
        || data.localityInfo?.informative?.find(i => i.description === "postcode")?.name;

      const dept = data.localityInfo?.administrative?.find(a =>
        a.adminLevel === 6 || a.description?.includes("department")
      )?.name;

      if (postal) {
        setPostalCode(postal);
        localStorage.setItem('postalCode', postal);
      } else {
        setPostalCode(null);
        localStorage.removeItem('postalCode');
      }

      if (dept) {
        setDepartement(dept);
        localStorage.setItem('departement', dept);
      } else {
        setDepartement(null);
        localStorage.removeItem('departement');
      }

    } catch (err) {
      console.error("Erreur fetch ville manuelle :", err);
      setPostalCode(null);
      setDepartement(null);
    }
      }}
    >
      OK   </button>
  </div>
)}

    {/* 🛑 RENDER CONDITIONNEL SELON LA VUE */}
    {view === 'today' && (
      <>
        <CurrentWeather
          current={weatherData.current}
          location={weatherData.location}
          departement={departement}
          postalCode={postalCode}
          quality={quality}
        />

        <CurrentDay
          current={weatherData.current}
          location={weatherData.location}
          astro={weatherData.forecast.forecastday[0].astro}
        />

        <Forecast forecast={weatherData.forecast.forecastday} />

        {/* 🔘 Boutons pour switch de vue */}
        <div className="bottom-buttons">

          <button onClick={() => setView('allDay')}>Today</button>
 
          <button onClick={() => setView('allDayPlus1')}>Day + 1</button>
          <button onClick={() => setView('allDayPlus2')}>Day +  2</button>
          {/* <button onClick={() => setView('3Day')}>3 Days</button> */}
        </div>
      </>
    )}

{view === 'allDay' && (
  <>
    <AllDayView hours={weatherData.forecast.forecastday[0].hour} date={weatherData.forecast.forecastday[0].date} 
    dayOffset={0}/>

    <div className="bottom-buttons">
      <button onClick={() => setView('today')}>Resume</button>
      <button onClick={() => setView('allDayPlus1')}>Day + 1</button>
      <button onClick={() => setView('allDayPlus2')}>Day + 2</button>
    </div>
  </>
)}

{view === 'allDayPlus1' && (
  <>
    <AllDayView hours={weatherData.forecast.forecastday[1].hour}
    date={weatherData.forecast.forecastday[1].date} 
    dayOffset={1}
    />

    <div className="bottom-buttons">
      <button onClick={() => setView('today')}>Resume</button>
      <button onClick={() => setView('allDay')}>Day</button>
      <button onClick={() => setView('allDayPlus2')}>Day + 2</button>
    </div>
  </>
)}{view === 'allDayPlus2' && (
  <>
    <AllDayView hours={weatherData.forecast.forecastday[2].hour} 
    date={weatherData.forecast.forecastday[2].date}
    dayOffset={2}/>

    <div className="bottom-buttons">
      <button onClick={() => setView('today')}>Resume</button>
      <button onClick={() => setView('allDay')}>Day</button>
      <button onClick={() => setView('allDayPlus1')}>Day + 1</button>
    </div>
  </>
)}
 


  </div>
);


}



export default App;
