let lat, lon, userLoc;
let now = new Date();
let localtime = now.getTime();
let localOffset = now.getTimezoneOffset() * 60000;
// Note that a negative return value from getTimezoneOffset() indicates that the current location is ahead of UTC, while a positive value indicates that the location is behind UTC.
let localUTC = localtime + localOffset;
const userInput = document.getElementById('userInputLoc');
const btnInput = document.getElementById('submit');
const radBtn = document.getElementsByName('temp_options');
const daily__content = document.querySelector('#daily_container');
const hourly__content = document.querySelector('#hourly_container');
let unitDef= 'celsius';

function getCtryDate(countryTimezone) {
  let timezoneMillisec = 1000 * countryTimezone;
  let countryDateUTC = localUTC + timezoneMillisec;
  let countryDate = new Date(countryDateUTC);
  let day = '';
  // countryDate.getDay();
  if(countryDate.getDay() === 1) {
    day = 'Mon'
  } else if(countryDate.getDay() === 2) {
    day = 'Tue'
  } else if(countryDate.getDay() === 3) {
    day = 'Wed'
  } else if(countryDate.getDay() === 4) {
    day = 'Thu'
  } else if(countryDate.getDay() === 5) {
    day = 'Fri'
  } else if(countryDate.getDay() === 6) {
    day = 'Sat'
  } else if(countryDate.getDay() === 0) {
    day = 'Sun'
  }
  let formatDate = `${day} ${countryDate.toLocaleString()}`;
  return formatDate;
}

function convertSRDate(timezone, sunRiseSet) {
  let timezoneMillisec = 1000 * timezone;
  let sunRiseSetMilli = sunRiseSet * 1000;
  let sunRSDate = new Date(sunRiseSetMilli);
  let sunRSUTC = sunRSDate.getTime() + (sunRSDate.getTimezoneOffset() *60000) + timezoneMillisec;
  let newDateRS = new Date(sunRSUTC);

  return newDateRS;
}

function removeAnimate(selector, animate) {

  document.querySelector(selector).addEventListener('animationend', () => {
    document.querySelector(selector).classList.remove(animate);
  }) 

}

// async function onecall(lat, lon) {

//   const api_url = `/onecall/${lat},${lon}`;
//   const response = await fetch(api_url);
//   const data = await response.json();
//   daily__content.textContent = ' ';

//   return data

  // let daily = data.daily.map(item => {
  //   return item;
  // })

  // daily.map(dd => {
  //   let convertedDate = convertSRDate(data.timezone_offset, dd.dt);
  //   let daily_date = convertedDate.toString().split(' ')
  //   let formatDdate = `${daily_date[0]}, ${daily_date[2]} ${daily_date[1]}`

  //   let div = document.createElement('div');
  //   div.classList.add('card', 'flex', 'flex-auto', 'px-3', 'py-2' , 'items-center', 'justify-between');

  //   let div_day = document.createElement('div');
  //   div_day.classList.add('card__day', 'flex', 'flex-initial', 'text-sm', 'flex-1');
  //   let text_wrap = document.createElement('h4');
  //   let day_text = document.createTextNode(`${formatDdate}`);
  //   text_wrap.appendChild(day_text)
  //   div_day.appendChild(text_wrap)

  //   let div_image = document.createElement('div');
  //   div_image.classList.add('card__image', 'flex-initial');
  //   let image = document.createElement('img');
  //   image.src = `http://openweathermap.org/img/wn/${dd.weather[0].icon}.png`
  //   div_image.appendChild(image)
  
  //   let div_temp = document.createElement('div');
  //   div_temp.classList.add('card__temp','text-sm', 'flex-initial');
  //   let text_wrap_morn = document.createElement('h4');
  //   let morn_text = document.createTextNode(`${dd.temp.morn} C`);
  //   text_wrap_morn.appendChild(morn_text);
  //   div_temp.appendChild(text_wrap_morn)

  //   daily__content.appendChild(div);
  //   div.appendChild(div_temp);
  //   div.insertBefore(div_image, div.childNodes[0])
  //   div.insertBefore(div_day, div.childNodes[0])

  // })
// }


