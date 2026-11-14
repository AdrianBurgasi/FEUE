(() => {
  // Referencias DOM
  const viewport = document.getElementById('viewport');
  const mapStage = document.getElementById('map-stage');
  const campusImage = document.getElementById('campus-image');
  const polygonsLayer = document.getElementById('polygons-layer');
  const hotspotsLayer = document.getElementById('hotspots-layer');
  const focusVignette = document.getElementById('focus-vignette');

  // HUD & Controles
  const btnBack = document.getElementById('btn-back');
  const btnBackLabel = document.getElementById('btn-back-label');
  const btnTogglePins = document.getElementById('btn-toggle-pins');
  const btnDirectory = document.getElementById('btn-directory');
  const directoryDrawer = document.getElementById('directory-drawer');
  const btnCloseDirectory = document.getElementById('btn-close-directory');
  const directoryList = document.getElementById('directory-list');

  // Buscador y Filtros
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const filterButtons = document.querySelectorAll('.filter-pill');

  // Tarjeta Glassmorphism Derecha
  const infoCard = document.getElementById('info-card');
  const btnCloseCard = document.getElementById('btn-close-card');
  const cardBadge = document.getElementById('card-badge');
  const cardTitle = document.getElementById('card-title');
  const cardCode = document.getElementById('card-code');
  const cardFaculty = document.getElementById('card-faculty');
  const cardSalasList = document.getElementById('card-salas-list');
  const cardReference = document.getElementById('card-reference');
  const btnZoomAction = document.getElementById('btn-zoom-action');
  const btnZoomText = document.getElementById('btn-zoom-text');
  const btnCopyLink = document.getElementById('btn-copy-link');

  // Caption Inferior Izquierdo
  const levelCaption = document.getElementById('level-caption');
  const captionEyebrow = document.getElementById('caption-eyebrow');
  const captionTitle = document.getElementById('caption-title');
  const captionSub = document.getElementById('caption-sub');

  // Zoom manual y Tooltip
  const btnZoomIn = document.getElementById('btn-zoom-in');
  const btnZoomOut = document.getElementById('btn-zoom-out');
  const btnResetView = document.getElementById('btn-reset-view');
  const hoverTooltip = document.getElementById('hover-tooltip');

  // Estado de la Aplicación
  const state = {
    level: 1, // 1: Campus General, 2: Zoom Bloque, 3: Zoom Sala
    activeZone: null,
    activeSala: null,
    previewZone: null,
    filter: 'all',
    showOverviewPins: true,
    stageWidth: 1600,
    stageHeight: 1000,
    camera: { x: 0, y: 0, scale: 1 },
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    calibratorOpen: false,
    calPoints: []
  };

  // =========================================================
  // 1. INICIALIZACIÓN Y DIMENSIONAMIENTO DEL ESCENARIO
  // =========================================================
  function initStageDimensions() {
    const natW = campusImage.naturalWidth || 1024;
    const natH = campusImage.naturalHeight || 665;
    const aspect = natW / natH;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Ajustar el escenario para cubrir armoniosamente el viewport
    if (vw / vh > aspect) {
      state.stageWidth = vw;
      state.stageHeight = vw / aspect;
    } else {
      state.stageHeight = vh;
      state.stageWidth = vh * aspect;
    }

    mapStage.style.width = `${state.stageWidth}px`;
    mapStage.style.height = `${state.stageHeight}px`;

    if (state.level === 1) {
      resetCamera(false);
    } else if (state.activeSala) {
      focusOnPoint(state.activeSala.x, state.activeSala.y, (state.activeZone?.zoomScale || 2.8) * 1.45, false);
    } else if (state.activeZone) {
      focusOnZone(state.activeZone, false);
    }
  }

  function applyCameraTransform(animate = true) {
    if (!animate) {
      mapStage.classList.add('no-transition');
    } else {
      mapStage.classList.remove('no-transition');
    }
    const { x, y, scale } = state.camera;
    mapStage.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;

    if (!animate) {
      // Forzar reflow para reactivar transiciones futuras
      void mapStage.offsetWidth;
      mapStage.classList.remove('no-transition');
    }
  }

  function resetCamera(animate = true) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    state.camera.scale = 1;
    state.camera.x = (vw - state.stageWidth) / 2;
    state.camera.y = (vh - state.stageHeight) / 2;
    applyCameraTransform(animate);
  }

  function getPolygonCenter(points) {
    let sumX = 0;
    let sumY = 0;
    points.forEach(([x, y]) => {
      sumX += x;
      sumY += y;
    });
    return {
      x: sumX / points.length,
      y: sumY / points.length
    };
  }

  function focusOnPoint(normX, normY, targetScale, animate = true) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const px = (normX / 1000) * state.stageWidth;
    const py = (normY / 1000) * state.stageHeight;

    // Desplazar ligeramente a la izquierda en pantallas grandes para dejar espacio a la tarjeta derecha
    const offsetX = vw > 768 ? -90 : 0;

    state.camera.scale = targetScale;
    state.camera.x = vw / 2 + offsetX - px * targetScale;
    state.camera.y = vh / 2 - py * targetScale;
    applyCameraTransform(animate);
  }

  function focusOnZone(zone, animate = true) {
    const center = getPolygonCenter(zone.polygon);
    focusOnPoint(center.x, center.y, zone.zoomScale || 2.8, animate);
  }

  // =========================================================
  // 2. RENDERIZADO DE POLÍGONOS SVG Y PINES
  // =========================================================
  function renderPolygons() {
    polygonsLayer.innerHTML = '';

    CAMPUS_DATA.forEach((zone) => {
      const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      const pointsAttr = zone.polygon.map((p) => `${p[0]},${p[1]}`).join(' ');
      poly.setAttribute('points', pointsAttr);
      poly.setAttribute('data-id', zone.id);
      poly.classList.add('zone-polygon', `category-${zone.categoria}`);

      if (state.filter !== 'all' && zone.categoria !== state.filter) {
        poly.classList.add('dimmed');
      }

      if (state.activeZone && state.activeZone.id === zone.id) {
        poly.classList.add('selected');
      }

      // Eventos de interacción
      poly.addEventListener('mouseenter', () => {
        if (state.calibratorOpen) return;
        hoverTooltip.textContent = `${zone.codigo} • ${zone.nombre}`;
        hoverTooltip.classList.remove('hidden');

        if (state.level === 1) {
          showZoneCard(zone, false);
        }
      });

      poly.addEventListener('mousemove', (e) => {
        hoverTooltip.style.left = `${e.clientX}px`;
        hoverTooltip.style.top = `${e.clientY}px`;
      });

      poly.addEventListener('mouseleave', () => {
        hoverTooltip.classList.add('hidden');
      });

      poly.addEventListener('click', (e) => {
        if (state.calibratorOpen) return;
        e.stopPropagation();
        enterZoneLevel(zone);
      });

      polygonsLayer.appendChild(poly);
    });
  }

  function renderHotspots() {
    hotspotsLayer.innerHTML = '';

    // NIVEL 1: Pines discretos sobre las zonas filtradas
    if (state.level === 1 && state.showOverviewPins) {
      CAMPUS_DATA.forEach((zone) => {
        if (state.filter !== 'all' && zone.categoria !== state.filter) return;
        const center = getPolygonCenter(zone.polygon);
        const pin = document.createElement('button');
        pin.type = 'button';
        pin.className = 'overview-pin';
        pin.style.left = `${center.x / 10}%`;
        pin.style.top = `${center.y / 10}%`;
        pin.innerHTML = `<span class="dot"></span><span>${zone.codigo}</span>`;

        pin.addEventListener('mouseenter', () => {
          highlightPolygon(zone.id, true);
          if (state.level === 1) showZoneCard(zone, false);
        });
        pin.addEventListener('mouseleave', () => highlightPolygon(zone.id, false));
        pin.addEventListener('click', (e) => {
          e.stopPropagation();
          enterZoneLevel(zone);
        });

        hotspotsLayer.appendChild(pin);
      });
    }

    // NIVEL 2 Y 3: Hotspots pulsantes de las Salas dentro del Bloque seleccionado
    if ((state.level === 2 || state.level === 3) && state.activeZone) {
      state.activeZone.salas.forEach((sala, idx) => {
        const spot = document.createElement('button');
        spot.type = 'button';
        spot.className = 'room-hotspot';
        if (state.activeSala && state.activeSala.id === sala.id) {
          spot.classList.add('active');
        }
        spot.style.left = `${sala.x / 10}%`;
        spot.style.top = `${sala.y / 10}%`;
        spot.style.animationDelay = `${idx * 0.06}s`;
        spot.innerHTML = `<span class="pulse-dot"></span><span>${sala.nombre}</span>`;

        spot.addEventListener('click', (e) => {
          e.stopPropagation();
          enterSalaLevel(state.activeZone, sala);
        });

        hotspotsLayer.appendChild(spot);
      });
    }
  }

  function highlightPolygon(zoneId, active) {
    const poly = polygonsLayer.querySelector(`[data-id="${zoneId}"]`);
    if (poly) {
      poly.classList.toggle('hovered', active);
    }
  }

  // =========================================================
  // 3. MÁQUINA DE ESTADOS DE NAVEGACIÓN (3 NIVELES)
  // =========================================================
  function showZoneCard(zone, isPinned = true) {
    state.previewZone = zone;
    cardBadge.textContent = zone.etiquetaCategoria;
    cardTitle.textContent = zone.nombre;
    cardCode.textContent = zone.codigo;
    cardFaculty.textContent = zone.facultad;
    cardReference.textContent = zone.referencia;

    cardSalasList.innerHTML = '';
    if (zone.salas && zone.salas.length > 0) {
      zone.salas.forEach((sala) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'sala-chip';
        chip.textContent = sala.nombre;
        chip.addEventListener('click', () => enterSalaLevel(zone, sala));
        cardSalasList.appendChild(chip);
      });
    } else {
      const empty = document.createElement('span');
      empty.className = 'sala-chip empty';
      empty.textContent = 'Área abierta / Sin salas numeradas';
      cardSalasList.appendChild(empty);
    }

    btnZoomText.textContent = `Acercar a ${zone.codigo}`;
    btnZoomAction.classList.remove('hidden');
    btnCopyLink.classList.add('hidden');
    btnZoomAction.onclick = () => enterZoneLevel(zone);

    infoCard.classList.remove('hidden');
  }

  function enterOverviewLevel() {
    state.level = 1;
    state.activeZone = null;
    state.activeSala = null;

    btnBack.classList.add('hidden');
    levelCaption.classList.add('hidden');
    focusVignette.classList.remove('active');
    infoCard.classList.add('hidden');

    resetCamera(true);
    renderPolygons();
    renderHotspots();
    syncUrlParams();
  }

  function enterZoneLevel(zone) {
    state.level = 2;
    state.activeZone = zone;
    state.activeSala = null;

    btnBackLabel.textContent = 'Volver al Campus';
    btnBack.classList.remove('hidden');
    focusVignette.classList.add('active');

    captionEyebrow.textContent = `${zone.etiquetaCategoria} • ${zone.codigo}`;
    captionTitle.textContent = zone.nombre;
    captionSub.textContent =
      zone.salas.length > 0
        ? `${zone.salas.length} ambiente(s) disponible(s) — Pulsa un marcador para acercar`
        : zone.referencia;
    levelCaption.classList.remove('hidden');

    showZoneCard(zone, true);
    btnZoomAction.classList.add('hidden'); // Ya estamos dentro del bloque

    focusOnZone(zone, true);
    renderPolygons();
    renderHotspots();
    syncUrlParams();
  }

  function enterSalaLevel(zone, sala) {
    state.level = 3;
    state.activeZone = zone;
    state.activeSala = sala;

    btnBackLabel.textContent = `Volver a ${zone.codigo}`;
    btnBack.classList.remove('hidden');
    focusVignette.classList.add('active');

    captionEyebrow.textContent = `${zone.nombre.toUpperCase()} • DETALLE DE AMBIENTE`;
    captionTitle.textContent = sala.nombre;
    captionSub.textContent = sala.detalle;
    levelCaption.classList.remove('hidden');

    // Actualizar tarjeta derecha con el detalle de la Sala
    cardBadge.textContent = `${zone.nombre} (${zone.codigo})`;
    cardTitle.textContent = sala.nombre;
    cardCode.textContent = 'NIVEL 3';
    cardFaculty.textContent = sala.detalle;
    cardReference.textContent = `Ubicado en ${zone.nombre}. ${zone.referencia}`;

    btnZoomAction.classList.add('hidden');
    btnCopyLink.classList.remove('hidden');
    btnCopyLink.onclick = () => {
      navigator.clipboard?.writeText(window.location.href);
      btnCopyLink.textContent = '¡Enlace copiado al portapapeles!';
      setTimeout(() => {
        btnCopyLink.textContent = 'Copiar enlace de esta sala';
      }, 2000);
    };

    infoCard.classList.remove('hidden');

    const deepScale = (zone.zoomScale || 2.8) * 1.45;
    focusOnPoint(sala.x, sala.y, deepScale, true);
    renderPolygons();
    renderHotspots();
    syncUrlParams();
  }

  // =========================================================
  // 4. BUSCADOR INSTANTÁNEO Y DIRECTORIO
  // =========================================================
  function handleSearch(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      searchResults.classList.add('hidden');
      return;
    }

    const matches = [];

    CAMPUS_DATA.forEach((zone) => {
      const zoneMatch =
        zone.nombre.toLowerCase().includes(q) ||
        zone.codigo.toLowerCase().includes(q) ||
        zone.facultad.toLowerCase().includes(q) ||
        zone.referencia.toLowerCase().includes(q);

      if (zoneMatch) {
        matches.push({
          type: 'zone',
          title: `${zone.nombre} (${zone.codigo})`,
          sub: zone.facultad,
          tag: 'Bloque / Zona',
          zone
        });
      }

      zone.salas.forEach((sala) => {
        if (
          sala.nombre.toLowerCase().includes(q) ||
          sala.detalle.toLowerCase().includes(q)
        ) {
          matches.push({
            type: 'sala',
            title: `${sala.nombre} — ${zone.codigo}`,
            sub: `${zone.nombre} • ${sala.detalle}`,
            tag: 'Sala',
            zone,
            sala
          });
        }
      });
    });

    searchResults.innerHTML = '';
    if (matches.length === 0) {
      searchResults.innerHTML = `<div class="search-result-item"><span class="search-result-sub">No se encontraron resultados para "${query}"</span></div>`;
    } else {
      matches.slice(0, 10).forEach((item) => {
        const row = document.createElement('div');
        row.className = 'search-result-item';
        row.innerHTML = `
          <div>
            <div class="search-result-title">${item.title}</div>
            <div class="search-result-sub">${item.sub}</div>
          </div>
          <span class="search-result-tag">${item.tag}</span>
        `;
        row.addEventListener('click', () => {
          searchResults.classList.add('hidden');
          searchInput.value = '';
          if (item.type === 'sala') {
            enterSalaLevel(item.zone, item.sala);
          } else {
            enterZoneLevel(item.zone);
          }
        });
        searchResults.appendChild(row);
      });
    }

    searchResults.classList.remove('hidden');
  }

  function renderDirectory() {
    directoryList.innerHTML = '';
    CAMPUS_DATA.forEach((zone) => {
      const item = document.createElement('div');
      item.className = 'dir-item';
      const salasText =
        zone.salas.length > 0
          ? zone.salas.map((s) => s.nombre).join(' • ')
          : zone.etiquetaCategoria;

      item.innerHTML = `
        <div class="dir-item-top">
          <span class="dir-item-name">${zone.nombre}</span>
          <span class="card-code-pill">${zone.codigo}</span>
        </div>
        <div class="dir-item-salas">${salasText}</div>
      `;
      item.addEventListener('click', () => {
        directoryDrawer.classList.add('hidden');
        enterZoneLevel(zone);
      });
      directoryList.appendChild(item);
    });
  }

  // =========================================================
  // 5. ARRASTRE MANUAL, RUEDA DE ZOOM Y ENLACES PROFUNDOS
  // =========================================================
  viewport.addEventListener('mousedown', (e) => {
    if (state.calibratorOpen) return;
    if (e.button !== 0) return;
    state.isDragging = true;
    state.dragStart.x = e.clientX - state.camera.x;
    state.dragStart.y = e.clientY - state.camera.y;
  });

  window.addEventListener('mousemove', (e) => {
    if (!state.isDragging) return;
    state.camera.x = e.clientX - state.dragStart.x;
    state.camera.y = e.clientY - state.dragStart.y;
    applyCameraTransform(false);
  });

  window.addEventListener('mouseup', () => {
    state.isDragging = false;
  });

  viewport.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.14 : 0.88;
      const nextScale = Math.min(Math.max(state.camera.scale * zoomFactor, 0.85), 5.5);

      const rect = viewport.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      state.camera.x = mouseX - ((mouseX - state.camera.x) / state.camera.scale) * nextScale;
      state.camera.y = mouseY - ((mouseY - state.camera.y) / state.camera.scale) * nextScale;
      state.camera.scale = nextScale;
      applyCameraTransform(false);
    },
    { passive: false }
  );

  function syncUrlParams() {
    const url = new URL(window.location.href);
    if (state.activeZone) {
      url.searchParams.set('bloque', state.activeZone.id);
    } else {
      url.searchParams.delete('bloque');
    }
    if (state.activeSala) {
      url.searchParams.set('sala', state.activeSala.id);
    } else {
      url.searchParams.delete('sala');
    }
    window.history.replaceState({}, '', url);
  }

  function restoreFromUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const bloqueId = params.get('bloque');
    const salaId = params.get('sala');

    if (bloqueId) {
      const zone = CAMPUS_DATA.find((z) => z.id === bloqueId);
      if (zone) {
        if (salaId) {
          const sala = zone.salas.find((s) => s.id === salaId);
          if (sala) {
            enterSalaLevel(zone, sala);
            return;
          }
        }
        enterZoneLevel(zone);
      }
    }
  }

  // =========================================================
  // 6. CALIBRADOR VISUAL INTEGRADO (SHIFT + E)
  // =========================================================
  function initCalibrator() {
    const panel = document.getElementById('calibrator-panel');
    const select = document.getElementById('cal-zone-select');
    const output = document.getElementById('cal-output');

    CAMPUS_DATA.forEach((z) => {
      const opt = document.createElement('option');
      opt.value = z.id;
      opt.textContent = `${z.codigo} — ${z.nombre}`;
      select.appendChild(opt);
    });

    function toggleCalibrator(force) {
      state.calibratorOpen = typeof force === 'boolean' ? force : !state.calibratorOpen;
      panel.classList.toggle('hidden', !state.calibratorOpen);
    }

    document.getElementById('btn-close-cal').onclick = () => toggleCalibrator(false);
    document.getElementById('btn-cal-clear').onclick = () => {
      state.calPoints = [];
      output.textContent = '[]';
    };
    document.getElementById('btn-cal-copy').onclick = () => {
      navigator.clipboard?.writeText(output.textContent);
    };

    mapStage.addEventListener('click', (e) => {
      if (!state.calibratorOpen) return;
      const rect = mapStage.getBoundingClientRect();
      const nx = Math.round(((e.clientX - rect.left) / rect.width) * 1000);
      const ny = Math.round(((e.clientY - rect.top) / rect.height) * 1000);
      state.calPoints.push([nx, ny]);

      const zone = CAMPUS_DATA.find((z) => z.id === select.value);
      if (zone) {
        zone.polygon = [...state.calPoints];
        renderPolygons();
      }
      output.textContent = JSON.stringify(state.calPoints);
    });

    window.addEventListener('keydown', (e) => {
      if (e.shiftKey && e.key.toLowerCase() === 'e') {
        toggleCalibrator();
      }
    });
  }

  // =========================================================
  // 7. EVENTOS DE INTERFAZ Y ARRANQUE
  // =========================================================
  btnBack.addEventListener('click', () => {
    if (state.level === 3 && state.activeZone) {
      enterZoneLevel(state.activeZone);
    } else {
      enterOverviewLevel();
    }
  });

  btnCloseCard.addEventListener('click', () => {
    infoCard.classList.add('hidden');
  });

  btnTogglePins.addEventListener('click', () => {
    state.showOverviewPins = !state.showOverviewPins;
    renderHotspots();
  });

  btnDirectory.addEventListener('click', () => {
    directoryDrawer.classList.toggle('hidden');
  });

  btnCloseDirectory.addEventListener('click', () => {
    directoryDrawer.classList.add('hidden');
  });

  searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
  searchInput.addEventListener('focus', (e) => handleSearch(e.target.value));

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrapper')) {
      searchResults.classList.add('hidden');
    }
  });

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.filter = btn.dataset.filter;
      renderPolygons();
      renderHotspots();
    });
  });

  btnZoomIn.addEventListener('click', () => {
    state.camera.scale = Math.min(state.camera.scale * 1.25, 5.5);
    applyCameraTransform(true);
  });

  btnZoomOut.addEventListener('click', () => {
    state.camera.scale = Math.max(state.camera.scale * 0.8, 0.85);
    applyCameraTransform(true);
  });

  btnResetView.addEventListener('click', () => enterOverviewLevel());

  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    } else if (e.key === 'Escape') {
      searchResults.classList.add('hidden');
      directoryDrawer.classList.add('hidden');
      if (state.level === 3 && state.activeZone) {
        enterZoneLevel(state.activeZone);
      } else if (state.level === 2) {
        enterOverviewLevel();
      }
    }
  });

  window.addEventListener('resize', initStageDimensions);

  // Arranque inicial
  if (campusImage.complete) {
    initStageDimensions();
  } else {
    campusImage.addEventListener('load', initStageDimensions);
  }

  renderPolygons();
  renderHotspots();
  renderDirectory();
  initCalibrator();
  restoreFromUrlParams();
})();