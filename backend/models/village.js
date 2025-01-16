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
  urban: { type: Boolean, required: false },

  pu18: { type: Number, min: 0, validate: validatorFunction(5), required: false },
  pu35: { type: Number, min: 0, validate: validatorFunction(5), required: false },
  pu50: { type: Number, min: 0, validate: validatorFunction(5), required: false },
  pu65: { type: Number, min: 0, validate: validatorFunction(5) , required: false},
  p65: { type: Number, min: 0, validate: validatorFunction(5), required: false },
  malePercentage: {
    type: Number,
    min: 0,
    max: 100,
    validate: validatorFunction(5),
    required: false
  },
  femalePercentage: {
    type: Number,
    min: 0,
    max: 100,
    validate: validatorFunction(5),
    required: false
  },
  location: {
    type: [Number],
    validate: {
      validator: function (v) {
        return (
          Array.isArray(v) &&
          v.length === 2 &&
          v.every(coord => Number(coord.toFixed(5)) === coord)
        );
      },
      message: props =>
        `Location must be an array of two numbers, each with up to 5 decimal places!`,
    },
  },
  populationGrowthRate: { type: Number,require:false},
  population: {
    type: Number,
    required: false,
    min: 0,
    validate: validatorFunction(5),
  },

});
VillageSchema.pre('save', function (next) {
  if (this.CategoriesTags && this.CategoriesTags.toLowerCase() === "urban") {
    this.urban = true;
  } else {
    this.urban = false;
  }
  next();
});

function validatorFunction(decimalPlaces) {
  return {
    validator: function (v) {
      return Number(v.toFixed(decimalPlaces)) === v;
    },
    message: props => `${props.value} exceeds ${decimalPlaces} decimal places!`,
  };
} 

VillageSchema.plugin(AutoIncrement, { inc_field: 'id' }); 

const Village = mongoose.model("Village", VillageSchema);

module.exports = Village;
