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
          popupAnchor: [-3, -76]
          });
      var marker = L.marker([latit, longit], {icon: myIcon}).addTo(mymap);

       L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: 'mapbox/streets-v11',
          tileSize: 512,
          zoomOffset: -1,
          accessToken: 'pk.eyJ1IjoiZGllZ29zYW1wZWRybyIsImEiOiJja2VsZHcyMXgwbG1oMnJud2R2bTg4b2MwIn0.D6B-FvY03F2vrMHY59DSEw'
          }).addTo(mymap);

    var geolocateRequest = $.ajax({
        url: "../gazetteer/php/geolocate.php",
        type: 'POST',
        dataType: 'json',
        data: {
            q: latLong,
            lang: 'en'
        },
        success: function(result) {

            console.log(result);

            if (result.status.name == "ok") {
                $('#text1').html(result['results'][0]['formatted']);
                $('#text2').html(result['results'][0]['timezone']);
                $('#text3').html(result['results'][0]['currency']);
                $('#text4').html(result['results'][0]['flag']);
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    }),
        geonameRequest = geolocateRequest.then(function(data){
            return $.ajax({
                url: "../gazetteer/php/getCountryInfo.php",
                type: 'POST',
                dataType: 'json',
                data: {
                    country: data['results'][0]['countryCode'],
                },
                success: function(result) {
        
                    console.log(result);

                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
            })
        }),
        openWeatherRequest = $.ajax({
            url: "../gazetteer/php/getWeatherInfo.php",
            type: 'POST',
            dataType: 'json',
            data: {
                lat: latit,
                lon: longit
            },
            success: function(result) {
    
                console.log(result);
    
                if (result.status.name == "ok") {
                  
                }
            
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        }),
        rateRequest = $.ajax({
            url: "../gazetteer/php/getRateInfo.php",
            type: 'POST',
            dataType: 'json',
            success: function(result) {
    
                console.log(result);
    
                if (result.status.name == "ok") {

                }
            
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        })
        
 

   } 
   )} else {
       $(".info").html("This browser doesn't support geolocation.")
   }






