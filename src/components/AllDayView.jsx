import React from 'react';
  function AllDayView({ hours,date }) {

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

  const width = 350;
  const height = 120;
  const paddingLeft = 40;
  const paddingRight = 40;

  // Points Température
  const pointsTemp = hours.map((h, i) => {
    const x = paddingLeft + (i / (hours.length - 1)) * (width - paddingLeft - paddingRight);
    const y = height - ((h.temp_c - tempsMin) / (tempsMax - tempsMin)) * height;
    return [x, y];
  });

  const pointsFeels = hours.map((h, i) => {
    const x = paddingLeft + (i / (hours.length - 1)) * (width - paddingLeft - paddingRight);
    const y = height - ((h.feelslike_c - tempsMin) / (tempsMax - tempsMin)) * height;
    return [x, y];
 });

  // Points Pluie
  const pointsPluie = hours.map((h, i) => {
    const x = paddingLeft + (i / (hours.length - 1)) * (width - paddingLeft - paddingRight);
    const y = height - (h.precip_mm / pluieMax) * height;
    return [x, y];
  });

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
        {getDayLabel(0)} · {formatDay(0)}
      </h2>

      

      {/* === Graph Température & Pluie === */}
      <div className="graph-container" style={{ margin: '0 auto 16px', maxWidth: '380px' }}>
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Axe X */}
          <line
            x1={paddingLeft}
            y1={height}
            x2={width - paddingRight}
            y2={height}
            stroke="#888"
            strokeWidth="1"
          />

          {/* Température rouge */}
          <path d={line(pointsTemp)} fill="none" stroke="#FF6B6B" strokeWidth="2" />
          {pointsTemp.map((p, i) => (
            <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#FF6B6B" />
          ))}

          {/* Pluie bleu */}
          <path d={line(pointsPluie)} fill="none" stroke="#4FC3F7" strokeWidth="2" />
          {pointsPluie.map((p, i) => (
            <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#4FC3F7" />
          ))}

          {/* Température ressentie */}
          {/* <path d={line(pointsFeels)} fill="none"
          stroke="#FFD166" strokeWidth="2"
          strokeDasharray="4 4"
         /> */}

        {pointsFeels.map((p, i) => (
        <circle key={`feels-${i}`} cx={p[0]} cy={p[1]} r="1.5" fill="#f14545ff" />
        ))}
 

          {/* Y Température gauche */}
          {yTempsLabels.map(([y, val], i) => (
            <text key={i} x={0} y={y + 4} fontSize="10" fill="#FF6B6B">
              {val}°C
            </text>
          ))}

          {/* Y Pluie droite */}
          {yPluieLabels.map(([y, val], i) => (
            <g key={i}>
              {/* petite ligne de graduation */}
              <line
                x1={width - paddingRight - 3}
                y1={y}
                x2={width - paddingRight + 3}
                y2={y}
                stroke="#4FC3F7"
                strokeWidth="1"
              />
              {/* label en mm */}
              <text
                x={width - paddingRight + 6}
                y={y + 4}
                fontSize="10"
                fill="#4FC3F7"
              >
                {val} mm
              </text>
            </g>
          ))}

          {/* Lignes de grille horizontales */}
          {[...Array(5)].map((_, i) => {
            const y = height - (i / 4) * height;
            return (
              <line
                key={i}
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            );
          })}
        </svg>

        {/* Axe X labels */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.7rem',
            color: 'white',
            marginTop: '4px',
          }}
        >
          <span>0h</span>
          <span>6h</span>
          <span>12h</span>
          <span>18h</span>
          <span>24h</span>
        </div>

        {/* Légende */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginTop: '8px',
            fontSize: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                backgroundColor: '#FF6B6B',
                marginRight: '4px',
                borderRadius: '50%',
              }}
            ></span>
            Temp.
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
                style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                border: '2px dashed #ea2929ff',
                marginRight: '4px',
                borderRadius: '50%',
                }}
            ></span>
            Feels like
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                backgroundColor: '#4FC3F7',
                marginRight: '4px',
                borderRadius: '50%',
              }}
            ></span>
            Rain
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', margin: '10px 0' }}>
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
            <td style={{ padding: '4px', textAlign: 'center' }}>{h.temp_c.toFixed(1)}°C</td>
            <td style={{ padding: '4px', textAlign: 'center' }}>{h.feelslike_c.toFixed(1)}°C</td>
            <td style={{ padding: '4px', textAlign: 'center' }}>
                {h.wind_kph !== 0 ? `${h.wind_kph} km/h` : ''}
            </td>
            <td style={{ padding: '4px', textAlign: 'center' }}>
                {h.precip_mm !== 0 ? `${h.precip_mm}%` : '-'}
            </td>
            <td style={{ padding: '4px', textAlign: 'center' }}>
                {h.precip_mm !== 0 ? `${h.precip_mm.toFixed(1)} mm` : '-'}
            </td>
            </tr>
        ))}
        </tbody>
    </table>
    )}

    
    
    </div>
  );
}

export default AllDayView;
