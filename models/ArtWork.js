const mongoose = require("mongoose");

const Artwork = mongoose.model("Artwork", {
  title: String,
  artist: String,
  description: String,
  dimensions: String,
  picture: Object,
});

module.exports = Artwork;
