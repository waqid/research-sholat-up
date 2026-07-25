<?php
require 'functions.php';

if(isset($_POST['submit'])) {
	$lama = $_POST['lama'];
	$tba = $_POST['imam'];
	if ($_POST['kota'] == 1) { $kota = $malang;}
	elseif ($_POST['kota'] == 2) { $kota = $surabaya;}
	else { $kota = $denpasar;}
} else {
	$lama = 30;
	$kota = $malang;
	$tba = 1;
}
?>
<!DOCTYPE HTML>
<html lang="id">
<head>
	<title>Jadwal Sholat - Sholat UP</title>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="stylesheet" href="assets/css/main.css" />
	<style>
		body { background: #f4f4f4; color: #3e3e3e; padding: 2em 0; }
		.container { max-width: 900px; margin: 0 auto; padding: 0 20px; }
		.header { text-align: center; margin-bottom: 2em; }
		.header h2 { font-size: 2em; margin-bottom: 0.5em; color: #282828; }
		.header p { color: #666; margin: 0; }
		.table-wrapper { background: #fff; box-shadow: inset 0px 0px 0px 1px rgba(0, 0, 0, 0.15), 0px 2px 3px 0px rgba(0, 0, 0, 0.1); overflow-x: auto; }
		table { width: 100%; border-collapse: collapse; text-align: center; }
		th { background: #282828; color: #fff; padding: 1em; font-weight: 700; white-space: nowrap; }
		td { padding: 1em; border-bottom: 1px solid #eee; white-space: nowrap; }
		tr:last-child td { border-bottom: none; }
		tr:nth-child(even) { background: #fafafa; }
		tr:hover { background: #f4f4f4; }
		.highlight { color: #43B3E0; font-weight: bold; }
		.back-link { display: inline-block; margin-bottom: 1em; color: #43B3E0; text-decoration: none; font-weight: 700; }
		.back-link:hover { color: #43bff0; }
		footer { text-align: center; margin-top: 3em; color: #bbb; font-size: 0.9em; }
		@media (max-width: 768px) {
			th, td { padding: 0.75em 0.5em; font-size: 0.9em; }
		}
	</style>
</head>
<body>
	<div class="container">
		<a href="index.php" class="back-link">&larr; Kembali</a>
		<div class="header">
			<h2>Jadwal Sholat: <?php echo $kota['kota']; ?></h2>
			<p>Algoritma Jean Meuss &middot; Asar Imam <?php echo $tba == 2 ? 'Hanafi' : 'Syafi\'i'; ?></p>
		</div>
		<div class="table-wrapper">
			<table>
				<thead>
					<tr>
						<th>Hari</th>
						<th>Tanggal</th>
						<th>Subuh</th>
						<th>Terbit</th>
						<th>Dhuhur</th>
						<th>Asar</th>
						<th>Maghrib</th>
						<th>Isya</th>
					</tr>
				</thead>
				<tbody>
				<?php
				if (!function_exists('fmt_time')) {
					function fmt_time($time, $use_ceil = true) {
						$jj = sprintf("%02d", floor($time));
						$mm = $time - floor($time);
						$mm = sprintf("%02d", $use_ceil ? ceil($mm * 60) : floor($mm * 60));
						return $jj . ":" . $mm;
					}
				}

				for ($x = 1; $x <= $lama; $x++) {
					$sholatku = waktu($jd, $kota, $c_dhuhur, $tba);
					
					echo "<tr>";
					echo "<td>" . $hari[($jd) % 7] . "</td>";
					echo "<td>" . jdtogregorian($jd) . "</td>";
					echo "<td class='highlight'>" . fmt_time($sholatku['subuh']) . "</td>";
					echo "<td>" . fmt_time($sholatku['terbit'], false) . "</td>";
					echo "<td class='highlight'>" . fmt_time($sholatku['dhuhur']) . "</td>";
					echo "<td class='highlight'>" . fmt_time($sholatku['ashar']) . "</td>";
					echo "<td class='highlight'>" . fmt_time($sholatku['maghrib']) . "</td>";
					echo "<td class='highlight'>" . fmt_time($sholatku['isya']) . "</td>";
					echo "</tr>";
					$jd++;
				}
				?>
				</tbody>
			</table>
		</div>
		<footer>
			<p>&copy; <?php echo date('Y'); ?> Nur Waqid Muhsinin. Toleransi waktu &plusmn; 5 menit.</p>
		</footer>
	</div>
</body>
</html>