async function openweatherAPI(location){

  const api_url = `/weather/${location}`
  const response = await fetch(api_url);
  const data = await response.json();
  const onecall_url = `/onecall/${data.coord.lat},${data.coord.lon}`;
  const oc_response = await fetch(onecall_url);
  const oc_data = await oc_response.json();

  return [ data, oc_data]

  // document.getElementById('error').classList.add('hidden');

  // onecall(data.coord.lat, data.coord.lon)
  //   .then(oc_data => {
  //     console.log(oc_data)
  //   })

  // try {

    // userLoc = userInput.value;

    // const api_url = `/weather/${userLoc}`
    // const response = await fetch(api_url);
    // const data = await response.json();
    // document.getElementById('error').classList.add('hidden');

    // onecall(data.coord.lat, data.coord.lon)
    //   .then(oc_data => {
    //     console.log(oc_data)
    //   })

    // let sunrise = convertSRDate(data.timezone, data.sys.sunrise).toLocaleTimeString();
    // let sunset = convertSRDate(data.timezone, data.sys.sunset).toLocaleTimeString();
    // let locationDate = getCtryDate(data.timezone);
    // let humidity = data.main.humidity;
    // let windSpeed = data.wind.speed;

    // document.querySelector('.weather__info').classList.remove('opacity-0');
    // document.querySelector('.weather__info').classList.add('animate__fadeIn');

    // document.getElementById('celsius').checked = true;
    // document.getElementById('location__id').textContent = `${data.name}, ${data.sys.country}`;
    // document.getElementById('location__date').textContent = `${locationDate}`;
    // document.getElementById('condition__id').textContent = 
    // `${data.weather[0].description}`;
    // document.getElementById('temp__id').textContent = `${data.main.temp}`
    // document.getElementById('humid__id').textContent = `${humidity}`;
    // document.getElementById('wind_id').textContent = `${windSpeed}`;
    // document.getElementById('rise_time').textContent = `${sunrise}`;
    // document.getElementById('set_time').textContent = `${sunset}`;

    // removeAnimate('.weather__info', 'animate__fadeIn')

  // } catch (error) {
  //   document.getElementById('error').classList.remove('hidden');
  //   document.querySelector('.weather__info').classList.add('opacity-0');
  //   document.getElementById('error').textContent = 'No weather data. Try another location.'
  // }

}



function howstheweather(unit) {

  let location = userInput.value;

  if(unitDef == 'celsius') {
    unitDef = 'metric'; 
  } else {
    unitDef = 'imperial'; 
  }
  console.log(unitDef)

  openweatherAPI(location)
    .then(data => {
      let c_data = data[0];
      let oc_data = data[1];
    })
    .catch((err) => console.log(err))

}

// userInput.addEventListener('keyup', (e) => {
//   if(e.keyCode === 13) {
//     e.preventDefault();
//     weather__me();
//   }
// })

btnInput.addEventListener('click', (e) => {
  e.preventDefault();
  howstheweather();
})

if('geolocation' in navigator) {
  
  // navigator.geolocation.getCurrentPosition(

  //   position => {
    

  //   }
  // )

} else {
  console.log('Geolocation not supported by your browser')
}

async function changeUnit(unit) {

  let location = document.getElementById('location__id').textContent.split(',')[0];
  let newUnit = '';

  // if(unit == 'celsius') {
  //   unitDef = 'metric';
    // document.getElementById('temp__id').classList.add('animate__fadeIn');
    // removeAnimate('#temp__id', 'animate__fadeIn');

  // } else {
  //   unitDef = 'imperial';
    // document.getElementById('temp__id').classList.add('animate__fadeIn');
    // removeAnimate('#temp__id', 'animate__fadeIn');
  // }

  // console.log(unitDef)

  // const api_url = `/weather/${location}/${newUnit}`;
  // const response = await fetch(api_url);
  // const data = await response.json();

  // try {
  //   document.getElementById('temp__id').textContent = `${data.main.temp}`;

  // } catch (error) {
  //   if(data.cod == 404) {
  //     let splitLocation = location.split(' ')[0];

  //     const api_url = `/weather/${splitLocation}/${newUnit}`;
  //     const response = await fetch(api_url);
  //     const data = await response.json();

  //     document.getElementById('temp__id').textContent = `${data.main.temp}`;

  //   }  
  // }

};

radBtn.forEach(radio => {
  // radio.addEventListener('click', (e) => changeUnit(e.target.value));
  radio.addEventListener('click', (e) => howstheweather(e.target.value));

});

// Location, metric / imperial , key
// https://api.openweathermap.org/data/2.5/forecast?q=Manila&units=metric&appid=98d64f8ed497ede09c4bd182cac39c01