    // Lightbox
    function openLightbox(img) {
      document.getElementById("lightbox-img").src = img.src;
      document.getElementById("lightbox").style.display = "flex";
    }

    function closeLightbox() {
      document.getElementById("lightbox").style.display = "none";
    }

    // Expand/retract gallery items
    document.querySelectorAll('.gallery-main').forEach(function (img) {
      img.addEventListener('click', function () {
        const parent = img.closest('.gallery-item');
        parent.classList.toggle('expanded');
      });
    });

    // Reveal sections on scroll
    const revealSections = document.querySelectorAll('.reveal-section');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('hidden-section');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    revealSections.forEach(section => {
      observer.observe(section);
    });

    // Sparkle layer
    function spawnSparkles() {
      const layer = document.getElementById('sparkle-layer');
      if (!layer) return;

      const maxSparkles = 120;

      for (let i = 0; i < 25; i++) {
        const s = document.createElement('span');
        s.className = 'sparkle';
        s.textContent = '\u2728';

        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;

        s.style.left = x + 'px';
        s.style.top = y + 'px';

        layer.appendChild(s);

        setTimeout(() => {
          s.remove();
        }, 2000);
      }

      const existing = layer.querySelectorAll('.sparkle');
      if (existing.length > maxSparkles) {
        const excess = existing.length - maxSparkles;
        for (let i = 0; i < excess; i++) {
          if (existing[i]) existing[i].remove();
        }
      }
    }

    // Smooth scroll for in-page anchors + global sparkles
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        if (target) {
          e.preventDefault();
          spawnSparkles();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Sparkles on MAIN NAV clicks
    document.querySelectorAll('.main-nav a').forEach(link => {
      link.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) return;

        const href = this.getAttribute('href');
        if (!href) return;

        if (href.startsWith('#')) return;

        e.preventDefault();
        spawnSparkles();

        setTimeout(() => {
          window.location.href = href;
        }, 150);
      });
    });

    // Smooth scroll back to top + global sparkles
    document.getElementById('back-to-top').addEventListener('click', function () {
      spawnSparkles();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });