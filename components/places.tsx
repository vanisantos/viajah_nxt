import usePlacesAutocomplete, {
  getGeocode,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import { DirectionsResult, GptData, LatLngLiteral } from "./map";
import { Box } from "@chakra-ui/react";

export default function Places(props: { 
  setPlaces : React.Dispatch<React.SetStateAction<GptData[]>>
  setLoading : React.Dispatch<React.SetStateAction<boolean>>
  setDirections : React.Dispatch<React.SetStateAction<DirectionsResult>>
}) {

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

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

  const handleSelect = async (val: string) => {
    setValue(val, false);
    clearSuggestions();
    
    props.setPlaces([])
    props.setDirections(initialDirectionsResult)
    props.setLoading(true)

    const results = await getGeocode({ address: val });

    console.log(results[0].formatted_address);

    const hc = await fetch('/api/healthchecker', {
      method: 'GET'});
    const hc_resp = await hc.json();
    console.log(hc_resp);

    // setTimeout(() => {
    //   // Dados da API
    //   const data = "{\"rotas\": [\n{\"lugar\": \"Tower of London\", \"descricao\": \"A Torre de Londres é um castelo histórico localizado na margem norte do rio Tâmisa. É famoso por sua história como fortaleza, palácio real e prisão. Hoje em dia, abriga as Joias da Coroa.\"},\n{\"lugar\": \"London Eye\", \"descricao\": \"A London Eye é uma roda-gigante de observação localizada às margens do rio Tâmisa. É uma das atrações turísticas mais populares de Londres, oferecendo vistas deslumbrantes da cidade.\"},\n{\"lugar\": \"Buckingham Palace\", \"descricao\": \"Buckingham Palace é a residência oficial do monarca britânico em Londres. É conhecido por ser a casa da rainha e pelos cerimoniais da família real, como a troca da guarda.\"}\n]}"
    //   const parsedData = JSON.parse(data)
    //   props.setPlaces(
    //     parsedData.rotas as GptData[]
    //   );         
    //   props.setLoading(false);
    // }, 2000); // Simulando um atraso de 2 segundos

    try{
      const prompt = await fetch('/api/place', {
        method: 'POST',
         headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city: results[0].formatted_address }),
      });
      
      const data = await prompt.json();
      const parsedData = JSON.parse(data)
      props.setPlaces(
        parsedData.rotas as GptData[]
      );    
      props.setLoading(false)
    } catch(e){
      props.setLoading(false)
      window.alert("Houve um problema obtendo os dado da sua viagem, tente novamente em alguns minutos")
    }
    
  }

  return (     
    <Box color={"black"}>
    <Combobox onSelect={handleSelect}>
      <ComboboxInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        className="combobox-input"
        placeholder="Search a city" />
      <ComboboxPopover>
        <ComboboxList>
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <ComboboxOption key={place_id} value={description} />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
    </Box>
  );
}
