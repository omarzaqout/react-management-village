const mongoose = require("mongoose");

const VillageSchema = new mongoose.Schema({
  VillageName: { type: String, required: true },
  RegionDistrict: { type: String, required: true },
  LandArea: { type: Number, required: true },
  Latitude: { type: Number, required: true },
  Longitude: { type: Number, required: true },
  Image: { type: String, required: false },
  CategoriesTags: { type: String, required: false, default: "undefined" },
});

const Village = mongoose.model("Village", VillageSchema);

module.exports = Village;
