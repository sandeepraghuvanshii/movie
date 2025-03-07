// server.js
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const Movie = require("./models/Movie");

const app = express();
const port = process.env.PORT || 3000;
const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0OTY5M2UwNmFmNTBmZDEyMjRlMTM4YjlmZTEyYmY1ZiIsIm5iZiI6MTcyOTgwMjAzNC41MzA5ODYsInN1YiI6IjVmNjMwM2YwODdmM2YyMDAzYTdmMDViMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.oF38eg57qmEpqmalQHxCkXmj0kHDmrNsiZmh9Y3aC98"; // Replace with your actual API key

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://Harman:Harman9696@cluster0.f3qys.mongodb.net/Harman?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Endpoint to fetch and display movie data from TMDb
app.get("/fetch-movie/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    };

    // Fetch movie details from TMDb
    const movieResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}`,
      config
    );
    const movieData = movieResponse.data;

    // Fetch movie credits (cast) from TMDb
    const creditsResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/credits`,
      config
    );
    const creditsData = creditsResponse.data;

    // Combine data to return
    const movie = {
      _id: movieData.id,
      title: movieData.title,
      adult: movieData.adult,
      backdrop_path: movieData.backdrop_path,
      belongs_to_collection: movieData.belongs_to_collection
        ? {
            id: movieData.belongs_to_collection.id,
            name: movieData.belongs_to_collection.name,
            poster_path: movieData.belongs_to_collection.poster_path,
            backdrop_path: movieData.belongs_to_collection.backdrop_path,
          }
        : null,
      budget: movieData.budget,
      genres: movieData.genres.map((genre) => ({
        id: genre.id,
        name: genre.name,
      })),
      homepage: movieData.homepage,
      imdb_id: movieData.imdb_id,
      origin_country: movieData.origin_country,
      original_language: movieData.original_language,
      original_title: movieData.original_title,
      overview: movieData.overview,
      popularity: movieData.popularity,
      poster_path: movieData.poster_path,
      production_companies: movieData.production_companies.map((company) => ({
        id: company.id,
        logo_path: company.logo_path,
        name: company.name,
        origin_country: company.origin_country,
      })),
      production_countries: movieData.production_countries.map((country) => ({
        iso_3166_1: country.iso_3166_1,
        name: country.name,
      })),
      release_date: movieData.release_date,
      revenue: movieData.revenue,
      runtime: movieData.runtime,
      spoken_languages: movieData.spoken_languages.map((language) => ({
        english_name: language.english_name,
        iso_639_1: language.iso_639_1,
        name: language.name,
      })),
      status: movieData.status,
      tagline: movieData.tagline,
      video: movieData.video,
      vote_average: movieData.vote_average,
      vote_count: movieData.vote_count,
      cast: creditsData.cast.map((member) => ({
        id: member.id,
        name: member.name,
        character: member.character,
        profile_path: member.profile_path,
        adult: member.adult,
        gender: member.gender,
        known_for_department: member.known_for_department,
        original_name: member.original_name,
        popularity: member.popularity,
        cast_id: member.cast_id,
        credit_id: member.credit_id,
        order : member.order,
      })),
    };

    // Now use the movie title to search on netfree.cc
    const searchResponse = await axios.get(`https://netfree.cc/search.php?s=${encodeURIComponent(movie.title)}`);
    const searchData = searchResponse?.data;
    const movieId = searchData?.searchResult[0]?.id;
    const movieTitle = searchData?.searchResult[0]?.t;
    const playlistResponse = await axios.get(`https://netfree.cc/playlist.php?id=${movieId}&${movieTitle}`);
    const playlistData = playlistResponse.data;
    res.json({ movie, playlistData});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create a new movie
