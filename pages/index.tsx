//https://www.youtube.com/watch?v=2po9_CIRW7I
//https://github.com/leighhalliday/google-maps-react-crash-course

// rest from next: https://rapidapi.com/guides/call-apis-next
import { useLoadScript } from "@react-google-maps/api";
import Map from "../components/map";

export default function Home() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <Map />;
}
