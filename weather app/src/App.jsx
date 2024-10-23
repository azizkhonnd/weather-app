import { useState, useEffect } from "react";
import axios from "axios";
import { FaBatteryEmpty, FaBatteryQuarter, FaBatteryHalf, FaBatteryThreeQuarters, FaBatteryFull } from 'react-icons/fa'; 
import { WiDaySunny, WiCloudy, WiRain, WiSnow } from 'react-icons/wi';


function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [time, setTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState(null);
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=dcf486a78f2b8e898c4b1a464a1b31e1`;

  const searchLocation = (event) => {
    if (event.key === 'Enter' || event.type === 'click') {
      axios.get(url).then((response) => {
        setData(response.data);
        console.log(response.data);
      });
      setLocation('');
    }
  };

  const renderBatteryIcon = () => {
    if (batteryLevel > 95) return <FaBatteryFull className="text-2xl" />;
    if (batteryLevel > 50) return <FaBatteryThreeQuarters className="text-2xl" />;
    if (batteryLevel > 25) return <FaBatteryHalf className="text-2xl" />;
    if (batteryLevel > 10) return <FaBatteryQuarter className="text-2xl" />;
    return <FaBatteryEmpty className="text-2xl" />;
  };

  useEffect(()=>{
    navigator.getBattery().then((battery)=>{
      setBatteryLevel((battery.level * 100).toFixed(0))

      battery.addEventListener("levelchange", ()=>{
        setBatteryLevel((battery.level * 100).toFixed(0))
      })
    })
  }, [])

  useEffect(()=>{
    const interval = setInterval (()=> {
      setTime(new Date())
    },1000)

    return () => clearInterval(interval)
  })

  const formatTime = (date) => {
    return date.toLocaleTimeString([],{
      hour: '2-digit',
      minute: '2-digit'});
  }

  const toCelsius = (fahrenheit) => {
    return ((fahrenheit - 32) * 5) / 9;
  };


  const getWeatherIcon = (weather) => {
    switch (weather) {
      case 'Clear':
    return <WiDaySunny className="text-7xl"/>;
      case 'Clouds':
    return <WiCloudy className="text-7xl"/>;
      case 'Rain':
    return <WiRain className="text-7xl"/>;
      case 'Snow':
    return <WiSnow className="text-7xl"/>;
      default:
    return null;
    }
  }


  return (
    <div className="app">
      <div className="search">
        <input 
          type="text" 
          value={location} 
          onChange={event => setLocation(event.target.value)}  
          placeholder="Enter city name" 
          onKeyDown={searchLocation}
        />
        <button onClick={searchLocation}>Search</button>
      </div>
      <div className="container">
        <div>
          <div className="location">
            <p className="flex justify-center">{data.name}</p>
          </div>
          <div className="temp flex items-center justify-center flex-col">
            {data.main ? <h1 className="flex justify-center">{toCelsius(data.main.temp).toFixed(0)}°C</h1> : null}
        {data.weather ? <div className="flex justify-center">{getWeatherIcon(data.weather[0].main)}</div> : null}
          <div className="description">
            {data.weather ? <p>{data.weather[0].main}</p> : null}
          </div>
          </div>
        </div>
        <div className="fixed top-[3%] right-5 flex gap-4 justify-center">
        <div>
            <p className='flex justify-center text-3xl'>{formatTime(time)}</p>
        </div>
        <div>
            {batteryLevel !==null && (
              <div className='battery'>
                <p className='flex justify-center items-center gap-1 mt-1 text-lg'>{renderBatteryIcon()}{batteryLevel}%</p>               
              </div>
            )}
        </div>
        </div>
        {data.name !== undefined &&       
          <div className="bottom flex items-center">
            <div className="feels">
              {data.main ? <p className="bold">{toCelsius(data.main.feels_like).toFixed(0)}°C</p> : null}
              <p>Feels Like</p>
            </div>
            <div className='line'></div>
            <div className="feels">
              <p className="bold">{data.main.humidity}%</p>
              <p>Humidity</p>
            </div>
            <div className='line'></div>
            <div className="wind">
              {data.wind ? <p className="bold">{data.wind.speed.toFixed()}km/h</p> : null} 
              <p>Wind Speed</p>   
            </div>
          </div>
        }
      </div>
    </div>
  );
}

export default App;
