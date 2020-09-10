$('document').ready(function(){

var mymap;
var myIcon;
var marker;
var popup;
var popupLocation;
var popupContent;
var myIcon;

if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
      latit = position.coords.latitude;
      longit = position.coords.longitude;
      var latLong = latit + ',' + longit;

    var geolocateRequest = $.ajax({
        url: "../gazetteer/php/getCurrentInfo.php",
        type: 'POST',
        dataType: 'json',
        data: {
            q: latLong,
            lang: 'en'
        },
        success: function(result) {

            console.log(result);

            if (result.status.name == "ok") {
                var corner1 = L.latLng(result['geonames'][0]['north'], result['geonames'][0]['west']),
                    corner2 = L.latLng(result['geonames'][0]['south'], result['geonames'][0]['east']),
                    bounds = L.latLngBounds(corner1, corner2);

                var latit = result['results'][0]['geometry']['lat'];
                var longit = result['results'][0]['geometry']['lng'];
                mymap = L.map('mapid').fitBounds(bounds, {padding: [50, 50]});
                myIcon = L.icon({
                    iconUrl: './images/map-marker.png',
                    iconSize: [38, 42],
                    iconAnchor: [19, 30],
                    popupAnchor: [2, -30]
                    });
                marker = L.marker([latit, longit], {icon: myIcon}).addTo(mymap);
                popupLocation = new L.LatLng(latit, longit);
      
                popupContent= 'You are in ' + result['results'][0]['country'];
                popup = new L.Popup();
                popup.setLatLng(popupLocation);
                popup.setContent(popupContent);

                marker.bindPopup(popup);

                marker.openPopup();

                L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                    maxZoom: 13,
                    id: 'mapbox/streets-v11',
                    tileSize: 512,
                    zoomOffset: -1,
                    accessToken: 'pk.eyJ1IjoiZGllZ29zYW1wZWRybyIsImEiOiJja2VsZHcyMXgwbG1oMnJud2R2bTg4b2MwIn0.D6B-FvY03F2vrMHY59DSEw'
                    }).addTo(mymap);

                $('#country2').html(result['results'][0]['country']);
                $('#continent').html(result['geonames'][0]['continentName']);
                $('#capital').html(result['geonames'][0]['capital']);
                $('#population').html(result['geonames'][0]['population']);
                var lowerCode = (result['geonames'][0]['countryCode']).toLowerCase();
                $('#flag').attr('src', 'https://www.countryflags.io/' + lowerCode + '/shiny/64.png');
                $('#currencyCode').html(result['geonames'][0]['currencyCode']);
                $('#exchange').html(result['rateData']['rates'][result['geonames'][0]['currencyCode']] + ' ' + result['geonames'][0]['currencyCode'] + ' / 1$');
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
       $("#country2").html("This browser doesn't support geolocation.");
       $("#continent").html("Please select a country on the dropdown menu.");
   }


       $('#country').on('change', function() {
        var geolocateRequest2 = $.ajax({
            url: "../gazetteer/php/getCountryInfo.php",
            type: 'POST',
            dataType: 'json',
            data: {
                countryCode: $('#country').val(),
                lang: 'en'
            },
            success: function(result) {
    
                console.log(result);
    
                if (result.status.name == "ok") {

                    var corner1 = L.latLng(result['geonames'][0]['north'], result['geonames'][0]['west']),
                        corner2 = L.latLng(result['geonames'][0]['south'], result['geonames'][0]['east']),
                        bounds = L.latLngBounds(corner1, corner2);

                    mymap.flyToBounds(bounds, {padding: [90, 90]});

                    var lat = result['results'][0]['geometry']['lat'];
                    var lng = result['results'][0]['geometry']['lng'];

                    var newLatLng = new L.LatLng(lat, lng);

                    marker.setLatLng(newLatLng);

                    popupContent= result['geonames'][0]['capital'] + ' is the capital';

                    popup = new L.Popup();
                    popup.setLatLng(newLatLng);
                    popup.setContent(popupContent);

                    marker.bindPopup(popup);

                    marker.openPopup();

                    
                   

                    $('#country2').html(result['results'][0]['country']);
                    $('#continent').html(result['geonames'][0]['continentName']);
                    $('#capital').html(result['geonames'][0]['capital']);
                    $('#population').html(result['geonames'][0]['population']);
                    var lowerCode = (result['geonames'][0]['countryCode']).toLowerCase();
                    $('#flag').attr('src', 'https://www.countryflags.io/' + lowerCode + '/shiny/64.png');
                    $('#currencyCode').html(result['geonames'][0]['currencyCode']);
                    $('#exchange').html(result['rateData']['rates'][result['geonames'][0]['currencyCode']] + ' ' + result['geonames'][0]['currencyCode'] + ' / 1$');
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

});
