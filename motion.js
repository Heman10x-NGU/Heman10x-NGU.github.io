// Figure reveal. Each chart plays once when it first scrolls into view: bars grow from the
// left, dots pop in order, labels fade in last. It never replays. Readers who prefer reduced
// motion, and browsers without IntersectionObserver, get the static figures untouched.
(function () {
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var figures = document.querySelectorAll(".fig-art");
  figures.forEach(function (figure) {
    figure.querySelectorAll("svg").forEach(function (svg) {
      svg.querySelectorAll("rect.f-ink, rect.f-bar, circle").forEach(function (el, i) {
        el.style.setProperty("--i", i);
      });
    });
  });
  document.documentElement.classList.add("motion");

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.35 }
  );
  figures.forEach(function (figure) {
    observer.observe(figure);
  });
})();
