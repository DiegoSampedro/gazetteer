$('document').ready(function(){

var mymap;
var myIcon;
var marker;
var popup;
var popupLocation;
var popupContent;
var myIcon;

var open_weather_key = config.OPEN_WEATHER;
var geocoder_key = config.GEOCODER;
var open_exchange_key = config.OPEN_EXCHANGE;
var username = config.USERNAME;
  

if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
      latit = position.coords.latitude;
      longit = position.coords.longitude;
      var latLong = latit + ',' + longit;
      mymap = L.map('mapid').setView([51.505, -0.09], 2);
      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                    maxZoom: 13,
                    id: 'mapbox/streets-v11',
                    tileSize: 512,
                    zoomOffset: -1,
                    accessToken: 'pk.eyJ1IjoiZGllZ29zYW1wZWRybyIsImEiOiJja2VsZHcyMXgwbG1oMnJud2R2bTg4b2MwIn0.D6B-FvY03F2vrMHY59DSEw'
                    }).addTo(mymap);

    var geolocateRequest = $.ajax({
        url: "../gazetteer/php/getCurrentInfo.php",
        type: 'POST',
        dataType: 'json',
        data: {
            q: latLong,
            lang: 'en',
            open_weather_key: open_weather_key,
            geocoder_key: geocoder_key,
            open_exchange_key: open_exchange_key,
            username: username
        },
        success: function(result) {

            console.log(result);

            if (result.status.name == "ok") {
                var corner1 = L.latLng(result['geonames'][0]['north'], result['geonames'][0]['west']),
                    corner2 = L.latLng(result['geonames'][0]['south'], result['geonames'][0]['east']),
                    bounds = L.latLngBounds(corner1, corner2);

                mymap.flyToBounds(bounds, {padding: [50, 50]});
                myIcon = L.icon({
                    iconUrl: './images/map-marker.png',
                    iconSize: [38, 42],
                    iconAnchor: [19, 30],
                    popupAnchor: [2, -30]
                    });
                marker = L.marker([latit, longit], {icon: myIcon}).addTo(mymap);
                popupLocation = new L.LatLng(latit, longit);
      
                popupContent= 'You are in ' + result['geonames'][0]['countryName'];
                popup = new L.Popup();
                popup.setLatLng(popupLocation);
                popup.setContent(popupContent);

                marker.bindPopup(popup);
                marker.openPopup();

                var myLines = [{
                    "type": result['borders'][0]['geometry']['type'],
                    "coordinates": result['borders'][0]['geometry']['coordinates'] 
                }];
                
                var myStyle = {
                    "color": "#ff7800",
                    "weight": 5,
                    "opacity": 0.65
                };
                
                var geojson = L.geoJSON(myLines, {
                    style: myStyle
                }).addTo(mymap);

                $('#country2').html(result['geonames'][0]['countryName']);
                $('#continent').html(result['geonames'][0]['continentName']);
                $('#capital').html(result['geonames'][0]['capital']);
                $('#population').html(result['geonames'][0]['population']);
                var lowerCode = (result['geonames'][0]['countryCode']).toLowerCase();
                $('#flag').attr('src', 'https://www.countryflags.io/' + lowerCode + '/shiny/64.png');
                $('#currencyCode').html(result['geonames'][0]['currencyCode']);
                $('#exchange').html(result['rateData']['rates'][result['geonames'][0]['currencyCode']] + ' ' + result['geonames'][0]['currencyCode'] + ' / 1USD');
                $('#area').html(result['geonames'][0]['areaInSqKm']);
                $('#todayW').attr('src', 'http://openweathermap.org/img/wn/' + result['weatherData']['current']['weather'][0]['icon'] + '@2x.png');
                $('#todayDescription').html(result['weatherData']['current']['weather'][0]['description']).css('textTransform', 'capitalize');;
                $('#todayMaxTemp').html('Max Temperature: ' + result['weatherData']['daily'][0]['temp']['max'] + 'C');
                $('#todayMinTemp').html('Min Temperature: ' + result['weatherData']['daily'][0]['temp']['min'] + 'C');
                $('#todayWind').html('Wind Speed: ' + result['weatherData']['current']['wind_speed'] + 'm/s');
                $('#todayHum').html('Humidity: ' + result['weatherData']['current']['humidity'] + '%');
                $('#tomorrowW').attr('src', 'http://openweathermap.org/img/wn/' + result['weatherData']['daily'][1]['weather'][0]['icon'] + '@2x.png');
                $('#tomorrowDescription').html(result['weatherData']['daily'][1]['weather'][0]['description']).css('textTransform', 'capitalize');;
                $('#tomorrowMaxTemp').html('Max Temperature: ' + result['weatherData']['daily'][1]['temp']['max'] + 'C');
                $('#tomorrowMinTemp').html('Min Temperature: ' + result['weatherData']['daily'][1]['temp']['min'] + 'C');
                $('#tomorrowWind').html('Wind Speed: ' + result['weatherData']['daily'][1]['wind_speed'] + 'm/s');
                $('#tomorrowHum').html('Humidity: ' + result['weatherData']['daily'][1]['humidity'] + '%');
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    })
   }  
   )} else {
       $("mapid").append("<p>This browser doesn't support geolocation.</p></br><p>Please select a country on the dropdown menu.</p>");
   }

   // event listener for the drop-down menu

       $('#country').on('change', function() {
        var geolocateRequest2 = $.ajax({
            url: "../gazetteer/php/getCountryInfo.php",
            type: 'POST',
            dataType: 'json',
            data: {
                countryCode: $('#country').val(),
                lang: 'en',
                open_weather_key: open_weather_key,
                geocoder_key: geocoder_key,
                open_exchange_key: open_exchange_key,
                username: username
            },
            success: function(result) {
    
                console.log(result);
    
                if (result.status.name == "ok") {

                    $(".leaflet-interactive").remove();

                    var corner1 = L.latLng(result['geonames'][0]['north'], result['geonames'][0]['west']),
                        corner2 = L.latLng(result['geonames'][0]['south'], result['geonames'][0]['east']),
                        bounds = L.latLngBounds(corner1, corner2);

                    mymap.flyToBounds(bounds, {padding: [90, 90]});
                    var lat = result['results'][0]['geometry']['lat'];
                    var lng = result['results'][0]['geometry']['lng'];
                    var newLatLng = new L.LatLng(lat, lng);
                    marker = L.marker([lat, lng], {icon: myIcon}).addTo(mymap);
                    marker.setLatLng(newLatLng);
                    popupContent = result['geonames'][0]['capital'] + ' is the capital of ' + result['geonames'][0]['countryName'];
                    popup = new L.Popup();
                    popup.setLatLng(newLatLng);
                    popup.setContent(popupContent);
                    marker.bindPopup(popup);
                    marker.openPopup();
                   

                    myLines = [{
                        "type": result['borders'][0]['geometry']['type'],
                        "coordinates": result['borders'][0]['geometry']['coordinates'] 
                    }];
                    
                    myStyle = {
                        "color": "#ff7800",
                        "weight": 5,
                        "opacity": 0.65
                    };
                    
                    geojson = L.geoJSON(myLines, {
                        style: myStyle
                    }).addTo(mymap);


                    $('#country2').html(result['geonames'][0]['countryName']);
                    $('#continent').html(result['geonames'][0]['continentName']);
                    $('#capital').html(result['geonames'][0]['capital']);
                    $('#population').html(result['geonames'][0]['population']);
                    var lowerCode = (result['geonames'][0]['countryCode']).toLowerCase();
                    $('#flag').attr('src', 'https://www.countryflags.io/' + lowerCode + '/shiny/64.png');
                    $('#currencyCode').html(result['geonames'][0]['currencyCode']);
                    $('#exchange').html(result['rateData']['rates'][result['geonames'][0]['currencyCode']] + ' ' + result['geonames'][0]['currencyCode'] + ' / 1USD');
                    $('#area').html(result['geonames'][0]['areaInSqKm']);
                    $('#todayW').attr('src', 'http://openweathermap.org/img/wn/' + result['weatherData']['current']['weather'][0]['icon'] + '@2x.png');
                    $('#todayDescription').html(result['weatherData']['current']['weather'][0]['description']).css('textTransform', 'capitalize');;
                    $('#todayMaxTemp').html('Max Temperature: ' + result['weatherData']['daily'][0]['temp']['max'] + 'C');
                    $('#todayMinTemp').html('Min Temperature: ' + result['weatherData']['daily'][0]['temp']['min'] + 'C');
                    $('#todayWind').html('Wind Speed: ' + result['weatherData']['current']['wind_speed'] + 'm/s');
                    $('#todayHum').html('Humidity: ' + result['weatherData']['current']['humidity'] + '%');
                    $('#tomorrowW').attr('src', 'http://openweathermap.org/img/wn/' + result['weatherData']['daily'][1]['weather'][0]['icon'] + '@2x.png');
                    $('#tomorrowDescription').html(result['weatherData']['daily'][1]['weather'][0]['description']).css('textTransform', 'capitalize');;
                    $('#tomorrowMaxTemp').html('Max Temperature: ' + result['weatherData']['daily'][1]['temp']['max'] + 'C');
                    $('#tomorrowMinTemp').html('Min Temperature: ' + result['weatherData']['daily'][1]['temp']['min'] + 'C');
                    $('#tomorrowWind').html('Wind Speed: ' + result['weatherData']['daily'][1]['wind_speed'] + 'm/s');
                    $('#tomorrowHum').html('Humidity: ' + result['weatherData']['daily'][1]['humidity'] + '%');
                }
            
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        })
       })

// event listeners for the sidebar

$(".closebtn").click(function() {
    document.getElementById("mySidebar").style.width = "0px";
    setTimeout( function(){
        document.getElementById("main").style.display = "inline-block";
           },350);
    
});

  $(".openbtn").click(function() {
    var width = $(window).width();
    if(width >= 450) { 
    document.getElementById("mySidebar").style.width = "450px";
    } else {
        document.getElementById("mySidebar").style.width = "100%";
    }
    document.getElementById("main").style.display = "none";
});


});
