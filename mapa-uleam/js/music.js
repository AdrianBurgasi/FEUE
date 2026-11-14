(() => {
  const music = document.getElementById('background-music');
  const toggle = document.getElementById('music-toggle');
  const status = document.getElementById('music-status');
  const audioPath = 'assets/audio/fondo-relajante.mp3';
  let manuallyPaused = false;
  let unavailable = false;

  function updateToggle() {
    const playing = !music.paused && !music.ended;
    toggle.classList.toggle('is-playing', playing);
    toggle.setAttribute('aria-pressed', String(playing));
    toggle.setAttribute('aria-label', playing ? 'Pausar música ambiental' : 'Activar música ambiental');
    toggle.title = playing ? 'Pausar música ambiental' : 'Activar música ambiental';
  }

  function showMissingAudio() {
    if (unavailable) return;
    unavailable = true;
    toggle.disabled = true;
    toggle.setAttribute('aria-label', `Agrega una canción en ${audioPath}`);
    toggle.title = `Agrega una canción en ${audioPath}`;
    status.textContent = `No se encontró la pista. Agrega tu archivo en ${audioPath}.`;
  }

  async function playMusic() {
    if (unavailable) return;
    try {
      await music.play();
      status.textContent = 'Música ambiental activada.';
      updateToggle();
    } catch (error) {
      updateToggle();
      if (error.name === 'AbortError') return;
      if (error.name === 'NotAllowedError') {
        status.textContent = 'Pulsa Música o interactúa con la página para activar el audio.';
        return;
      }
      if (error.name === 'NotSupportedError') {
        showMissingAudio();
        return;
      }
      console.error('No se pudo reproducir la música ambiental.', error);
      status.textContent = 'No se pudo reproducir la música ambiental.';
    }
  }

  function resumeAfterGesture(event) {
    if (event.target instanceof Element && event.target.closest('#music-toggle')) return;
    document.removeEventListener('pointerdown', resumeAfterGesture);
    document.removeEventListener('keydown', resumeAfterGesture);
    if (!manuallyPaused && music.paused && !unavailable) void playMusic();
  }

  music.addEventListener('error', showMissingAudio);
  music.addEventListener('play', updateToggle);
  music.addEventListener('pause', updateToggle);
  toggle.addEventListener('click', () => {
    if (music.paused) {
      manuallyPaused = false;
      void playMusic();
    } else {
      manuallyPaused = true;
      music.pause();
      status.textContent = 'Música ambiental pausada.';
      updateToggle();
    }
  });

  document.addEventListener('pointerdown', resumeAfterGesture);
  document.addEventListener('keydown', resumeAfterGesture);
  updateToggle();
  void playMusic();
})();
