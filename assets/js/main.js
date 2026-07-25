(function () {
  "use strict";

  function toggleMenu() {
    var nav = document.getElementById("main-nav");
    if (nav) nav.classList.toggle("is-open");
  }

  document.addEventListener("click", function (e) {
    var nav = document.getElementById("main-nav");
    var toggle = document.querySelector(".sidebar-toggle");
    if (nav && toggle && !nav.contains(e.target) && !toggle.contains(e.target)) {
      nav.classList.remove("is-open");
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    var elements = document.querySelectorAll(".fade-in");
    elements.forEach(function (el, i) {
      el.style.animationDelay = i * 0.1 + "s";
    });
  });

  window.toggleMenu = toggleMenu;

  // ================================
  // Window controls (minimize/maximize/close)
  // ================================

  var siteWindow = document.querySelector(".site-window");
  var contentArea = document.querySelector(".content-area");
  var dock = document.querySelector(".aero-dock");

  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".title-btn");
    if (!btn || !siteWindow) return;

    var action = btn.getAttribute("data-action");

    if (action === "close") {
      siteWindow.style.display = "none";
      if (dock) dock.style.display = "none";
    }

    if (action === "minimize") {
      if (!contentArea) return;
      var isMinimized = contentArea.style.display === "none";
      contentArea.style.display = isMinimized ? "" : "none";
      btn.textContent = isMinimized ? "_" : "□";
      btn.title = isMinimized ? "Minimize" : "Restore";
      btn.setAttribute("aria-label", isMinimized ? "Minimize" : "Restore");
    }

    if (action === "maximize") {
      var isMaximized = siteWindow.classList.toggle("is-maximized");
      btn.textContent = isMaximized ? "❐" : "□";
      btn.title = isMaximized ? "Restore" : "Maximize";
      btn.setAttribute("aria-label", isMaximized ? "Restore" : "Maximize");
    }
  });
})();
