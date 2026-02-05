// ========================
// APP State + Helpers
// ========================
(function () {
  if (typeof APP_CONFIG === "undefined" || typeof FIELDS === "undefined" || typeof DEFAULT_FIELD === "undefined") {
    throw new Error("Config belum diload. Pastikan index.html memanggil ./js/config.js sebelum file JS lain.");
  }

  window.APP = {
    map: null,
    layers: {
      points: null,
      heat: null
    },
    data: {
      geojson: null,
      features: []
    },
    ui: {
      fieldSelect: null,
      radiusSlider: null,
      radiusVal: null,
      togglePoints: null,
      toggleHeat: null,
      statsBody: null
    }
  };

  // ---------- Helpers ----------
  APP.fmtNum = function (x, digits = 2) {
    if (x === null || x === undefined || Number.isNaN(x)) return "-";
    return Number(x).toFixed(digits);
  };

  APP.getFeatureValue = function (feature, fieldKey) {
    const v = feature?.properties?.[fieldKey];
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  APP.computeMinMax = function (features, fieldKey) {
    let min = Infinity, max = -Infinity, count = 0;
    for (const f of features) {
      const v = APP.getFeatureValue(f, fieldKey);
      if (v === null) continue;
      count++;
      if (v < min) min = v;
      if (v > max) max = v;
    }
    if (count === 0) return { min: null, max: null, count: 0 };
    return { min, max, count };
  };

  APP.buildPopupHTML = function (props) {
    const rows = [
      ["Site", props.site],
      ["Depth (m)", APP.fmtNum(props.depth_m, 0)],
      ["OM (%)", APP.fmtNum(props.om_pct)],
      ["Mud (%)", APP.fmtNum(props.mud_pct)],
      ["Sand (%)", APP.fmtNum(props.sand_pct)],
      ["Gravel (%)", APP.fmtNum(props.gravel_pct)],
      ["Tipe sedimen", props.sediment_desc || "-"],
      ["Kode", props.sediment_code || "-"]
    ];

    const tr = rows.map(([k, v]) => `
      <tr>
        <td style="padding:4px 8px; border-bottom:1px solid #eee;"><b>${k}</b></td>
        <td style="padding:4px 8px; border-bottom:1px solid #eee;">${v ?? "-"}</td>
      </tr>
    `).join("");

    return `
      <div style="min-width:240px;">
        <div style="font-weight:700; margin-bottom:6px;">${props.site}</div>
        <table style="border-collapse:collapse; width:100%;">${tr}</table>
      </div>
    `;
  };

  APP.updateStats = function (features, fieldKey) {
    const el = APP.ui.statsBody;
    if (!el) return;

    const meta = FIELDS[fieldKey];
    const { min, max, count } = APP.computeMinMax(features, fieldKey);

    if (count === 0) {
      el.textContent = "-";
      return;
    }
    el.textContent = `n=${count}\nmin=${APP.fmtNum(min)} ${meta.unit}\nmax=${APP.fmtNum(max)} ${meta.unit}`;
  };

  APP.getSelectedField = function () {
    return APP.ui.fieldSelect?.value || DEFAULT_FIELD;
  };

  APP.getRadius = function () {
    const v = Number(APP.ui.radiusSlider?.value);
    return Number.isFinite(v) ? v : APP_CONFIG.heat.radius;
  };
})();
