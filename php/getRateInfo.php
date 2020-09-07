<?php

    $url='https://openexchangerates.org/api/latest.json?app_id=2ebca78af62d417688a07bcc8e5c9962';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['rateData'] = $decode;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output);

?>