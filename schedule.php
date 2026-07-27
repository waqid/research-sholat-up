
		<!-- Portfolio -->
			<div class="wrapper style3">
				<article id="portfolio">
					<header>
						<h2>Buat kalender sholat Anda</h2>
						<p>Anda dapat mencetak jadwal untuk ditempelkan di kantor, di sekolah, atau di rumah.</p>
					</header>
					<div class="container">
						<form action="table.php" method="POST">
							<fieldset>
								<legend>Pilih Parameter Asyar</legend>
								<div class="row">
									<div class="4u 12u(mobile)">
										<div class="radio">
										  <label>
										    <input type="radio" name="imam" value="1" checked>
										    Imam Syafi'i
										  </label>
										</div>
										<div class="radio">
										  <label>
										    <input type="radio" name="imam"  value="2">
										    Imam Hanafi
										  </label>
										</div>
									 </div>
									 <div class="4u 12u(mobile)">
										<legend>Pilih Kota Anda</legend>
										<div class="radio">
										  <label>
										    <input type="radio" name="kota"  value="1" checked>
										    Kota Malang
										  </label>
										</div>
										<div class="radio">
										  <label>
										    <input type="radio" name="kota" value="2">
										    Kota Surabaya
										  </label>
										</div>
										<div class="radio">
										  <label>
										    <input type="radio" name="kota" value="3">
										    Kota Denpasar
										  </label>
										</div>
									 </div>
									 <div class="4u 12u(mobile)">
										<legend>Pilih Jumlah Hari</legend>
										<div class="radio">
										  <label>
										    <input type="radio" name="lama" value="30" checked>
										    30 Hari (1 Bulan)
										  </label>
										</div>
										<div class="radio">
										  <label>
										    <input type="radio" name="lama" value="90">
										    90 Hari (3 Bulan)
										  </label>
										</div>
										<div class="radio">
										  <label>
										    <input type="radio" name="lama" value="365">
										    365 Hari (1 Tahun)
										  </label>
										</div>
									 </div>
								  </div>
							  </fieldset>
							  <br>
							  <button type="submit" class="btn big btn-default" name="submit" value="submit">Cetak Jadwal</button>
						</form>
					</div>
					<footer>
						<p>
							<?php //print_r($kota); //print_r($test_point);  //echo JDToGregorian($jd); ?>
                                                </p>
						<!-- a href="#contact" class="button big scrolly">Kontak</a -->
					</footer>
				</article>
			</div>
