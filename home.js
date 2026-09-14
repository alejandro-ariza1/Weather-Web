const city = document.getElementById("city");
const weatherBtn = document.getElementById("weather-btn");

const cityName = document.getElementById("cityName");
const emoji = document.getElementById("emoji");
const temp = document.getElementById("temp");
const extratemp = document.getElementById("extraTemp");
const recommendation = document.getElementById("recommendation");
const rainRecommendation = document.getElementById("rainRecommendation");

let realPlace = false;

async function btnClicked(){
    let cityInputted = city.value;

    if (cityInputted === "") {
        removeInfo();
        cityName.textContent = "Please enter a city";
        return;
    }

    let cityCapitalised = cityInputted.charAt(0).toUpperCase() + cityInputted.slice(1);
    
    const data = await getWeather(cityCapitalised);
    if (!data) {
        removeInfo();
        cityName.textContent = "The place you entered does NOT exist. Try again";
        return;
    }

    const rain = await getForecast(cityCapitalised);
    const rainChance = rain.list[0].pop * 100;
    const text = await recommend(data, rainChance);

    const rainText = rainRecommend(rainChance);
    const emojiIcon = getEmoji(data, rainChance);

    displayInfo(data, cityCapitalised, text, rain, emojiIcon, rainText);
}

weatherBtn.addEventListener("click", btnClicked);


async function getWeather(cityCapitalised) {
    try{
        const response = await fetch ("https://api.openweathermap.org/data/2.5/weather?q=" + cityCapitalised + "&units=metric&appid=" + API_KEY);
        
        if(!response.ok){
            return null;
        }

        const data = await response.json();
        realPlace = true;
        return data;

    } catch (error){
        console.error("Something went wrong:", error)
        realPlace = false;
    }
}

async function getForecast(cityCapitalised) {
    try{
        const response = await fetch ("https://api.openweathermap.org/data/2.5/forecast?q=" + cityCapitalised + "&units=metric&appid=" + API_KEY);
        const rain = await response.json();
        return rain;
    } catch (error){
        console.error("Something went wrong:", error)
    }
}

function recommend(data) {
    let text;

    if(data.main.temp<=9){
        text = "It's very cold, wear a warm coat and consider wearing gloves, hat and scarf";
    }
    else if(data.main.temp<=14){
        text = "It's cold, wear a warm coat";
    }
    else if(data.main.temp<=17){
        text = "It's chilly, wear a light coat or jumper";
    }
    else if(data.main.temp<=23){
        text = "It's hot, you can wear a t-shirt";
    }
    else if(data.main.temp>=24){
        text = "It's very hot, stay hydrated";
    }
    return text;
}

function rainRecommend(rainChance) {
    let rainText;

    if (rainChance >=60){
        rainText = "There's a chance it's raining, consider taking an umbrella ☔️";
    }
    return rainText;
}

function getEmoji(data, rainChance){
    let emojiIcon;
    if (rainChance >=60){
        return "🌧️";
    }
    
    if(data.main.temp<=9){
        emojiIcon = "❄️"
    }
    else if(data.main.temp<=14){
        emojiIcon = "💨"
    }
    else if(data.main.temp<=17){
        emojiIcon = "☁️"
    }
    else if(data.main.temp<=23){
        emojiIcon = "☀️"
    }
    else if(data.main.temp>=24){
        emojiIcon = "🥵"
    }
    return emojiIcon;
}

function displayInfo(data, cityCapitalised, text, rain, emojiIcon, rainText){
    const rainChance = rain.list[0].pop * 100;
    cityName.textContent = cityCapitalised;
    emoji.textContent = emojiIcon;
    temp.textContent = `${Math.round(data.main.temp)}°C`;

    extratemp.innerHTML = `
        <span class="high-low">H:</span>${Math.round(data.main.temp_max)}°C
        <span class="high-low">L:</span>${Math.round(data.main.temp_min)}°C
        ${rainChance}% of rain
    `;

    recommendation.textContent = text;
    rainRecommendation.textContent = rainText;
}

function removeInfo(){
    cityName.textContent = "";
    emoji.textContent = "";
    temp.textContent = "";
    extratemp.innerHTML = "";
    recommendation.textContent = "";
    rainRecommendation.textContent = "";
}