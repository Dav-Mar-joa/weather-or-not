import React from 'react';
  function AllDayView({ hours,date,dayOffset,location }) {

    const formatDay = (offset = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);

    return d.toLocaleDateString('en-EN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });
    };  
  const getDayLabel = (offset) => {
    if (offset === 0) return "Today";
    if (offset === 1) return "Tomorrow";
    if (offset === 2) return "After tomorrow";
    return formatDay(offset);
    };  
  // 📊 calculs pour le graph
  const [showTable, setShowTable] = React.useState(false);
  const realTempsMax = Math.max(...hours.map(h => h.temp_c));
//   const tempsMax = realTempsMax + 2; // +2°C pour lisibilité
  const realTempsMin = Math.min(...hours.map(h => h.temp_c));
//   const tempsMin = realTempsMin - 2; // -2°C pour lisibilité
  const realPluieMax = Math.max(...hours.map(h => h.precip_mm));
  const pluieMax = realPluieMax + 1; // +1 mm pour lisibilité

  const realFeelsMax = Math.max(...hours.map(h => h.feelslike_c));
  const realFeelsMin = Math.min(...hours.map(h => h.feelslike_c));

  const feelsMax = Math.max(realTempsMax, realFeelsMax) + 2;
  const feelsMin = Math.min(realTempsMin, realFeelsMin) - 2;

  const tempsMax = feelsMax;
  const tempsMin = feelsMin;

    // Au début du composant, ajoutez une ref pour le conteneur
  const containerRef = React.useRef(null);
  const [containerWidth, setContainerWidth] = React.useState(350);

  // Ajoutez un useEffect pour mesurer la largeur réelle
  React.useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Modifiez vos constantes pour utiliser la largeur dynamique
  const width = 350; // Garde pour viewBox
  const actualWidth = containerWidth; // Largeur réelle du conteneur


  // const width = 350;
  const height = 120;
  const paddingLeft = 60;
  const paddingRight = 60;

    // 🎯 AXE X UNIQUE (IMPORTANT)
  // const getX = (i) =>
  //   paddingLeft +
  //   (i / (hours.length - 1)) *
  //   (width - paddingLeft - paddingRight);

  const getX = (i) =>
  getXFromHour(
    Number(hours[i].time.split(' ')[1].slice(0, 2))
  );

  const innerWidth = width - paddingLeft - paddingRight;

  const getXFromHour = (hour) => {
  const x =
    paddingLeft + (hour / 23) * innerWidth;

  // 🔒 Clamp de sécurité (Samsung fix)
  return Math.min(
    paddingLeft + innerWidth - 1,
    Math.max(paddingLeft + 1, x)
  );
};

  // Points Température
const pointsTemp = hours.map((h, i) => [
  getX(i),
  height -
    ((h.temp_c - tempsMin) / (tempsMax - tempsMin)) * height
]);


  // 🔥 Top 3 valeurs MAX
  const top3Wind = [...hours]
    .map(h => h.wind_kph)
    .sort((a, b) => b - a)
    .slice(0, 1);

  const tMax =  [...hours]
    .map(h => h.temp_c)
    .sort((a, b) => b - a)
    .slice(0, 1);
  
  const tMaxHour = hours.find(h => h.temp_c === tMax[0])?.time. split(' ')[1].slice(0, 2);

  const tMin =  [...hours]
    .map(h => h.temp_c)
    .sort((a, b) => a - b)
    .slice(0, 1);

  const tMinHour = hours.find(h => h.temp_c === tMin[0])?.time.split(' ')[1].slice(0, 2);
  
  const tMaxFeel =  [...hours]
    .map(h => h.feelslike_c)
    .sort((a, b) => b - a)
    .slice(0, 1);
  
  const tMaxFeelHour = hours.find(h => h.feelslike_c === tMaxFeel[0])?.time.split(' ')[1].slice(0, 2);
  
  const tMinFeel =  [...hours]
    .map(h => h.feelslike_c)
    .sort((a, b) => a - b)
    .slice(0, 1);
  
  const tMinFeelHour = hours.find(h => h.feelslike_c === tMinFeel[0])?.time.split(' ')[1].slice(0, 2);
  
  const windMax =  [...hours]
    .map(h => h.wind_kph)
    .sort((a, b) => b - a)
    .slice(0, 1);
  
  const windMaxHour = hours.find(h => h.wind_kph === windMax[0])?.time.split(' ')[1].slice(0, 2);
  
  const rainMax =  [...hours]
    .map(h => h.precip_mm)
    .sort((a, b) => b - a)
    .slice(0, 2);   
  
  const rainMaxHour = hours.find(h => h.precip_mm === rainMax[0])?.time.split(' ')[1].slice(0, 2);

  const totalRain = hours.reduce((sum, h) => sum + h.precip_mm, 0).toFixed(2);

  const hourOf = (key, value) =>
    hours.find(h => h[key] === value)?.time.split(' ')[1].slice(0, 2);

  // console.log("rainMaxHour :",rainMaxHour);
  // console.log("rainMax :",rainMax);
  // console.log("tMinHour :",tMinHour);
  // console.log("tMin :",tMin);
  // console.log("tMaxHour :",tMaxHour);
  // console.log("tMax :",tMax); 
  // console.log("windMaxHour :",windMaxHour);
  // console.log("windMax :",windMax);
  // console.log("tMaxFeelHour :",tMaxFeelHour);
  // console.log("tMaxFeel :",tMaxFeel);
  // console.log("tMinFeelHour :",tMinFeelHour);
  // console.log("tMinFeel :",tMinFeel);

  const getWindColor = (wind) => {
    // if (top3Wind.includes(wind) && wind > 0) return '#FF4D4D';
    if (wind >= 40) return '#FF4D4D';
    if (wind >= 25) return '#FF8C00';
    if (wind >= 12) return '#FFD700';
    
    return 'white';
  };

  // 🌡️ Température
const getTempColor = (temp) => {

  if (temp >= 25) return '#FF4D4D'; // très chaud, orange doux
  if (temp >= 15) return '#FFD580'; // chaud/modéré, jaune pastel
  if (temp >= 5)  return '#a0ffcfff'; // tempérée/fraîche, bleu pastel
  if (temp >= 0) return '#80DFFF'; // froid, bleu doux
  return '#5CB3FF'; // très froid, bleu plus profond
};

  const top3Rain = [...hours]
    .map(h => h.precip_mm)
    .sort((a, b) => b - a)
    .slice(0, 3);

  const pointsFeels = hours.map((h, i) => [
    getX(i),
    height - ((h.feelslike_c - tempsMin) / (tempsMax - tempsMin)) * height
  ]);

  const pointsPluie = hours.map((h, i) => [
    getX(i),
    height - (h.precip_mm / pluieMax) * height
  ]);

  // Génère une ligne SVG à partir des points
  const line = points =>
    points.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(' ');

  // Labels Température (Y gauche)
  const yTempsLabels = [];
  for (let i = 0; i <= 4; i++) {
    const val = tempsMin + i * (tempsMax - tempsMin) / 4;
    const y = height - (i / 4) * height;
    yTempsLabels.push([y, val.toFixed(0)]);
  }

  // Labels Pluie (Y droite)
  const yPluieLabels = [];
  for (let i = 0; i <= 4; i++) {
    const val = i * (pluieMax / 4);
    const y = height - (i / 4) * height;
    yPluieLabels.push([y, val.toFixed(1)]);
  }

  // const now =new Date()
  // const currentHour = now.getHours();
  // // console.log("currentHour :",currentHour);

  // ✅ Heure locale exacte de la ville
const localTime = new Date(location.localtime_epoch * 1000);
let timezoneOffset = location.localtime.split(' ')[1]

timezoneOffset = timezoneOffset.split(':')[0].replace(':', '' ).trim();

const currentHour = localTime.getHours();

  const currentIndex = hours.findIndex(
  h => Number(h.time.split(' ')[1].slice(0, 2)) === Number(timezoneOffset)
);

  const safeIndex = currentIndex !== -1 ? currentIndex : null;
  const currentX = safeIndex !== null ? getX(safeIndex) : null;
  


  return (
    <div
      className="all-day-view"
      style={{
        width: '100%',
        height: 'calc(95vh - 120px)',
        overflowY: 'auto',
        padding: '8px',
        boxSizing: 'border-box',
        color: 'white',
        
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '1rem' }}>
        {getDayLabel(dayOffset)} · {formatDay(dayOffset)}
        <br/> {location.name} 
      </h2>

      

      {/* === Graph Température & Pluie === */}
      {/* ===== GRAPH ===== */}
      <div style={{ margin: '16px auto', maxWidth: '350px' }} ref={containerRef}>
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>

          {yTempsLabels.map(([y, v], i) => (
            <line 
              key={`grid-${i}`}
              x1={paddingLeft} 
              y1={y} 
              x2={width - paddingRight} 
              y2={y} 
              stroke="rgba(255, 255, 255, 0.3)" 
              strokeWidth="0.5"
            />
          ))}

          <line x1={paddingLeft} y1={height} x2={width - paddingRight} y2={height} stroke="#888" />

          {currentX && dayOffset === 0 && (
            <line
              x1={currentX}
              y1={0}
              x2={currentX}
              y2={height}
              stroke="#00FF88"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.8"
            />
          )}

          <path d={line(pointsTemp)} fill="none" stroke="#FF6B6B" strokeWidth="2" />
          {pointsTemp.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#FF6B6B" />)}

          <path d={line(pointsPluie)} fill="none" stroke="#4FC3F7" strokeWidth="2" />
          {pointsPluie.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#4FC3F7" />)}

          {pointsFeels.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="1.5" fill="#f14545" />)}

          {yTempsLabels.map(([y, v], i) => <text key={i} x={0} y={y + 4} fontSize="10" fill="#FF6B6B">{v}°C</text>)}
          {/* {yPluieLabels.map(([y, v], i) => <text key={i} x={width - paddingRight + 6} y={y + 4} fontSize="10" fill="#4FC3F7">{v} mm</text>)} */}
          {yPluieLabels.map(([y, v], i) => (
  <text 
    key={i} 
    x={width } 
    y={y + 4} 
    fontSize="10" 
    fill="#4FC3F7"
    textAnchor="end"
  >
    {v} mm
  </text>
))}

        </svg>

        {/* 🕒 AXE TEMPS ALIGNÉ */}
        <div style={{ position: 'relative', height: '1rem', fontSize: '0.7rem',marginTop: '4px' }}>
          
            {[0, 6, 12, 18, 23].map(hour => {
              const ratio = (getXFromHour(hour) - paddingLeft) / (width - paddingLeft - paddingRight);
              const actualX = paddingLeft + ratio * (actualWidth - paddingLeft - paddingRight); 
              
              return (
                <span
                  key={hour}
                  style={{
                    position: 'absolute',
                    left: `${(actualX / actualWidth) * 100}%`,
                    transform: 'translateX(-50%)',
                    whiteSpace: 'nowrap',
                    fontVariantNumeric: 'tabular-nums'
                  }}
                >
                  {hour}h
                </span>
              );
            })}
          </div>

                 {/* Légende */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginTop: '2px',
            fontSize: '0.75rem',
            
          }}
        >

          <div style={{ display: 'flex', alignItems: 'center',marginTop: '10px', }}>
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                backgroundColor: '#FF6B6B',
                marginRight: '8px',
                borderRadius: '50%',
              }}
            ></span>
            Temp.
          </div>
          <div style={{ display: 'flex', alignItems: 'center',marginTop: '10px', }}>
            <span
                style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                border: '2px solid #ea2929ff',
                marginRight: '8px',
                borderRadius: '50%',
                }}
            ></span>
            Feels like
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', }}>
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                backgroundColor: '#4FC3F7',
                marginRight: '8px',
                borderRadius: '50%',

              }}
            ></span >
            Rain
          </div>
        </div>
      </div>

      

      {/* <div style={{ marginBottom: '16px', fontSize: '0.8rem' }}   >
        <p>🔥 Max Temp : {tMax[0]}°C ({tMaxHour}h) - ❄️ Min Temp : {tMin[0]}°C ({tMinHour}h)</p>
        <p>🔥 Max Feels like : {tMaxFeel[0]}°C ({tMaxFeelHour}h) - ❄️ Min Feels like : {tMinFeel[0]}°C ({tMinFeelHour}h)</p>
        <p>🌬️ Max Wind : {windMax[0]} km/h ({windMaxHour}h) - 🌧️ Max Rain : {rainMax[0]} mm ({rainMaxHour}h)</p>
      </div> */}

        <div style={{ margin: '16px 0px 0 0px', fontSize: '0.7rem' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'center',
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '12px',
              overflow: 'hidden'
            }}
          >
            <thead style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <tr>
                {/* <th style={{ padding: '0px' }}></th> */}
                {/* <th style={{ padding: '6px' }}>🔥 Temp</th> */}
                <th style={{ padding: '6px' }}>🌡 Feels like</th>
                <th style={{ padding: '6px' }}>🌬️ Wind max</th>
                <th style={{ padding: '6px' }}>🌧️ Rain max / Day</th>
              </tr>
            </thead>
          
          <tbody>
          <tr>

            <td style={{ padding: '6px', paddingBottom:'8px' }}>
              <div style={{ borderBottom: '1px solid white', paddingBottom:'8px'}}>
                <div style={{ paddingTop:'6px' }}>
                {tMinFeelHour} h - Min : {tMinFeel[0]}°C
                </div>
                
              </div >
              <div style={{paddingTop:'0px',marginTop:'0px'}}><br/>{tMaxFeelHour} h - Max : {tMaxFeel[0]}°C<br/> 
              </div>
              
            </td>
            <td style={{ padding: '6px' ,color: getWindColor(windMax[0])}}>
              {windMax[0]} km/h <br/><br/> {windMaxHour} h 
            </td>
            <td style={{ padding: '6px' }}>
              {rainMax[0]} / {totalRain} mm <br/><br/> {rainMaxHour} h 
            </td>
          </tr>
        </tbody>

          </table>
        </div>



      <div style={{ textAlign: 'center', margin: '30px 0 16px 0' }}>
        <button onClick={() => setShowTable(!showTable)}>
          {showTable ? 'Masquer les données' : 'Afficher les données'}
        </button>
      </div>

    {/* === Tableau des heures === */}
    {showTable && (
    <table
        style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '0.8rem',
        }}
    >
        <thead>
        <tr>
            <th style={{ borderBottom: '1px solid rgba(255,255,255,0.3)', padding: '4px' }}>Hour</th>
            <th style={{ borderBottom: '1px solid rgba(255,255,255,0.3)', padding: '4px' }}>Temp</th>
            <th style={{ borderBottom: '1px solid rgba(255,255,255,0.3)', padding: '4px' }}>Feels like</th>
            <th style={{ borderBottom: '1px solid rgba(255,255,255,0.3)', padding: '4px' }}>🌬️ Wind</th>
            <th style={{ borderBottom: '1px solid rgba(255,255,255,0.3)', padding: '4px' }}>🌧 Rain</th>
            <th style={{ borderBottom: '1px solid rgba(255,255,255,0.3)', padding: '4px' }}>💧 Précip</th>
        </tr>
        </thead>
        <tbody>
        {hours.map((h, index) => (
            <tr key={index} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <td style={{ padding: '2px', textAlign: 'center' }}>
                {h.time.split(' ')[1].slice(0, 2)}h
            </td>
            {/* <td style={{ padding: '4px', textAlign: 'center' }}>{h.temp_c.toFixed(1)}°C</td> */}
            <td
              style={{
                padding: '4px',
                textAlign: 'center',
                color: getTempColor(h.temp_c), // couleur selon la température
                borderRadius: '4px' // optionnel, coins arrondis
              }}
            >
              {h.temp_c.toFixed(1)}°C
            </td>
            <td style={{ padding: '4px', textAlign: 'center' }}>{h.feelslike_c.toFixed(1)}°C</td>
            {/* <td style={{ padding: '4px', textAlign: 'center' }}>
                {h.wind_kph !== 0 ? `${h.wind_kph} km/h` : ''}
            </td> */}
            {/* <td
              style={{
                padding: '4px',
                textAlign: 'center',
                color: top3Wind.includes(h.wind_kph) && h.wind_kph > 0
                  ? '#FF4D4D'
                  : 'white',
                fontWeight: top3Wind.includes(h.wind_kph) ? 'bold' : 'normal'
              }}
            >
              {h.wind_kph !== 0 ? `${h.wind_kph} km/h` : '-'}
            </td> */}
            <td style={{ color: getWindColor(h.wind_kph) }}>
              {h.wind_kph !== 0 ? `${h.wind_kph} km/h` : '-'}
            </td>


            <td style={{ padding: '4px', textAlign: 'center' }}>
                {h.precip_mm !== 0 ? `${h.precip_mm}%` : '-'}
            </td>
            {/* <td style={{ padding: '4px', textAlign: 'center' }}>
                {h.precip_mm !== 0 ? `${h.precip_mm.toFixed(1)} mm` : '-'}
            </td> */}
            <td
              style={{
                padding: '4px',
                textAlign: 'center',
                color: top3Rain.includes(h.precip_mm) && h.precip_mm > 0
                  ? '#FF4D4D'
                  : 'white',
                fontWeight: top3Rain.includes(h.precip_mm) ? 'bold' : 'normal'
              }}
            >
              {h.precip_mm !== 0 ? `${h.precip_mm.toFixed(2)} mm` : '-'}
            </td>

            {/* <td style={{ color: getWindColor(h.wind_kph) }}>
              {h.wind_kph !== 0 ? `${h.wind_kph} km/h` : '-'}
            </td> */}

            </tr>
        ))}
        </tbody>
    </table>
    )}

    
    
    </div>
  );
}

export default AllDayView;
