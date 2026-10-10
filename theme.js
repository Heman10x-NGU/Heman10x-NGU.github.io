// Theme toggle. The effective theme is the saved choice, or the system setting when nothing is saved.
(function () {
  var root = document.documentElement;
  var button = document.getElementById("theme-toggle");
  var systemDark = window.matchMedia("(prefers-color-scheme: dark)");

  function effectiveTheme() {
    return root.dataset.theme || (systemDark.matches ? "dark" : "light");
  }

  function syncLabel() {
    button.setAttribute(
      "aria-label",
      effectiveTheme() === "dark" ? "Switch to light theme" : "Switch to dark theme"
    );
  }

  button.addEventListener("click", function () {
    var next = effectiveTheme() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch (e) {
      // Storage can be blocked. The choice still applies until the page reloads.
    }
    syncLabel();
  });

  systemDark.addEventListener("change", syncLabel);
  syncLabel();
})();
