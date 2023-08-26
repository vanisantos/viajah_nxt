import { useState, useMemo, useCallback, useRef, SetStateAction } from "react";
import {
  GoogleMap,
  } from "@react-google-maps/api";
import Places from "./places";
import GeocodeGPT from "./geocodeGPT";
import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { PlacesCard } from "./placesCard";

export type GptData = {lugar:string, descricao:string}
export type LatLngLiteral = google.maps.LatLngLiteral;
export type DirectionsResult = google.maps.DirectionsResult;
export type MapOptions = google.maps.MapOptions;
 
export default function Map() {
  
  const mapRef = useRef<GoogleMap>();
  const center = useMemo<LatLngLiteral>(
    () => ({ lat: -22.9064, lng: -47.0616 }),
    []
  );
  const options = useMemo<MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );
  const onLoad = useCallback((map) => (mapRef.current = map), []);

  const initialDirectionsResult = {
    geocoded_waypoints: [],
    routes: [],
    request: {
      origin: "", // Ponto de partida
      destination: "", // Destino
      travelMode: google.maps.TravelMode.DRIVING
    },
    status: google.maps.DirectionsStatus.ZERO_RESULTS
  };

  const [directions, setDirections] = useState<DirectionsResult>(initialDirectionsResult);
  const [places, setPlaces] = useState<GptData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadingMessages = [
    "Aguarde, inteligência artificial pensando nos lugares que nunca visitou, mas sempre quis :)",
    "Carregando melhores pontos turísticos...",
    "Estou pensando nas melhores experiências, posso ir com você?"
  ];
  
  function getRandomMessage() {
    const randomIndex = Math.floor(Math.random() * loadingMessages.length);
    return loadingMessages[randomIndex];
  }

  return (
    <div className="container">
      <div className="controls">
      <Box>
        <h1><Text marginTop={3} fontSize="xl">Bora viajah?</Text></h1>
        <Places
          setPlaces={setPlaces}
          setLoading={setLoading}
          setDirections={setDirections}
        /> 
        <Box marginTop={7}>       
        {loading ? (
          <Flex direction="column" textAlign="center" alignContent="center" justifyContent="center" >
            <Spinner size="xl" speed='0.65s' alignSelf='center'/>
            <Text marginTop={3} fontSize="xl">{getRandomMessage()}</Text>
          </Flex>
        )
        : (
          <PlacesCard
            places={places}
          ></PlacesCard>
        )}
        </Box>
      </Box>   
      </div>
      <div className="map">
        <GoogleMap
          zoom={10}
          center={center}
          mapContainerClassName="map-container"
          options={options}
          onLoad={onLoad}
        >
          <GeocodeGPT
            places={places}
            directions={directions}
            setDirections={setDirections}
          ></GeocodeGPT>
        </GoogleMap>
      </div>
    </div>
  );
}