app.post("/movies", async (req, res) => {
  try {
    const movieData = req.body;  // Get the movie data from the request body

    // Validate required fields
    if (!movieData._id || !movieData.title) {
      return res.status(400).json({ message: "ID and title are required" });
    }

    // Create a new Movie instance
    const newMovie = new Movie(movieData);

    // Save the movie data to the database
    await newMovie.save();

    // Respond with success message
    res.status(201).json({
      message: "Movie created successfully",
      movie: newMovie
    });
  } catch (error) {
    console.error("Error saving movie:", error);
    res.status(500).json({ message: "Failed to create movie", error });
  }
});


// Endpoint to update video URLs for a movie by its ID using PATCH
app.patch("/movies/:id/urls", async (req, res) => {
  const { id } = req.params;
  const { low, medium, high } = req.body;  // Extract the video URLs from the request body

  // Check if at least one URL is provided
  if (!low && !medium && !high) {
    return res.status(400).json({ message: "At least one video URL (low, medium, or high) is required." });
  }

  try {
    // Find the movie by its ID and update the URLs
    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      {
        $set: {
          "urls.low": low,
          "urls.medium": medium,
          "urls.high": high,
        },
      },
      { new: true } // Return the updated movie document
    );

    // If the movie with the given ID is not found
    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found." });
    }

    // Return the updated movie details
    res.status(200).json(updatedMovie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add GET method to fetch movies from the database
app.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.get("/movies/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Cannot find movie" });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint to fetch and display TV series data from TMDb
app.get("/fetch-tv/:series_id", async (req, res) => {
  const { series_id } = req.params;

  if (!series_id) {
    return res.status(400).json({ message: "Series ID is required" });
  }

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    };

    // Fetch TV series details from TMDb
    const seriesResponse = await axios.get(
      `https://api.themoviedb.org/3/tv/${series_id}`,
      config
    );
    const seriesData = seriesResponse.data;

    // Fetch TV series credits (cast and crew) from TMDb
    const creditsResponse = await axios.get(
      `https://api.themoviedb.org/3/tv/${series_id}/credits`,
      config
    );
    const creditsData = creditsResponse.data;

    // Fetch seasons details
    const seasons = [];
    for (const season of seriesData.seasons) {
      const seasonResponse = await axios.get(
        `https://api.themoviedb.org/3/tv/${series_id}/season/${season.season_number}`,
        config
      );
      const seasonData = seasonResponse.data;

      // Fetch season credits
      const seasonCreditsResponse = await axios.get(
        `https://api.themoviedb.org/3/tv/${series_id}/season/${season.season_number}/credits`,
        config
      );
      const seasonCreditsData = seasonCreditsResponse.data;

      const episodes = [];
      for (const episode of seasonData.episodes) {
        const episodeResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${series_id}/season/${season.season_number}/episode/${episode.episode_number}`,
          config
        );
        const episodeData = episodeResponse.data;

        // Fetch episode credits
        const episodeCreditsResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${series_id}/season/${season.season_number}/episode/${episode.episode_number}/credits`,
          config
        );
        const episodeCreditsData = episodeCreditsResponse.data;

        episodes.push({
          ...episodeData,
          cast: episodeCreditsData.cast,
          crew: episodeCreditsData.crew,
        });
      }

      seasons.push({
        ...seasonData,
        episodes,
        cast: seasonCreditsData.cast,
        crew: seasonCreditsData.crew,
      });
    }

    const tvShow = {
      ...seriesData,
      cast: creditsData.cast,
      crew: creditsData.crew,
      seasons,
    };

    res.json(tvShow);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Endpoint to save TV series data
app.post("/save-tv", async (req, res) => {
  const tvShowData = new TVShow(req.body);

  try {
    const newMovie = await tvShowData.save();
    res.status(201).json(newTVShow);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add GET method to fetch TV shows from the database
app.get("/tv-shows", async (req, res) => {
  try {
    const tvShows = await TVShow.find();
    res.json(tvShows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/fetch-tvshow/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  try {
    // Fetch TV show details from the database
    const tvShow = await TVShow.findById(id).exec();
    if (!tvShow) {
      return res.status(404).json({ message: "TV show not found" });
    }

    res.status(200).json(tvShow);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
