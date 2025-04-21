
import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const locations = [
  {
    name: "Viva Esportes Novos Tempos",
    coordinates: [-44.2012, -20.0273],
    description: "Unidade Novos Tempos",
  },
  {
    name: "Viva Esportes Betim",
    coordinates: [-44.1978, -19.9678],
    description: "Unidade Betim",
  },
];

const LocationsMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState("");

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-44.1995, -19.9975],
      zoom: 11,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    locations.forEach((location) => {
      const marker = new mapboxgl.Marker({ color: "#E83A45" })
        .setLngLat(location.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h3 class="font-bold">${location.name}</h3><p>${location.description}</p>`
          )
        )
        .addTo(map.current!);
    });

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  return (
    <div className="w-full">
      {!mapboxToken ? (
        <div className="text-center p-4">
          <input
            type="text"
            placeholder="Cole seu token público do Mapbox aqui"
            className="w-full max-w-md p-2 border rounded"
            onChange={(e) => setMapboxToken(e.target.value)}
          />
          <p className="text-sm text-gray-500 mt-2">
            Visite mapbox.com para obter seu token público gratuito
          </p>
        </div>
      ) : null}
      <div
        ref={mapContainer}
        className="w-full h-[400px] rounded-lg shadow-lg"
      />
    </div>
  );
};

export default LocationsMap;
