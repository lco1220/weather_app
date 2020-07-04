window.addEventListener("load",  () => {

let now = new Date();
let localtime = now.getTime();
let localOffset = now.getTimezoneOffset() * 60000;
let localUTC = localtime + localOffset;

const userInput = document.getElementById('userInputLoc');
const btnInput = document.getElementById('submit');
const radBtn = document.getElementsByName('temp_options');
const daily__content = document.querySelector('#daily_container');
const hourly__content = document.querySelector('#hourly_container');
document.getElementById('celsius').checked = true;
let defaultUnit= 'metric';
userInput.value = '';

convertTimezone = (tz, sun) => {
  let timezoneToMilli = 1000 * tz,

      sunMilli = 1000 * sun,
      sunDateUTC = new Date(sunMilli),
      sunUTC = sunDateUTC.getTime() + (sunDateUTC.getTimezoneOffset() * 60000) + timezoneToMilli,
      newsunDate = new Date(sunUTC),
      sundateHr = newsunDate.getHours(),
      sundateMin = newsunDate.getMinutes(),
      formatsundate = `${sundateHr}:${sundateMin}`,

      ctryDateUTC = localUTC + timezoneToMilli,
      countryDate = new Date(ctryDateUTC),
      countryDateArr = countryDate.toString().split(' '),
      formatctrydate = 
        `${countryDateArr[0]}, ${countryDateArr[2]} ${countryDateArr[1]} ${countryDateArr[4]}`;

      country_date_sun = {
        'date': formatctrydate,
        'sun': formatsundate,
        'fullctrydate':ctryDateUTC,
        'fullsundate': sunUTC
      }
  return country_date_sun;
}

removeAnimate = (selector, animate) => {
  document.querySelector(selector).addEventListener('animationend', () => {
    document.querySelector(selector).classList.remove(animate);
  })
}

roundTemp = number => {
  return Math.round((number + Number.EPSILON) * 10) / 10
}

const groupBy = key => array =>
array.reduce((objectsByKeyValue, obj) => {
  const value = obj[key];
  objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
  return objectsByKeyValue;
}, {});

createElement = element => {
  return document.createElement(element);
}

changeUnit = (element,unit) => {
  if(unit == 'metric') {
    element.classList.toggle('temp__switch--cel');
  } else if(unit == 'imperial'){
    element.classList.toggle('temp__switch--fah');
  }
}

showData = data => {

  try {
  daily__content.textContent = ' '
  hourly__content.textContent = ' '
  let current = data.ocall.current
  let daily = data.ocall.daily.map(item => {
    return item;
  })

  let hourly = data.ocall.hourly.map(hour => {
    return hour;
  })

  userInput.value = `${data.name}, ${data.country}`;
  let country_tzdate = convertTimezone(data.ocall.timezone_offset)
  let sunrise = convertTimezone(data.ocall.timezone_offset, current.sunrise).sun;
  let sunset = convertTimezone(data.ocall.timezone_offset, current.sunset).sun,
      max_temp = document.getElementById('max__temp'),
      min_temp = document.getElementById('min__temp');

      max_temp.classList = ' ';
      min_temp.classList = ' ';

  document.querySelector('.weather__section').classList.add('show_weather');
  document.querySelector('.weather__section').classList.remove('opacity-0');
  document.querySelector('.weather__section').classList.add('animate__fadeIn');
  document.querySelector('.weather__features').classList.remove('opacity-0');
  document.getElementById('error').classList.add('hidden');
  document.getElementById('info').classList.add('hidden')

  document.getElementById('location__id').textContent = `${data.name}, ${data.country}`;
  document.getElementById('location__date').textContent = `${country_tzdate.date}`
  document.getElementById('condition__id').textContent = `${current.weather[0].description}`;

  document.getElementById('temp__id').textContent = roundTemp(current.temp);  
  max_temp.textContent = roundTemp(daily[0].temp.max)
  min_temp.textContent = roundTemp(daily[0].temp.min) // (Math.round((daily[0].temp.min + Number.EPSILON) * 10) / 10)

  
  document.getElementById('humid__id').textContent = `${current.humidity}`;
  if(current.wind_gust) {
    document.getElementById('wind_id').textContent = 
      `Wind Gust: ${current.wind_gust} m/s`;
  } else {
    document.getElementById('wind_id').textContent = 
      `Wind Speed: ${current.wind_speed} m/s`;
  }
  document.getElementById('rise_time').textContent = `${sunrise}`;
  document.getElementById('set_time').textContent = `${sunset}`;

  daily.map(dd=> {
    let dd_utc = 
          convertTimezone(data.ocall.timezone_offset, dd.dt),
        dd_date = new Date(dd_utc.fullsundate),
        dd_arr = dd_date.toString().split(' '),
        ctry_utc = dd_utc.fullctrydate,
        ctry_date = new Date(ctry_utc),
        daily_day = `${dd_arr[0]}, ${dd_arr[2]} ${dd_arr[1]}`,
        current_day = '',
        dd_day_temp = (Math.round((dd.temp.day + Number.EPSILON) * 10) / 10),
        dd_night_temp = (Math.round((dd.temp.night + Number.EPSILON) * 10) / 10),
        div = createElement('div');
    div.classList.add('card__content', 'card__content--daily');

      if(ctry_date.getDate() == dd_date.getDate()){
        current_day = 'Current'
        div.classList.add('bg-gray-300')
      } else {
        current_day = ' ';
      }

    let div_day = createElement('div');
    div_day.classList.add('card__dt');
    let text_wrap = createElement('h4');
    let p_wrap = createElement('p');
    p_wrap.classList.add('text-gray-600')
    let p_text = document.createTextNode(`${current_day}`);
    let day_text = document.createTextNode(`${daily_day}`);
    p_wrap.appendChild(p_text);
    text_wrap.appendChild(day_text)
    div_day.appendChild(p_wrap);
    div_day.insertBefore(text_wrap, p_wrap);

    let div_image = createElement('div');
    div_image.classList.add('card__image');
    let image = createElement('img');
    image.src = `http://openweathermap.org/img/wn/${dd.weather[0].icon}@2x.png`;
    image.alt = `${dd.weather[0].description}`
    div_image.appendChild(image)
  
    let div_temp = createElement('div');
    div_temp.classList.add('card__temp');
    let text_wrap_morn = createElement('h4');
    text_wrap_morn.classList.add('daily__temp--morn');
    let text_wrap_night = createElement('h4');
    text_wrap_night.classList.add('daily__temp--night', 'mt-2');
    let morn_text = document.createTextNode(`${dd_day_temp}`);
    let night_text = document.createTextNode(`${dd_night_temp}`);
    text_wrap_night.appendChild(night_text)
    text_wrap_morn.appendChild(morn_text);
    div_temp.insertAdjacentElement('beforeend',text_wrap_morn);
    div_temp.insertAdjacentElement('beforeend',text_wrap_night);

    daily__content.appendChild(div);
      div.appendChild(div_temp);
      div.insertBefore(div_image, div.childNodes[0])
      div.insertBefore(div_day, div.childNodes[0])

      changeUnit(text_wrap_night,defaultUnit);
      changeUnit(text_wrap_morn,defaultUnit);

  })

  for (let i = 0; i < hourly.length; i++) {
    let hr_utc = convertTimezone(data.ocall.timezone_offset, hourly[i].dt),
        hr_date = new Date(hr_utc.fullsundate),
        hr_date_arr = hr_date.toString().split(' ');
        hourly[i]['day'] = `${hr_date_arr[2]}`;
  }
  const groupByDay = groupBy('day');
  const hourly__day = (groupByDay(hourly));

  let keys = Object.keys(hourly__day);
  for(let i = 0; i< keys.length;i++){
    let value = hourly__day[keys[i]];
    let hr_utc = convertTimezone(data.ocall.timezone_offset, value[0].dt),
    hr_date = new Date(hr_utc.fullsundate),
    hr_date_arr = hr_date.toString().split(' ')
    hr_day = `${hr_date_arr[0]}, ${hr_date_arr[2]} ${hr_date_arr[1]}`,
    card_div = createElement('div'),
    card_title = createElement('div'),
    h4_card_title = createElement('h4'),
    h4_text = document.createTextNode(`${hr_day}`),
    content_container = createElement('div'),

    card_div.classList.add('card__container--hourly');
    card_title.classList.add('card__title--date');
        
    h4_card_title.appendChild(h4_text);
    card_title.appendChild(h4_card_title);

      for(let j = 0; j<value.length; j+=3) {
        let
        val_utc = convertTimezone(data.ocall.timezone_offset, value[j].dt),
        val_date = new Date(val_utc.fullsundate),
        date_arr = val_date.toString().split(' '),
        val_time = date_arr[4].toString().slice(0, -3);
        dt_text = document.createTextNode(`${val_time}`),

        card_content = createElement('div'),
        card_img_div = createElement('div'),
        card_img = createElement('img'),
        card_temp = createElement('div'),
        card_temp_p = createElement('p'),
        card_temp_p_desc = createElement('p'),
        card_dt_h4 = createElement('h4'),
        card_dt = createElement('div'),

        card_tp_text = document.createTextNode(`${value[j].temp}`);
        card_tpd_text = document.createTextNode(`${value[j].weather[0].description}`);
        content_container.classList.add('content__container')
        card_content.classList.add('card__content', 'card__content--hourly');
        card_dt.classList.add('card__dt', 'card__dt--hr');
        card_img.classList.add('card__image', 'card__image--hr');
        card_img_div.classList.add('card__image', 'card__image--hr')
        card_temp.classList.add('card__temp', 'card__temp--hourly');
        card_temp_p.classList.add('hr__temp')
        card_temp_p_desc.classList.add('hr__weather--description', 'capitalize');

        card_img.src = `http://openweathermap.org/img/wn/${value[j].weather[0].icon}@2x.png`;
        card_img.alt = `${value[j].weather[0].description}`

        card_temp_p_desc.appendChild(card_tpd_text);
        card_temp_p.appendChild(card_tp_text);
        card_temp.insertAdjacentElement('beforeend', card_temp_p);
        card_temp.insertAdjacentElement('beforeend', card_temp_p_desc);

        card_img_div.insertAdjacentElement('afterbegin', card_img);

        card_dt_h4.appendChild(dt_text);
        card_dt.appendChild(card_dt_h4);

        card_content.insertAdjacentElement('beforeend', card_dt);
        card_content.insertAdjacentElement('beforeend', card_img_div);
        card_content.insertAdjacentElement('beforeend', card_temp)
        
        content_container.insertAdjacentElement('beforeend', card_content)

        changeUnit(card_temp_p, defaultUnit);
      }
      card_div.appendChild(content_container)    
      hourly__content.appendChild(card_div);
      card_div.insertBefore(card_title, content_container);
  }

  removeAnimate('.weather__section', 'animate__fadeIn');
  changeUnit(max_temp,defaultUnit);
  changeUnit(min_temp,defaultUnit);

  } catch (err) {
    document.getElementById('info').classList = ' ';
    document.getElementById('error').classList.remove('hidden');
    document.querySelector('.weather__section').classList.add('opacity-0');
    document.querySelector('.weather__features').classList.add('opacity-0');
    document.getElementById('error').textContent = 'No weather data. Try another location.'
  }

}

howstheweather = (locationInput, unit) => {

  document.querySelector('.loading').classList.add('show_loading');
  document.querySelector('.weather__section').classList.remove('show_weather');
  document.querySelector('.weather__section').classList.add('opacity-0');

  openweatherAPI(locationInput,unit)  
    .then(response => {
        document.querySelector('.loading').classList.remove('show_loading');
        showData(response);
    })
    .catch(err => console.log(err))
}

openweatherAPI = async (location, unit) => {

  try {
    const api_url = `/weather/${location}`
    const response = await fetch(api_url);
    const data = await response.json();
    try {
      const onecall_url = `/onecall/${data.coord.lat},${data.coord.lon}/${unit}`;
      const oc_response = await fetch(onecall_url);
      const oc_data = await oc_response.json();

      let all_data = {
        'name': data.name,
        'country': data.sys.country,
        'ocall': oc_data
      }
      return all_data
    } finally {

    }


  } catch(err) {
    console.log(err)
  }
}

openweatherAPI__latlon = async (lat,lon,unit) => {

  try {
    const api_url = `/weather/latlon/${lat},${lon}`;
    const response = await fetch(api_url);
    const data = await response.json();
    
    try {
      const onecall_url = `/onecall/${data.coord.lat},${data.coord.lon}/${unit}`;
      const oc_response = await fetch(onecall_url);
      const oc_data = await oc_response.json();

      let all_data = {
        'name': data.name,
        'country': data.sys.country,
        'ocall': oc_data
      }
      return all_data

    } finally {

    }
    
  } catch (error) {
    
    console.log(error)

  }

}

geo_position = (position) => {
  document.querySelector('.loading').classList.remove('opacity-0');

  openweatherAPI__latlon(position.coords.latitude,position.coords.longitude,defaultUnit)
    .then(response => {
      document.querySelector('.loading').classList.add('opacity-0', 'hidden');
      showData(response)
    })
    .catch(err => console.log(err))
}

geo_error = error => {
  const error_message = error
}

geoLocation = () => {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(geo_position,geo_error)
    
  } else {
    console.log('Geolocation not supported by your browser')
  }
}

btnInput.addEventListener('click', (e) => {
  e.preventDefault();
  howstheweather(userInput.value, defaultUnit);
})

radBtn.forEach(radio => {
  radio.addEventListener('click', (e) => {
        
    if(e.target.value == 'celsius') {
      // newUnit = 'metric';
      defaultUnit = 'metric'
    } else if(e.target.value == 'fahrenheit'){
      // newUnit = 'imperial';
      defaultUnit = 'imperial';
    }
    
    howstheweather(userInput.value, defaultUnit)
    
  });
  
});

geoLocation();
});