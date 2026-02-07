// ========================
// UI (panel controls)
// ========================
(function () {
  if (typeof APP === "undefined") throw new Error("APP belum ada. Pastikan ./js/app.js diload.");

  APP.initUI = function () {
    APP.ui.fieldSelect = document.getElementById("fieldSelect");
    APP.ui.stationSelect = document.getElementById("stationSelect");
    APP.ui.panel = document.getElementById("panel");
    APP.ui.panelToggle = document.getElementById("panelToggle");
    APP.ui.radiusSlider = document.getElementById("radius");
    APP.ui.radiusVal = document.getElementById("radiusVal");
    APP.ui.togglePoints = document.getElementById("togglePoints");
    APP.ui.toggleHeat = document.getElementById("toggleHeat");
    APP.ui.statsBody = document.getElementById("statsBody");

    // Dropdown fields
    APP.ui.fieldSelect.innerHTML = "";
    for (const key of Object.keys(FIELDS)) {
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent = FIELDS[key].label;
      APP.ui.fieldSelect.appendChild(opt);
    }
    APP.ui.fieldSelect.value = DEFAULT_FIELD;

    // Dropdown station (ALL + kode stasiun)
    const fillStationOptions = (codes, keepSelection = true) => {
      const sel = APP.ui.stationSelect;
      if (!sel) return;

      const prev = sel.value || "ALL";
      const uniq = Array.from(
        new Set((codes || []).map((x) => String(x).toUpperCase()).filter(Boolean))
      ).sort();

      sel.innerHTML = "";
      const optAll = document.createElement("option");
      optAll.value = "ALL";
      optAll.textContent = "All stations";
      sel.appendChild(optAll);

      for (const code of uniq) {
        const opt = document.createElement("option");
        opt.value = code;
        opt.textContent = code;
        sel.appendChild(opt);
      }

      if (keepSelection && (prev === "ALL" || uniq.includes(prev))) sel.value = prev;
      else sel.value = "ALL";
    };

    // Isi awal pakai config (MA/BA/TO/BU), lalu akan disinkronkan dari data setelah load.
    if (typeof STATION_CODES !== "undefined") fillStationOptions(STATION_CODES, false);
    else fillStationOptions([], false);

    // expose helper for main.js (dipanggil setelah GeoJSON diload)
    APP.refreshStationOptions = function () {
      const features = APP.data.features || [];
      const set = new Set(typeof STATION_CODES !== "undefined" ? STATION_CODES : []);
      for (const f of features) {
        const site = String(f?.properties?.site || "").toUpperCase();
        const code = site.slice(0, 2);
        if (code) set.add(code);
      }
      fillStationOptions(Array.from(set), true);
    };

    // Radius default
    APP.ui.radiusSlider.value = String(APP_CONFIG.heat.radius);
    APP.ui.radiusVal.textContent = APP.ui.radiusSlider.value;

    // Events
    APP.ui.fieldSelect.addEventListener("change", () => {
      APP.refreshHeatOnly();
    });

    APP.ui.stationSelect?.addEventListener("change", () => {
      APP.renderAll();
    });

    APP.ui.radiusSlider.addEventListener("input", () => {
      APP.ui.radiusVal.textContent = APP.ui.radiusSlider.value;
    });

    APP.ui.radiusSlider.addEventListener("change", () => {
      APP.refreshHeatOnly();
    });

    APP.ui.togglePoints.addEventListener("change", () => {
      if (!APP.layers.points) return;
      if (APP.ui.togglePoints.checked) APP.layers.points.addTo(APP.map);
      else APP.map.removeLayer(APP.layers.points);
    });

    APP.ui.toggleHeat.addEventListener("change", () => {
      if (!APP.layers.heat) return;
      if (APP.ui.toggleHeat.checked) APP.layers.heat.addTo(APP.map);
      else APP.map.removeLayer(APP.layers.heat);
    });

    // Panel open/close button (biar tidak ketutup map di layar kecil)
    const setPanelExpanded = (expanded) => {
      if (!APP.ui.panel || !APP.ui.panelToggle) return;
      APP.ui.panel.classList.toggle("closed", !expanded);
      APP.ui.panelToggle.setAttribute("aria-expanded", expanded ? "true" : "false");
      APP.ui.panelToggle.textContent = expanded ? "✕" : "☰";
    };

    // Default: close on small screens
    if (window.innerWidth <= 520) setPanelExpanded(false);
    else setPanelExpanded(true);

    APP.ui.panelToggle?.addEventListener("click", () => {
      const isClosed = APP.ui.panel?.classList.contains("closed");
      setPanelExpanded(isClosed); // if closed -> open, else close
    });
  };
})();
