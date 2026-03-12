(() => {
    const intro = document.getElementById('intro-screen');
    if (!intro) {
        return;
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.body.classList.add('intro-lock');

    const finishIntro = () => {
        intro.classList.add('intro-hide');
        document.body.classList.remove('intro-lock');
        window.setTimeout(() => {
            intro.remove();
        }, 450);
    };

    const audioEl = document.getElementById('intro-audio');
    let audioStarted = false;

    const tryPlayAudio = () => {
        if (!audioEl || audioStarted) {
            return;
        }
        const playPromise = audioEl.play();
        audioStarted = true;
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.then(() => {
                intro.classList.remove('intro-needs-click');
            }).catch(() => {
                audioStarted = false;
                intro.classList.add('intro-needs-click');
            });
        }
    };

    window.addEventListener('load', () => {
        intro.classList.add('intro-needs-click');

        if (audioEl && audioEl.getAttribute('src')) {
            tryPlayAudio();
        }

        const duration = prefersReduced ? 2000 : 3600;
        window.setTimeout(finishIntro, duration);
    });

    const handleGesture = () => {
        tryPlayAudio();
        intro.classList.remove('intro-needs-click');
    };

    window.addEventListener('pointerdown', handleGesture, { once: true });
    window.addEventListener('keydown', handleGesture, { once: true });
})();
