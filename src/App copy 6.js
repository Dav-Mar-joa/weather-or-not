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
  const [country,setCountry]=useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const [city, setCity] = useState(
    () => localStorage.getItem('city')
  );

  const [citySuggestions, setCitySuggestions] = useState([]);

   const [quality, setQuality] = useState(
    () => localStorage.getItem('quality')
  );

  const [locationAllowed, setLocationAllowed] = useState(
    () => localStorage.getItem('locationAllowed')
  );

  const [view, setView] = useState('today'); // 'today' ou 'allDay'

  const [showCityInput, setShowCityInput] = useState(false); // affiche le champ
  const [manualCity, setManualCity] = useState(''); // ce que l'utilisateur tape

  const resetFrenchGeoData = () => {
  setPostalCode(null);
  setDepartement(null);
  localStorage.removeItem('postalCode');
  localStorage.removeItem('departement');
};

  // 📍 Demande de localisation (une seule fois)
  const askForLocation = () => {
    console.log("ask for location called");
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
            const country = data.countryCode;
           console.log ("data from bigdatacloud dans useEffect :",data)

            // console.log ("data from bigdatacloud dans ask :",data)

            // console.log("country :",country);

            const postal = data.postcode
              || data.localityInfo?.informative?.find(i => i.description === "postcode")?.name;

            const dept = data.localityInfo?.administrative?.find(a =>
              a.adminLevel === 6 || a.description?.includes("department")
            )?.name;
            // console.log("postal---3333--- :",postal)

            if (detectedCity) {
              setCity(detectedCity);
              localStorage.setItem('city', detectedCity);
            }

            // if (country) {
            //   setCountry(country);
            //   localStorage.setItem('country', country);
            // }

            if (postal) {
              setPostalCode(postal);
              localStorage.setItem('postalCode', postal);
            }

            if (dept) {
              setDepartement(dept);
              localStorage.setItem('departement', dept);
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

  const updatePostalDeptForCity = async (cityName) => {
  let postal = null;
  let dept = null;

  try {
    // 1️⃣ GeoData via bigdatacloud
    const resGeo = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?locality=${encodeURIComponent(cityName)}&localityLanguage=fr`
    );
    const geoData = await resGeo.json();

    postal = geoData.postcode
      || geoData.localityInfo?.informative?.find(i => i.description?.toLowerCase().includes("postcode") || i.description?.toLowerCase().includes("code postal"))?.name;

    dept = geoData.localityInfo?.administrative?.find(a => a.adminLevel === 6)?.name;

    // 2️⃣ Fallback si ville FR mais pas de postal
    if (!postal) {
      const vicopoRes = await fetch(`https://vicopo.selfbuild.fr/cherche/${encodeURIComponent(cityName)}`);
      const vicopoData = await vicopoRes.json();
      if (vicopoData.cities?.length > 0) postal = vicopoData.cities[0].code;
    }

    setPostalCode(postal);
    setDepartement(dept);
    if (postal) localStorage.setItem('postalCode', postal);
    if (dept) localStorage.setItem('departement', dept);

  } catch (err) {
    console.error("Erreur updatePostalDeptForCity :", err);
    setPostalCode(null);
    setDepartement(null);
    localStorage.removeItem('postalCode');
    localStorage.removeItem('departement');
  }
};


  // 🔁 Mise à jour auto de la ville au refresh si autorisé
  useEffect(() => {
    console.log("useEffect for locationAllowed called");
    if (locationAllowed !== 'true') return;
    const openWeatherApiKey = '2dec67f041a37a3333796cc816ca6b9e';

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // console.log("position",position)

        fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=fr`
        )
          .then(res => res.json())
          .then(data => {
           const detectedCity = data.city || data.locality;
           const country = data.countryCode;
          //  console.log("country : ",country)
          //  console.log("data from bigdatacloud :",data)

          const postal = data.postcode
            || data.localityInfo?.informative?.find(i => i.description === "code postal")?.name;


          const dept = data.localityInfo?.administrative?.find(a =>
            a.adminLevel === 6 || a.description?.includes("department")
          )?.name;
          // console.log("postal---2222--- :",postal)

          if (detectedCity) {
            setCity(detectedCity);
            localStorage.setItem('city', detectedCity);
          }

          // if (country) {
          //     setCountry(country);
          //     localStorage.setItem('country', country);
          //   }

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
//   useEffect(() => {
//     if (!city) return;

//     fetch(
//       `https://api.weatherapi.com/v1/forecast.json?key=f9cc340e26b240188b2195245242805&q=${city}&days=7&aqi=no&alerts=no`
//     )
//       .then(res => res.json())
//       // .then(data => setWeatherData(data))
//       .then(data => {
//   setWeatherData(data);

//   const countryName = data.location.country;
//   const countryCode = data.location.country_code;

//   setCountry(countryName);
//   localStorage.setItem('country', countryName);

//   // Nettoyage si hors France
//   if (countryCode !== 'FR') {
//     setPostalCode(null);
//     setDepartement(null);
//   }
// })

//       .catch(err => console.error(err));
//   }, [city]);

useEffect(() => {
  console.log("useEffect for city called");
  if (!city) return;

  fetch(
       `https://api.weatherapi.com/v1/forecast.json?key=f9cc340e26b240188b2195245242805&q=${city}&days=7&aqi=no&alerts=no`
     )
    .then(res => res.json())
    .then(data => {
      setWeatherData(data);

      const countryName = data.location.country;
      const countryCode = data.location.country_code;
    

      setCountry(countryName);
      localStorage.setItem('country', countryName);

      if (countryCode !== 'FR') {
        setPostalCode(null);
        setDepartement(null);
        localStorage.removeItem('postalCode');
        localStorage.removeItem('departement');
      }
    });
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
        // console.log("position 22-22", position);

        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=fr`)
          .then(res => res.json())
          .then(data => {
            const detectedCity = data.city || data.locality;
            // console.log("data from geolocation :",data )
             
            const country = data.countryCode;
            // console.log("country :",country);
            const postal = data.postcode
              || data.localityInfo?.informative?.find(i => i.description === "postcode")?.name;

            const dept = data.localityInfo?.administrative?.find(a =>
              a.adminLevel === 6 || a.description?.includes("department")
            )?.name;
            // console.log("postal---2222--- :",postal)

            if (detectedCity) {
              setCity(detectedCity);
              localStorage.setItem('city', detectedCity);
            }

            if (country) {
              setCountry(country);
              localStorage.setItem('country', country);
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
    <div className="top-bar">
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
    </div>
    
  
  {showCityInput && (
  <div className="city-input-container">
    <input
      type="text"
      placeholder="Entrez une ville"
      value={manualCity}
      onChange={async (e) => {
        setManualCity(e.target.value);
        if (!e.target.value.trim()) {
          setCitySuggestions([]);
          return;
        }

        try {
          // 🔹 Recherche toutes les villes correspondantes
          const res = await fetch(
            `https://api.weatherapi.com/v1/search.json?key=f9cc340e26b240188b2195245242805&q=${encodeURIComponent(e.target.value.trim())}`
          );
          const results = await res.json();
          // console.log("City search results 2 :",results);
          // console.log('country dans 2 :', results[0].country);
          setCitySuggestions(results || []);
        } catch (err) {
          console.error(err);
          setCitySuggestions([]);
        }
      }}  
      
    />
    {citySuggestions.length > 0 && (
  <div className="city-suggestions">
    {citySuggestions.map((c, idx) => (
      <div
        key={idx}
        className="city-suggestion"
        onClick={() => {
          setManualCity(c.name);
          setCity(c.name);
          localStorage.setItem('city', c.name);
          setLocationAllowed('false');
          setShowCityInput(false);
          setCitySuggestions([]);
        }}
      >
        {c.name} ({c.region}) – {c.country}
      </div>
    ))}
  </div>
)}


    {/* <button
      onClick={() => {
        if (!manualCity.trim()) return;
        setCity(manualCity.trim());
        localStorage.setItem('city', manualCity.trim());
        setLocationAllowed('false'); // désactive géoloc
        setShowCityInput(false);
      }}
    >
      OK   </button> */}

      {/* <button
      onClick={async () => {
        if (!manualCity.trim()) return;

        const cityName = manualCity.trim();
        setCity(cityName);
        localStorage.setItem('city', cityName);
        setLocationAllowed('false'); // désactive géoloc
        setShowCityInput(false);

        try {
          // 🔹 1️⃣ Récupère latitude/longitude depuis WeatherAPI
          const resWeather = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=f9cc340e26b240188b2195245242805&q=${encodeURIComponent(cityName)}`
          );
          const weatherData = await resWeather.json();
          const { lat, lon } = weatherData.location;

          // 🔹 2️⃣ Reverse geocode pour code postal et département
          const resGeo = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=fr`
          );
          const geoData = await resGeo.json();

          const postal = geoData.postcode
            || geoData.localityInfo?.informative?.find(i =>
                i.description?.toLowerCase().includes("postcode") ||
                i.description?.toLowerCase().includes("code postal")
              )?.name;

          const dept = geoData.localityInfo?.administrative?.find(a => a.adminLevel === 6)?.name;

          if (postal) {
            setPostalCode(postal);
            localStorage.setItem('postalCode', postal);
          }

          if (dept) {
            setDepartement(dept);
            localStorage.setItem('departement', dept);
          }

          console.log("Ville manuelle :", cityName, "Postal :", postal, "Dept :", dept);

        } catch (err) {
          console.error("Erreur récupération code postal/département :", err);
        }
      }}
    >
      OK
    </button> */}
    <button
  onClick={async () => {
    if (!manualCity.trim()) return;

    let cityName = manualCity.trim();
    const isPostalCode = /^\d{5}$/.test(cityName);
    // console.log("isPostalCode :", isPostalCode);
    // console.log('cityName : ',cityName)

    if (isPostalCode) {
  try {
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${cityName}&country=FR&format=json`);
const geoData = await geoRes.json();
// console.log("geoData from postal code lookup :",geoData);
    // console.log("geoRes : ",geoData[0]?.display_name.split(',')[2].trim());
    cityName = geoData[0]?.display_name.split(',')[2].trim(); // Extrait la ville du résultat
    // console.log("cityName after lookup :", cityName);
  } catch (err) {
    console.error("Erreur lookup code postal :", err);
  }
}

    // 🔹 Update city
    setCity(cityName);
    localStorage.setItem('city', cityName);
    setLocationAllowed('false'); 
    setShowCityInput(false);

    // 🔹 Fetch météo
    try {
      const resWeather = await fetch(`https://api.weatherapi.com/v1/current.json?key=f9cc340e26b240188b2195245242805&q=${encodeURIComponent(cityName)}`);
      const weatherData = await resWeather.json();
      const { lat, lon } = weatherData.location;
      // console.log("wheater data  ---*****----- :",weatherData);

      // 🔹 Reverse geocode pour code postal & dept
      const resGeo = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=fr`);
      const geoData = await resGeo.json();
      console.log("geoData from reverse geocode :",geoData);

      let postal = geoData.postcode
        || geoData.localityInfo?.informative?.find(i =>
            i.description?.toLowerCase().includes("postcode") ||
            i.description?.toLowerCase().includes("code postal")
          )?.name;

      if (!postal) {
      // fallback vers Vicopo pour la France
      const vicopoRes = await fetch(`https://vicopo.selfbuild.fr/cherche/${encodeURIComponent(cityName)}`);
      const vicopoData = await vicopoRes.json();
      if (vicopoData.cities && vicopoData.cities.length > 0) {
        postal = vicopoData.cities[0].code;
      }
    }    

      const dept = geoData.localityInfo?.administrative?.find(a => a.adminLevel === 6)?.name;
      const country = weatherData.location.country

      
      // console.log("country 514 : ",country)
      // console.log("department 515 :",dept)
      if (postal) setPostalCode(postal);
      if (dept) setDepartement(dept);
      if (country) setCountry(country);

    } catch (err) {
      console.error("Erreur récupération météo/code postal :", err);
    }
  }}
>
  OK
</button>


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
          country={country}
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
