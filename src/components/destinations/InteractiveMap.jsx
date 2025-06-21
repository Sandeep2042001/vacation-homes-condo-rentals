import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { motion } from 'framer-motion';

const InteractiveMap = ({ destinations }) => {
  const center = [20, 0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="mt-20"
    >
      <div className="weather-card border-blue-500/20 p-4 md:p-8 rounded-lg">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            Explore on Interactive Map
          </h2>
          <p className="text-gray-300">
            Discover destinations visually with our interactive world map
          </p>
        </div>
        <div className="h-[500px] rounded-lg overflow-hidden z-0">
          <MapContainer center={center} zoom={2} scrollWheelZoom={true} style={{ height: '100%', width: '100%', backgroundColor: '#0f172a' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {destinations.map(dest => (
              <Marker key={dest.id} position={dest.coordinates}>
                <Popup>
                  <div className="text-center bg-slate-800 text-white p-1 rounded-md">
                    <h3 className="font-bold">{dest.name}</h3>
                    <p>{dest.country}</p>
                    <p>{dest.temperature}, {dest.condition}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default InteractiveMap;