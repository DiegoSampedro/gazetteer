<?php

    $url='https://api.openweathermap.org/data/2.5/onecall?lat=' . $_REQUEST['lat'] . '&lon=' . $_REQUEST['lon'] . '&exclude=hourly,minutely&appid=23c61634b6fd3e68fc3c5cbde0ff8c7c';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['weatherData'] = $decode;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output);

?>