import { useState, useEffect } from "react";
import axios from "axios";
import {
  List,
  WeatherForecastDay,
  WeatherTodayResponse,
} from "../../types/weather";
import { useAddressStore } from "../../store/store";

const WeatherComponent = () => {
  const coordinates = useAddressStore((state) => state.coordinates);

  const [currentWeather, setCurrentWeather] =
    useState<WeatherTodayResponse | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!coordinates) return;

    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);
      try {
        const currentWeatherResponse = await axios.get(
          `http://localhost:8080/weather?lat=${coordinates.lat}&lon=${coordinates.lon}`
        );
        setCurrentWeather(currentWeatherResponse.data);

        const forecastResponse = await axios.get(
          `http://localhost:8080/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}`
        );

        processForecastData(forecastResponse.data.list);
      } catch (error: any) {
        setError(error.message || "Could not fetch weather data.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [coordinates]);

  const processForecastData = (list: List[]) => {
    const processedData: WeatherForecastDay[] = [];
    list.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      const timeOfTheDay = new Date(item.dt * 1000).getHours();
      /* Consider only noon temperature*/
      if (timeOfTheDay < 12 || timeOfTheDay > 14) {
        return;
      }

      processedData.push({
        day: date,
        temperature: item.main.temp,
        humidity: item.main.humidity,
        icon: item.weather[0].icon,
      });
    });
    setWeatherData(processedData);
  };

  const getCurrentTime = (timeInMillis: number) =>
    new Date(timeInMillis * 1000).toLocaleTimeString();

  return (
    <div className="bg-foreground w-full p-6 rounded-lg shadow-lg">
      {currentWeather && (
        <div>
          <div className="mb-6 flex justify-between mx-auto items-center sm:flex-col rounded-lg">
            {/* Località */}
            <h2 className="text-xl font-semibold text-text whitespace-nowrap">
              {currentWeather.name}, {currentWeather.sys.country}
            </h2>

            {/* Ora attuale */}
            <p className="text-sm text-text whitespace-nowrap">
              {getCurrentTime(currentWeather.dt)}
            </p>

            {/* Meteo attuale */}
            <div className="flex items-center rounded-lg gap-3">
              <img
                src={`http://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png`}
                alt="Weather Icon"
                className="w-11 h-11 md:w-14 md:h-14"
              />
              <p className="text-3xl font-bold text-text">
                {currentWeather.main.temp}°C
              </p>
            </div>
          </div>
            <table className="w-full text-sm bg-foreground text-text">
              <thead className="bg-foreground">
                <tr>
                  <th className="px-4 py-2 text-left">Day</th>
                  <th className="px-4 py-2 text-center">Temp (°C)</th>
                  <th className="px-4 py-2 text-center">Humidity</th>
                  <th className="px-4 py-2 text-center">Icon</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : (
                  weatherData.map((weather, index) => (
                    <tr key={index} className="odd:bg-gray-50 even:bg-foreground hover:bg-gray-200 transition">
                      <td className="px-4 py-2">{weather.day}</td>
                      <td className="px-4 py-2 text-center">{weather.temperature}°C</td>
                      <td className="px-4 py-2 text-center">{weather.humidity}%</td>
                      <td className="px-4 py-2 text-center">
                        <img
                          src={`http://openweathermap.org/img/w/${weather.icon}.png`}
                          alt="Weather Icon"
                          className="w-6 h-6 mx-auto"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
        </div>
      )}
    </div>
  );
};

export default WeatherComponent;
