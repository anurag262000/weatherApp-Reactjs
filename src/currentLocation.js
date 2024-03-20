import React from "react";
import apiKeys from "./apiKeys";
import Clock from "react-live-clock";
import Forcast from "./forcast";
import loader from "./images/WeatherIcons.gif";
import ReactAnimatedWeather from "react-animated-weather";
const dateBuilder = (d) => {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
};
const defaults = {
  color: "white",
  size: 112,
  animate: true,
};
class Weather extends React.Component {
  state = {
    lat: undefined,
    lon: undefined,
    errorMessage: undefined,
    temperatureC: undefined,
    temperatureF: undefined,
    city: undefined,
    country: undefined,
    humidity: undefined,
    description: undefined,
    icon: "CLEAR_DAY",
    sunrise: undefined,
    sunset: undefined,
    errorMsg: undefined,
  };

  componentDidMount() {
    if (navigator.geolocation) {
      this.getPosition()
        .then((position) => {
          // Set latitude and longitude in state
          this.setState({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
          // Call getWeather with obtained latitude and longitude
          this.getWeather(position.coords.latitude, position.coords.longitude);
        })
        .catch((err) => {
          // Handle error if geolocation is not available
          this.setState({ errorMsg: "Geolocation not available" });
        });
    } else {
      this.setState({ errorMsg: "Geolocation not available" });
    }

    // Start fetching weather data periodically
    this.timerID = setInterval(
      () => this.getWeather(this.state.lat, this.state.lon),
      6000
    );
  }


  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  // tick = () => {
  //   this.getPosition()
  //   .then((position) => {
  //     this.getWeather(position.coords.latitude, position.coords.longitude)
  //   })
  //   .catch((err) => {
  //     this.setState({ errorMessage: err.message });
  //   });
  // }

  getPosition = (options) => {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };
  getWeather = async (lat, lon) => {
    const api_call = await fetch(
      `${apiKeys.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKeys.key}`
    );
    const data = await api_call.json();
    this.setState({
      lat: lat,
      lon: lon,
      city: data.name,
      temperatureC: Math.round(data.main.temp),
      temperatureF: Math.round(data.main.temp * 1.8 + 32),
      humidity: data.main.humidity,
      main: data.weather[0].main,
      country: data.sys.country,
      // sunrise: this.getTimeFromUnixTimeStamp(data.sys.sunrise),

      // sunset: this.getTimeFromUnixTimeStamp(data.sys.sunset),
    });
    switch (this.state.main) {
      case "Haze":
        this.setState({ icon: "CLEAR_DAY" });
        break;
      case "Clouds":
        this.setState({ icon: "CLOUDY" });
        break;
      case "Rain":
        this.setState({ icon: "RAIN" });
        break;
      case "Snow":
        this.setState({ icon: "SNOW" });
        break;
      case "Dust":
        this.setState({ icon: "WIND" });
        break;
      case "Drizzle":
        this.setState({ icon: "SLEET" });
        break;
      case "Fog":
        this.setState({ icon: "FOG" });
        break;
      case "Smoke":
        this.setState({ icon: "FOG" });
        break;
      case "Tornado":
        this.setState({ icon: "WIND" });
        break;
      default:
        this.setState({ icon: "CLEAR_DAY" });
    }


  };

  render() {
    let background;
    switch (this.state.main) {
      case "Haze":
        background = 'https://cdn.pixabay.com/photo/2017/11/04/08/14/tree-2916763_1280.jpg';
        break;
      case "Clouds":
        background = 'https://cdn.pixabay.com/photo/2015/12/25/13/03/sky-1107579_1280.jpg'
        break;
      case "Rain":
        background = 'https://cdn.pixabay.com/photo/2020/08/30/09/28/buildings-5528981_1280.jpg'
        break;
      case "Snow":
        background = 'https://cdn.pixabay.com/photo/2015/02/19/18/15/snow-642454_1280.jpg'
        break;
      case "Dust":
        background = 'https://cdn.pixabay.com/photo/2022/08/21/02/26/road-7400333_960_720.jpg'
        break;
      case "Drizzle":
        background = 'https://cdn.pixabay.com/photo/2019/10/30/21/52/gods-gift-4590644_1280.jpg'
        break;
      case "Fog":
        background = 'https://cdn.pixabay.com/photo/2016/11/22/19/10/clouds-1850093_1280.jpg'
        break;
      case "Smoke":
        background = 'https://cdn.pixabay.com/photo/2014/11/27/10/29/mountain-547363_640.jpg'
        break;
      case "Tornado":
        background = 'https://cdn.pixabay.com/photo/2020/02/18/06/25/grain-4858574_640.jpg'
        break;
      default:
        background = 'https://cdn.pixabay.com/photo/2017/11/04/08/14/tree-2916763_1280.jpg';
    }

    const cityStyle = {
      backgroundImage: `url(${background})`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",

      // Add any other background styles you need...
    };

    if (this.state.temperatureC) {
      return (
        <React.Fragment>

          <div className="city" style={cityStyle} >
            <div className="title">
              <ReactAnimatedWeather
                icon={this.state.icon}
                color={defaults.color}
                size={defaults.size}
                animate={defaults.animate}
              />
              <h2>{this.state.city}</h2>
              <h3>{this.state.country}</h3>
            </div>
            <div className="mb-icon">
              {" "}
              <ReactAnimatedWeather
                icon={this.state.icon}
                color={defaults.color}
                size={defaults.size}
                animate={defaults.animate}
              />
              <p>{this.state.main}</p>
            </div>
            <div className="date-time">
              <div className="dmy">
                <div id="txt"></div>
                <div className="current-time">
                  <Clock format="HH:mm:ss" interval={1000} ticking={true} />
                </div>
                <div className="current-date">{dateBuilder(new Date())}</div>
              </div>
              <div className="temperature">
                <p>
                  {this.state.temperatureC}°<span>C</span>
                </p>
                <span className="slash">/</span>
                {this.state.temperatureF} &deg;F
              </div>
            </div>
          </div>

          <Forcast icon={this.state.icon} weather={this.state.main} />
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <img src={loader} style={{ width: "50%", WebkitUserDrag: "none" }} alt="Loading..." />
          <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
            Detecting your location
          </h3>
          <h3 style={{ color: "white", marginTop: "10px" }}>
            Your current location wil be displayed on the App <br></br> & used
            for calculating Real time weather.
          </h3>
        </React.Fragment>
      );
    }
  }
}

export default Weather;
