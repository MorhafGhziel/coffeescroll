/**
 * An illustrative night map, drawn in the site's own ink: not a real street plan (the address is a sample).
 * A tilted grid of streets, two main roads, a dry valley, and the pin.
 */
export function NightMap() {
  const minor: number[] = [];
  for (let v = -300; v <= 1100; v += 70) minor.push(v);

  return (
    <figure className="map">
      <svg viewBox="0 0 800 620" role="img" aria-label="خريطة توضيحية لموقع نوكتورن في حي الملقا بالرياض">
        <defs>
          <radialGradient id="map-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#d39a5c" stopOpacity="0.42" />
            <stop offset="1" stopColor="#d39a5c" stopOpacity="0" />
          </radialGradient>
          <clipPath id="map-clip">
            <rect width="800" height="620" rx="3" />
          </clipPath>
        </defs>
        <g clipPath="url(#map-clip)">
          <rect width="800" height="620" fill="#0c0806" />
          <g transform="rotate(-17 400 310)">
            {/* blocks: a few lit parcels so the grid reads as a city at night */}
            {[
              [190, 170, 66, 66],
              [470, 100, 66, 66],
              [540, 380, 66, 66],
              [260, 450, 66, 66],
              [120, 310, 66, 66],
              [610, 240, 66, 66],
            ].map(([x, y, w, h]) => (
              <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} fill="#1a110a" />
            ))}
            {minor.map((v) => (
              <g key={v} stroke="rgba(242,234,223,.09)" strokeWidth="1">
                <line x1={v} y1="-300" x2={v} y2="920" />
                <line x1="-300" y1={v} x2="1100" y2={v} />
              </g>
            ))}
            {/* main roads */}
            <line x1="-300" y1="344" x2="1100" y2="344" stroke="rgba(211,154,92,.5)" strokeWidth="5" />
            <line x1="436" y1="-300" x2="436" y2="920" stroke="rgba(211,154,92,.34)" strokeWidth="3.5" />
            <line x1="-300" y1="64" x2="1100" y2="64" stroke="rgba(242,234,223,.2)" strokeWidth="2.5" />
          </g>
          {/* the wadi */}
          <path d="M-20 120 C 140 170, 180 300, 120 420 S 60 590, 150 660" fill="none" stroke="#130d08" strokeWidth="46" strokeLinecap="round" />
          <path d="M-20 120 C 140 170, 180 300, 120 420 S 60 590, 150 660" fill="none" stroke="rgba(242,234,223,.1)" strokeWidth="1" strokeDasharray="3 7" />

          {/* the pin */}
          <circle cx="418" cy="318" r="120" fill="url(#map-glow)" />
          <circle className="map-ring" cx="418" cy="318" r="16" fill="none" stroke="#d39a5c" strokeWidth="1.5" />
          <circle cx="418" cy="318" r="7" fill="#f2eadf" />

          {/* north */}
          <g transform="translate(742 64)" stroke="rgba(242,234,223,.55)" fill="none" strokeWidth="1.2">
            <circle r="17" />
            <path d="M0 9 L0 -9 M-4.5 -3.5 L0 -9 L4.5 -3.5" />
          </g>
        </g>
      </svg>
      <figcaption>
        <strong>نوكتورن</strong>
        <span>حي الملقا، الرياض</span>
      </figcaption>
      <p className="map-note">خريطة توضيحية</p>
    </figure>
  );
}
