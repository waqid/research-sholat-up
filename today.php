<?php
if (!function_exists('fmt_time')) {
	function fmt_time($time, $use_ceil = true) {
		$jj = sprintf("%02d", floor($time));
		$mm = $time - floor($time);
		$mm = sprintf("%02d", $use_ceil ? ceil($mm * 60) : floor($mm * 60));
		return $jj . ":" . $mm;
	}
}
?>
<!-- Work -->
			<div class="wrapper style2">
				<article >
					<header>
						<h2 >Jadwal Sholat untuk hari <?php echo $hari[($jd) % 7] . ", " . date("j") . " " . $bulan[date('m')] . " " . date("Y") ;?>
</h2>

					</header>
					<div class="container" >
						<div class="row" id="work">
							<div class="4u 12u(mobile)">
								<section class="box style1">
									<h3>Subuh</h3>
									<h1><?= fmt_time($test_point['subuh']) ?></h1>
								</section>
							</div>
							<div class="4u 12u(mobile)">
								<section class="box style1">
									<h3>Terbit</h3>
									<h1><?= fmt_time($test_point['terbit'], false) ?></h1>
								</section>
							</div>
							<div class="4u 12u(mobile)">
								<section class="box style1">
									<h3>Dhuhur</h3>
									<h1><?= fmt_time($test_point['dhuhur']) ?></h1>
								</section>
							</div>
						</div>
					</div>
					<div class="container">
						<div class="row">
							<div class="4u 12u(mobile)">
								<section class="box style1">
									<h3>Ashar</h3>
									<h1><?= fmt_time($test_point['ashar']) ?></h1>
								</section>
							</div>
							<div class="4u 12u(mobile)">
								<section class="box style1">
									<h3>Maghrib</h3>
									<h1><?= fmt_time($test_point['maghrib']) ?></h1>
								</section>
							</div>
							<div class="4u 12u(mobile)">
								<section class="box style1">
									<h3>Isya'</h3>
									<h1><?= fmt_time($test_point['isya']) ?></h1>
								</section>
							</div>
						</div>
					</div>
					<footer>
						<p>Ralat waktu sholat &plusmn; 2 menit.</p>

					</footer>
				</article>
			</div>