
import { useState } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";

const locations = [
  {
    name: "Viva Esportes Novos Tempos",
    position: { lat: -20.0273, lng: -44.2012 },
    description: "Unidade Novos Tempos",
  },
  {
    name: "Viva Esportes Betim",
    position: { lat: -19.9678, lng: -44.1978 },
    description: "Unidade Betim",
  },
];

const mapContainerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "0.5rem",
};

const center = {
  lat: -19.9975,
  lng: -44.1995,
};

const LocationsMap = () => {
  const [selectedLocation, setSelectedLocation] = useState<(typeof locations)[0] | null>(null);
  const [googleApiKey, setGoogleApiKey] = useState("");

  return (
    <div className="w-full">
      {!googleApiKey ? (
        <div className="text-center p-4">
          <input
            type="text"
            placeholder="Cole sua API key do Google Maps aqui"
            className="w-full max-w-md p-2 border rounded"
            onChange={(e) => setGoogleApiKey(e.target.value)}
          />
          <p className="text-sm text-gray-500 mt-2">
            Visite console.cloud.google.com para obter sua API key do Google Maps
          </p>
        </div>
      ) : (
        <LoadScript googleMapsApiKey={googleApiKey}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={11}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
            }}
          >
            {locations.map((location) => (
              <Marker
                key={location.name}
                position={location.position}
                onClick={() => setSelectedLocation(location)}
              />
            ))}

            {selectedLocation && (
              <InfoWindow
                position={selectedLocation.position}
                onCloseClick={() => setSelectedLocation(null)}
              >
                <div>
                  <h3 className="font-bold">{selectedLocation.name}</h3>
                  <p>{selectedLocation.description}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      )}
    </div>
  );
};

export default LocationsMap;
