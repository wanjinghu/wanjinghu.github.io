import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { useState, useEffect } from 'react';
import axios from 'axios';

const baseMapUrl = '/world-countries.json'; // 背景底图

export default function WorldMap() {
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [hoveredGeoData, setHoveredGeoData] = useState(null);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);

  useEffect(() => {
    if (!hoveredCountry) {
      setHoveredGeoData(null);
      return;
    }

    const code = hoveredCountry.toLowerCase();
    axios
      .get(`/geo/${code}.json`)
      .then((res) => {
        setHoveredGeoData(res.data);
      })
      .catch(() => {
        setHoveredGeoData(null);
      });
  }, [hoveredCountry]);

  const handleMouseEnter = (geo) => {
    setHoveredCountry(geo.properties.ISO_A2);
  };

  const handleMouseLeave = () => {
    setHoveredCountry(null);
  };

  const handleClick = (geo) => {
    const name = geo.properties.name.toLowerCase().replace(/\s+/g, '_');
    setSelectedCountry(geo.properties.name);
    setSelectedImageUrl(`/pics/${name}.JPG`);
  };

  const handleClose = () => {
    setSelectedCountry(null);
    setSelectedImageUrl(null);
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* 背景地图 */}
      <ComposableMap projectionConfig={{ scale: 140 }}>
        <Geographies geography={baseMapUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onMouseEnter={() => handleMouseEnter(geo)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick(geo)}
                style={{
                  default: { fill: '#EEE', stroke: '#FFF' },
                  hover: { fill: '#CFD8DC', stroke: '#607D8B' },
                  pressed: { fill: '#FF5722' },
                }}
              />
            ))
          }
        </Geographies>

        {/* 高亮国家 */}
        {hoveredGeoData && (
          <Geographies geography={hoveredGeoData}>
            {({ geographies }) =>
              geographies.map((geo, i) => (
                <Geography
                  key={`hover-${i}`}
                  geography={geo}
                  style={{
                    default: { fill: '#FFCC00', stroke: '#000' },
                  }}
                />
              ))
            }
          </Geographies>
        )}
      </ComposableMap>

      {/* 点击后图片浮层 */}
      {selectedCountry && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            background: '#fff',
            padding: '10px',
            border: '1px solid #ccc',
            boxShadow: '0 0 10px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>{selectedCountry}</h3>
            <button
              onClick={handleClose}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer',
                color: '#888',
              }}
            >
              ✖
            </button>
          </div>
          {selectedImageUrl ? (
            <img
              src={selectedImageUrl}
              alt={selectedCountry}
              width={300}
              style={{ border: '1px solid #ccc', marginTop: '10px' }}
            />
          ) : (
            <p>No image available for this country.</p>
          )}
        </div>
      )}
    </div>
  );
}
