// ========================
// Map + Layers
// ========================
(function () {
  if (typeof APP === "undefined") throw new Error("APP belum ada. Pastikan ./js/app.js diload.");

  APP.initMap = function () {
    APP.map = L.map("map", {
      center: APP_CONFIG.map.center,
      zoom: APP_CONFIG.map.zoom
    });

    L.tileLayer(APP_CONFIG.tile.url, APP_CONFIG.tile.options).addTo(APP.map);
    L.control.scale({ metric: true, imperial: false }).addTo(APP.map);

    APP.layers.points = L.layerGroup().addTo(APP.map);

    APP.layers.heat = L.heatLayer([], {
      radius: APP_CONFIG.heat.radius,
      blur: APP_CONFIG.heat.blur,
      maxZoom: APP_CONFIG.heat.maxZoom
    }).addTo(APP.map);
  };

  APP.updatePoints = function (features) {
    const layer = APP.layers.points;
    if (!layer) return;

    layer.clearLayers();
    const latlngs = [];

    for (const f of features) {
      const [lon, lat] = f.geometry.coordinates;
      const props = f.properties || {};

      const depth = Number(props.depth_m);
      const r = Number.isFinite(depth) ? Math.max(4, Math.min(14, 4 + depth / 8)) : 6;

      const marker = L.circleMarker([lat, lon], {
        radius: r,
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7
      }).bindPopup(APP.buildPopupHTML(props));

      marker.addTo(layer);
      latlngs.push([lat, lon]);
    }

    if (latlngs.length) {
      APP.map.fitBounds(L.latLngBounds(latlngs).pad(0.2));
    }
  };

  APP.updateHeat = function (features, fieldKey) {
    const { min, max, count } = APP.computeMinMax(features, fieldKey);

    // rebuild heat layer supaya radius terbaru kepake
    if (APP.layers.heat) APP.map.removeLayer(APP.layers.heat);

    if (count === 0) {
      APP.layers.heat = L.heatLayer([], {
        radius: APP.getRadius(),
        blur: APP_CONFIG.heat.blur,
        maxZoom: APP_CONFIG.heat.maxZoom
      });

      if (APP.ui.toggleHeat?.checked) APP.layers.heat.addTo(APP.map);
      APP.updateStats(features, fieldKey);
      return;
    }

    const range = (max - min) || 1;
    const points = [];

    for (const f of features) {
      const v = APP.getFeatureValue(f, fieldKey);
      if (v === null) continue;

      const [lon, lat] = f.geometry.coordinates;
      const intensity = (v - min) / range; // 0..1
      points.push([lat, lon, intensity]);
    }

    APP.layers.heat = L.heatLayer(points, {
      radius: APP.getRadius(),
      blur: APP_CONFIG.heat.blur,
      maxZoom: APP_CONFIG.heat.maxZoom
    });

    if (APP.ui.toggleHeat?.checked) APP.layers.heat.addTo(APP.map);

    APP.updateStats(features, fieldKey);
  };

  APP.renderAll = function () {
    const features = APP.data.features || [];
    APP.updatePoints(features);
    APP.updateHeat(features, APP.getSelectedField());
  };

  APP.refreshHeatOnly = function () {
    const features = APP.data.features || [];
    APP.updateHeat(features, APP.getSelectedField());
  };
})();
