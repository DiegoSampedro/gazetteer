<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	include('openCage/AbstractGeocoder.php');
	include('openCage/Geocoder.php');

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

	$capital = $searchResult['geonames'][0]['capital'] . ',' . $searchResult['geonames'][0]['countryName'];

	$geocoder = new \OpenCage\Geocoder\Geocoder('706eeb14f80c490cbba4ee3a3ced2ef8');

	$result = $geocoder->geocode($capital, ['language'=>$_REQUEST['lang']]);

	if (in_array($result['status']['code'], [401,402,403,429])) {

		$handle = curl_init('https://geocoder.ls.hereapi.com/6.2/geocode.json?searchtext=' . urlencode($_REQUEST['q']) . '&gen=9&language=' . $_POST['lang'] . '&locationattributes=tz&locationattributes=tz&apiKey=3a-30Zv1XS6W1oOiLxhsIfSudk2mDak6bfVQmOrPvjA');

        curl_setopt($handle, CURLOPT_HTTPHEADER, array('Content-Type: text/plain; charset=UTF-8'));
        curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($handle, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
        $json_result = curl_exec($handle);

		$searchResult = [];
		$searchResult['results'] = [];

		$temp = [];

        $r = json_decode($json_result, true);
        

		foreach ($r['Response']['View'][0]['Result'] as $result) {

			$temp['source'] = 'here';
			$temp['formatted'] = $result['Location']['Address']['Label'];
			$temp['geometry']['lat'] = $result['Location']['DisplayPosition']['Latitude'];
			$temp['geometry']['lng'] = $result['Location']['DisplayPosition']['Longitude'];
			$temp['countryCode'] = getCountryCode($result['Location']['Address']['Country']);
			$temp['timezone'] = $result['Location']['AdminInfo']['TimeZone']['id'];

			array_push($searchResult['results'], $temp);

		}

	} else {

        $searchResult['results'] = [];
        $searchResult['status']['code'] = "200";
	    $searchResult['status']['name'] = "ok";

		$temp = [];

		foreach ($result['results'] as $entry) {

			$temp['geometry']['lat'] = $entry['geometry']['lat'] ?: 'N/A';
			$temp['geometry']['lng'] = $entry['geometry']['lng'] ?: 'N/A';
			$temp['countryCode'] = strtoupper($entry['components']['country_code']) ?: 'N/A';
			$temp['timezone'] = $entry['annotations']['timezone']['name'] ?: 'N/A';
			//$temp['currency'] = ($entry['annotations']['currency']['name']) ?: 'N/A';
			$temp['flag'] = $entry['annotations']['flag'] ?: 'N/A';
			$temp['country'] = $entry['components']['country'] ?: 'N/A';
			$temp['continent'] = $entry['components']['continent'] ?: 'N/A';

			array_push($searchResult['results'], $temp);

		}

	}

	header('Content-Type: application/json; charset=UTF-8');


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
		
	echo json_encode($searchResult, JSON_UNESCAPED_UNICODE);

	// functions

	function getCountryCode($countryCode) {
	    
	    $iso3 = ['AFG','ALA','ALB','DZA','ASM','AND','AGO','AIA','ATA','ATG','ARG','ARM','ABW','AUS','AUT','AZE','BHS','BHR','BGD','BRB','BLR','BEL','BLZ','BEN','BMU','BTN','BOL','BIH','BWA','BVT','BRA','IOT','VGB','BRN','BGR','BFA','BDI','KHM','CMR','CAN','CPV','CYM','CAF','TCD','CHL','CHN','CXR','CCK','COL','COM','COG','COD','COK','CRI','CIV','HRV','CUB','CYP','CZE','DNK','DJI','DMA','DOM','ECU','EGY','SLV','GNQ','ERI','EST','ETH','FLK','FRO','FJI','FIN','FRA','GUF','PYF','ATF','GAB','GMB','GEO','DEU','GHA','GIB','GRC','GRL','GRD','GLP','GUM','GTM','GGY','GIN','GNB','GUY','HTI','HMD','VAT','HND','HKG','HUN','ISL','IND','IDN','IRN','IRQ','IRL','IMN','ISR','ITA','JAM','JPN','JEY','JOR','KAZ','KEN','KIR','PRK','KOR','KWT','KGZ','LAO','LVA','LBN','LSO','LBR','LBY','LIE','LTU','LUX','MAC','MKD','MDG','MWI','MYS','MDV','MLI','MLT','MHL','MTQ','MRT','MUS','MYT','MEX','FSM','MDA','MCO','MNG','MNE','MSR','MAR','MOZ','MMR','NAM','NRU','NPL','NLD','ANT','NCL','NZL','NIC','NER','NGA','NIU','NFK','MNP','NOR','OMN','PAK','PLW','PSE','PAN','PNG','PRY','PER','PHL','PCN','POL','PRT','PRI','QAT','REU','ROU','RUS','RWA','SHN','KNA','LCA','SPM','VCT','BLM','MAF','WSM','SMR','STP','SAU','SEN','SRB','SYC','SLE','SGP','SVK','SVN','SLB','SOM','ZAF','SGS','SSD','ESP','LKA','SDN','SUR','SJM','SWZ','SWE','CHE','SYR','TWN','TJK','TZA','THA','TLS','TGO','TKL','TON','TTO','TUN','TUR','TKM','TCA','TUV','UGA','UKR','ARE','GBR','USA','URY','UMI','UZB','VUT','VEN','VNM','VIR','WLF','ESH','YEM','ZMB','ZWE'];
	    
		$iso2 = ['AF','AX','AL','DZ','AS','AD','AO','AI','AQ','AG','AR','AM','AW','AU','AT','AZ','BS','BH','BD','BB','BY','BE','BZ','BJ','BM','BT','BO','BA','BW','BV','BR','IO','VG','BN','BG','BF','BI','KH','CM','CA','CV','KY','CF','TD','CL','CN','CX','CC','CO','KM','CG','CD','CK','CR','CI','HR','CU','CY','CZ','DK','DJ','DM','DO','EC','EG','SV','GQ','ER','EE','ET','FK','FO','FJ','FI','FR','GF','PF','TF','GA','GM','GE','DE','GH','GI','GR','GL','GD','GP','GU','GT','GG','GN','GW','GY','HT','HM','VA','HN','HK','HU','IS','IN','ID','IR','IQ','IE','IM','IL','IT','JM','JP','JE','JO','KZ','KE','KI','KP','KR','KW','KG','LA','LV','LB','LS','LR','LY','LI','LT','LU','MO','MK','MG','MW','MY','MV','ML','MT','MH','MQ','MR','MU','YT','MX','FM','MD','MC','MN','ME','MS','MA','MZ','MM','NA','NR','NP','NL','AN','NC','NZ','NI','NE','NG','NU','NF','MP','NO','OM','PK','PW','PS','PA','PG','PY','PE','PH','PN','PL','PT','PR','QA','RE','RO','RU','RW','SH','KN','LC','PM','VC','BL','MF','WS','SM','ST','SA','SN','RS','SC','SL','SG','SK','SI','SB','SO','ZA','GS','SS','ES','LK','SD','SR','SJ','SZ','SE','CH','SY','TW','TJ','TZ','TH','TL','TG','TK','TO','TT','TN','TR','TM','TC','TV','UG','UA','AE','GB','US','UY','UM','UZ','VU','VE','VN','VI','WF','EH','YE','ZM','ZW'];
		
		if (strlen(trim($countryCode)) == 2) {
		    
		   return $iso3[array_search($countryCode, $iso2)];
		    
		} else {
		    
		   return $iso2[array_search($countryCode, $iso3)];
		
		}

	}

?>