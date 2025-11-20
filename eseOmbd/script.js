const API_KEY = "ab98d384";
let currentPage = 1;
let currentQuery = "";

// ELEMENTI
const resultsDiv = document.getElementById("results");
const detailsDiv = document.getElementById("movieDetails");
const paginationDiv = document.getElementById("pagination");
const pageInfo = document.getElementById("pageInfo");

// 🔍 Cerca film
document.getElementById("searchBtn").addEventListener("click", () => {
    const query = document.getElementById("searchInput").value.trim();
    if (query) {
        currentQuery = query;
        currentPage = 1;
        searchMovies(query, currentPage);
    } else {
        alert("Inserisci un titolo da cercare!");
    }
});

// ▶️ Navigazione
document.getElementById("nextBtn").addEventListener("click", () => {
    currentPage++;
    searchMovies(currentQuery, currentPage);
});

document.getElementById("prevBtn").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        searchMovies(currentQuery, currentPage);
    }
});

// 🔝 Scroll su / giù
document.getElementById("scrollTop").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

document.getElementById("scrollBottom").addEventListener("click", () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
});

// 📡 Funzione ricerca film
async function searchMovies(query, page) {
    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`;
    const res = await fetch(url);
    const data = await res.json();

    detailsDiv.classList.add("hidden");
    resultsDiv.innerHTML = "";

    if (data.Response === "True") {
        paginationDiv.classList.remove("hidden");

        data.Search.forEach(movie => {
            const card = document.createElement("div");
            card.className = "movie-card";
            card.innerHTML = `
                <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/200x300?text=No+Image'}" alt="${movie.Title}">
                <h3>${movie.Title} (${movie.Year})</h3>
            `;
            card.addEventListener("click", () => showDetails(movie.imdbID));
            resultsDiv.appendChild(card);
        });
        pageInfo.textContent = `Pagina ${page}`;
    } else {
        resultsDiv.innerHTML = `<p>Nessun risultato trovato per "${query}"</p>`;
        paginationDiv.classList.add("hidden");
    }
}

// 🎬 Mostra dettagli film
async function showDetails(id) {
    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`;
    const res = await fetch(url);
    const movie = await res.json();

    // Nasconde i risultati e la paginazione
    resultsDiv.classList.add("hidden");
    paginationDiv.classList.add("hidden");

    detailsDiv.classList.remove("hidden");
    detailsDiv.innerHTML = `
        <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/200x300?text=No+Image'}" alt="${movie.Title}">
        <h2>${movie.Title} (${movie.Year})</h2>
        <p><strong>Genere:</strong> ${movie.Genre}</p>
        <p><strong>Regista:</strong> ${movie.Director}</p>
        <p><strong>Attori:</strong> ${movie.Actors}</p>
        <p><strong>Trama:</strong> ${movie.Plot}</p>
        <p><strong>Valutazione IMDb:</strong> ⭐ ${movie.imdbRating}</p>
        <button class="back-btn" id="backToResults">⬅️ Torna ai risultati</button>
    `;

    document.getElementById("backToResults").addEventListener("click", () => {
        detailsDiv.classList.add("hidden");
        resultsDiv.classList.remove("hidden");
        paginationDiv.classList.remove("hidden");
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.scrollTo({ top: detailsDiv.offsetTop, behavior: "smooth" });
}

