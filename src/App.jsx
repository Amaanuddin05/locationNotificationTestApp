import { useState, useEffect } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import './App.css'

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '12px',
  marginTop: '1rem',
  maxWidth: '100%',
  minHeight: '250px'
}

// Get API key from environment variables
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

function App() {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mapError, setMapError] = useState(null)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // Check if user has a dark mode preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(prefersDarkMode)
    
    // Apply dark mode class to body
    if (prefersDarkMode) {
      document.body.classList.add('dark-mode')
    }
  }, [])

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
        setLoading(false)
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access was denied. Please enable location services.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.'
            break
        }
        setError(errorMessage)
        setLoading(false)
      }
    )
  }, [])

  const onError = (error) => {
    setMapError('Error loading Google Maps. Please check your API key.')
    console.error('Google Maps Error:', error)
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.body.classList.toggle('dark-mode')
  }

  return (
    <div className={`container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="header">
        <h1>Location Tracker</h1>
        <button 
          className="theme-toggle" 
          onClick={toggleDarkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
      <div className="location-card">
        {loading && <p>Loading location...</p>}
        {error && <p className="error">{error}</p>}
        {mapError && <p className="error">{mapError}</p>}
        {location && (
          <div className="location-info">
            <h2>Your Current Location</h2>
            <p>Latitude: {location.latitude.toFixed(6)}°</p>
            <p>Longitude: {location.longitude.toFixed(6)}°</p>
            <LoadScript 
              googleMapsApiKey={GOOGLE_MAPS_API_KEY}
              onError={onError}
            >
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={{
                  lat: location.latitude,
                  lng: location.longitude
                }}
                zoom={15}
              >
                <Marker
                  position={{
                    lat: location.latitude,
                    lng: location.longitude
                  }}
                  title="Your Location"
                />
              </GoogleMap>
            </LoadScript>
            <a
              href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="map-link"
            >
              View on Google Maps
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
