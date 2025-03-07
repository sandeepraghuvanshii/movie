// models/Movie.js
const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  title: { type: String, required: true },
  adult: { type: Boolean },
  backdrop_path: { type: String },
  belongs_to_collection: {
    id: { type: Number },
    name: { type: String },
    poster_path: { type: String },
    backdrop_path: { type: String }
  },
  budget: { type: Number },
  genres: [{
    id: { type: Number },
    name: { type: String }
  }],
  homepage: { type: String },
  imdb_id: { type: String },
  origin_country: [{ type: String }],
  original_language: { type: String },
  original_title: { type: String },
  overview: { type: String },
  popularity: { type: Number },
  poster_path: { type: String },
  production_companies: [{
    id: { type: Number },
    logo_path: { type: String },
    name: { type: String },
    origin_country: { type: String }
  }],
  production_countries: [{
    iso_3166_1: { type: String },
    name: { type: String }
  }],
  release_date: { type: String },
  revenue: { type: Number },
  runtime: { type: Number },
  spoken_languages: [{
    english_name: { type: String },
    iso_639_1: { type: String },
    name: { type: String }
  }],
  status: { type: String },
  tagline: { type: String },
  video: { type: Boolean },
  vote_average: { type: Number },
  vote_count: { type: Number },
  cast: [{
    id: { type: Number },
    name: { type: String },
    character: { type: String },
    profile_path: { type: String },
    adult: { type: Boolean },
    gender: { type: Number },
    known_for_department: { type: String },
    original_name: { type: String },
    popularity: { type: Number },
    cast_id: { type: Number },
    credit_id: { type: String },
    order: { type: Number }
  }],
});

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;
