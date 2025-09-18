const API_KEY = "123e428535a6365ca77ffe5db5383f55";  
const BASE_URL = "https://api.themoviedb.org/3";
let moviesData = [];
let lastView = { endpoint: "popular", title: "🔥 Popular Movies" };

// ========= Fetch Movies =========
async function fetchMovies(endpoint, title = "Results") {
  const response = await fetch(`${BASE_URL}/movie/${endpoint}?api_key=${API_KEY}&language=en-US&page=1`);
  const data = await response.json();
  moviesData = data.results;
  displayMovies(moviesData);
  document.getElementById("resultsTitle").innerText = title;
  document.getElementById("backBtn").style.display = "none";
  lastView = { endpoint, title };
}

// ========= Display Movies =========
function displayMovies(movies) {
  const container = document.getElementById("movieList");
  container.innerHTML = "";

  if (movies.length === 0) {
    container.innerHTML = "<p>No movies found!</p>";
    return;
  }

  movies.forEach(movie => {
    const card = document.createElement("div");
    card.classList.add("movie-card");

    const posterPath = movie.poster_path 
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
      : "https://via.placeholder.com/300x450?text=No+Image";

    card.innerHTML = `
      <img src="${posterPath}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <p>⭐ ${movie.vote_average} | 📅 ${movie.release_date || "N/A"}</p>
    `;

    // On click → show movie details
    card.addEventListener("click", () => showMovieDetails(movie.id));

    container.appendChild(card);
  });
}

// ========= Search Movies =========
async function searchMovies() {
  const query = document.getElementById("searchInput").value;
  if (!query) {
    fetchMovies("popular", "🔥 Popular Movies");
    return;
  }

  const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
  const data = await response.json();
  moviesData = data.results;
  displayMovies(moviesData);
  document.getElementById("resultsTitle").innerText = `Search Results for "${query}"`;
  document.getElementById("backBtn").style.display = "block";
}

// ========= Filter Movies =========
function filterMovies() {
  const filter = document.getElementById("filterSelect").value;
  if (filter === "popular") {
    fetchMovies("popular", "🔥 Popular Movies");
  } else if (filter === "top_rated") {
    fetchMovies("top_rated", "⭐ Top Rated Movies");
  } else if (filter === "now_playing") {
    fetchMovies("now_playing", "🎥 Now Playing");
  } else if (filter === "upcoming") {
    fetchMovies("upcoming", "🆕 Upcoming Movies");
  } else {
    fetchMovies("popular", "🔥 Popular Movies");
  }
}

// ========= Movie Details (Popup) =========
async function showMovieDetails(movieId) {
  const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`);
  const movie = await response.json();

  const posterPath = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : "https://via.placeholder.com/300x450?text=No+Image";

  const genres = movie.genres.map(g => g.name).join(", ") || "N/A";

  document.getElementById("modalBody").innerHTML = `
    <img src="${posterPath}" alt="${movie.title}">
    <h2>${movie.title}</h2>
    <p><strong>Release Date:</strong> ${movie.release_date || "N/A"}</p>
    <p><strong>Rating:</strong> ⭐ ${movie.vote_average} (${movie.vote_count} votes)</p>
    <p><strong>Genres:</strong> ${genres}</p>
    <p><strong>Overview:</strong> ${movie.overview || "No description available."}</p>
    <button onclick="showSimilarMovies(${movie.id}, '${movie.title.replace(/'/g, "\\'")}')">🔗 Show Similar Movies</button>
  `;

  document.getElementById("movieModal").style.display = "block";
}

// ========= Close Modal =========
function closeModal() {
  document.getElementById("movieModal").style.display = "none";
}

// ========= Similar Movies =========
async function showSimilarMovies(movieId, movieTitle) {
  closeModal();
  const response = await fetch(`${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}&language=en-US&page=1`);
  const data = await response.json();
  const similarMovies = data.results;

  document.getElementById("resultsTitle").innerText = `🎬 Similar to "${movieTitle}"`;
  displayMovies(similarMovies);
  document.getElementById("backBtn").style.display = "block";
}

// ========= Back Button =========
function goBack() {
  fetchMovies(lastView.endpoint, lastView.title);
}

// ========= Surprise Feature =========
async function surpriseMe() {
  const randomPage = Math.floor(Math.random() * 10) + 1; // pick a random page
  const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${randomPage}`);
  const data = await response.json();
  const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];
  showMovieDetails(randomMovie.id);
}

// ========= Initial Load =========
fetchMovies("popular", "🔥 Popular Movies");
