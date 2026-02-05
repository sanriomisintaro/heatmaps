// ========================
// Konfigurasi Aplikasi Peta
// ========================

// Field yang bisa dipakai untuk heatmap
// key harus sama dengan properties di GeoJSON (data/samples.geojson)
const FIELDS = {
  om_pct:     { label: "OM (%)", unit: "%" },
  mud_pct:    { label: "Mud (%)", unit: "%" },
  sand_pct:   { label: "Sand (%)", unit: "%" },
  gravel_pct: { label: "Gravel (%)", unit: "%" },
  depth_m:    { label: "Depth (m)", unit: "m" }
};

const DEFAULT_FIELD = "om_pct";

const APP_CONFIG = {
  map: {
    center: [0.8727053, 124.7307739],
    zoom: 11
  },
  tile: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    options: {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors"
    }
  },
  heat: {
    radius: 25,
    blur: 18,
    maxZoom: 17
  }
};
