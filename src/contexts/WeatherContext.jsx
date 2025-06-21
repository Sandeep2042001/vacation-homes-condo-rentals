
import React, { createContext, useContext, useState, useCallback } from 'react';

const WeatherContext = createContext();

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

export const WeatherProvider = ({ children }) => {
  const [weatherData, setWeatherData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const getWeatherCondition = (weatherCode, isDay) => {
    const conditions = {
      0: isDay ? 'Clear Sky' : 'Clear Night',
      1: isDay ? 'Mainly Clear' : 'Mainly Clear Night',
      2: 'Partly Cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing Rime Fog',
      51: 'Light Drizzle',
      53: 'Moderate Drizzle',
      55: 'Dense Drizzle',
      56: 'Light Freezing Drizzle',
      57: 'Dense Freezing Drizzle',
      61: 'Slight Rain',
      63: 'Moderate Rain',
      65: 'Heavy Rain',
      66: 'Light Freezing Rain',
      67: 'Heavy Freezing Rain',
      71: 'Slight Snow',
      73: 'Moderate Snow',
      75: 'Heavy Snow',
      77: 'Snow Grains',
      80: 'Slight Rain Showers',
      81: 'Moderate Rain Showers',
      82: 'Violent Rain Showers',
      85: 'Slight Snow Showers',
      86: 'Heavy Snow Showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with Slight Hail',
      99: 'Thunderstorm with Heavy Hail'
    };
    return conditions[weatherCode] || 'Unknown';
  };

  const getSimpleCondition = (weatherCode, isDay) => {
    if (weatherCode === 0 || weatherCode === 1) return isDay ? 'Sunny' : 'Clear';
    if (weatherCode >= 2 && weatherCode <= 3) return 'Cloudy';
    if (weatherCode >= 45 && weatherCode <= 48) return 'Foggy';
    if (weatherCode >= 51 && weatherCode <= 67) return 'Rainy';
    if (weatherCode >= 71 && weatherCode <= 86) return 'Snowy';
    if (weatherCode >= 95) return 'Stormy';
    return 'Cloudy';
  };

  const fetchWeather = useCallback(async (city) => {
    setIsLoading(true);
    try {
      const geocodingResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
      );
      
      if (!geocodingResponse.ok) {
        throw new Error('Failed to find location');
      }
      
      const geocodingData = await geocodingResponse.json();
      
      if (!geocodingData.results || geocodingData.results.length === 0) {
        throw new Error('Location not found');
      }
      
      const location = geocodingData.results[0];
      const { latitude, longitude, name, country, timezone } = location;
      
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum&timezone=${encodeURIComponent(timezone)}&forecast_days=7`
      );
      
      if (!weatherResponse.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      const weatherApiData = await weatherResponse.json();
      const current = weatherApiData.current;
      const daily = weatherApiData.daily;
      
      const currentTime = new Date().toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour12: true,
        hour: '2-digit',
        minute: '2-digit'
      });
      
      const timezoneOffset = new Date().toLocaleString('en-US', {
        timeZone: timezone,
        timeZoneName: 'short'
      }).split(' ').pop();
      
      const forecast = daily.time.slice(1, 6).map((date, index) => ({
        day: new Date(date).toLocaleDateString('en', { weekday: 'short' }),
        date: date,
        temp_max: Math.round(daily.temperature_2m_max[index + 1]),
        temp_min: Math.round(daily.temperature_2m_min[index + 1]),
        condition: getSimpleCondition(daily.weather_code[index + 1], true),
        weather_code: daily.weather_code[index + 1],
        sunrise: new Date(daily.sunrise[index + 1]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: timezone }),
        sunset: new Date(daily.sunset[index + 1]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: timezone }),
        precipitation: daily.precipitation_sum[index + 1],
      }));
      
      const weatherResult = {
        city: name,
        country: country,
        temperature: Math.round(current.temperature_2m),
        apparentTemperature: Math.round(current.apparent_temperature),
        condition: getSimpleCondition(current.weather_code, current.is_day),
        detailedCondition: getWeatherCondition(current.weather_code, current.is_day),
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m),
        windDirection: current.wind_direction_10m,
        precipitation: current.precipitation,
        cloudCover: current.cloud_cover,
        timezone: timezoneOffset,
        localTime: currentTime,
        isDay: current.is_day,
        weatherCode: current.weather_code,
        coordinates: { latitude, longitude },
        sunrise: new Date(daily.sunrise[0]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: timezone }),
        sunset: new Date(daily.sunset[0]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: timezone }),
        forecast: forecast,
        lastUpdated: new Date().toISOString()
      };
      
      setWeatherData(prev => ({ ...prev, [name]: weatherResult }));
      return weatherResult;
    } catch (error) {
      console.error('Weather fetch error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    weatherData,
    fetchWeather,
    isLoading
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};
