const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose); // Importing the AutoIncrement plugin

const VillageSchema = new mongoose.Schema({
  VillageName: { type: String, required: true },
  RegionDistrict: { type: String, required: true },
  LandArea: { type: Number, required: true },
  Latitude: { type: Number, required: true },
  Longitude: { type: Number, required: true },
  Image: { type: String, required: false },
  CategoriesTags: { type: String, required: false, default: "undefined" },
  id: { type: Number, unique: true },
});

VillageSchema.plugin(AutoIncrement, { inc_field: 'id' }); 

const Village = mongoose.model("Village", VillageSchema);

module.exports = Village;
