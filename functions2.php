<?php 

/* ============================================================
   Set array untuk mengubah bahasa sistem ke bahasa indonesia.
   $hari  : mengubah nama hari
   $bulan : mengubah nama bulan
   ============================================================ */

$hari = array(
	'Sunday' => 'Minggu',
	'Monday' => 'Senin',
	'Tuesday' => 'Selasa',
	'Wednesday' => 'Rabu',
	'Thursday' => 'Kamis',
	'Friday' => 'Jumat',
	'Saturday' => 'Sabtu'
);
$bulan = array(
                '01' => 'Januari',
                '02' => 'Februari',
                '03' => 'Maret',
                '04' => 'April',
                '05' => 'Mei',
                '06' => 'Juni',
                '07' => 'Juli',
                '08' => 'Agustus',
                '09' => 'September',
                '10' => 'Oktober',
                '11' => 'November',
                '12' => 'Desember',
);



/* ============================================================
   Set array untuk database kota setempat.
   Database ini hanya contoh, penggunaan aplikasi seperti MySQL
   sangat disarankan untuk kota yang banyak. 
   ============================================================ */

$malang = array("kota"=>"Kota Malang", "tinggi"=>550, "long"=>112.065, "lat"=>-7.54, "zone"=>7 );
$surabaya = array("kota"=>"Kota Surabaya", "tinggi"=>37.5, "long"=>112.667, "lat"=>-7.20, "zone"=>7 );
$denpashar = array("kota"=>"Kota Denpashar", "tinggi"=>35, "long"=>115.15, "lat"=>-8.60, "zone"=>8 );
$jakarta = array("kota"=>"Kota Jakarta", "tinggi"=>50, "long"=>106.85, "lat"=>-6.16666, "zone"=>7 );
//$kota = $jakarta; // test point
$kota = $malang;



/* ============================================================
   Inisiasi variabel komputasi
   ============================================================ */

$c_dhuhur = 0.033; // satuan dalam jam, sekitar 2 menit.
$tba = 1;          // tetapan bayangan ashar, default = 1 (syafi'i) , dapat diubah menjadi = 2 (hanafi)
$lama = 1;         // tanpa satuan, dapat diubah



/* ============================================================
   Perhitungan JD hari ini
   ============================================================ */
   
$day   = date("d");
$month = date("m");
$year  = date("Y");
$jd    = GregorianToJD($month,$day,$year); // fungsi yang ada di php
//$jd    = 2454995; //test point



/* ============================================================
   Perhitungan Sholat fungsi waktu()
   ============================================================ */
   
function waktu($jd, $kota, $c_dhuhur, $tba) {
	$T = 2 * 3.14159265359 * ($jd - 2451545) / 365.25;  // sudut tanggal, dalam radian
	$delta = 0.37877 + 23.264 * sin ($T - 1.388356) + 0.3812 * sin ( 2 * $T - 1.44307) + 0.17132 * sin (3 * $T - 1.042345);
	$delta = $delta / 57.297;
	//sudut deklinasi, disesuaikan dalam radian
	$U = ($jd - 2451545) / 36525;
	$L0 = fmod((280.46607 + 36000.7698 * $U),360.0) /  57.297; 
	//disesuaikan dalam radian
	$EoT = - (1789 + 237 * $U) * sin ($L0) - (7146 - 62 * $U) * cos ($L0) + (9934 - 14 * $U) * sin (2* $L0);
	$EoT = $EoT - (29 + 5 * $U) * cos (2 * $L0) + (74 + 10 * $U) * sin (3 * $L0) + (320 - 4 * $U) * cos  (3 * $L0);
	$EoT = ($EoT - 212 * sin (4 * $L0))/1000; // Equation of Time, dalam satuan menit
	$transit = 12 + $kota['zone'] - $kota['long'] / 15 - $EoT / 60; // waktu transit
	
	/*  Perhitungan Sudut Jam (Hour Angle) masing-masing waktu sholat  
	    rumusan asyar_alt merupakan konversi arc cot() 
	    menggunakan identitas trigonometri (provided by Pak Abdurrouf) */
	
	$c = $tba + tan (abs ($delta - $kota['lat'])); 
	$ashar_alt = 1 / sqrt(($c * $c + 1));
	$ha_ashar = acos ( sin ($ashar_alt) - sin ($kota['lat'] / 57.297) * sin ($delta )) / (cos ($kota['lat'] / 57.297) * cos ($delta));
		
	
	$maghrib_alt = - 0.833 - 0.0347 * sqrt ($kota['tinggi']);
	$ha_maghrib = acos ( sin ($maghrib_alt / 57.297) - sin ($kota['lat'] / 57.297) * sin ($delta )) / (cos ($kota['lat'] / 57.297) * cos ($delta)); 
	
	
	$isya_alt = -0.314159; // -18 derajat
	$ha_isya = acos ( sin ($isya_alt ) - sin ($kota['lat'] / 57.297) * sin ($delta )) / (cos ($kota['lat'] / 57.297) * cos ($delta));
	
	
	$subuh_alt = -0.349065; // -20 derajat
	$ha_subuh = acos ( sin ($subuh_alt) - sin ($kota['lat'] / 57.297) * sin ($delta )) / (cos ($kota['lat'] / 57.297) * cos ($delta));
	
	
	$terbit_alt = -0.8333 - 0.0347 * sqrt ($kota['tinggi']);
	$ha_terbit = acos ( sin ($terbit_alt / 57.297) - sin ($kota['lat']/ 57.297) * sin ($delta )) / (cos ($kota['lat'] / 57.297) * cos ($delta));
	
	
	$dhuhur = $transit + $c_dhuhur; 			// OK
	$ashar = $transit + $ha_ashar / 0.2617993; 		// +26
	$maghrib = $transit + $ha_maghrib / 0.2617993 ; 	// +34
	$isya = $transit + $ha_isya / 0.2617993; 		// +34
	$subuh = $transit - $ha_subuh / 0.2617993; 		// -33
	$terbit = $transit - $ha_terbit / 0.2617993; 	        // -33
	$sholat = array( 'subuh'=>$subuh,
                	 'terbit'=>$terbit,
                	 'dhuhur'=>$dhuhur,
                	 'ashar'=>$ashar,
                	 'maghrib'=>$maghrib,
                	 'isya'=>$isya,
                	 'transit'=>$transit, 
  			 'T'=>$T,
  			 'Delta'=>$delta,
  			 'U'=>$U,
  			 'L0'=>$L0,
  			 'EoT'=>$EoT,
  			 'subuh_alt'=>$subuh_alt,
  			 'subuh_ha'=>$ha_subuh,
  			 'terbit_alt'=>$terbit_alt,
  			 'terbit_ha'=>$ha_terbit,
  			 'ashar_alt'=>$ashar_alt,
  			 'ashar_ha'=>$ha_ashar,
  			 'maghrib_alt'=>$maghrib_alt,
  			 'maghrib_ha'=>$ha_maghrib,
  			 'isya_alt'=>$isya_alt,
  			 'isya_ha'=>$ha_isya,
  			 'JD'=>$jd,
                );
        return $sholat;
}


$test_point = waktu($jd, $kota, $c_dhuhur, $tba);


?>