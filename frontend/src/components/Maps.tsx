import React, { useEffect, useRef, useState } from 'react';

interface MapProps {
  center: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  markers?: Array<{
    id: string;
    position: { lat: number; lng: number };
    title?: string;
    description?: string;
    icon?: string;
  }>;
  onMarkerClick?: (marker: any) => void;
  onMapClick?: (event: any) => void;
  className?: string;
  height?: string;
  interactive?: boolean;
}

interface TourLocation {
  id: string;
  name: string;
  position: { lat: number; lng: number };
  description?: string;
  imageUrl?: string;
}

interface TourMapProps {
  tour: {
    id: number;
    name: string;
    destination: string;
    itinerary?: string;
  };
  locations?: TourLocation[];
  className?: string;
}

// Simple Map Component (without Google Maps API)
const SimpleMap: React.FC<MapProps> = ({
  center,
  zoom = 10,
  markers = [],
  onMarkerClick,
  onMapClick,
  className = '',
  height = '400px',
  interactive = true
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleMarkerClick = (marker: any) => {
    onMarkerClick?.(marker);
  };

  const handleMapClick = (event: React.MouseEvent) => {
    if (interactive) {
      onMapClick?.(event);
    }
  };

  if (!mapLoaded) {
    return (
      <div 
        className={`bg-gray-200 rounded-lg flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef}
      className={`bg-gray-100 rounded-lg relative overflow-hidden ${className}`}
      style={{ height }}
      onClick={handleMapClick}
    >
      {/* Map Placeholder */}
      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
        <div className="text-center text-gray-600">
          <div className="text-4xl mb-2">🗺️</div>
          <p className="font-medium">{center.lat.toFixed(4)}, {center.lng.toFixed(4)}</p>
          <p className="text-sm">Zoom: {zoom}</p>
        </div>
      </div>

      {/* Markers */}
      {markers.map((marker) => (
        <div
          key={marker.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          style={{
            left: `${50 + (marker.position.lng - center.lng) * 100}%`,
            top: `${50 - (marker.position.lat - center.lat) * 100}%`,
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleMarkerClick(marker);
          }}
        >
          <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg hover:bg-red-600 transition-colors">
            📍
          </div>
          {marker.title && (
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 text-sm whitespace-nowrap">
              {marker.title}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Tour Map Component
const TourMap: React.FC<TourMapProps> = ({
  tour,
  locations = [],
  className = ''
}) => {
  const [selectedLocation, setSelectedLocation] = useState<TourLocation | null>(null);

  // Default center based on destination
  const getDefaultCenter = () => {
    // This would normally use geocoding API
    const destinationCenters: Record<string, { lat: number; lng: number }> = {
      'Phú Quốc': { lat: 10.2899, lng: 103.9840 },
      'Đà Lạt': { lat: 11.9404, lng: 108.4583 },
      'Hạ Long': { lat: 20.9101, lng: 107.1839 },
      'Sapa': { lat: 22.3406, lng: 103.8440 },
      'Nha Trang': { lat: 12.2388, lng: 109.1967 },
      'Hội An': { lat: 15.8801, lng: 108.3380 },
      'Cần Thơ': { lat: 10.0452, lng: 105.7469 },
      'Huế': { lat: 16.4637, lng: 107.5909 },
    };

    return destinationCenters[tour.destination] || { lat: 21.0285, lng: 105.8542 }; // Default to Hanoi
  };

  const center = getDefaultCenter();

  const markers = locations.map(location => ({
    id: location.id,
    position: location.position,
    title: location.name,
    description: location.description,
  }));

  const handleMarkerClick = (marker: any) => {
    const location = locations.find(l => l.id === marker.id);
    setSelectedLocation(location || null);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Map */}
      <SimpleMap
        center={center}
        zoom={12}
        markers={markers}
        onMarkerClick={handleMarkerClick}
        height="300px"
      />

      {/* Location Info */}
      {selectedLocation && (
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-start space-x-4">
            {selectedLocation.imageUrl && (
              <img
                src={selectedLocation.imageUrl}
                alt={selectedLocation.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{selectedLocation.name}</h3>
              {selectedLocation.description && (
                <p className="text-sm text-gray-600 mt-1">{selectedLocation.description}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                {selectedLocation.position.lat.toFixed(4)}, {selectedLocation.position.lng.toFixed(4)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Locations List */}
      {locations.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Tour Locations</h3>
          <div className="space-y-2">
            {locations.map((location) => (
              <div
                key={location.id}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedLocation(location)}
              >
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{location.name}</p>
                  {location.description && (
                    <p className="text-xs text-gray-600">{location.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Itinerary */}
      {tour.itinerary && (
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Itinerary</h3>
          <div className="text-sm text-gray-700 whitespace-pre-line">
            {tour.itinerary}
          </div>
        </div>
      )}
    </div>
  );
};

// Location Picker Component
interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  className?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{
    name: string;
    address: string;
    position: { lat: number; lng: number };
  }>>([]);

  // Mock suggestions
  const mockSuggestions = [
    { name: 'Ho Chi Minh City', address: 'Ho Chi Minh City, Vietnam', position: { lat: 10.8231, lng: 106.6297 } },
    { name: 'Hanoi', address: 'Hanoi, Vietnam', position: { lat: 21.0285, lng: 105.8542 } },
    { name: 'Da Nang', address: 'Da Nang, Vietnam', position: { lat: 16.0544, lng: 108.2022 } },
    { name: 'Nha Trang', address: 'Nha Trang, Vietnam', position: { lat: 12.2388, lng: 109.1967 } },
    { name: 'Phu Quoc', address: 'Phu Quoc Island, Vietnam', position: { lat: 10.2899, lng: 103.9840 } },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      const filtered = mockSuggestions.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.address.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    onLocationSelect(suggestion);
    setSearchQuery(suggestion.name);
    setSuggestions([]);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search for a location..."
          className="input-field w-full"
        />
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <p className="font-medium text-gray-900">{suggestion.name}</p>
                <p className="text-sm text-gray-600">{suggestion.address}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export { SimpleMap, TourMap, LocationPicker };
export default TourMap;

