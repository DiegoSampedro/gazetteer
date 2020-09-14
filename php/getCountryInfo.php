<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	include('openCage/AbstractGeocoder.php');
	include('openCage/Geocoder.php');

	//Getting info from geonames API

	$url='http://api.geonames.org/countryInfoJSON?formatted=true&country=' . $_REQUEST['countryCode'] . '&username=DiegoSampedro&style=full';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result1=curl_exec($ch);

	curl_close($ch);

	$searchResult = [];

	$searchResult = json_decode($result1,true);
	
	header('Content-Type: application/json; charset=UTF-8');

	// Getting info from openCage API

	$capital = $searchResult['geonames'][0]['capital'] . ',' . $searchResult['geonames'][0]['countryName'];

	$geocoder = new \OpenCage\Geocoder\Geocoder('706eeb14f80c490cbba4ee3a3ced2ef8');

	$result = $geocoder->geocode($capital, ['language'=>$_REQUEST['lang']]);

    $searchResult['results'] = [];
    $searchResult['status']['code'] = "200";
	$searchResult['status']['name'] = "ok";

	$temp = [];

	foreach ($result['results'] as $entry) {

		$temp['geometry']['lat'] = $entry['geometry']['lat'] ?: 'N/A';
		$temp['geometry']['lng'] = $entry['geometry']['lng'] ?: 'N/A';

		array_push($searchResult['results'], $temp);

		}

	header('Content-Type: application/json; charset=UTF-8');
	
	// Getting info from openWeather API

	$url='https://api.openweathermap.org/data/2.5/onecall?lat=' . $searchResult['results'][0]['geometry']['lat'] . '&lon=' . $searchResult['results'][0]['geometry']['lng'] . '&units=metric&exclude=hourly,minutely&appid=23c61634b6fd3e68fc3c5cbde0ff8c7c';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result2=curl_exec($ch);

	curl_close($ch);

	$decode2 = json_decode($result2,true);	

	$searchResult['weatherData'] = $decode2;
	
	header('Content-Type: application/json; charset=UTF-8');

	// Getting info from openExchangeRates API

	$url='https://openexchangerates.org/api/latest.json?app_id=2ebca78af62d417688a07bcc8e5c9962';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result3=curl_exec($ch);

	curl_close($ch);

	$decode3 = json_decode($result3,true);	

	$searchResult['rateData'] = $decode3;
	
	header('Content-Type: application/json; charset=UTF-8');

	// Adding border coordinates from geojson file

	//$geoJson = file_get_contents("./countries_small.geo.json");
	$geoJson = file_get_contents("./countries.geojson");
    
	$geojsonArray['borders'] = json_decode($geoJson, true);
	//array_push($searchResult, $geojsonArray);
	$tempo = [];
	$searchResult['borders'] = [];

		for($x = 0; $x < 180; $x++) {
			//if($geojsonArray['borders']['features'][$x]['id'] == $searchResult['geonames'][0]['isoAlpha3']) {
				if($geojsonArray['borders']['features'][$x]['properties']['ISO_A3'] == $searchResult['geonames'][0]['isoAlpha3']) {
			    $tempo = $geojsonArray['borders']['features'][$x];
				array_push($searchResult['borders'], $tempo);
		    }
		}
	
	echo json_encode($searchResult, JSON_UNESCAPED_UNICODE);


?>