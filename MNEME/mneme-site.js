(function () {
  "use strict";

  var root = document.documentElement;
  var header = document.querySelector(".site-header");
  var menu = document.querySelector("[data-mobile-menu]");
  var menuButton = document.querySelector("[data-menu-toggle]");
  var themeButton = document.querySelector("[data-theme-toggle]");
  var dialog = document.querySelector("[data-search-dialog]");
  var searchInput = document.querySelector("[data-search-input]");

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem("mneme-theme", theme); } catch (_) {}
    if (themeButton) {
      var dark = theme === "dark";
      themeButton.setAttribute("aria-pressed", String(dark));
      themeButton.setAttribute("aria-label", dark ? themeButton.dataset.lightLabel : themeButton.dataset.darkLabel);
    }
  }

  var savedTheme = null;
  try { savedTheme = localStorage.getItem("mneme-theme"); } catch (_) {}
  setTheme(savedTheme || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

  if (themeButton) themeButton.addEventListener("click", function () { setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark"); });

  function closeMenu() {
    if (!menu || !menuButton) return;
    menu.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }
  if (menuButton) menuButton.addEventListener("click", function () {
    var open = menu.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
  });
  if (menu) menu.querySelectorAll("a").forEach(function (link) { link.addEventListener("click", closeMenu); });

  function openSearch() { if (!dialog) return; if (typeof dialog.showModal === "function") dialog.showModal(); else dialog.setAttribute("open", ""); if (searchInput) searchInput.focus(); }
  function closeSearch() { if (!dialog) return; if (typeof dialog.close === "function") dialog.close(); else dialog.removeAttribute("open"); }
  document.querySelectorAll("[data-search-open]").forEach(function (button) { button.addEventListener("click", openSearch); });
  document.querySelectorAll("[data-search-close]").forEach(function (button) { button.addEventListener("click", closeSearch); });
  document.addEventListener("keydown", function (event) { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); openSearch(); } if (event.key === "Escape") closeMenu(); });

  if (searchInput) searchInput.addEventListener("input", function () {
    var query = searchInput.value.trim().toLowerCase();
    var empty = document.querySelector("[data-search-empty]");
    var visible = 0;
    document.querySelectorAll("[data-search-item]").forEach(function (item) {
      var haystack = (item.dataset.title + " " + item.dataset.keywords + " " + item.textContent).toLowerCase();
      var match = !query || haystack.indexOf(query) !== -1;
      item.hidden = !match;
      if (match) visible += 1;
    });
    if (empty) empty.hidden = visible !== 0;
  });

  window.addEventListener("scroll", function () { if (header) header.classList.toggle("is-scrolled", window.scrollY > 48); }, { passive: true });

  document.querySelectorAll("[data-copy-target]").forEach(function (button) {
    button.addEventListener("click", function () {
      var target = document.getElementById(button.dataset.copyTarget);
      if (!target) return;
      var text = target.innerText;
      var doneLabel = button.dataset.doneLabel || "Copied";
      var original = button.textContent;
      var finish = function () { button.textContent = doneLabel; window.setTimeout(function () { button.textContent = original; }, 1400); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(finish).catch(function () {}); else finish();
    });
  });

  document.querySelectorAll("[data-platform-tab]").forEach(function (tab) {
    tab.addEventListener("click", function () {
      var platform = tab.dataset.platformTab;
      document.querySelectorAll("[data-platform-tab]").forEach(function (item) { item.setAttribute("aria-selected", String(item === tab)); });
      document.querySelectorAll("[data-platform-panel]").forEach(function (panel) { panel.hidden = panel.dataset.platformPanel !== platform; });
    });
  });
}());
