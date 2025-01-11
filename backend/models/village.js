const mongoose = require("mongoose");

const villageSchema = new mongoose.Schema({
  villageName: { type: String, required: true, unique: true },
  area: {
    type: Number,
    required: true,
    min: 0, // ensure area is non-negative
    validate: {
      validator: function (v) {
        return Number(v.toFixed(5)) === v; // Allow up to 5 decimal places
      },
      message: props => `${props.value} exceeds 5 decimal places!`,
    },
  },
  urban: { type: Boolean, required: true },
  pu18: {
    type: Number,
    required: true,
    min: 0, // Minimum population under 18, and so on for next ages
    validate: {
      validator: function (v) {
        return Number(v.toFixed(5)) === v;
      },
      message: props => `${props.value} exceeds 5 decimal places!`,
    },
  },
  pu35: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function (v) {
        return Number(v.toFixed(5)) === v;
      },
      message: props => `${props.value} exceeds 5 decimal places!`,
    },
  },
  pu50: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function (v) {
        return Number(v.toFixed(5)) === v;
      },
      message: props => `${props.value} exceeds 5 decimal places!`,
    },
  },
  pu65: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function (v) {
        return Number(v.toFixed(5)) === v;
      },
      message: props => `${props.value} exceeds 5 decimal places!`,
    },
  },
  p65: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function (v) {
        return Number(v.toFixed(5)) === v;
      },
      message: props => `${props.value} exceeds 5 decimal places!`,
    },
  },
  malePercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100, // Percentage must be between 0 and 100, and so on for female Percentage
    validate: {
      validator: function (v) {
        return Number(v.toFixed(5)) === v;
      },
      message: props => `${props.value} exceeds 5 decimal places!`,
    },
  },
  femalePercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    validate: {
      validator: function (v) {
        return Number(v.toFixed(5)) === v;
      },
      message: props => `${props.value} exceeds 5 decimal places!`,
    },
  },
  location: {
    type: [Number],
    required: true,
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
  population: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function (v) {
        return Number(v.toFixed(5)) === v; // Allow up to 5 decimal places
      },
      message: props => `${props.value} exceeds 5 decimal places!`,
    },
  },
});

const Village = mongoose.model("Village", villageSchema);

module.exports = Village;
