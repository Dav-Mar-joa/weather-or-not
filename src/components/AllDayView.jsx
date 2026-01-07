function AllDayView({ hours }) {
  return (
    <div
      className="all-day-view"
      style={{
        width: '100%',
        height: 'calc(100vh - 120px)',
        overflowY: 'auto',
        padding: '8px',
        boxSizing: 'border-box',
        color: 'white',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '1.2rem' }}>
        All day
      </h2>

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
            <th style={{ borderBottom: '1px solid rgba(255,255,255,0.3)', padding: '4px'}}>💧 Précip</th>
          </tr>
        </thead>
        <tbody>
          {hours.map((h, index) => (
            <tr key={index} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <td style={{ padding: '2px', textAlign: 'center' }}>
                {h.time.split(' ')[1].slice(0, 2)}h {/* heure HH:MM */}
              </td>
              <td style={{ padding: '4px', textAlign: 'center' }}>
                {h.temp_c.toFixed(1)}°C
              </td>
              <td style={{ padding: '4px', textAlign: 'center' }}>
                {h.feelslike_c.toFixed(1)}°C
              </td>
              <td style={{ padding: '4px', textAlign: 'center' }}>
                {h.wind_kph} km/h
                </td>
              <td style={{ padding: '4px', textAlign: 'center' }}>
                {h.chance_of_rain}%
              </td>
              <td style={{ padding: '4px', textAlign: 'center' }}>
                {h.precip_mm.toFixed(1)} mm
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default AllDayView;  