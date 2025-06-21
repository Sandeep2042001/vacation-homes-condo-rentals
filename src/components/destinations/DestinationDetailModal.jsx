import React from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { MapPin, Star, Calendar } from 'lucide-react';

const DestinationDetailModal = ({ destination, open, onOpenChange }) => {
  if (!destination) return null;

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return '☀️';
      case 'cloudy': return '☁️';
      case 'rainy': return '🌧️';
      case 'snowy': return '❄️';
      case 'windy': return '💨';
      default: return '🌤️';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] glass-effect border-blue-500/20 text-white p-0">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="relative h-64">
            <img 
              className="w-full h-full object-cover rounded-t-lg"
              alt={`Scenic view of ${destination.name}`}
             src="https://images.unsplash.com/photo-1698329446430-f64ced79c82e" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <DialogTitle className="text-3xl font-bold text-white">{destination.name}</DialogTitle>
              <DialogDescription className="text-gray-300 flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {destination.country}
              </DialogDescription>
            </div>
            <div className="absolute top-4 right-4 flex items-center space-x-1 bg-black/40 px-2 py-1 rounded-lg">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="text-white font-semibold">{destination.rating}</span>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-300 mb-6">{destination.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="weather-card p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2 text-blue-400">Current Weather</h3>
                <div className="flex items-center justify-between">
                  <div className="text-5xl">{getWeatherIcon(destination.condition)}</div>
                  <div>
                    <p className="text-3xl font-bold">{destination.temperature}</p>
                    <p className="text-gray-400">{destination.condition}</p>
                  </div>
                </div>
              </div>
              <div className="weather-card p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2 text-blue-400">Travel Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-blue-400" />
                    <span>Best time: {destination.bestTime}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3 text-blue-400">Top Attractions</h3>
              <div className="flex flex-wrap gap-2">
                {destination.attractions.map((attraction, idx) => (
                  <span key={idx} className="text-sm bg-white/10 text-gray-200 px-3 py-1 rounded-full">
                    {attraction}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default DestinationDetailModal;