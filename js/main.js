(function () {
  var root = document.documentElement;
  root.classList.add('js');

  var motionOk = !window.matchMedia || window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  var saveData = !!(connection && (connection.saveData || /(^|-)2g$/.test(connection.effectiveType || '')));

  if (!motionOk || saveData) return;

  root.classList.add('anim-pending');
  setTimeout(function () {
    root.classList.remove('anim-pending');
  }, 3000);

  [
    'js/vendor/gsap.min.js',
    'js/vendor/ScrollTrigger.min.js',
    'js/vendor/MorphSVGPlugin.min.js',
    'js/animations.js',
    'js/brand-morph.js'
  ].forEach(function (src) {
    var script = document.createElement('script');
    script.src = src;
    script.async = false;
    document.head.appendChild(script);
  });
})();

document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    nav.classList.toggle('is-open', open);
  }

  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
});
