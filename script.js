 document.addEventListener('DOMContentLoaded', () => {

  const cityinput = document.querySelector('.city-input');
  const searchbtn = document.querySelector('.search-btn');
  const notfoundsection = document.querySelector('.not-found')
  const searchcitysection = document.querySelector('.search-city')
  const weatherinfosection = document.querySelector('.weather-info')
  const countrytxt = document.querySelector('.country-text')
  const temptext = document.querySelector('.temp-text')
  const conditiontext = document.querySelector('.condition-txt')
  const windvaluetext = document.querySelector('.wind-value-txt')
  const humidityvaluetext = document.querySelector('.Humidity-value-txt')
  const forecastitemscontainer = document.querySelector('.forecast-items-container')

  
  const weathersummaryimage = document.querySelector('.weather-summary-img')
  const currentdatetxt = document.querySelector('.current-date-txt')

  const apikey = 'e5cb344a07b6a3475cd06318e5acb57e';

  searchbtn.addEventListener('click', () => {
    if (cityinput.value.trim() != '') {
      updateweatherinfo(cityinput.value);
      cityinput.value = '';
      cityinput.blur();
    }
  });

  cityinput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' && cityinput.value.trim() != '') {
      updateweatherinfo(cityinput.value);
      cityinput.value = '';
      cityinput.blur();
    }
    console.log(event);
  });

  async function getfetchdata(endpoint, city) {
    const apiurl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apikey}&units=metric`;
    const response = await fetch(apiurl);
    return response?.json();
  }

     function getweathericon(id){
     
        if(id<=232) return 'thunderstorm.svg'
        if(id<=321) return 'drizzle.svg'
        if(id<=531) return 'rain.svg'
        if(id<=622) return 'snow.svg'
        if(id<=781) return 'atmosphere.svg'
        if(id<=800) return 'clear.svg'

        else return 'clouds.svg'
      
      }

      function getcurrentdate(){
        const currentdate = new Date()
        const options ={
          weekday : 'short',
          day : '2-digit',
          month : 'short',
        }
        return currentdate.toLocaleDateString('en-GB',options)
      }
  

  async function updateweatherinfo(city) {
    const weatherdata = await getfetchdata('weather', city);
    console.log(weatherdata);

    if(weatherdata.cod != 200){
        showdisplaysection(notfoundsection)
        return
    }
    console.log(weatherdata)

    const{
        name:country,
        main:{temp,humidity},
        weather:[{ id,main }],
        wind:{speed}

    }= weatherdata

    countrytxt.textContent = country
    temptext.textContent   = Math.round(temp) + '°C'
    conditiontext.textContent = main
    humidityvaluetext.textContent = humidity + '%'
    windvaluetext.textContent = speed + 'M/s'

    currentdatetxt.textContent = getcurrentdate()
    console.log(getcurrentdate())
    weathersummaryimage.src = `assets/weather/${ getweathericon(id) }`
    await updateforecastinfo(city)
    showdisplaysection(weatherinfosection)
  }
  
  async function updateforecastinfo(city) {
    
    const forecastdata = await getfetchdata('forecast',city)
    const timetaken = '12:00:00'
    const todaysdate = new Date().toISOString().split('T')[0]
    console.log(todaysdate)
    console.log(forecastdata)

    forecastitemscontainer.innerHTML = ''
    forecastdata.list.forEach(forecastweather => {

       if(forecastweather.dt_txt.includes(timetaken) && !forecastweather.dt_txt.includes(todaysdate)){
        
        updateforecastitems(forecastweather)

       }
       
    })
  }
  function updateforecastitems(weatherdata){
      console.log(weatherdata)
      const{
        dt_txt : date,
        weather : [{id}],
        main   : {temp}

      }= weatherdata

      const datetaken = new Date(date)
      const dateOption = {
         
        day : '2-digit',
        month : 'short'
      }
  
      const dateResult = datetaken.toLocaleDateString('en-US',dateOption)

      const forecastitem = `
      <div class="forecast-item">
          <h5 class="forecaste-items-date regular-txt">
                    ${dateResult}
          </h5>
          <img src="assets/weather/${getweathericon(id)}" class="forecast-item-img">
          <h5 class="forecast-item-temperature">
                    ${Math.round(temp)} °C
          </h5>
      </div>`
  
      forecastitemscontainer.insertAdjacentHTML('beforeend',forecastitem)

    }
  function showdisplaysection(section){
      [weatherinfosection,searchcitysection,notfoundsection]
      .forEach(section => section.style.display= 'none')

      section.style.display ='flex'
  }
  
 });
