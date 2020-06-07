import React from 'react';

//MAP
import { Map as LeafletMap, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';

interface MapProps {
  setMarkerPosition: (
    //@ts-ignore
    [number, number]
  ) => void;
  markerPosition: [number, number];
}

const Map: React.FC<MapProps> = ({ setMarkerPosition, markerPosition }) => {
  const [initPosition, setInitPosition] = React.useState<[number, number]>([
    0,
    0,
  ]);

  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setInitPosition([latitude, longitude]);
    });
  }, []);

  function handleMarkerClick(event: LeafletMouseEvent) {
    setMarkerPosition([event.latlng.lat, event.latlng.lng]);
  }

  return (
    <LeafletMap center={initPosition} zoom={15} onClick={handleMarkerClick}>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={markerPosition} />
    </LeafletMap>
  );
};

export default Map;
