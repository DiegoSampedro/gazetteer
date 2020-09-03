var latit;
var longit;

if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(function(position) {
      var latit = position.coords.latitude;
      var longit = position.coords.longitude;
      var marker = L.marker([latit, longit], {icon: myIcon}).addTo(mymap);
   } 
   )} else {
       $(".info").html("This browser doesn't support geolocation.")
   }

var mymap = L.map('mapid', {doubleClickZoom: false}).locate({setView: true, maxZoom: 16});
var myIcon = L.icon({
    iconUrl: './images/map-marker.png',
    iconSize: [38, 42],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
});

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiZGllZ29zYW1wZWRybyIsImEiOiJja2VsZHcyMXgwbG1oMnJud2R2bTg4b2MwIn0.D6B-FvY03F2vrMHY59DSEw'
}).addTo(mymap);




