
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Clock, Thermometer, Users, Calendar, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWeather } from '@/contexts/WeatherContext';
import { useToast } from '@/components/ui/use-toast';
import HeroVideoSlider from '@/components/HeroVideoSlider';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { fetchWeather, weatherData } = useWeather();
  const { toast } = useToast();

  useEffect(() => {
    const loadPopularDestinations = async () => {
      const destinations = ['London', 'Tokyo', 'New York'];
      for (const city of destinations) {
        try {
          await fetchWeather(city);
        } catch (error) {
          console.error(`Failed to load weather for ${city}:`, error);
        }
      }
    };
    
    if (Object.keys(weatherData).length === 0) {
      loadPopularDestinations();
    }
  }, [fetchWeather, weatherData]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      await fetchWeather(searchQuery);
      toast({
        title: "Weather Updated!",
        description: `Found weather data for ${searchQuery}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch weather data",
        variant: "destructive"
      });
    }
  };

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear': return '☀️';
      case 'cloudy':
      case 'partly cloudy': return '☁️';
      case 'rainy': return '🌧️';
      case 'snowy': return '❄️';
      case 'stormy': return '⛈️';
      case 'foggy': return '🌫️';
      default: return '🌤️';
    }
  };

  const features = [
    {
      icon: Thermometer,
      title: "Real-time Weather",
      description: "Get accurate weather data for any destination worldwide"
    },
    {
      icon: Clock,
      title: "Time Zone Comparison",
      description: "Compare time zones and plan your trips accordingly"
    },
    {
      icon: MapPin,
      title: "Interactive Maps",
      description: "Explore destinations with detailed interactive maps"
    },
    {
      icon: Calendar,
      title: "Trip Planning",
      description: "Schedule and organize your perfect travel itinerary"
    },
    {
      icon: Users,
      title: "Travel Groups",
      description: "Connect with fellow travelers and plan group adventures"
    },
    {
      icon: Star,
      title: "Favorites",
      description: "Save your favorite destinations for quick access"
    }
  ];

  const popularDestinations = Object.values(weatherData).slice(0, 4);

  return (
    <div className="min-h-screen">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 h-[80vh] flex items-center justify-center">
        <HeroVideoSlider />
        <div className="relative max-w-7xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              <span className="text-gradient">Weather</span>
              <span>Trip</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Discover the world with real-time weather data, plan amazing trips, 
              and connect with fellow travelers on the ultimate smart tourism platform.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for any city or destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-32 h-14 text-lg glass-effect border-white/20 text-white placeholder:text-gray-400"
              />
              <Button
                type="submit"
                className="absolute right-2 top-2 weather-gradient text-white hover:opacity-90"
              >
                Search
              </Button>
            </div>
          </motion.form>
        </div>
      </section>

      {Object.keys(weatherData).length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-5xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(weatherData).slice(-3).map((weather, index) => (
                <Card key={index} className="weather-card border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <div>
                        <div className="text-lg">{weather.city}</div>
                        <div className="text-sm text-gray-400">{weather.country}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl">{weather.temperature}°C</div>
                        <div className="text-sm text-gray-400">Feels {weather.apparentTemperature}°C</div>
                        <div className="text-2xl mt-1">{getWeatherIcon(weather.condition)}</div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-gray-300 text-left">
                      <p>Condition: {weather.detailedCondition}</p>
                      <p>Humidity: {weather.humidity}%</p>
                      <p>Wind: {weather.windSpeed} km/h</p>
                      <p>Local Time: {weather.localTime}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything You Need for Perfect Trips
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From real-time weather updates to comprehensive trip planning, 
              WeatherTrip has all the tools you need for unforgettable adventures.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Card className="h-full weather-card border-blue-500/20 hover:border-blue-400/40 transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 weather-gradient rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {popularDestinations.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Popular Destinations
              </h2>
              <p className="text-xl text-gray-300">
                Explore trending destinations with live weather updates
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularDestinations.map((destination, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="cursor-pointer"
                  onClick={() => {
                    setSearchQuery(destination.city);
                    handleSearch({ preventDefault: () => {} });
                  }}
                >
                  <Card className="weather-card border-blue-500/20 hover:border-blue-400/40 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-white mb-1">
                          {destination.city}
                        </h3>
                        <p className="text-gray-400 mb-3">{destination.country}</p>
                        <div className="text-4xl mb-2">{getWeatherIcon(destination.condition)}</div>
                        <div className="text-3xl font-bold text-blue-400 mb-1">
                          {destination.temperature}°C
                        </div>
                        <p className="text-gray-400 text-sm mb-2">Feels {destination.apparentTemperature}°C</p>
                        <p className="text-gray-300">{destination.condition}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="weather-card p-12 rounded-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of travelers who trust WeatherTrip for their journeys
            </p>
            <Button
              onClick={() => toast({
                title: "🚧 Feature Coming Soon!",
                description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
              })}
              size="lg"
              className="weather-gradient text-white hover:opacity-90 text-lg px-8 py-4"
            >
              Start Planning Now
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
