import { useAddressStore } from "../../store/store";

const SelectedCoordinates = () => {
  // Using Zustand store to manage state
  const coordinates = useAddressStore((state) => state.coordinates);
  const selectedAddress = useAddressStore((state) => state.selectedAddress);

  const defaultCoordinates = { lat: 59.32671282807284, lon: 18.022816125917494 };
  const defaultAddress = "Stockholm, Sweden";

  const formatAddress = (address: string) => {
    const formatted = address.replace(/,([^\s])/g, ", $1");
    return formatted;
  };

  const displayCoordinates = coordinates || defaultCoordinates;
  const displayAddress = selectedAddress || defaultAddress;

  return (
    <section className="flex justify-center items-center flex-col bg-background">
      <div className="mx-auto w-3/4 text-center p-2 rounded-lg">
        <h3 className="text-lg font-semibold">Adress:</h3>
        <p className="text-sm">{formatAddress(displayAddress)}</p>
      </div>
      <div className="flex flex-col justify-center items-center mx-auto w-3/4 text-center rounded-lg">
        <h4 className="text-lg font-semibold mt-2">Koordinater:</h4>
        <p className="text-sm">Latitud: {displayCoordinates.lat}</p>
        <p className="text-sm">Longitud: {displayCoordinates.lon}</p>
      </div>
    </section>
  );
};

export default SelectedCoordinates;