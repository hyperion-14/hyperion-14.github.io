/*!
* Start Bootstrap - Resume v7.0.2 (https://startbootstrap.com/theme/resume)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-resume/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const sideNav = document.body.querySelector('#sideNav');
    if (sideNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#sideNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Scroll progress bar
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            progressBar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
        };
        window.addEventListener('scroll', updateProgress, { passive: true });
    }

    // Back to top button
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Scroll reveal via IntersectionObserver
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(el => observer.observe(el));
    }

    // Typewriter effect on tagline
    const typewriterEl = document.getElementById('typewriter');
    if (typewriterEl) {
        const text = typewriterEl.dataset.text || '';
        typewriterEl.textContent = '';
        let i = 0;
        function type() {
            if (i < text.length) {
                typewriterEl.textContent += text[i++];
                setTimeout(type, 55);
            } else {
                typewriterEl.classList.add('tw-done');
            }
        }
        setTimeout(type, 750); // start after the name has faded in (~650ms)
    }

    // Animated stat counters
    function animateCounter(el) {
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const duration = parseInt(el.dataset.duration, 10) || 2000;
        const startTime = performance.now();
        function tick(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            const raw = eased * target;
            if (progress >= 1) {
                el.textContent = target + suffix;
            } else {
                el.textContent = suffix ? raw.toFixed(1) : Math.floor(raw);
                requestAnimationFrame(tick);
            }
        }
        requestAnimationFrame(tick);
    }
    const counterEls = document.querySelectorAll('.stat-number[data-target]');
    if (counterEls.length && 'IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counterEls.forEach(el => counterObserver.observe(el));
    }

    // Align timeline line to start/end exactly at the first/last dot centres
    function alignTimelines() {
        const rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const dotCenterOffset = 0.5 * rootPx + 6; // top: 0.5rem  +  half of 12px dot
        document.querySelectorAll('.experience-timeline').forEach(timeline => {
            const items = timeline.querySelectorAll('.experience-item');
            if (items.length < 1) return;
            const lineTop = items[0].offsetTop + dotCenterOffset;
            const lineBottom = timeline.offsetHeight
                - (items[items.length - 1].offsetTop + dotCenterOffset);
            timeline.style.setProperty('--line-top', lineTop + 'px');
            timeline.style.setProperty('--line-bottom', lineBottom + 'px');
        });
    }
    alignTimelines();
    window.addEventListener('resize', alignTimelines);

});












// Anim Morph

var morphing = anime({
    targets: '.morph',
      points: [
          //Debut
          { value: '460.677372 125.296036 108.040017 24.8652344 112.454079 125.296036' },
          //Fin
          { value: '460.677372 157.296036 112.758683 38.9677241 119.111306 145.719727' },
      ],
    easing: 'easeInOutQuad',
    duration: 3000,
    loop: true
  });
  
  var morphing = anime({
    targets: '.morph2',
      points: [
          //Debut
          { value: '108.040017 24.8652344 168.780251 0 460.677372 125.296036' },
          //Fin
          { value: '112.758683 38.9677241 184.146186 0 460.677372 157.296036' },
      ],
    easing: 'easeInOutQuad',
    duration: 3000,
    loop: true
  });
  
  var morphing = anime({
    targets: '.morph3',
      points: [
          //Debut
          { value: '75.3147561 38.1354167 460.677372 125.296036 0 68.5184024' },
          //Fin
          { value: '78.250435 57.8044647 460.677372 157.296036 0 100.518402' },
      ],
    easing: 'easeInOutQuad',
    duration: 3000,
    loop: true
  });
  
  
  
