// ============================================================
// TEMA CLARO / ESCURO
// ============================================================
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');

if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
}

themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});

// ============================================================
// NAV — sombra ao rolar + menu mobile
// ============================================================
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

// Fecha o menu mobile ao clicar em um link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ============================================================
// LINK ATIVO NA NAV CONFORME A SEÇÃO VISÍVEL
// ============================================================
const sections = document.querySelectorAll('section[id]');
const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.querySelectorAll('a').forEach(a => {
                a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
            });
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

// ============================================================
// FADE-IN AO ROLAR
// ============================================================
const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

// ============================================================
// SHOWCASE DE EXEMPLOS — abas trocam a imagem em destaque
// ============================================================
const showcaseImg = document.getElementById('showcaseImg');
const showcaseLink = document.getElementById('showcaseLink');
const frameTitle = document.getElementById('frameTitle');
const showcaseTabs = document.querySelectorAll('.showcase-tab');

showcaseTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        if (tab.classList.contains('active')) return;
        showcaseTabs.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const { img, title, alt } = tab.dataset;
        showcaseImg.classList.add('swapping');
        setTimeout(() => {
            showcaseImg.src = img;
            showcaseImg.alt = alt;
            showcaseLink.href = img;
            frameTitle.textContent = title;
            showcaseImg.onload = () => showcaseImg.classList.remove('swapping');
        }, 220);
    });
});

// ============================================================
// COPIAR E-MAIL — endereço fora do HTML (evita robôs de spam)
// ============================================================
const emailBtn = document.getElementById('emailBtn');
if (emailBtn) {
    const emailLabel = document.getElementById('emailBtnLabel');
    const endereco = ['henrique', '.', 'reolon', '.', 'pain', '@', 'gmail', '.', 'com'].join('');
    let emailTimer;
    emailBtn.addEventListener('click', () => {
        const feito = () => {
            emailBtn.classList.add('copied');
            emailLabel.textContent = 'E-mail copiado ✓';
            clearTimeout(emailTimer);
            emailTimer = setTimeout(() => {
                emailBtn.classList.remove('copied');
                emailLabel.textContent = 'Prefere e-mail? Copiar endereço';
            }, 2600);
        };
        const copiaLegado = () => {
            const ta = document.createElement('textarea');
            ta.value = endereco;
            ta.setAttribute('readonly', '');
            ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
            document.body.appendChild(ta);
            ta.select();
            let ok = false;
            try { ok = document.execCommand('copy'); } catch (e) { /* sem suporte */ }
            document.body.removeChild(ta);
            if (ok) feito();
            else window.location.href = 'mailto:' + endereco;
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(endereco).then(feito).catch(copiaLegado);
        } else {
            copiaLegado();
        }
    });
}

// ============================================================
// VÍDEO DO HERO
// ============================================================
const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // pausa para quem prefere menos movimento
        heroVideo.removeAttribute('autoplay');
        heroVideo.pause();
    } else {
        // alguns navegadores bloqueiam autoplay — retenta no load e na 1ª interação
        const tryPlay = () => { heroVideo.play().catch(() => {}); };
        tryPlay();
        document.addEventListener('click', tryPlay, { once: true });
        document.addEventListener('touchstart', tryPlay, { once: true });
    }
}
