// ========================
// Data Loader
// ========================
(function () {
  if (typeof APP === "undefined") throw new Error("APP belum ada. Pastikan ./js/app.js diload.");

  APP.loadGeoJSON = function (url) {
    return fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error("Gagal load GeoJSON: " + r.status);
        return r.json();
      })
      .then((data) => {
        APP.data.geojson = data;
        APP.data.features = data.features || [];
        return data;
      });
  };
})();
