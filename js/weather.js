const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

window.addEventListener('load', () => {
    const success = (position) => {
        const {
            latitude,
            longitude
        } = position.coords;
        getCurrentWeather(latitude, longitude);
    }

    const error = () => {
        const latitude = '52.237049';
        const longitude = '21.017532';
        getCurrentWeather(latitude, longitude);
    }

    if (!navigator.geolocation) {
        error();
    } else {
        navigator.geolocation.getCurrentPosition(success, error);
    }
})

const getCurrentWeather = (latitude, longitude) => {
    fetch(`https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const date = new Date();
            const month = date.getMonth() + 1;
            const dayOfTheMonth = date.getDate();
            const dayOfTheWeek = date.getDay();
            const hour = date.getHours();
            const minutes = date.getMinutes();
            weather = {
                city: data.data[0].city_name,
                month,
                dayOfTheMonth,
                dayOfTheWeek,
                hour,
                minutes,
                icon: data.data[0].weather.icon,
                temp: data.data[0].temp,
                appTemp: data.data[0].app_temp,
                pressure: data.data[0].pres,
                wind: data.data[0].wind_spd,
                aqi: data.data[0].aqi,
            }
            showCurrentWeather(weather);
        });
}

const showCurrentWeather = (weather) => {
    const data = weather;
    const aqi = weather.aqi;
    let aqiMessage = '';
    let color = '';

    if (aqi <= 50) {
        aqiMessage = 'Good'
        color = '#55A84F';
    } else if (aqi > 50 && aqi <= 100) {
        aqiMessage = 'Satisfactory'
        color = '#A3C853';
    } else if (aqi > 100 && aqi <= 150) {
        aqiMessage = 'Moderate'
        color = '#FFF833';
    } else if (aqi > 150 && aqi <= 200) {
        aqiMessage = 'Unhealthy'
        color = '#F29C33';
    } else if (aqi > 200 && aqi <= 300) {
        aqiMessage = 'Very Unhealthy'
        color = '#F1F1F1';
    } else if (aqi > 300 && aqi <= 500) {
        aqiMessage = 'Hazardous'
        color = '#141518';
    }

    document.querySelector('.weather__city').textContent = data.city;

    document.querySelector('.weather__span').textContent = `${days[data.dayOfTheWeek]} ${data.dayOfTheMonth}.${data.month.toString().length===1? '0'+data.month: data.month}`;

    document.querySelector('.weather__time').textContent = `(${data.hour}:${data.minutes})`;

    document.querySelector('.weather__img').src = `./src/${data.icon}.png`;
    document.querySelector('.weather__temp').textContent = data.temp;

    document.querySelector('.weather__value:nth-of-type(1)').innerHTML = data.appTemp + ' &#8451;';
    document.querySelector('.weather__value:nth-of-type(2)').textContent = data.pressure.toFixed(1) + ' hPa';
    document.querySelector('.weather__value:nth-of-type(3)').textContent = (data.wind * 18 / 5).toFixed(1) + ' km/h';
    const aqiText = document.querySelector('.weather__value:nth-of-type(4)');

    aqiText.textContent = aqiMessage;
    aqiText.style.color = color;
};

const showDetails = (weatherData) => {
    console.log(weatherData);
};

// const getWeather = (latitude, longitude, forecast) => {
//     fetch(`https://api.weatherbit.io/v2.0/forecast/hourly?lat=${latitude}&lon=${longitude}&key=${apiKey}&hours=48`)
//         .then(response => response.json())
//         .then(data => {
//             const cityName = data.city_name;
//             const weatherData = data.data.map(data => {
//                 const date = new Date(data.timestamp_local);
//                 const month = date.getMonth() + 1;
//                 const dayOfTheMonth = date.getDate();
//                 const dayOfTheWeek = date.getDay();
//                 const hour = data.timestamp_local.slice(11, -3);

//                 return {
//                     cityName,
//                     month,
//                     dayOfTheMonth,
//                     dayOfTheWeek,
//                     hour,
//                     icon: data.weather.icon,
//                     temp: data.temp,
//                     appTemp: data.app_temp,
//                     pressure: data.pres,
//                     wind: data.wind_spd,
//                     humidity: data.rh,
//                     pop: data.pop,
//                 }
//             })

//             showCurrentWeather(weatherData);
//             showDetails(weatherData)
//         });
// }