(function () {
  function start() {
    var root = document.documentElement;

    function reveal() {
      root.classList.remove('anim-pending');
    }

    if (!window.gsap || !window.ScrollTrigger) {
      reveal();
      return;
    }

    var gsap = window.gsap;
    var ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    var mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', function () {
      reveal();

      var intro = gsap.utils.toArray('main .kicker, main .hero h1, main .page-title, main .lead');
      var titles = gsap.utils.toArray('main .hero h1, main .page-title');
      var blocks = gsap.utils.toArray('main .notice, main .toc, main .card, main .sources');
      var items = gsap.utils.toArray('main .posts li, main .phones li');
      var photos = gsap.utils.toArray('main .photo');

      gsap.set(titles, { '--draw': 0 });
      gsap.set(blocks, { '--draw': 0 });

      gsap
        .timeline({ defaults: { ease: 'power3.out', duration: 0.9 } })
        .from(intro, { opacity: 0, y: 24, stagger: 0.12 })
        .to(titles, { '--draw': 1, duration: 0.9, ease: 'power2.inOut' }, '-=0.5');

      photos.forEach(function (figure) {
        var img = figure.querySelector('img');
        gsap.from(figure, {
          opacity: 0,
          y: 32,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: figure, start: 'top 92%', toggleActions: 'play none none none' }
        });
        if (!img) return;
        gsap.from(img, {
          scale: 1.06,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: figure, start: 'top 92%', toggleActions: 'play none none none' }
        });
      });

      blocks.forEach(function (block) {
        gsap
          .timeline({ scrollTrigger: { trigger: block, start: 'top 88%', toggleActions: 'play none none none' } })
          .from(block, { opacity: 0, y: 32, duration: 0.85, ease: 'power3.out' })
          .to(block, { '--draw': 1, duration: 1.1, ease: 'power2.inOut' }, 0);
      });

      gsap.set(items, { opacity: 0, y: 24 });
      ScrollTrigger.batch(items, {
        start: 'top 94%',
        onEnter: function (batch) {
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' });
        }
      });
    });

    mm.add('(prefers-reduced-motion: no-preference) and (min-width: 48em) and (pointer: fine)', function () {
      gsap.utils.toArray('main .photo img').forEach(function (img) {
        gsap.fromTo(
          img,
          { yPercent: -2.5 },
          {
            yPercent: 2.5,
            ease: 'none',
            scrollTrigger: { trigger: img.parentNode, start: 'top bottom', end: 'bottom top', scrub: true }
          }
        );
      });
    });

    mm.add('(prefers-reduced-motion: reduce)', reveal);

    document.addEventListener('i18n:change', function () {
      ScrollTrigger.refresh();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
