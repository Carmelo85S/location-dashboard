import Weather from '../weather/Weather'

const WheatherDeparture = () => {
  return (
    <div className="flex flex-col w-5/6 md:flex-row gap-8 p-6 max-w-screen-xl mx-auto">
      <Weather />
    </div>
  )
}

export default WheatherDeparture
