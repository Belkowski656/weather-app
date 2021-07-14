const search = document.querySelector('.search__btn');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

let type = 'tomorrow';

window.addEventListener('load', () => {
    const success = (position) => {
        const {
            latitude,
            longitude
        } = position.coords;

        getCurrentWeather(latitude, longitude);
        getForecast(latitude, longitude);
    }

    const error = () => {
        const latitude = '52.237049';
        const longitude = '21.017532';

        getCurrentWeather(latitude, longitude);
        getForecast(latitude, longitude);
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
    input.value = '';

    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            getCurrentWeather(data[0].lat, data[0].lon)
            getForecast(data[0].lat, data[0].lon);
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

const showButtons = (forecast) => {
    const allDays = forecast.map(weather => weather.dayOfTheWeek);

    const uniqueDays = [...new Set(allDays)];

    const panel = document.querySelector('.details__panel');
    panel.innerHTML = '';

    uniqueDays.forEach((day, i) => {

        const index = forecast.findIndex(weather => weather.dayOfTheWeek === day);

        const dayOfTheMonth = forecast[index].dayOfTheMonth.toString();
        const month = forecast[index].month.toString();

        const btn = document.createElement('button');
        btn.classList.add('details__btn');
        if (i === 0) btn.classList.add('details__btn--active');
        btn.setAttribute('data-day', `${day}`);

        btn.textContent = `${day.slice(0,2)} ${dayOfTheMonth.length ===1? '0'+ dayOfTheMonth: dayOfTheMonth}.${month.length ===1? '0'+ month: month}`;

        panel.appendChild(btn);
    })
    const btns = document.querySelectorAll('.details__btn');

    btns.forEach(btn => btn.addEventListener('click', (e) => {
        document.querySelector('.details__btn--active').classList.remove('details__btn--active');

        e.target.classList.add('details__btn--active');
        showForecast(forecast, e.target.dataset.day);
    }))
};

const showForecast = (forecast, day) => {
    const weatherToShow = forecast.filter(weather => weather.dayOfTheWeek === day);

    const table = document.querySelector('.details__table');
    table.innerHTML = '';
    const firstRow = document.createElement('tr');
    firstRow.classList.add('details__row');

    firstRow.innerHTML = `<th class="details__category">Time</th>
        <th class="details__category">Temp [&#8451;]</th>
        <th class="details__category">Forecast</th>
        <th class="details__category">Max Temp [&#8451;]</th>
        <th class="details__category">Min Temp [&#8451;]</th>
        <th class="details__category">Precipitation [%]</th>
        <th class="details__category">Pressure [hPa]</th>
        <th class="details__category">Wind [km/h]</th>
        <th class="details__category">Humidity [%]</th>`;

    table.appendChild(firstRow);

    weatherToShow.forEach(weather => {
        const row = document.createElement('tr');
        row.classList.add('details__row');

        row.innerHTML = (
            `<td class="details__element details__time">${weather.hour.toString().length===1? '0' + weather.hour : weather.hour}:00</td>
        <td class="details__element">${weather.temp.toFixed(1)}</td>
        <td class="details__element"><img class="details__img" src="http://openweathermap.org/img/wn/${weather.icon}@2x.png"/></td>
        <td class="details__element">${weather.tempMax.toFixed(1)}</td>
        <td class="details__element">${weather.tempMin.toFixed(1)}</td>
        <td class="details__element">${(weather.pop*100).toFixed()}</td>
        <td class="details__element">${weather.pressure}</td>
        <td class="details__element">${(weather.wind*18/5).toFixed(1)}</td>
        <td class="details__element">${weather.humidity}</td>`);

        table.appendChild(row);
    })
};

const getForecast = (latitude, longitude) => {

    fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {

            const forecast = data.list.map(weather => {
                const date = new Date(weather.dt_txt);
                const dayOfTheWeek = days[date.getDay()];
                const dayOfTheMonth = date.getDate();
                const month = date.getMonth() + 1;
                const hour = date.getHours();

                return {
                    dayOfTheWeek,
                    dayOfTheMonth,
                    month,
                    hour,
                    temp: weather.main.temp,
                    tempMin: weather.main.temp_min,
                    tempMax: weather.main.temp_max,
                    icon: weather.weather[0].icon,
                    pop: weather.pop,
                    pressure: weather.main.pressure,
                    wind: weather.wind.speed,
                    humidity: weather.main.humidity,
                }
            });

            showButtons(forecast);
            showForecast(forecast, forecast[0].dayOfTheWeek);
        });

};

const showMap = (forecast) => {
    const voivodeship = document.querySelector(`[data-name="${forecast.city}"]`);

    voivodeship.innerHTML = (
        `<img class="map__icon" src="http://openweathermap.org/img/wn/${forecast.icon}@2x.png"/>
            <p class="map__temp">
                <span class="map__number">${forecast.temp.toFixed()}</span>
                <span class="map__degree">&#8451;</span>
            </p>`
    )
};

const getForecastForMap = (type) => {
    const cities = ['szczecin', 'gdańsk', 'olsztyn', 'białystok', 'zielona góra', 'poznań', 'bydgoszcz', 'warszawa', 'wrocław', 'opole', 'łódź', 'kielce', 'lublin', 'katowice', 'kraków', 'rzeszów'];

    if (type === 'current') {
        cities.forEach(city => {
            fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
                .then(response => response.json())
                .then(data => {
                    const forecast = {
                        city: data.name,
                        temp: data.main.temp,
                        icon: data.weather[0].icon,
                    }

                    showMap(forecast);
                })
        });
    } else {
        cities.forEach(city => {
            fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
                .then(response => response.json())
                .then(data => {
                    const city = data.city.name;

                    const today = new Date(data.list[0].dt_txt);
                    const tomorrowDate = new Date(today);
                    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
                    const tomorrow = tomorrowDate.getDate();

                    data.list.forEach(weather => {
                        const date = new Date(weather.dt_txt);
                        const day = date.getDate();
                        const hour = date.getHours();

                        if (tomorrow === day && hour === 12) {
                            const forecast = {
                                city,
                                temp: weather.main.temp,
                                icon: weather.weather[0].icon,
                            }
                            showMap(forecast);
                        }


                    })

                })
        });
    }

}

const changeTypeOfForecast = () => {
    const select = document.querySelector('.map__select');

    select.addEventListener('change', (e) => {
        type = e.target.value;
        getForecastForMap(type);
    })
}

changeTypeOfForecast();

getForecastForMap(type);