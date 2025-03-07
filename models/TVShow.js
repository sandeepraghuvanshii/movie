const mongoose = require("mongoose");

const createdBySchema = new mongoose.Schema(
  {
    id: { type: Number, required: false },
    credit_id: { type: String, required: false },
    name: { type: String, required: false },
    original_name: { type: String, required: false },
    gender: { type: Number, required: false },
    profile_path: { type: String, required: false },
  },
  { _id: false }
);

const genreSchema = new mongoose.Schema(
  {
    id: { type: Number, required: false },
    name: { type: String, required: false },
  },
  { _id: false }
);

const creditSchema = new mongoose.Schema(
  {
    job: { type: String, required: false },
    department: { type: String, required: false },
    credit_id: { type: String, required: false },
    adult: { type: Boolean, required: false },
    gender: { type: Number, required: false },
    id: { type: Number, required: false },
    known_for_department: { type: String, required: false },
    name: { type: String, required: false },
    original_name: { type: String, required: false },
    popularity: { type: Number, required: false },
    profile_path: { type: String, required: false },
  },
  { _id: false }
);

const episodeSchema = new mongoose.Schema(
  {
    id: { type: Number, required: false },
    name: { type: String, required: false },
    overview: { type: String, required: false },
    vote_average: { type: Number, required: false },
    vote_count: { type: Number, required: false },
    air_date: { type: Date, required: false },
    episode_number: { type: Number, required: false },
    episode_type: { type: String, required: false },
    production_code: { type: String, required: false },
    runtime: { type: Number, required: false },
    season_number: { type: Number, required: false },
    show_id: { type: Number, required: false },
    still_path: { type: String, required: false },
    crew: [creditSchema],
    guest_stars: [creditSchema],
  },
  { _id: false }
);

const networkSchema = new mongoose.Schema(
  {
    id: { type: Number, required: false },
    logo_path: { type: String, required: false },
    name: { type: String, required: false },
    origin_country: { type: String, required: false },
  },
  { _id: false }
);

const productionCompanySchema = new mongoose.Schema(
  {
    id: { type: Number, required: false },
    logo_path: { type: String, required: false },
    name: { type: String, required: false },
    origin_country: { type: String, required: false },
  },
  { _id: false }
);

const productionCountrySchema = new mongoose.Schema(
  {
    iso_3166_1: { type: String, required: false },
    name: { type: String, required: false },
  },
  { _id: false }
);

const spokenLanguageSchema = new mongoose.Schema(
  {
    english_name: { type: String, required: false },
    iso_639_1: { type: String, required: false },
    name: { type: String, required: false },
  },
  { _id: false }
);

const castSchema = new mongoose.Schema(
  {
    adult: { type: Boolean, required: false },
    gender: { type: Number, required: false },
    id: { type: Number, required: false },
    known_for_department: { type: String, required: false },
    name: { type: String, required: false },
    original_name: { type: String, required: false },
    popularity: { type: Number, required: false },
    profile_path: { type: String, required: false },
    character: { type: String, required: false },
    credit_id: { type: String, required: false },
    order: { type: Number, required: false },
  },
  { _id: false }
);

const crewSchema = new mongoose.Schema(
  {
    adult: { type: Boolean, required: false },
    gender: { type: Number, required: false },
    id: { type: Number, required: false },
    known_for_department: { type: String, required: false },
    name: { type: String, required: false },
    original_name: { type: String, required: false },
    popularity: { type: Number, required: false },
    profile_path: { type: String, required: false },
    credit_id: { type: String, required: false },
    department: { type: String, required: false },
    job: { type: String, required: false },
  },
  { _id: false }
);

const seasonSchema = new mongoose.Schema(
  {
    air_date: { type: Date, required: false },
    episode_count: { type: Number, required: false },
    id: { type: Number, required: false },
    name: { type: String, required: false },
    overview: { type: String, required: false },
    poster_path: { type: String, required: false },
    season_number: { type: Number, required: false },
    vote_average: { type: Number, required: false },
    episodes: [episodeSchema], // Nested episodes inside season
    cast: [castSchema], // Nested cast inside season
  },
  { _id: false }
);

const tvShowSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  adult: { type: Boolean, required: false },
  backdrop_path: { type: String, required: false },
  created_by: [createdBySchema],
  episode_run_time: [{ type: Number, required: false }],
  first_air_date: { type: Date, required: false },
  genres: [genreSchema],
  homepage: { type: String, required: false },
  id: { type: Number, required: true },
  in_production: { type: Boolean, required: false },
  languages: [{ type: String, required: false }],
  last_air_date: { type: Date, required: false },
  last_episode_to_air: episodeSchema,
  name: { type: String, required: false },
  next_episode_to_air: episodeSchema,
  networks: [networkSchema],
  number_of_episodes: { type: Number, required: false },
  number_of_seasons: { type: Number, required: false },
  origin_country: [{ type: String, required: false }],
  original_language: { type: String, required: false },
  original_name: { type: String, required: false },
  overview: { type: String, required: false },
  popularity: { type: Number, required: false },
  poster_path: { type: String, required: false },
  production_companies: [productionCompanySchema],
  production_countries: [productionCountrySchema],
  seasons: [seasonSchema],
  spoken_languages: [spokenLanguageSchema],
  status: { type: String, required: false },
  tagline: { type: String, required: false },
  type: { type: String, required: false },
  vote_average: { type: Number, required: false },
  vote_count: { type: Number, required: false },
  cast: [castSchema], // Field for main cast
  crew: [crewSchema], // Field for main crew
});

const TVShow = mongoose.model("TVShow", tvShowSchema);
module.exports = TVShow;
