const express = require("express");

const router = express.Router();

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const fileUpload = require("express-fileupload");

const convertToBase64 = require("../utils/convertToBase64");

const Artwork = require("../models/ArtWork");

router.post("/artwork/add", fileUpload(), async (req, res) => {
  try {
    const picture = req.files.picture;
    const PictureComplete = await cloudinary.uploader.upload(
      convertToBase64(picture)
    );

    const { title, artist, description, dimensions } = req.body;

    const newArtwork = new Artwork({
      title: title,
      artist: artist,
      description: description,
      dimensions: dimensions,
      picture: PictureComplete,
    });
    console.log(newArtwork);
    await newArtwork.save();
    res.json(newArtwork);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/artwork/list", async (req, res) => {
  try {
    /*
    const artworksList = await Artwork.find();
    res.json(artworksList);
    */
    const artworkOne = await Artwork.findById(req.query.id);
    if (req.query.id) {
      return res.json(artworkOne);
    } else {
      res.json({ message: "missing id" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/artwork/update", async (req, res) => {
  try {
    const updateArtwork = await Artwork.findByIdAndUpdate(req.body.id, {
      description: req.body.description,
    });
    if (!req.body.id || !req.body.description) {
      res.json({ message: "bad request" });
    } else {
      res.json({ message: "artwork succesfully updated" });
    }
    await updateArtwork.save();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/artwork/delete", async (req, res) => {
  await Artwork.findByIdAndDelete(req.body.id);
  if (!req.body.id) {
    return res.json({ message: "missing id" });
  }
  if (req.body.id) {
    return res.json({ message: "artwork deleted" });
  }
});

module.exports = router;
