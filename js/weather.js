const search = document.querySelector('.search__btn');

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

search.addEventListener('click', (e) => {
    e.preventDefault();
    const input = document.querySelector('.search__input');
    const city = input.value;

    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            getCurrentWeather(data[0].lat, data[0].lon)
        });

})

const getCurrentWeather = (latitude, longitude) => {
    fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const date = new Date();
            const month = date.getMonth() + 1;
            const dayOfTheMonth = date.getDate();
            const dayOfTheWeek = date.getDay();
            const hour = date.getHours();
            const minutes = date.getMinutes();

            weather = {
                city: data.name,
                month,
                dayOfTheMonth,
                dayOfTheWeek,
                hour,
                minutes,
                icon: data.weather[0].icon,
                temp: data.main.temp,
                feelsLike: data.main.feels_like,
                pressure: data.main.pressure,
                wind: data.wind.speed,
                humidity: data.main.humidity
            }
            showCurrentWeather(weather);
        });
}

const showCurrentWeather = (weather) => {
    const data = weather;

    document.querySelector('.weather__city').textContent = data.city;

    document.querySelector('.weather__span').textContent = `${days[data.dayOfTheWeek]} ${data.dayOfTheMonth}.${data.month.toString().length===1? '0'+data.month: data.month}`;

    document.querySelector('.weather__time').textContent = `(${data.hour}:${data.minutes.toString().length === 1? '0'+ data.minutes : data.minutes })`;

    document.querySelector('.weather__img').src = `http://openweathermap.org/img/wn/${data.icon}@2x.png`;
    document.querySelector('.weather__temp').textContent = data.temp.toFixed(1);

    document.querySelector('.weather__value:nth-of-type(1)').innerHTML = data.feelsLike.toFixed(1) + ' &#8451;';
    document.querySelector('.weather__value:nth-of-type(2)').textContent = data.pressure.toFixed(1) + ' hPa';
    document.querySelector('.weather__value:nth-of-type(3)').textContent = (data.wind * 18 / 5).toFixed(1) + ' km/h';
    document.querySelector('.weather__value:nth-of-type(4)').textContent = data.humidity + ' %';

};

// const showDetails = (weatherData) => {
//     console.log(weatherData);
// };

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