/* Sholat UP - static client-side app (no backend) */
(function () {
  'use strict';

  const PRESET_CITIES = [
    { id: 'malang', name: 'Kota Malang', tinggi: 550, long: 112.065, lat: -7.54, zone: 7 },
    { id: 'surabaya', name: 'Kota Surabaya', tinggi: 37.5, long: 112.667, lat: -7.20, zone: 7 },
    { id: 'denpasar', name: 'Kota Denpasar', tinggi: 35, long: 115.15, lat: -8.60, zone: 8 },
    { id: 'jakarta', name: 'Kota Jakarta', tinggi: 50, long: 106.85, lat: -6.16666, zone: 7 }
  ];
  const MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  const DAYS = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  const PRAYERS = [
    { key: 'subuh', label: 'Subuh' },
    { key: 'terbit', label: 'Terbit' },
    { key: 'dhuhur', label: 'Dhuhur' },
    { key: 'ashar', label: 'Ashar' },
    { key: 'maghrib', label: 'Maghrib' },
    { key: 'isya', label: "Isya'" }
  ];

  const state = {
    location: loadLocation(),
    tba: loadTba(),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    activeTab: 'today',
    times: null,
    countdownTimer: null
  };

  const $ = (id) => document.getElementById(id);
  const els = {
    statusRamp: $('statusRamp'),
    badgeLocation: $('badgeLocation'),
    badgeTba: $('badgeTba'),
    nextLabel: $('nextLabel'),
    nextTime: $('nextTime'),
    countdown: $('countdown'),
    monthSelect: $('monthSelect'),
    yearSelect: $('yearSelect'),
    scheduleBody: $('scheduleBody'),
    settingsModal: $('settingsModal'),
    cityOptions: $('cityOptions'),
    printMeta: $('printMeta'),
    todayView: $('todayView'),
    calendarView: $('calendarView')
  };

  function loadTba() {
    const v = Number(localStorage.getItem('sholat_tba'));
    return v === 2 ? 2 : 1;
  }
  function loadLocation() {
    try {
      const raw = localStorage.getItem('sholat_location');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.lat === 'number' && typeof parsed.long === 'number') return parsed;
      }
    } catch (_) {}
    return { ...PRESET_CITIES[0] };
  }
  function saveState() {
    localStorage.setItem('sholat_tba', String(state.tba));
    localStorage.setItem('sholat_location', JSON.stringify(state.location));
  }

  /* --- Astronomy (Jean Meeus, ported from meeus.ts) --- */
  function gregorianToJD(month, day, year) {
    let m = month, y = year;
    if (m <= 2) { y -= 1; m += 12; }
    const a = Math.floor(y / 100);
    const b = 2 - a + Math.floor(a / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5 + 0.5;
  }
  function fmtTime(time, useCeil) {
    if (useCeil === undefined) useCeil = true;
    let jj = Math.floor(time);
    const mmRaw = (time - jj) * 60;
    let mm = useCeil ? Math.ceil(mmRaw) : Math.floor(mmRaw);
    if (mm >= 60) { jj += Math.floor(mm / 60); mm = mm % 60; }
    jj = ((jj % 24) + 24) % 24;
    return String(jj).padStart(2, '0') + ':' + String(mm).padStart(2, '0');
  }
  function calculateRawTimes(jd, kota, tba) {
    const c_dhuhur = 0.033;
    const T = 2 * Math.PI * (jd - 2451545) / 365.25;
    let delta = 0.37877 + 23.264 * Math.sin(T - 1.388356) + 0.3812 * Math.sin(2 * T - 1.44307) + 0.17132 * Math.sin(3 * T - 1.042345);
    const deltaRad = delta / 57.297;
    const U = (jd - 2451545) / 36525;
    const L0 = (((280.46607 + 36000.7698 * U) % 360.0)) * (Math.PI / 180.0);
    let EoT = -(1789 + 237 * U) * Math.sin(L0) - (7146 - 62 * U) * Math.cos(L0) + (9934 - 14 * U) * Math.sin(2 * L0);
    EoT = EoT - (29 + 5 * U) * Math.cos(2 * L0) + (74 + 10 * U) * Math.sin(3 * L0) + (320 - 4 * U) * Math.cos(3 * L0);
    EoT = (EoT - 212 * Math.sin(4 * L0)) / 1000;
    const transit = 12 + kota.zone - (kota.long / 15) - (EoT / 60);
    const dhuhur = transit + c_dhuhur;
    const latRad = kota.lat / 57.297;
    const c = tba + Math.tan(Math.abs(deltaRad - latRad));
    const asharAlt = (1.570796 - Math.atan(c));
    const haAshar = Math.acos((Math.sin(asharAlt) - Math.sin(latRad) * Math.sin(deltaRad)) / (Math.cos(latRad) * Math.cos(deltaRad)));
    const ashar = transit + haAshar * (12 / Math.PI);
    const maghribAlt = (-0.833 - 0.0347 * Math.sqrt(kota.tinggi)) / 57.297;
    const haMaghrib = Math.acos((Math.sin(maghribAlt) - Math.sin(latRad) * Math.sin(deltaRad)) / (Math.cos(latRad) * Math.cos(deltaRad)));
    const maghrib = transit + haMaghrib * (12 / Math.PI);
    const terbit = transit - haMaghrib * (12 / Math.PI);
    const subuhAlt = -20 / 57.297;
    const haSubuh = Math.acos((Math.sin(subuhAlt) - Math.sin(latRad) * Math.sin(deltaRad)) / (Math.cos(latRad) * Math.cos(deltaRad)));
    const subuh = transit - haSubuh * (12 / Math.PI);
    const isyaAlt = -18 / 57.297;
    const haIsya = Math.acos((Math.sin(isyaAlt) - Math.sin(latRad) * Math.sin(deltaRad)) / (Math.cos(latRad) * Math.cos(deltaRad)));
    const isya = transit + haIsya * (12 / Math.PI);
    return { subuh, terbit, dhuhur, ashar, maghrib, isya };
  }
  function getSchedule(date, kota, tba) {
    const jd = gregorianToJD(date.getMonth() + 1, date.getDate(), date.getFullYear());
    const raw = calculateRawTimes(jd, kota, tba);
    return {
      subuh: fmtTime(raw.subuh, true),
      terbit: fmtTime(raw.terbit, false),
      dhuhur: fmtTime(raw.dhuhur, true),
      ashar: fmtTime(raw.ashar, true),
      maghrib: fmtTime(raw.maghrib, true),
      isya: fmtTime(raw.isya, true)
    };
  }

  /* --- UI --- */
  function showStatus(msg, showRetry) {
    els.statusRamp.innerHTML = '';
    const span = document.createElement('span');
    span.textContent = msg;
    els.statusRamp.appendChild(span);
    if (showRetry) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = 'Coba Lagi';
      btn.addEventListener('click', requestGps);
      els.statusRamp.appendChild(btn);
    }
    els.statusRamp.classList.remove('hidden');
  }
  function clearStatus() { els.statusRamp.classList.add('hidden'); els.statusRamp.innerHTML = ''; }

  function renderBadges() {
    els.badgeLocation.textContent = state.location.name;
    els.badgeTba.textContent = "Asar: " + (state.tba === 1 ? "Syafi'i" : 'Hanafi');
  }

  function renderToday() {
    const now = new Date();
    state.times = getSchedule(now, state.location, state.tba);
    for (const p of PRAYERS) {
      const el = $('time-' + p.key);
      if (el) el.textContent = state.times[p.key];
    }
    updateCountdown();
  }

  function parseTimeToDate(timeStr, base) {
    const parts = timeStr.split(':').map(Number);
    const d = new Date(base);
    d.setHours(parts[0], parts[1], 0, 0);
    return d;
  }

  function updateCountdown() {
    if (!state.times) return;
    const now = new Date();
    let next = null;
    for (const p of PRAYERS) {
      const target = parseTimeToDate(state.times[p.key], now);
      if (target.getTime() > now.getTime()) { next = { ...p, target }; break; }
    }
    if (!next) {
      const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate() + 1);
      const tTimes = getSchedule(tomorrow, state.location, state.tba);
      const target = parseTimeToDate(tTimes.subuh, tomorrow);
      next = { key: 'subuh', label: 'Subuh (Besok)', target, time: tTimes.subuh };
    }
    const diff = Math.max(0, next.target.getTime() - now.getTime());
    const totalSec = Math.floor(diff / 1000);
    const h = String(Math.floor(totalSec / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
    const s = String(totalSec % 60).padStart(2, '0');
    els.nextLabel.textContent = next.label;
    els.nextTime.textContent = next.time || state.times[next.key];
    els.countdown.textContent = h + ':' + m + ':' + s;

    document.querySelectorAll('.prayer-card').forEach(card => {
      const key = card.getAttribute('data-key');
      const active = key === next.key;
      card.classList.toggle('active', active);
      let dot = card.querySelector('.active-dot');
      if (active && !dot) {
        dot = document.createElement('span');
        dot.className = 'active-dot';
        dot.setAttribute('aria-hidden', 'true');
        card.querySelector('.card-head').appendChild(dot);
      } else if (!active && dot) {
        dot.remove();
      }
    });
  }

  function startCountdown() {
    if (state.countdownTimer) clearInterval(state.countdownTimer);
    state.countdownTimer = setInterval(updateCountdown, 1000);
  }

  function daysInMonth(year, month) { return new Date(year, month, 0).getDate(); }

  function renderCalendar() {
    const count = daysInMonth(state.year, state.month);
    const now = new Date();
    const todayStr = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0');
    const frag = document.createDocumentFragment();
    for (let d = 1; d <= count; d++) {
      const date = new Date(state.year, state.month - 1, d);
      const dateStr = state.year + '-' + String(state.month).padStart(2,'0') + '-' + String(d).padStart(2,'0');
      const t = getSchedule(date, state.location, state.tba);
      const tr = document.createElement('tr');
      if (dateStr === todayStr) tr.className = 'today';
      const cells = [
        DAYS[date.getDay()],
        d + ' ' + MONTHS[state.month - 1] + ' ' + state.year,
        t.subuh, t.terbit, t.dhuhur, t.ashar, t.maghrib, t.isya
      ];
      cells.forEach((val, i) => {
        const td = document.createElement('td');
        td.textContent = val;
        if (i >= 2 && i !== 3) td.className = 'mono';
        if (i === 3) td.className = 'muted-cell mono';
        tr.appendChild(td);
      });
      frag.appendChild(tr);
    }
    els.scheduleBody.innerHTML = '';
    els.scheduleBody.appendChild(frag);
    els.printMeta.textContent = state.location.name + ' - ' + MONTHS[state.month - 1] + ' ' + state.year + ' (Asar: ' + (state.tba === 1 ? "Syafi'i" : 'Hanafi') + ')';
  }

  function initControls() {
    MONTHS.forEach((m, i) => {
      const opt = document.createElement('option');
      opt.value = String(i + 1); opt.textContent = m;
      if (i + 1 === state.month) opt.selected = true;
      els.monthSelect.appendChild(opt);
    });
    const cy = new Date().getFullYear();
    for (let y = cy - 1; y <= cy + 2; y++) {
      const opt = document.createElement('option');
      opt.value = String(y); opt.textContent = String(y);
      if (y === state.year) opt.selected = true;
      els.yearSelect.appendChild(opt);
    }
    els.monthSelect.addEventListener('change', () => { state.month = Number(els.monthSelect.value); renderCalendar(); });
    els.yearSelect.addEventListener('change', () => { state.year = Number(els.yearSelect.value); renderCalendar(); });
  }

  function buildCityOptions() {
    els.cityOptions.innerHTML = '';
    PRESET_CITIES.forEach(city => {
      const label = document.createElement('label');
      label.className = 'option';
      const input = document.createElement('input');
      input.type = 'radio'; input.name = 'city'; input.value = city.id;
      input.checked = !state.location.isGps && state.location.name === city.name;
      input.addEventListener('change', () => {
        state.location = { ...city, isGps: false };
        saveState(); clearStatus(); renderBadges(); renderToday(); renderCalendar(); syncSettingsUI(); closeSettings();
      });
      const span = document.createElement('span');
      span.textContent = city.name;
      label.append(input, span);
      els.cityOptions.appendChild(label);
    });
  }

  function syncSettingsUI() {
    document.querySelectorAll('input[name="tba"]').forEach(r => { r.checked = Number(r.value) === state.tba; });
    document.querySelectorAll('input[name="city"]').forEach(r => {
      const city = PRESET_CITIES.find(c => c.id === r.value);
      r.checked = !!city && !state.location.isGps && city.name === state.location.name;
    });
    const gpsBtn = $('gpsBtn');
    gpsBtn.classList.toggle('active', !!state.location.isGps);
    gpsBtn.textContent = state.location.isGps ? 'GPS Aktif (Terdeteksi)' : 'Deteksi GPS Otomatis';
  }

  function openSettings() { syncSettingsUI(); els.settingsModal.classList.remove('hidden'); els.settingsModal.setAttribute('aria-hidden','false'); }
  function closeSettings() { els.settingsModal.classList.add('hidden'); els.settingsModal.setAttribute('aria-hidden','true'); }

  function requestGps() {
    if (!navigator.geolocation) { showStatus('Geolocation tidak didukung di browser ini.', false); return; }
    showStatus('Mendeteksi lokasi GPS...', false);
    navigator.geolocation.getCurrentPosition((pos) => {
      state.location = {
        name: 'Lokasi GPS (Otomatis)',
        tinggi: pos.coords.altitude || 50,
        lat: pos.coords.latitude,
        long: pos.coords.longitude,
        zone: Math.round(new Date().getTimezoneOffset() / -60),
        isGps: true
      };
      saveState(); clearStatus(); renderBadges(); renderToday(); renderCalendar(); syncSettingsUI(); closeSettings();
    }, () => {
      showStatus('Gagal mendeteksi GPS. Menggunakan lokasi default/pilihan terakhir.', true);
    }, { timeout: 8000 });
  }

  /* --- Export --- */
  function downloadBlob(content, mime, filename) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  function exportExcel() {
    const count = daysInMonth(state.year, state.month);
    const title = 'Jadwal Sholat - ' + state.location.name + ' - ' + MONTHS[state.month-1] + ' ' + state.year;
    const rows = [];
    rows.push('<tr><th colspan="8" style="font-size:14px;padding:8px">' + escapeHtml(title) + '</th></tr>');
    rows.push('<tr><th colspan="8" style="font-size:11px;padding:4px">Parameter Ashar: ' + (state.tba === 1 ? "Imam Syafi'i" : 'Imam Hanafi') + '</th></tr>');
    rows.push('<tr style="background:#282828;color:#fff"><th>Hari</th><th>Tanggal</th><th>Subuh</th><th>Terbit</th><th>Dhuhur</th><th>Ashar</th><th>Maghrib</th><th>Isya\'</th></tr>');
    const todayStr = new Date().getFullYear() + '-' + String(new Date().getMonth()+1).padStart(2,'0') + '-' + String(new Date().getDate()).padStart(2,'0');
    for (let d = 1; d <= count; d++) {
      const date = new Date(state.year, state.month - 1, d);
      const dateStr = state.year + '-' + String(state.month).padStart(2,'0') + '-' + String(d).padStart(2,'0');
      const t = getSchedule(date, state.location, state.tba);
      const bg = dateStr === todayStr ? 'background:#d9f1f4;' : '';
      rows.push('<tr style="' + bg + '"><td>' + DAYS[date.getDay()] + '</td><td>' + d + ' ' + MONTHS[state.month-1] + ' ' + state.year + '</td><td>' + t.subuh + '</td><td style="color:#666">' + t.terbit + '</td><td>' + t.dhuhur + '</td><td>' + t.ashar + '</td><td>' + t.maghrib + '</td><td>' + t.isya + '</td></tr>');
    }
    const html = '\uFEFF<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Jadwal Sholat</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table border="1" cellpadding="4" cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:12px;text-align:center">' + rows.join('') + '</table></body></html>';
    const safeName = state.location.name.replace(/\s+/g, '_');
    downloadBlob(html, 'application/vnd.ms-excel;charset=utf-8;', 'jadwal_sholat_' + safeName + '_' + state.year + '_' + state.month + '.xls');
  }

  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  function switchTab(tab) {
    state.activeTab = tab;
    document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    els.todayView.classList.toggle('hidden', tab !== 'today');
    els.calendarView.classList.toggle('hidden', tab !== 'calendar');
  }

  function bindEvents() {
    document.querySelectorAll('.tab').forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));
    $('settingsBtn').addEventListener('click', openSettings);
    $('closeSettings').addEventListener('click', closeSettings);
    $('doneSettings').addEventListener('click', closeSettings);
    els.settingsModal.addEventListener('click', (e) => { if (e.target && e.target.dataset.close === 'modal') closeSettings(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSettings(); });
    $('gpsBtn').addEventListener('click', requestGps);
    document.querySelectorAll('input[name="tba"]').forEach(r => r.addEventListener('change', (e) => {
      state.tba = Number(e.target.value); saveState(); renderBadges(); renderToday(); renderCalendar(); syncSettingsUI();
    }));
    $('printBtn').addEventListener('click', () => { switchTab('calendar'); renderCalendar(); setTimeout(() => window.print(), 50); });
    $('exportExcelBtn').addEventListener('click', exportExcel);
  }

  function init() {
    initControls();
    buildCityOptions();
    bindEvents();
    renderBadges();
    renderToday();
    renderCalendar();
    startCountdown();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
