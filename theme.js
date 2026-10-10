// Theme toggle. The effective theme is the saved choice, or the system setting when nothing is saved.
// Switching plays a short synthesized tick and, where the browser supports View Transitions,
// reveals the new theme as a circle growing from the button.
(function () {
  var root = document.documentElement;
  var button = document.getElementById("theme-toggle");
  var systemDark = window.matchMedia("(prefers-color-scheme: dark)");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var audio = null;

  function effectiveTheme() {
    return root.dataset.theme || (systemDark.matches ? "dark" : "light");
  }

  function syncLabel() {
    button.setAttribute(
      "aria-label",
      effectiveTheme() === "dark" ? "Switch to light theme" : "Switch to dark theme"
    );
  }

  function apply(next) {
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch (e) {
      // Storage can be blocked. The choice still applies until the page reloads.
    }
    syncLabel();
  }

  // A 160ms triangle-wave sweep: down for dark, up for light. Quiet, and only after a click.
  function tick(next) {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === "suspended") audio.resume();
      var t = audio.currentTime;
      var osc = audio.createOscillator();
      var gain = audio.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(next === "dark" ? 520 : 700, t);
      osc.frequency.exponentialRampToValueAtTime(next === "dark" ? 280 : 1040, t + 0.12);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.18, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      osc.connect(gain).connect(audio.destination);
      osc.start(t);
      osc.stop(t + 0.18);
    } catch (e) {
      // No Web Audio: switch silently.
    }
  }

  function origin(event) {
    if (event.detail > 0) return { x: event.clientX, y: event.clientY };
    var r = button.getBoundingClientRect(); // keyboard activation: use the button's center
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  button.addEventListener("click", function (event) {
    var next = effectiveTheme() === "dark" ? "light" : "dark";
    tick(next);
    if (!document.startViewTransition || reducedMotion.matches) {
      apply(next);
      return;
    }
    var o = origin(event);
    var radius = Math.hypot(Math.max(o.x, innerWidth - o.x), Math.max(o.y, innerHeight - o.y));
    var transition = document.startViewTransition(function () {
      apply(next);
    });
    transition.ready.then(function () {
      root.animate(
        {
          clipPath: [
            "circle(0px at " + o.x + "px " + o.y + "px)",
            "circle(" + radius + "px at " + o.x + "px " + o.y + "px)",
          ],
        },
        { duration: 650, easing: "cubic-bezier(0.4, 0, 0.2, 1)", pseudoElement: "::view-transition-new(root)" }
      );
    });
  });

  systemDark.addEventListener("change", syncLabel);
  syncLabel();
})();
