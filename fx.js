// V.S. Enterprises - animations & effects
(function () {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scroll progress bar + back-to-top
    const bar = document.createElement('div');
    bar.id = 'scrollProgress';
    document.body.appendChild(bar);

    const topBtn = document.createElement('button');
    topBtn.className = 'to-top';
    topBtn.setAttribute('aria-label', 'Back to top');
    topBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    topBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.appendChild(topBtn);

    const wa = document.createElement('a');
    wa.className = 'float-wa';
    wa.href = 'https://wa.me/916260362038?text=Hello%20V.S.%20Enterprises,%20I%20need%20a%20quote.';
    wa.target = '_blank';
    wa.rel = 'noopener';
    wa.setAttribute('aria-label', 'Chat on WhatsApp');
    wa.innerHTML = '<i class="fa-brands fa-whatsapp"></i>';
    document.body.appendChild(wa);

    function onScroll() {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
        topBtn.classList.toggle('show', h.scrollTop > 500);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Scroll reveal
    const targets = [
        ['.section-title', ''],
        ['.product-card', 'zoom'], ['.service-card', 'zoom'], ['.stat-card', 'zoom'],
        ['.quick-card', 'zoom'], ['.video-card', 'zoom'], ['.owner-card', 'from-left'],
        ['.info-card', 'from-left'], ['.contact-form-box', 'from-right'],
        ['.calculator-box', 'zoom'], ['.about-grid > *', ''], ['.gallery-filters', '']
    ];
    const els = [];
    targets.forEach(([sel, cls]) => {
        document.querySelectorAll(sel).forEach((el, i) => {
            if (el.classList.contains('reveal')) return;
            el.classList.add('reveal');
            if (cls) el.classList.add(cls);
            el.style.transitionDelay = Math.min(i % 6, 5) * 0.08 + 's';
            els.push(el);
        });
    });
    // Gallery items: lightweight fade only for the first screenful so 200+ photos stay fast
    if ('IntersectionObserver' in window && !reduce) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('in-view');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.12 });
        els.forEach(el => io.observe(el));
    } else {
        els.forEach(el => el.classList.add('in-view'));
    }

    // Count-up numbers (about page stats)
    document.querySelectorAll('.stat-card h3').forEach(h => {
        const m = h.textContent.trim().match(/^(\d+)(.*)$/);
        if (!m || reduce) return;
        const end = parseInt(m[1], 10), suffix = m[2];
        h.textContent = '0' + suffix;
        const obs = new IntersectionObserver(([en]) => {
            if (!en.isIntersecting) return;
            obs.disconnect();
            const t0 = performance.now(), dur = 1600;
            (function tick(t) {
                const p = Math.min((t - t0) / dur, 1);
                h.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suffix;
                if (p < 1) requestAnimationFrame(tick);
            })(t0);
        }, { threshold: 0.5 });
        obs.observe(h);
    });

    // Cursor-follow glow on cards
    document.querySelectorAll('.product-card, .service-card, .quick-card, .video-card, .stat-card').forEach(card => {
        card.classList.add('glow-card');
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
            card.style.setProperty('--my', (e.clientY - r.top) + 'px');
        });
    });

    // Hero: typing text + particle network
    const typed = document.querySelector('.typed');
    if (typed) {
        const words = (typed.dataset.words || '').split(',');
        let w = 0, c = 0, del = false;
        (function type() {
            const word = words[w];
            typed.textContent = word.slice(0, c);
            if (!del && c === word.length) { del = true; return setTimeout(type, 1500); }
            if (del && c === 0) { del = false; w = (w + 1) % words.length; }
            c += del ? -1 : 1;
            setTimeout(type, del ? 45 : 90);
        })();
    }

    const hero = document.querySelector('.hero');
    if (hero && !reduce) {
        const cv = document.createElement('canvas');
        cv.className = 'hero-canvas';
        hero.insertBefore(cv, hero.firstChild);
        const ctx = cv.getContext('2d');
        let W, H, pts = [];
        function size() {
            W = cv.width = hero.offsetWidth;
            H = cv.height = hero.offsetHeight;
            const n = Math.min(70, Math.floor(W / 18));
            pts = Array.from({ length: n }, () => ({
                x: Math.random() * W, y: Math.random() * H,
                vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5
            }));
        }
        size();
        window.addEventListener('resize', size);
        (function draw() {
            ctx.clearRect(0, 0, W, H);
            pts.forEach((p, i) => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > W) p.vx *= -1;
                if (p.y < 0 || p.y > H) p.vy *= -1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 1.8, 0, 6.283);
                ctx.fillStyle = 'rgba(103,232,249,.85)';
                ctx.fill();
                for (let j = i + 1; j < pts.length; j++) {
                    const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
                    if (d < 120) {
                        ctx.strokeStyle = 'rgba(168,85,247,' + (1 - d / 120) * .5 + ')';
                        ctx.lineWidth = 1;
                        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(draw);
        })();
    }
})();
