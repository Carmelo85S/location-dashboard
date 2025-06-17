import AddressInput from "./components/AddressInput";
import "./index.css";
import MapTraffic from "./components/traffic/MapTraffic";
import "./index.css";
import ErrorBoundary from "./components/error/ErrorBoudary";
import Weather from "./components/weather/Weather";

const App = () => {
  return (
    <>
        <div className="space-y-4">
          <ErrorBoundary>
            <AddressInput />
          </ErrorBoundary>
          <Weather />
          <MapTraffic />
        </div>
    </>
  );
};

export default App;