const userTab=document.querySelector("[data-userWeather]"); 
const searchTab=document.querySelector("[data-searchWeather");
const userContainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScran=document.querySelector(".laoding-conatiner");
const userInfoConatiner=document.querySelector(".user-info-conatiner");
const Error1=document.querySelector("[error]");
const errorText=document.querySelector('[errMsg]')

let currentTab=userTab;
const API_key="cc361200064ab8f2d7b64020ef4ca017";
currentTab.classList.add("current-tab");
getfromSessionStorage()

userTab.addEventListener('click',()=> switchTab(userTab));
searchTab.addEventListener('click',()=>switchTab(searchTab));

function switchTab(clicledTab)
{
    Error1.classList.remove('active');
    if(currentTab!=clicledTab){
        currentTab.classList.remove("current-tab")
        currentTab=clicledTab;
        currentTab.classList.add("current-tab");
    }
    if(!searchForm.classList.contains('active') && currentTab == searchTab){
        userInfoConatiner.classList.remove('active');
        grantAccessContainer.classList.remove('active');
        searchForm.classList.add('active');
    }
    else if(currentTab==userTab){
        searchForm.classList.remove('active');
        userInfoConatiner.classList.remove('active');
        getfromSessionStorage();
    }
}

function getfromSessionStorage()
{
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates)
    {
        grantAccessContainer.classList.add('active');
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates)
{
    const {lat,lon}=coordinates;
    grantAccessContainer.classList.remove('active');
    //make loder active
    loadingScran.classList.add("active");
    //api call
    try{
        const respons=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`);
        const data = await respons.json();
        if (!data.sys) {
            throw data;
        }
        Error1.classList.remove('active');
        loadingScran.classList.remove('active');
        userInfoConatiner.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        Error1.classList.add('active');
        userInfoConatiner.classList.remove('active')
        loadingScran.classList.remove('active');
    }
}
function renderWeatherInfo(data)
{
    const cityName = document.querySelector('[data-cityName]');
    const countryIcon=document.querySelector("[data-countryIcon]");
    const dec =document.querySelector('[data-weatheDesc]');
    const weatherIcon=document.querySelector("[ data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const wideSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cludeness=document.querySelector("[data-cloudness]");

    //fetch data
    cityName.innerText= data?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    dec.innerText = data?.weather?.[0]?.description;
    weatherIcon.src =`http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerText= `${data?.main?.temp} °C`;
    wideSpeed.innerText = `${data?.wind?.speed} m/s`;
    humidity.innerText = `${data?.main?.humidity} %`;
    cludeness.innerText  = `${data?.clouds?.all} %`;
    
}
const flash=document.querySelector(".flash")
const MsgBox=document.querySelector(".MsgBox");

flash.addEventListener('click',()=>{
    console.log("remove flash")
    flash.classList.remove("active");
    MsgBox.classList.remove('active');
})

const cross=document.querySelector("[btnCross]");
cross.addEventListener('click',()=>{
    flash.classList.remove("active");
    MsgBox.classList.remove('active');
})

function getlocation()
{
    console.log("location")
    if(navigator.geolocation){
        console.log("assecc location")
        if(navigator.geolocation.getCurrentPosition(showPosition))
            console.log("loaction get");
        else{
            MsgBox.classList.add("active");
            flash.classList.add("active");
        }
    }
    else{
        console.log("location not assecc")
        grantAccessBtn.style.display = 'none';
    }
}
function showPosition(position) {
    console.log("coordinates")
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    };
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    console.log(userCoordinates);
    fetchUserWeatherInfo(userCoordinates);
}
const grantAccessBtn=document.querySelector("[data-grantAccess]");
grantAccessBtn.addEventListener('click',getlocation)


const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    let city=searchInput.value;
    if(city==="")
        return;
    else
        fetchSearchWeatherInfo(city);
})
async function fetchSearchWeatherInfo(city)
{
    loadingScran.classList.add('active');
    userInfoConatiner.classList.remove('active');
    grantAccessContainer.classList.remove('active');
    try{
        console.log('call api');
        const respons = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);
        console.log("get respons");
        const data = await respons.json();
        if (!data.sys) {
            throw data;
        }
        Error1.classList.remove('active');
        loadingScran.classList.remove('active');
        userInfoConatiner.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        Error1.classList.add('active');
        userInfoConatiner.classList.remove('active')
        loadingScran.classList.remove('active');
        errorText.innerText = `${err?.message}`;
    }
}