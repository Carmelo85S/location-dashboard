import Traffic from "./Traffic";
import SelectedCoordinates from "./SelectedCoordinates";

const MapTraffic = () => {
  return (
    <section className="flex justify-center w-5/6 mx-auto flex-col bg-background sm:flex-row sm:space-x-6">
        <SelectedCoordinates />
        <Traffic />
    </section>
  );
};

export default MapTraffic;
