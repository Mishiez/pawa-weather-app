'use client';

import { useState } from 'react';

export default function Home() {
  const [city, setCity] = useState('');
  const [unit, setUnit] = useState<'celsius' | 'fahrenheit'>('celsius');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (city: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:8000/api/weather?city=${encodeURIComponent(city)}&unit=${unit === 'celsius' ? 'metric' : 'imperial'}`);
      if (!response.ok) {
        throw new Error('Weather data not found');
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      handleSearch(city);
    }
  };

  const toggleUnit = () => {
    setUnit(unit === 'celsius' ? 'fahrenheit' : 'celsius');
    if (weatherData) {
      handleSearch(weatherData.current.name);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <header className="flex items-center justify-between mb-6">
          <img src="/pawa-logo.png" alt="Pawa IT" className="h-12" />
          <div className="flex items-center gap-2">
            <button
              onClick={toggleUnit}
              className="px-4 py-2 rounded-full border border-gray-300 text-sm"
            >
              {unit === 'celsius' ? '°C' : '°F'}
            </button>
          </div>
        </header>

        {/* Search Box */}
        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search city..."
            className="flex-1 p-2 border rounded"
          />
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
            🔍
          </button>
        </form>

        {loading && <div className="text-center">Loading...</div>}
        {error && <div className="text-red-500 text-center">{error}</div>}

        {weatherData && (
          <>
            {/* Current Weather Display */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-32 h-32">
                <img
                  src={`http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@4x.png`}
                  alt={weatherData.current.weather[0].description}
                  className="w-full h-full"
                />
              </div>
              <div>
                <h2 className="text-5xl font-bold">
                  {Math.round(weatherData.current.main.temp)}°{unit === 'celsius' ? 'C' : 'F'}
                </h2>
                <p className="text-xl capitalize">{weatherData.current.weather[0].description}</p>
                <p className="text-gray-600">
                  {new Date(weatherData.current.dt * 1000).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-gray-600">{weatherData.current.name}</p>
              </div>
            </div>

            {/* 3-Day Forecast */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {weatherData.forecast.list
                .filter((item: any, index: number) => index % 8 === 0)
                .slice(1, 4)
                .map((day: any, index: number) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium">
                      {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <img
                      src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                      alt={day.weather[0].description}
                      className="w-12 h-12 mx-auto"
                    />
                    <p>{Math.round(day.main.temp)}°{unit === 'celsius' ? 'C' : 'F'}</p>
                  </div>
                ))}
            </div>

            {/* Weather Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm text-gray-600">Wind Status</h3>
                <p className="text-2xl font-bold">{weatherData.current.wind.speed} km/h</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm text-gray-600">Humidity</h3>
                <p className="text-2xl font-bold">{weatherData.current.main.humidity}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${weatherData.current.main.humidity}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}