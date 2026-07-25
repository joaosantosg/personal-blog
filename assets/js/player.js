/* ============================================
   Aero Music Player — MP3s locais
   ============================================ */

(function () {
  "use strict";

  var currentTrack = 0;
  var audio = null;
  var isPlaying = false;
  var tracks = [];

  function init() {
    var el = document.getElementById("player-tracks");
    if (!el) return;

    try {
      tracks = JSON.parse(el.textContent || "[]");
    } catch (e) {
      tracks = [];
    }

    tracks = tracks.filter(function (t) {
      return t && t.file;
    });

    if (tracks.length === 0) return;

    audio = new Audio();
    audio.volume = 0.7;
    audio.addEventListener("ended", nextTrack);
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("error", function () {
      setStatus("Ficheiro não encontrado");
      isPlaying = false;
      updatePlayBtn();
    });

    renderPlayer();
    loadTrack(0);
  }

  function renderPlayer() {
    var container = document.getElementById("music-player");
    if (!container) return;

    container.innerHTML =
      '<div class="player-controls">' +
        '<button type="button" id="player-prev" class="player-btn" title="Anterior">&laquo;</button>' +
        '<button type="button" id="player-toggle" class="player-btn player-btn--play" title="Play/Pause">&#9654;</button>' +
        '<button type="button" id="player-next" class="player-btn" title="Seguinte">&raquo;</button>' +
      "</div>" +
      '<div class="player-info">' +
        '<div id="player-title" class="player-title"></div>' +
        '<div id="player-artist" class="player-artist"></div>' +
        '<div id="player-status" class="player-status"></div>' +
        '<div class="player-progress">' +
          '<div class="player-progress__bar">' +
            '<div id="player-progress-fill" class="player-progress__fill"></div>' +
          "</div>" +
          '<div class="player-time">' +
            '<span id="player-current">0:00</span>' +
            '<span id="player-total">0:00</span>' +
          "</div>" +
        "</div>" +
        '<div class="player-volume">' +
          '<span class="player-vol-icon">&#9835;</span>' +
          '<input type="range" id="player-volume" min="0" max="100" value="70" class="player-vol-slider">' +
        "</div>" +
      "</div>";

    document.getElementById("player-prev").addEventListener("click", prevTrack);
    document.getElementById("player-toggle").addEventListener("click", togglePlay);
    document.getElementById("player-next").addEventListener("click", nextTrack);
    document.getElementById("player-volume").addEventListener("input", function () {
      audio.volume = this.value / 100;
    });

    var progressBar = document.querySelector(".player-progress__bar");
    if (progressBar) {
      progressBar.addEventListener("click", function (e) {
        var rect = this.getBoundingClientRect();
        var pct = (e.clientX - rect.left) / rect.width;
        if (audio.duration) audio.currentTime = pct * audio.duration;
      });
    }
  }

  function setStatus(msg) {
    var el = document.getElementById("player-status");
    if (el) el.textContent = msg || "";
  }

  function assetBase() {
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].src || "";
      if (src.indexOf("player.js") !== -1) {
        return src.replace(/\/assets\/js\/player\.js.*$/, "");
      }
    }
    return "";
  }

  function loadTrack(index) {
    if (index < 0 || index >= tracks.length) return;
    currentTrack = index;
    var t = tracks[currentTrack];

    audio.src = assetBase() + "/assets/audio/" + t.file;
    document.getElementById("player-title").textContent = t.title;
    document.getElementById("player-artist").textContent =
      t.artist +
      (t.album ? " — " + t.album : "") +
      (t.year ? " (" + t.year + ")" : "");
    document.getElementById("player-progress-fill").style.width = "0%";
    document.getElementById("player-current").textContent = "0:00";
    document.getElementById("player-total").textContent = "0:00";
    setStatus("");
    isPlaying = false;
    updatePlayBtn();
  }

  function togglePlay() {
    if (!audio.src) return;
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
    } else {
      var playPromise = audio.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(function () {
          setStatus("Ficheiro não encontrado");
          isPlaying = false;
          updatePlayBtn();
        });
      }
      isPlaying = true;
    }
    updatePlayBtn();
  }

  function nextTrack() {
    loadTrack((currentTrack + 1) % tracks.length);
    audio.play();
    isPlaying = true;
    updatePlayBtn();
  }

  function prevTrack() {
    loadTrack((currentTrack - 1 + tracks.length) % tracks.length);
    audio.play();
    isPlaying = true;
    updatePlayBtn();
  }

  function updatePlayBtn() {
    var btn = document.getElementById("player-toggle");
    if (btn) btn.innerHTML = isPlaying ? "&#9646;&#9646;" : "&#9654;";
  }

  function updateProgress() {
    if (!audio.duration) return;
    var pct = (audio.currentTime / audio.duration) * 100;
    document.getElementById("player-progress-fill").style.width = pct + "%";
    document.getElementById("player-current").textContent = formatTime(audio.currentTime);
  }

  function updateDuration() {
    if (!audio.duration) return;
    document.getElementById("player-total").textContent = formatTime(audio.duration);
  }

  function formatTime(s) {
    var m = Math.floor(s / 60);
    var sec = Math.floor(s % 60);
    return m + ":" + (sec < 10 ? "0" : "") + sec;
  }

  document.addEventListener("DOMContentLoaded", init);
})();
