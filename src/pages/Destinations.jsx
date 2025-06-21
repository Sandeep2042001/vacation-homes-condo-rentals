
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Heart, Camera, Navigation, Filter, Calendar, Sun, Cloud, Thermometer, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useToast } from '@/components/ui/use-toast';

const Destinations = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [mapUrl, setMapUrl] = useState('');
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { toast } = useToast();

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'beaches', name: 'Beaches' },
    { id: 'mountains', name: 'Mountains' },
    { id: 'cities', name: 'Cities' },
    { id: 'cultural', name: 'Cultural' },
    { id: 'adventure', name: 'Adventure' }
  ];

  const destinations = [
    {
      id: 1, name: 'Santorini', country: 'Greece', category: 'beaches', rating: 4.8, temperature: '24°C', condition: 'Sunny',
      description: 'A quintessential Greek island, Santorini is famed for its dramatic cliffs, whitewashed villages clinging to their edges, and breathtaking sunsets over the caldera.',
      attractions: ['Oia Village', 'Red Beach', 'Ancient Thera', 'Fira'], bestTime: 'April - October',
      lat: 36.3932, lon: 25.4615, imageAlt: 'Whitewashed buildings of Santorini overlooking the blue sea'
    },
    {
      id: 2, name: 'Kyoto', country: 'Japan', category: 'cultural', rating: 4.9, temperature: '18°C', condition: 'Cloudy',
      description: "Japan's former imperial capital, Kyoto is a city of ancient temples, sublime gardens, traditional teahouses, and geishas wandering the Gion district.",
      attractions: ['Fushimi Inari Shrine', 'Arashiyama Bamboo Grove', 'Kiyomizu-dera Temple', 'Gion District'], bestTime: 'March - May, Sep - Nov',
      lat: 35.0116, lon: 135.7681, imageAlt: 'The iconic Fushimi Inari Shrine in Kyoto with red torii gates'
    },
    {
      id: 3, name: 'Swiss Alps', country: 'Switzerland', category: 'mountains', rating: 4.7, temperature: '8°C', condition: 'Snowy',
      description: 'The Swiss Alps are a paradise for outdoor enthusiasts, offering world-class skiing, hiking through pristine landscapes, and views of iconic peaks like the Matterhorn.',
      attractions: ['Matterhorn', 'Jungfraujoch', 'Lake Geneva', 'Interlaken'], bestTime: 'Dec - Mar, Jun - Sep',
      lat: 46.8182, lon: 8.2275, imageAlt: 'The majestic Matterhorn peak in the Swiss Alps covered in snow'
    },
    {
      id: 4, name: 'New York City', country: 'USA', category: 'cities', rating: 4.6, temperature: '15°C', condition: 'Rainy',
      description: 'The city that never sleeps, NYC is a global hub of culture, finance, and media, boasting iconic landmarks, world-class museums, and endless energy.',
      attractions: ['Times Square', 'Central Park', 'Statue of Liberty', 'Empire State Building'], bestTime: 'Apr - Jun, Sep - Nov',
      lat: 40.7128, lon: -74.0060, imageAlt: 'The bustling Times Square in New York City at night with bright billboards'
    },
    {
      id: 5, name: 'Bali', country: 'Indonesia', category: 'beaches', rating: 4.8, temperature: '28°C', condition: 'Sunny',
      description: 'Known as the "Island of the Gods," Bali is a tropical paradise with lush rice paddies, volcanic mountains, beautiful beaches, and a deeply spiritual culture.',
      attractions: ['Uluwatu Temple', 'Tegalalang Rice Terraces', 'Mount Batur', 'Ubud Monkey Forest'], bestTime: 'April - October',
      lat: -8.4095, lon: 115.1889, imageAlt: 'Lush green rice terraces in Bali with palm trees'
    },
    {
      id: 6, name: 'Patagonia', country: 'Chile/Argentina', category: 'adventure', rating: 4.9, temperature: '12°C', condition: 'Windy',
      description: 'A vast and wild region at the tip of South America, Patagonia is a dream for adventurers with its dramatic mountain peaks, massive glaciers, and pristine wilderness.',
      attractions: ['Torres del Paine National Park', 'Perito Moreno Glacier', 'Fitz Roy Massif', 'Ushuaia'], bestTime: 'November - March',
      lat: -50.9423, lon: -72.3444, imageAlt: 'The dramatic granite peaks of Torres del Paine in Patagonia'
    }
  ];

  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) || dest.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || dest.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFavoriteToggle = (destination) => {
    if (isFavorite(destination.name)) {
      removeFavorite(destination.name);
      toast({ title: "Removed from Favorites", description: `${destination.name} has been removed from your favorites` });
    } else {
      addFavorite({ name: destination.name, country: destination.country, temperature: destination.temperature, condition: destination.condition });
      toast({ title: "Added to Favorites", description: `${destination.name} has been added to your favorites` });
    }
  };

  const openMap = (dest) => {
    const url = `https://www.openstreetmap.org/export/embed.html?bbox=${dest.lon - 0.5},${dest.lat - 0.5},${dest.lon + 0.5},${dest.lat + 0.5}&layer=mapnik&marker=${dest.lat},${dest.lon}`;
    setMapUrl(url);
  };

  const openWorldMap = () => {
    setMapUrl('https://www.openstreetmap.org/export/embed.html?bbox=-180,-90,180,90&layer=mapnik');
  };

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
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6"><span className="text-gradient">Discover</span> Destinations</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">Explore amazing destinations worldwide with real-time weather data and travel recommendations</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Input type="text" placeholder="Search destinations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-12 glass-effect border-white/20 text-white placeholder:text-gray-400" />
            </div>
            <Button variant="outline" className="glass-effect border-white/20 text-white hover:bg-white/10" onClick={() => toast({ title: "🚧 Feature Coming Soon!", description: "Advanced filters are on the way! 🚀" })}>
              <Filter className="h-4 w-4 mr-2" /> Filters
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button key={category.id} variant={selectedCategory === category.id ? "default" : "outline"} onClick={() => setSelectedCategory(category.id)} className={selectedCategory === category.id ? "weather-gradient text-white" : "glass-effect border-white/20 text-white hover:bg-white/10"}>
                {category.name}
              </Button>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((destination, index) => (
            <motion.div key={destination.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ y: -10 }} className="group">
              <Card className="h-full weather-card border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 overflow-hidden flex flex-col">
                <div className="relative h-48">
                  <img  className="w-full h-full object-cover" alt={destination.imageAlt} src="https://images.unsplash.com/photo-1556817643-9b9d1f182599" />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleFavoriteToggle(destination); }} className="bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm">
                      <Heart className={`h-4 w-4 ${isFavorite(destination.name) ? 'fill-current text-red-400' : ''}`} />
                    </Button>
                  </div>
                  <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-black/40 rounded-lg px-3 py-1 backdrop-blur-sm">
                    <span className="text-2xl">{getWeatherIcon(destination.condition)}</span>
                    <span className="text-white font-semibold">{destination.temperature}</span>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white text-xl">{destination.name}</CardTitle>
                      <p className="text-gray-400 flex items-center mt-1"><MapPin className="h-4 w-4 mr-1" />{destination.country}</p>
                    </div>
                    <div className="flex items-center space-x-1 text-yellow-400"><Star className="h-4 w-4 fill-current" /><span className="text-white font-semibold">{destination.rating}</span></div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <p className="text-gray-300 mb-4 flex-grow">{destination.description.substring(0, 100)}...</p>
                  <div className="flex space-x-2 mt-auto">
                    <Button onClick={() => setSelectedDestination(destination)} className="flex-1 weather-gradient text-white hover:opacity-90">View Details</Button>
                    <Button variant="outline" onClick={() => openMap(destination)} className="glass-effect border-white/20 text-white hover:bg-white/10">
                      <Navigation className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filteredDestinations.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-4">No destinations found</h3>
            <p className="text-gray-300 max-w-md mx-auto">Try adjusting your search terms or category filters.</p>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="mt-20">
          <Card className="weather-card border-blue-500/20 p-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Explore on Interactive Map</h2>
              <p className="text-gray-300 mb-6">Discover destinations visually with our interactive world map</p>
              <Button onClick={openWorldMap} className="weather-gradient text-white hover:opacity-90">Launch World Map</Button>
            </div>
          </Card>
        </motion.div>
      </div>

      {selectedDestination && (
        <Dialog open={!!selectedDestination} onOpenChange={() => setSelectedDestination(null)}>
          <DialogContent className="weather-card text-white sm:max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-hide">
            <DialogHeader>
              <div className="w-full h-64 rounded-t-lg overflow-hidden relative">
                <img  className="w-full h-full object-cover" alt={selectedDestination.imageAlt} src="https://images.unsplash.com/photo-1583237925560-9a6bdaa24895" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <DialogTitle className="absolute bottom-4 left-4 text-3xl font-bold text-white">{selectedDestination.name}</DialogTitle>
              </div>
            </DialogHeader>
            <div className="p-6">
              <p className="text-gray-300 mb-6">{selectedDestination.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-lg text-blue-400 mb-3 flex items-center"><Star className="h-5 w-5 mr-2" />Top Attractions</h4>
                  <ul className="space-y-2">
                    {selectedDestination.attractions.map(attraction => (
                      <li key={attraction} className="flex items-center text-gray-300">
                        <Tag className="h-4 w-4 mr-2 text-cyan-400" /> {attraction}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg text-blue-400 mb-2 flex items-center"><Calendar className="h-5 w-5 mr-2" />Best Time to Visit</h4>
                    <p className="text-gray-300">{selectedDestination.bestTime}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-blue-400 mb-2 flex items-center"><Thermometer className="h-5 w-5 mr-2" />Current Weather</h4>
                    <div className="flex items-center space-x-4 text-gray-300">
                      <span className="text-3xl">{getWeatherIcon(selectedDestination.condition)}</span>
                      <div>
                        <p className="font-bold text-xl">{selectedDestination.temperature}</p>
                        <p>{selectedDestination.condition}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {mapUrl && (
        <Dialog open={!!mapUrl} onOpenChange={() => setMapUrl('')}>
          <DialogContent className="weather-card text-white sm:max-w-6xl w-[95vw] h-[90vh] p-2">
            <iframe src={mapUrl} title="Interactive Map" className="map-iframe"></iframe>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Destinations;
