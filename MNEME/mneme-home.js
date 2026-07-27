(function () {
  "use strict";

  var html = document.documentElement;
  var header = document.querySelector(".mneme-header");
  var themeButtons = document.querySelectorAll("[data-theme-toggle]");
  var menuButton = document.querySelector("[data-menu-toggle]");
  var mobileMenu = document.querySelector("[data-mobile-menu]");
  var searchDialog = document.querySelector("[data-search-dialog]");
  var searchInput = document.querySelector("[data-search-input]");

  function setTheme(theme) {
    html.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("mneme-theme", theme);
    } catch (error) {
      // Local storage is optional; the selected theme still applies for this visit.
    }
    themeButtons.forEach(function (button) {
      button.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      button.setAttribute("aria-label", theme === "dark" ? button.dataset.darkLabel : button.dataset.lightLabel);
    });
  }

  var savedTheme = null;
  try {
    savedTheme = localStorage.getItem("mneme-theme");
  } catch (error) {
    savedTheme = null;
  }
  setTheme(savedTheme || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

  document.querySelectorAll(".keyboard-hint").forEach(function (hint) {
    if (/Mac|iPhone|iPad/.test(navigator.platform)) hint.textContent = "⌘ K";
  });

  themeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setTheme(html.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  });

  function updateHeader() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 48);
    }
  }
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  function closeMenu() {
    if (!menuButton || !mobileMenu) return;
    menuButton.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("is-open");
  }

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", function () {
      var isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      mobileMenu.classList.toggle("is-open", !isOpen);
    });
    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 959) closeMenu();
    });
  }

  function openSearch() {
    if (!searchDialog) return;
    if (typeof searchDialog.showModal === "function") {
      searchDialog.showModal();
    } else {
      searchDialog.setAttribute("open", "open");
    }
    if (searchInput) {
      searchInput.value = "";
      filterResults("");
      window.setTimeout(function () { searchInput.focus(); }, 20);
    }
  }

  function closeSearch() {
    if (!searchDialog) return;
    if (typeof searchDialog.close === "function") searchDialog.close();
    else searchDialog.removeAttribute("open");
  }

  document.querySelectorAll("[data-search-open]").forEach(function (button) {
    button.addEventListener("click", openSearch);
  });

  document.querySelectorAll("[data-search-close]").forEach(function (button) {
    button.addEventListener("click", closeSearch);
  });

  function filterResults(query) {
    if (!searchDialog) return;
    var normalized = query.trim().toLowerCase();
    var visibleCount = 0;
    searchDialog.querySelectorAll("[data-search-item]").forEach(function (item) {
      var haystack = (item.dataset.title + " " + item.dataset.keywords).toLowerCase();
      var visible = !normalized || haystack.indexOf(normalized) !== -1;
      item.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    var empty = searchDialog.querySelector("[data-search-empty]");
    if (empty) empty.hidden = visibleCount !== 0;
  }

  if (searchInput) {
    searchInput.addEventListener("input", function () { filterResults(searchInput.value); });
  }

  document.addEventListener("keydown", function (event) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      openSearch();
    }
    if (event.key === "Escape") closeMenu();
  });

  document.querySelectorAll("[data-copy-target]").forEach(function (button) {
    button.addEventListener("click", function () {
      var target = document.getElementById(button.dataset.copyTarget);
      var codeBlock = button.closest(".code-block");
      if (codeBlock) target = codeBlock.querySelector("[data-platform-panel]:not([hidden])") || target;
      if (!target) return;
      var text = target.textContent.trim();
      var doneLabel = button.dataset.doneLabel || "Copied";
      var originalLabel = button.textContent;
      var finish = function () {
        button.textContent = doneLabel;
        window.setTimeout(function () { button.textContent = originalLabel; }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(finish).catch(finish);
      } else {
        var area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        try { document.execCommand("copy"); } catch (error) { /* best effort */ }
        document.body.removeChild(area);
        finish();
      }
    });
  });

  var platformTabs = document.querySelectorAll("[data-platform-tab]");
  var codePanels = document.querySelectorAll("[data-platform-panel]");
  platformTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var platform = tab.dataset.platformTab;
      platformTabs.forEach(function (item) { item.setAttribute("aria-selected", item === tab ? "true" : "false"); });
      codePanels.forEach(function (panel) { panel.hidden = panel.dataset.platformPanel !== platform; });
    });
  });
})();
