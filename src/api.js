const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;
const api_key = process.env.API_KEY;
const openweathermap = `https://api.openweathermap.org/data/2.5/`;
app.use(express.static('dist'));

app.listen(port, () => {
  console.log(`Start`);
});

app.get('/weather/:location', async (request, response) => {

  try {
    const location = request.params.location;
    const current_url = `${openweathermap}weather?q=${location}&units=metric&appid=${api_key}`;
    const fetch_current = await fetch(current_url);
    const data = await fetch_current.json();
  // console.log(data)
    response.json(data)
  } catch (error) {
    console.log(err)
  }
});

app.get('/onecall/:latlon/:unit', async (request, response) => {
  
  try {
    const latlon = request.params.latlon.split(',');
    const lat = latlon[0];
    const lon = latlon[1];
    const unit = request.params.unit
  
    const onecall_url = `${openweathermap}onecall?lat=${lat}&lon=${lon}&appid=${api_key}&units=${unit}&exclude=minutely`;
    const fetch_onecall = await fetch(onecall_url);
    const data = await fetch_onecall.json();
  
    response.json(data)

  } catch (error) {
    console.log(err)
  }
});

app.get('/weather/latlon/:latlon', async (request, response) => {

  try {
    const latlon = request.params.latlon.split(',');
    const lat = latlon[0];
    const lon = latlon[1];
    const current_url = `${openweathermap}weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`;
    const fetch_current = await fetch(current_url);
    const data = await fetch_current.json();
    response.json(data)

  } catch (error) {
    console.log(error)
  }

});


