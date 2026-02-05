// ========================
// UI (panel controls)
// ========================
(function () {
  if (typeof APP === "undefined") throw new Error("APP belum ada. Pastikan ./js/app.js diload.");

  APP.initUI = function () {
    APP.ui.fieldSelect = document.getElementById("fieldSelect");
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

    // Radius default
    APP.ui.radiusSlider.value = String(APP_CONFIG.heat.radius);
    APP.ui.radiusVal.textContent = APP.ui.radiusSlider.value;

    // Events
    APP.ui.fieldSelect.addEventListener("change", () => {
      APP.refreshHeatOnly();
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
  };
})();
