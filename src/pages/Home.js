// from NPM
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from 'recharts';
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import moment from 'moment';
// Custom Components
import CustomTooltip from "./../components/CustomTooltip";
import UVBar from "./../images/UV-bar.png"
import Logo from "./../images/fav.png"

const Home = () => {
    const [location, setLocation] = useState(null)
    const [current, setCurrent] = useState(null)
    const [forecast, setForecast] = useState(null)
    const [hoveredLine, setHoveredLine] = useState(null);
    const isOnline = navigator.onLine;
    var pollutants = ["pm2_5", "pm10", "o3", "no2", "so2", "co", "us-epa-index", "gb-defra-index"]
    var currentPollutant = "pm2_5"
    var HHA = moment().format('hh:mm A')

    useEffect(() => {
        const url = "https://api.weatherapi.com/v1/forecast.json?key=fe1b386df6c541aba8c105248212610&q=auto:ip&aqi=yes&days=5&alert=yes";
        isOnline && fetch(url)
            .then(res => res.json())
            .then(data => {
                document.title = "Atomic Weather - " + data.location.name + ", " + data.location.region
                setLocation(data.location);
                setCurrent(data.current);
                setForecast(data.forecast);
                localStorage.setItem("weather-data", JSON.stringify(data));

                document.body.style.background = `url(${codeToBackground(data.current.condition.code)})`;
                document.body.style.backgroundSize = "110% 110%";
                document.body.style.backgroundRepeat = "no-repeat";
                document.body.style.backgroundAttachment = "fixed";
            })

        if (!isOnline) {
            const data = JSON.parse(localStorage.getItem("weather-data"));
            setLocation(data.location);
            setCurrent(data.current);
            setForecast(data.forecast);

            document.body.style.background = `url(${codeToBackground(data.current.condition.code)})`;
            document.body.style.backgroundSize = "110% 110%";
            document.body.style.backgroundRepeat = "no-repeat";
            document.body.style.backgroundAttachment = "fixed";
        }
    }, [])

    function formatTime(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return hours + ':' + minutes + ' ' + ampm;
    }

    function animateAirQuality() {
        if (document.getElementById("AQI-val")) {
            var indexofCurrentPollutant = pollutants.indexOf(currentPollutant)
            if (indexofCurrentPollutant == pollutants.length - 1) {
                document.getElementById("AQI-val").innerHTML = roundNumber(current.air_quality.pm2_5)
                document.getElementById("AQI-lab").innerHTML = "AQI - PM2.5"
                currentPollutant = pollutants[0]
            } else {
                document.getElementById("AQI-val").innerHTML = roundNumber(current.air_quality[pollutants[indexofCurrentPollutant + 1]])
                document.getElementById("AQI-lab").innerHTML = "AQI - " + pollutants[indexofCurrentPollutant + 1].toUpperCase()
                currentPollutant = pollutants[indexofCurrentPollutant + 1]
            }
        }
        setTimeout(() => {
            animateAirQuality();
        }, 5000);
    }

    function roundNumber(number) {
        return Math.round(number);
    }

    function codeToBackground(code) {
        switch (code) {
            case 1000:
                return "https://images.pexels.com/photos/912110/pexels-photo-912110.jpeg"; // Clear sky
            case 1003:
                return "https://images.pexels.com/photos/158163/clouds-cloudporn-weather-lookup-158163.jpeg"; // Partly cloudy
            case 1006:
                return "https://images.pexels.com/photos/158163/clouds-cloudporn-weather-lookup-158163.jpeg"; // Cloudy
            case 1009:
                return "https://images.pexels.com/photos/158163/clouds-cloudporn-weather-lookup-158163.jpeg"; // Overcast
            case 1030:
                return "https://images.pexels.com/photos/158163/clouds-cloudporn-weather-lookup-158163.jpeg"; // Mist
            case 1063:
                return "https://images.pexels.com/photos/110874/pexels-photo-110874.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"; // Patchy rain possible
            case 1066:
                return "https://images.pexels.com/photos/15326984/pexels-photo-15326984/free-photo-of-man-with-an-umbrella-walking-in-snow.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"; // Patchy snow possible
            case 1069:
                return "https://images.pexels.com/photos/235621/pexels-photo-235621.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"; // Patchy sleet possible
            case 1072:
                return "https://scx2.b-cdn.net/gfx/news/hires/2017/nasasolvesad.jpg"; // Patchy freezing drizzle possible
            case 1087:
                return "https://images.pexels.com/photos/53459/lightning-storm-weather-sky-53459.jpeg"; // Thundery outbreaks possible
            default:
                return "https://images.pexels.com/photos/912110/pexels-photo-912110.jpeg"; // Default image
        }
    }

    const legendFormatter = (value) => {
        switch (value) {
            case 'vis_km':
                return 'Visibility (km)';
            case 'aqi':
                return 'Air Quality Index';
            case 'uv':
                return 'UV Index';
            case 'chance_of_rain':
                return 'Chance of Rain';
            case 'temp_c':
                return 'Temperature (°C)';
            default:
                return value;
        }
    };

    return (<>
        {!forecast && !current && <>
            <div style={{
                width: "100vw",
                height: "100vh",
                position: "absolute",
                top: "0",
                left: "0",
                background: "#5c707f"
            }}>
                <div style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)"
                }}>
                    <img src={Logo} alt="Logo" width={150} />
                </div>
            </div>
        </>}

        {forecast && current && <div>
            <div className="home">

                <div className="current">

                    {isOnline && <>
                        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6, ease: "easeIn" }}>
                            <center>
                                <img className="icon" src={current.condition.icon} alt="" />
                            </center>
                            <h1 className="temp f-giant">
                                {current.temp_c}°
                            </h1>
                            <p className="condition-text">
                                {current.condition.text}
                            </p>
                            <div className="location">
                                <p>{HHA}, {location.name}, {location.region}</p>
                                <br />
                                <p>Current conditions</p>
                            </div>
                        </motion.div>

                        <div className="boxes">
                            <center>
                                <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }} className="box" style={{ marginRight: "10px", marginBottom: "10px" }}>
                                    <div className="content">
                                        <h1 className="value">{current.cloud}<span>%</span> </h1>
                                        <p className="label">Cloud Cover</p>
                                    </div>
                                </motion.div>
                                <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }} className="box">
                                    <div className="content">
                                        <h1 className="value">{current.humidity}<span>%</span></h1>
                                        <p className="label">Humidity</p>
                                    </div>
                                </motion.div>
                                <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="box" style={{ marginRight: "10px", marginBottom: "10px" }}>
                                    <div className="content">
                                        <h1 className="value">{current.vis_km}<span>km</span></h1>
                                        <p className="label">Visibility</p>
                                    </div>
                                </motion.div>
                                <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="box" id="AQI-box" onLoad={animateAirQuality()}>
                                    <div className="content">
                                        <h1 className="value" id="AQI-val">{roundNumber(current.air_quality.pm2_5)}</h1>
                                        <p className="label" id="AQI-lab">AQI - PM2.5</p>
                                    </div>
                                </motion.div>
                                <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="box" style={{ marginRight: "10px" }}>
                                    <div className="content">
                                        <h1 className="value">{current.uv}</h1>
                                        <p className="label">UV Index</p>
                                    </div>
                                </motion.div>
                                <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.4, delay: 0 }} className="box">
                                    <div className="content">
                                        <h1 className="value">{current.precip_mm}<span>mm</span></h1>
                                        <p className="label">Precepetation</p>
                                    </div>
                                </motion.div>
                            </center>
                        </div>
                    </>}

                    {!isOnline && <>
                        <div style={{
                            position: "absolue",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)"
                        }}>
                            <h1>
                                Offline
                            </h1>
                            <p>
                                Using last synced values at ${current.last_updated}
                            </p>
                        </div>
                    </>}

                </div>

                <div className="forecast">
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="box">
                        <div className="title">
                            <p>Hourly Forecast</p>
                        </div>
                        <div className="content">
                            {forecast.forecastday[0].hour.filter(hourlyForecast => new Date(hourlyForecast.time) > new Date()).map((hourlyForecast, index) => {
                                const time = formatTime(new Date(hourlyForecast.time));
                                return (
                                    <>
                                        <div className="hourly" key={`Hourly-${time}`}>
                                            <div className="always">
                                                <img src={hourlyForecast.condition.icon} alt="" />
                                                <h1 className="temp">{roundNumber(hourlyForecast.temp_c)}°</h1>
                                                <p className="label">{hourlyForecast.condition.text}</p>
                                                <p className="time">{time}</p>
                                            </div>
                                            <div className="extended">
                                                <div className="text-info">
                                                    <p> {hourlyForecast.vis_km}<span>km Visibility</span> </p>
                                                    <p> {hourlyForecast.chance_of_rain}<span>% Chance of rain</span> </p>
                                                    <p> {hourlyForecast.cloud}<span>% Cloud cover</span> </p>
                                                    <p> {hourlyForecast.wind_kph}<span>km/h Wind</span> </p>
                                                    <p> {hourlyForecast.humidity}<span>% Humidity</span> </p>
                                                </div>
                                                <div className="uv-info">
                                                    <h1 style={{ fontSize: "7rem" }}>
                                                        {hourlyForecast.uv}
                                                    </h1>

                                                    <div style={{
                                                        textAlign: "left",
                                                        paddingLeft: `${(hourlyForecast.uv * 10) - 9}%`,
                                                        zIndex: "3",
                                                        position: "relative"
                                                    }}>
                                                        <div className="circle" style={{ zIndex: "3", position: "relative" }} /> {/* Add position: "relative" here */}
                                                    </div>

                                                    <div style={{ marginTop: "-20px", zIndex: "-1" }}>
                                                        <img src={UVBar} alt="UV Index Bar" style={{ zIndex: "-1" }} />
                                                        <p style={{ zIndex: "-1" }}>UV Index</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )
                            })}
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="box">
                        <div className="title">
                            <p>Daily Forecast</p>
                        </div>
                        <div className="content">
                            {forecast.forecastday.map((dailyForecast, index) => {
                                return (
                                    <>
                                        <div className="hourly daily" key={`Daily-${dailyForecast.date}`}>
                                            <div className="always">
                                                <img src={dailyForecast.day.condition.icon} alt="" />
                                                <h1 className="temp">{roundNumber(dailyForecast.day.avgtemp_c)}°</h1>
                                                <p className="label">{dailyForecast.day.condition.text}</p>
                                                <p className="time">{index === 0 && "Today - Average values" || index === 1 && "Tomorrow" || dailyForecast.date}</p>
                                            </div>
                                            <div className="extended">
                                                <div className="text-info">
                                                    <p> {dailyForecast.day.maxtemp_c}<span>°C Max</span> </p>
                                                    <p> {dailyForecast.day.mintemp_c}<span>°C Min</span> </p>
                                                    <p> {dailyForecast.day.maxwind_kph}<span>km/h Max Wind</span> </p>
                                                    <p> {dailyForecast.day.daily_chance_of_rain}<span>% Chance of rain</span> </p>
                                                    <p> {dailyForecast.day.avghumidity}<span>% Humidity</span> </p>
                                                </div>

                                            </div>
                                        </div>
                                    </>
                                )
                            })}
                        </div>
                    </motion.div>

                    <motion.div className="box" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                        {/* <div className="content"> */}
                        <ResponsiveContainer width="100%" height="100%" >
                            <LineChart width={600} height={100} data={forecast.forecastday[0].hour} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <Line type="monotone" dataKey="temp_c" stroke="#BF55EC" strokeWidth={hoveredLine === 'temp_c' ? 7 : 2} dot={false} yAxisId={0} label={({ x, y, value }) => (
                                    <text x={x} y={y} dy={-4} fill="#BF55EC" fontSize={10} textAnchor="middle">
                                        {value}
                                    </text>
                                )} onMouseEnter={() => setHoveredLine('temp_c')} onMouseLeave={() => setHoveredLine(null)} style={{ cursor: "pointer" }} />
                                <Line type="monotone" dataKey="humidity" stroke="lightblue" strokeWidth={hoveredLine === 'humidity' ? 7 : 2} dot={false} yAxisId={0} label={({ x, y, value }) => (
                                    <text x={x} y={y} dy={-4} fill="lightblue" fontSize={10} textAnchor="middle">
                                        {value}
                                    </text>
                                )} onMouseEnter={() => setHoveredLine('humidity')} onMouseLeave={() => setHoveredLine(null)} style={{ cursor: "pointer" }} />
                                <Line type="monotone" dataKey="cloud" stroke="lightblue" strokeWidth={hoveredLine === 'cloud' ? 7 : 2} dot={false} yAxisId={0} label={({ x, y, value }) => (
                                    <text x={x} y={y} dy={-4} fill="lightblue" fontSize={10} textAnchor="middle">
                                        {value}
                                    </text>
                                )} onMouseEnter={() => setHoveredLine('cloud')} onMouseLeave={() => setHoveredLine(null)} style={{ cursor: "pointer" }} />
                                <Line type="monotone" dataKey="chance_of_rain" stroke="lightblue" strokeWidth={hoveredLine === 'chance_of_rain' ? 7 : 2} dot={false} yAxisId={0} label={({ x, y, value }) => (
                                    <text x={x} y={y} dy={-4} fill="lightblue" fontSize={10} textAnchor="middle">
                                        {value}
                                    </text>
                                )} onMouseEnter={() => setHoveredLine('chance_of_rain')} onMouseLeave={() => setHoveredLine(null)} style={{ cursor: "pointer" }} />
                                <Line type="monotone" dataKey="uv" stroke="#ffc658" strokeWidth={hoveredLine === 'uv' ? 7 : 2} dot={false} yAxisId={1} label={({ x, y, value }) => (
                                    <text x={x} y={y} dy={-4} fill="#ffc658" fontSize={10} textAnchor="middle">
                                        {value}
                                    </text>
                                )} onMouseEnter={() => setHoveredLine('uv')} onMouseLeave={() => setHoveredLine(null)} style={{ cursor: "pointer" }} />
                                <Line type="monotone" dataKey="vis_km" stroke="lightgreen" strokeWidth={hoveredLine === 'vis_km' ? 7 : 2} dot={false} yAxisId={2} label={({ x, y, value }) => (
                                    <text x={x} y={y} dy={-4} fill="lightgreen" fontSize={10} textAnchor="middle">
                                        {value}
                                    </text>
                                )} onMouseEnter={() => setHoveredLine('vis_km')} onMouseLeave={() => setHoveredLine(null)} style={{ cursor: "pointer" }} />
                                <Tooltip content={<CustomTooltip hoveredLine={hoveredLine} data={forecast.forecastday[0].hour} />} />
                                <CartesianGrid stroke="#B9B5B54D" strokeDasharray="4 5" />
                                <XAxis dataKey="time" tickFormatter={(timeStr) => moment(timeStr, 'YYYY-MM-DD HH:mm').format('hA')} interval={2} />
                                <YAxis yAxisId={2} orientation="right" width={30} stroke="lightgreen" />
                                <YAxis yAxisId={1} orientation="right" width={30} stroke="#ffc658" />
                                <YAxis yAxisId={0} orientation="right" width={40} stroke="lightblue" />
                                <Legend formatter={legendFormatter} />
                            </LineChart>
                        </ResponsiveContainer>
                        {/* </div> */}
                    </motion.div>
                </div>

                <div className="disclamer">
                    <p>
                        Data provided by <a href="https://www.weatherapi.com/" title="Free Weather API">WeatherAPI.com</a>. Data may change periodically and may not be 100% accurate.
                    </p>
                </div>
            </div>
        </div>}
    </>);
}

export default Home;