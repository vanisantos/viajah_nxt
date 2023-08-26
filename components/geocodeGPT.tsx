import { DirectionsRenderer } from "@react-google-maps/api";
import { DirectionsResult, GptData, LatLngLiteral } from "./map";

export default function GeocodeGPT(props: { 
    places : GptData[],
    directions: DirectionsResult,
    setDirections : React.Dispatch<React.SetStateAction<DirectionsResult>>
  }) {
    var directionsService = new google.maps.DirectionsService();;
    
    const lugaresParaGeocodificar = props.places.map(l => l.lugar);
    let coordenadas: google.maps.LatLngLiteral[] = [];
    
    // Geocodificar cada lugar (lat, long)
    lugaresParaGeocodificar.forEach((lugar: string) => {
        
        getLatLngForPlace(lugar, (coordenada) => {
            if (coordenada) {
                coordenadas.push(coordenada);
    
                if (coordenadas.length === lugaresParaGeocodificar.length) {
                    const origin = coordenadas[0];
                    const destination = coordenadas[2];
                    const waypoints: google.maps.DirectionsWaypoint[] = [{
                        location: new google.maps.LatLng(coordenadas[1]),
                        stopover: true
                    }];
                    const directionsAreNotCalculated = props.directions?.routes.length === 0
    
                    if(directionsAreNotCalculated) calculateAndDisplayRoute(directionsService, origin, destination, waypoints, props.setDirections);
                    
                }
            }
        });
    });

    return ((props.directions!.routes.length > 0) ? 
        <DirectionsRenderer
            directions={props.directions}
            options={{
            polylineOptions: {
                zIndex: 50,
                strokeColor: "#1976D2",
                strokeWeight: 5,
            },
            }}
        /> : <></>
    )
}

function getLatLngForPlace(placeName: string, callback: (coordenada: google.maps.LatLngLiteral | null) => void) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: placeName }, async (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results) {

            const loc = results[0].geometry.location;
            // Converte para um formato simples
            callback({ lat: loc.lat(), lng: loc.lng() });
        } else {
            console.error('Erro ao geocodificar:', placeName);
            callback(null);
        }
    });
}

function calculateAndDisplayRoute(
    directionsService: google.maps.DirectionsService,
    origin: LatLngLiteral,
    destination: LatLngLiteral,
    waypoints: google.maps.DirectionsWaypoint[],
    setDirections : React.Dispatch<React.SetStateAction<DirectionsResult>>,
    ) {
    directionsService.route(
        {
            origin: origin,
            destination: destination,
            waypoints: waypoints,
            optimizeWaypoints: true,
            travelMode: google.maps.TravelMode.DRIVING
        },
        (response, status) => {
          if (status === "OK" && response) {
            setDirections(response)
          } else {
            window.alert('Directions request failed due to ' + status);
        }
        }
        
    );
  }