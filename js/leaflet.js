var latit;
var longit;

if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
      var latit = position.coords.latitude;
      var longit = position.coords.longitude;
      
      var latLong = latit + ',' + longit;
      var mymap = L.map('mapid').setView([latit, longit], 5);
      var myIcon = L.icon({
          iconUrl: './images/map-marker.png',
          iconSize: [38, 42],
          iconAnchor: [19, 30],
          popupAnchor: [2, -30]
          });
      var marker = L.marker([latit, longit], {icon: myIcon}).addTo(mymap);
      var popupLocation1 = new L.LatLng(latit, longit);
        var popupContent1 = 'You are here';

        popup1 = new L.Popup();
        popup1.setLatLng(popupLocation1);
        popup1.setContent(popupContent1);

        marker.bindPopup(popup1);

        marker.openPopup();

       L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
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
            lang: 'en'
        },
        success: function(result) {

            console.log(result);

            if (result.status.name == "ok") {
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

                    mymap.setView([result['results'][0]['geometry']['lat'], result['results'][0]['geometry']['lng']], 5);
                   // popupLocation1 = new L.LatLng(result['results'][0]['geometry']['lat'], result['results'][0]['geometry']['lng']);
                   // popupContent1 = 'This is the capital';
                   // var newLatLng = new L.LatLng(result['results'][0]['geometry']['lat'], result['results'][0]['geometry']['lng']);
                   // marker.setLatLng(newLatLng); 

                    /*var mymap = L.map('mapid').setView([result['results'][0]['geometry']['lat'], result['results'][0]['geometry']['lng']], 5);
                    var myIcon = L.icon({
                        iconUrl: './images/map-marker.png',
                        iconSize: [38, 42],
                        iconAnchor: [19, 30],
                        popupAnchor: [2, -30]
                        });
                    var marker = L.marker([result['results'][0]['geometry']['lat'], result['results'][0]['geometry']['lng']], {icon: myIcon}).addTo(mymap);
                    var popupLocation1 = new L.LatLng(result['results'][0]['geometry']['lat'], result['results'][0]['geometry']['lng']);
                    var popupContent1 = 'This is the capital';

                        popup1 = new L.Popup();
                        popup1.setLatLng(popupLocation1);
                        popup1.setContent(popupContent1);

                        marker.bindPopup(popup1);

                        marker.openPopup();

                    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                        maxZoom: 18,
                        id: 'mapbox/streets-v11',
                        tileSize: 512,
                        zoomOffset: -1,
                        accessToken: 'pk.eyJ1IjoiZGllZ29zYW1wZWRybyIsImEiOiJja2VsZHcyMXgwbG1oMnJud2R2bTg4b2MwIn0.D6B-FvY03F2vrMHY59DSEw'
                        }).addTo(mymap);*/

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






