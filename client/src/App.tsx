import AddressInput from "./components/AddressInput";
import "./index.css";
import MapTraffic from "./components/traffic/MapTraffic";
import "./index.css";
import ErrorBoundary from "./components/error/ErrorBoudary";
import WheatherDeparture from "./components/weatherDeparture/WheatherDeparture";

const App = () => {
  return (
    <>
        <div className="space-y-4">
          <ErrorBoundary>
            <AddressInput />
          </ErrorBoundary>
          <WheatherDeparture />
          <MapTraffic />
        </div>
    </>
  );
};

export default App;