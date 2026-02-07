// ========================
// Entry Point
// ========================
window.addEventListener("DOMContentLoaded", () => {
  // 1) init map
  APP.initMap();

  // 2) init UI
  APP.initUI();

  // 3) load data & render
  APP.loadGeoJSON("./data/samples.geojson")
    .then(() => {
      // Update station dropdown based on loaded data
      if (typeof APP.refreshStationOptions === "function") APP.refreshStationOptions();

      APP.renderAll();

      // Terapkan toggle awal (kalau user uncheck di HTML nanti)
      if (!APP.ui.togglePoints.checked && APP.layers.points) {
        APP.map.removeLayer(APP.layers.points);
      }
      if (!APP.ui.toggleHeat.checked && APP.layers.heat) {
        APP.map.removeLayer(APP.layers.heat);
      }
    })
    .catch((err) => {
      alert(err.message);
      console.error(err);
    });
});
