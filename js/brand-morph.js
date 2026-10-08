(function () {
  var SHAPES = {
    flag: {
      a: 'M17.6 3.3 Q20 1.8 22.4 3.3 L35.4 11.7 Q38.3 14 35.4 16.3 L22.4 24.7 Q20 26.2 17.6 24.7 L4.6 16.3 Q1.7 14 4.6 11.7 Z',
      b: 'M14.40 14.00 C14.40 10.91 16.91 8.40 20.00 8.40 C23.09 8.40 25.60 10.91 25.60 14.00 C25.60 17.09 23.09 19.60 20.00 19.60 C16.91 19.60 14.40 17.09 14.40 14.00 Z'
    },
    coffee: {
      a: 'M8.5 9.5 L27.5 9.5 L27.5 15.5 Q27.5 22.5 18 22.5 Q8.5 22.5 8.5 15.5 Z M27.5 11.2 Q33.8 11 33.8 15 Q33.8 19.2 27 19.2 L27.6 17 Q31.4 17.2 31.4 15 Q31.4 13.2 27.5 13.4 Z M5.5 24 L30.5 24 Q30.5 26.2 28 26.2 L8 26.2 Q5.5 26.2 5.5 24 Z',
      b: 'M13.6 7.6 C11.6 5.8 15.4 4.6 13.4 2.4 L14.8 1.6 C17.2 4.2 13.4 5.4 15.2 7.2 Z M19.4 7.6 C17.4 5.8 21.2 4.6 19.2 2.4 L20.6 1.6 C23 4.2 19.2 5.4 21 7.2 Z M9.8 10.4 Q18 8.4 26.2 10.4 Q18 12.6 9.8 10.4 Z'
    },
    carnival: {
      a: 'M3.5 10.5 Q11 5 20 9.6 Q29 5 36.5 10.5 Q37 19.5 27.5 20.6 Q22.3 21 20 16.8 Q17.7 21 12.5 20.6 Q3 19.5 3.5 10.5 Z M9.6 13.2 Q13 10.6 16.4 13.2 Q13 16.4 9.6 13.2 Z M23.6 13.2 Q27 10.6 30.4 13.2 Q27 16.4 23.6 13.2 Z',
      b: 'M29.5 8.2 Q30.5 1.8 36.5 0.8 Q33.4 3.8 31.8 8.6 Z M32 9 Q35.4 4.4 39.6 4.8 Q35.8 6.8 33.8 10.2 Z M27 8.4 Q26.4 3 30 0.6 Q28.8 4.2 29 8.4 Z'
    },
    football: {
      a: 'M8.80 14.00 C8.80 7.81 13.81 2.80 20.00 2.80 C26.19 2.80 31.20 7.81 31.20 14.00 C31.20 20.19 26.19 25.20 20.00 25.20 C13.81 25.20 8.80 20.19 8.80 14.00 Z',
      b: 'M20.00 10.60 L23.23 12.95 L22.00 16.75 L18.00 16.75 L16.77 12.95 Z M20.00 8.80 L17.38 6.90 L18.38 3.83 L21.62 3.83 L22.62 6.90 Z M24.95 12.39 L25.94 9.32 L29.18 9.32 L30.18 12.39 L27.56 14.29 Z M23.06 18.21 L26.29 18.21 L27.29 21.28 L24.67 23.18 L22.06 21.28 Z M16.94 18.21 L17.94 21.28 L15.33 23.18 L12.71 21.28 L13.71 18.21 Z M15.05 12.39 L12.44 14.29 L9.82 12.39 L10.82 9.32 L14.06 9.32 Z'
    },
    bird: {
      a: 'M14.75 7 C14.75 7.9 14 8.65 13.1 8.65 C12.2 8.65 11.45 7.9 11.45 7 C11.45 6.1 12.2 5.35 13.1 5.35 C14 5.35 14.75 6.1 14.75 7 Z M12.40 7.00 C12.40 6.61 12.71 6.30 13.10 6.30 C13.49 6.30 13.80 6.61 13.80 7.00 C13.80 7.39 13.49 7.70 13.10 7.70 C12.71 7.70 12.40 7.39 12.40 7.00 Z M9.4 10.8 Q11 12.3 13 11.6 Q11.6 13.4 9.4 10.8 Z M6 22.4 Q19 19.8 33 22.8 L32.6 24.4 Q19 21.6 6.2 23.9 Z',
      b: 'M9 5.6 Q11.4 2.6 15.4 3.4 Q19.4 4.4 20.4 8.6 Q25.4 10.4 28.6 14.4 Q32.6 19.2 38.6 25.6 Q31.4 23.2 26.6 21 Q22 20.4 18.4 17.6 Q14.8 14.6 14.4 11.8 Q12 12.2 10.4 11 Q8.6 13 7.4 11.6 Q6.4 9.4 7.4 8 Q7.8 6.4 9 5.6 Z M11.45 7.00 C11.45 6.09 12.19 5.35 13.10 5.35 C14.01 5.35 14.75 6.09 14.75 7.00 C14.75 7.91 14.01 8.65 13.10 8.65 C12.19 8.65 11.45 7.91 11.45 7.00 Z'
    }
  };

  function start() {
    var mark = document.querySelector('.brand-mark');
    if (!mark || !window.gsap || !window.MorphSVGPlugin) return;

    var gsap = window.gsap;
    gsap.registerPlugin(window.MorphSVGPlugin);

    var group = mark.querySelector('.mark-g');
    var pathA = mark.querySelector('.mark-a');
    var pathB = mark.querySelector('.mark-b');
    var CENTER = '20 14';
    function morphTo(tl, name) {
      tl.to(group, { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.3, ease: 'power2.out', svgOrigin: CENTER })
        .to(pathA, { morphSVG: { shape: SHAPES[name].a, shapeIndex: 'auto' }, duration: 0.9, ease: 'power3.inOut' }, '<0.1')
        .to(pathB, { morphSVG: { shape: SHAPES[name].b, shapeIndex: 'auto' }, duration: 0.9, ease: 'power3.inOut' }, '<');
    }

    var ACTIONS = {
      flag: function (tl) {
        tl.to(pathB, { scale: 1.18, duration: 0.45, ease: 'sine.inOut', svgOrigin: CENTER, yoyo: true, repeat: 3 })
          .to(group, { rotation: 4, duration: 0.9, ease: 'sine.inOut', svgOrigin: CENTER, yoyo: true, repeat: 1 }, '<');
      },
      coffee: function (tl) {
        tl.to(pathB, { skewX: 9, duration: 0.5, ease: 'sine.inOut', svgOrigin: '18 11', yoyo: true, repeat: 3 })
          .to(group, { rotation: -4, duration: 1, ease: 'sine.inOut', svgOrigin: '18 24', yoyo: true, repeat: 1 }, '<')
          .set(pathB, { skewX: 0 });
      },
      carnival: function (tl) {
        tl.to(group, { rotation: 9, duration: 0.42, ease: 'sine.inOut', svgOrigin: CENTER, yoyo: true, repeat: 3 })
          .to(pathB, { rotation: -14, duration: 0.3, ease: 'sine.inOut', svgOrigin: '30 9', yoyo: true, repeat: 5 }, '<')
          .set(pathB, { rotation: 0 });
      },
      football: function (tl) {
        tl.to(group, { y: -4, duration: 0.32, ease: 'power2.out', yoyo: true, repeat: 3 })
          .to(group, { rotation: 360, duration: 1.28, ease: 'none', svgOrigin: CENTER }, '<')
          .set(group, { rotation: 0 });
      },
      bird: function (tl) {
        tl.to(group, { y: -2.5, rotation: -5, duration: 0.25, ease: 'power2.out', svgOrigin: '20 23', yoyo: true, repeat: 3 })
          .to(group, { rotation: 6, duration: 0.5, ease: 'sine.inOut', svgOrigin: '20 23', yoyo: true, repeat: 1 });
      }
    };

    var ORDER = ['flag', 'coffee', 'carnival', 'football', 'bird'];

    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', function () {
      var tl = gsap.timeline({ repeat: -1, delay: 1.5 });
      var observer = null;
      if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver(function (entries) {
          if (entries[0].isIntersecting) tl.resume();
          else tl.pause();
        });
        observer.observe(mark);
      }

      ORDER.forEach(function (name, i) {
        if (i > 0) morphTo(tl, name);
        tl.add(function () {}, '+=0.25');
        ACTIONS[name](tl);
        tl.add(function () {}, '+=0.6');
      });
      morphTo(tl, 'flag');
      return function () {
        if (observer) observer.disconnect();
        gsap.set(pathA, { attr: { d: SHAPES.flag.a } });
        gsap.set(pathB, { attr: { d: SHAPES.flag.b } });
      };
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
