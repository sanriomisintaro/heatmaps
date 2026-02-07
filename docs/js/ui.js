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

    // ------- Station dropdown (ALL + Groups + Sites) -------
    const buildStationSelect = ({ groups = [], sites = [], keepSelection = true } = {}) => {
      const sel = APP.ui.stationSelect;
      if (!sel) return;

      const prev = String(sel.value || "ALL").toUpperCase();

      const uniqGroups = Array.from(new Set(groups.map(x => String(x).toUpperCase()).filter(Boolean))).sort();
      const uniqSites = Array.from(new Set(sites.map(x => String(x).toUpperCase()).filter(Boolean)))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

      sel.innerHTML = "";

      // All
      const optAll = document.createElement("option");
      optAll.value = "ALL";
      optAll.textContent = "All stations";
      sel.appendChild(optAll);

      // Groups
      if (uniqGroups.length) {
        const og = document.createElement("optgroup");
        og.label = "Groups";
        for (const g of uniqGroups) {
          const opt = document.createElement("option");
          opt.value = g;                 // MA, BA, TO, BU
          opt.textContent = `${g} (all)`; // display label
          og.appendChild(opt);
        }
        sel.appendChild(og);
      }

      // Sites
      if (uniqSites.length) {
        const og2 = document.createElement("optgroup");
        og2.label = "Sites";
        for (const s of uniqSites) {
          const opt = document.createElement("option");
          opt.value = s;      // MA1, MA2, ...
          opt.textContent = s;
          og2.appendChild(opt);
        }
        sel.appendChild(og2);
      }

      // restore selection if possible
      if (keepSelection) {
        const allValues = new Set(["ALL", ...uniqGroups, ...uniqSites]);
        sel.value = allValues.has(prev) ? prev : "ALL";
      } else {
        sel.value = "ALL";
      }
    };

    // Initial: show groups from config, sites will be added after data load
    const initialGroups = (typeof STATION_CODES !== "undefined") ? STATION_CODES : [];
    buildStationSelect({ groups: initialGroups, sites: [], keepSelection: false });

    // Called after GeoJSON loaded
    APP.refreshStationOptions = function () {
      const features = APP.data.features || [];
      const sites = features
        .map(f => String(f?.properties?.site || "").toUpperCase())
        .filter(Boolean);

      // groups from config, plus anything found in data (prefix 2 chars)
      const groupSet = new Set((typeof STATION_CODES !== "undefined") ? STATION_CODES : []);
      for (const s of sites) groupSet.add(s.slice(0, 2));

      buildStationSelect({
        groups: Array.from(groupSet),
        sites,
        keepSelection: true
      });
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

    // Panel open/close button
    const setPanelExpanded = (expanded) => {
      if (!APP.ui.panel || !APP.ui.panelToggle) return;
      APP.ui.panel.classList.toggle("closed", !expanded);
      APP.ui.panelToggle.setAttribute("aria-expanded", expanded ? "true" : "false");
      APP.ui.panelToggle.textContent = expanded ? "✕" : "☰";
    };

    if (window.innerWidth <= 520) setPanelExpanded(false);
    else setPanelExpanded(true);

    APP.ui.panelToggle?.addEventListener("click", () => {
      const isClosed = APP.ui.panel?.classList.contains("closed");
      setPanelExpanded(isClosed);
    });
  };
})();
