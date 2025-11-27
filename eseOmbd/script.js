const API_KEY = "ab98d384";

// ELEMENTI HTML
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const homeBtn = document.getElementById("homeBtn");

const featuredMovies = document.getElementById("featuredMovies");
const categoriesSection = document.getElementById("categories");

const overlay = document.getElementById("movieOverlay");
const overlayContent = document.getElementById("overlayContent");

// SCROLL VERTICALE
document.getElementById("scrollTop").onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
document.getElementById("scrollBottom").onclick = () => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

// CHIUDI OVERLAY
overlay.onclick = (e) => { if (e.target === overlay) overlay.classList.remove("active"); };

// TORNA ALLA HOME
homeBtn.onclick = () => {
    homeBtn.classList.add("hidden");
    categoriesSection.innerHTML = "";
    document.getElementById("featured").style.display = "block";
    categoriesSection.style.display = "block";
    loadCategories();
};

// ====== FUNZIONI DI BASE ======

// Prendi film tramite ID
async function getMovie(id) {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`);
    return await res.json();
}

// Cerca film tramite testo
async function searchMovies(query) {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=movie`);
    const data = await res.json();
    return data.Response === "True" ? data.Search : [];
}

// Crea card film
function createCard(movie) {
    const card = document.createElement("div");
    card.className = "movie-card";

    const poster = movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/200x300";

    card.innerHTML = `
        <img src="${poster}">
        <h3>${movie.Title}</h3>
    `;

    // Mostra dettagli cliccando
    card.onclick = async () => {
        if (!movie.imdbID) return alert("Dettagli non disponibili");
        await showDetails(movie.imdbID);
    };

    return card;
}

// Mostra dettagli film in overlay
async function showDetails(id) {
    try {
        const movie = await getMovie(id);
        if (!movie) return;

        overlayContent.innerHTML = `
            <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/200x300'}">
            <div>
                <h2>${movie.Title} (${movie.Year})</h2>
                <p><strong>Genere:</strong> ${movie.Genre}</p>
                <p><strong>Regista:</strong> ${movie.Director}</p>
                <p><strong>Attori:</strong> ${movie.Actors}</p>
                <p><strong>Trama:</strong> ${movie.Plot}</p>
                <p><strong>IMDb:</strong> ⭐ ${movie.imdbRating}</p>
            </div>
        `;

        overlay.classList.add("active");
    } catch(err) {
        alert("Errore nel caricare i dettagli");
        console.error(err);
    }
}

// ====== SCROLL ORIZZONTALE ======
function enableRowScroll(wrapper, row) {
    wrapper.querySelector(".scroll-left").onclick = () => row.scrollBy({ left: -300, behavior: "smooth" });
    wrapper.querySelector(".scroll-right").onclick = () => row.scrollBy({ left: 300, behavior: "smooth" });
}

// ====== RICERCA ======
searchBtn.onclick = async () => {
    const text = searchInput.value.trim();
    if (!text) return;

    const results = await searchMovies(text);

    if (results.length === 0) {
        alert("Nessun film trovato!");
        return;
    }

    document.getElementById("featured").style.display = "none";
    categoriesSection.style.display = "block";
    categoriesSection.innerHTML = "<h2>Risultati ricerca</h2>";
    homeBtn.classList.remove("hidden");

    const wrapper = document.createElement("div");
    wrapper.className = "movie-row-wrapper";

    const row = document.createElement("div");
    row.className = "movie-row";

    // Fetch completo per dettagli
    for (let movie of results) {
        const fullMovie = await getMovie(movie.imdbID);
        row.appendChild(createCard(fullMovie));
    }

    const btnLeft = document.createElement("button");
    btnLeft.className = "scroll-left"; btnLeft.innerHTML = "&#10094;";
    const btnRight = document.createElement("button");
    btnRight.className = "scroll-right"; btnRight.innerHTML = "&#10095;";

    wrapper.appendChild(btnLeft);
    wrapper.appendChild(row);
    wrapper.appendChild(btnRight);

    categoriesSection.appendChild(wrapper);

    enableRowScroll(wrapper, row);
};

// ====== HOME: FILM POPOLARI ======
async function loadFeatured() {
    const ids = [
        "tt7286456","tt10954600","tt6751668","tt4154796",
        "tt2488496","tt0499549","tt0088763","tt1375666",
        "tt0816692","tt0110912","tt0137523","tt0468569",
        "tt0109830","tt0114369","tt0120737","tt0133093"
    ];

    for (let id of ids) {
        const movie = await getMovie(id);
        featuredMovies.appendChild(createCard(movie));
    }
}

// ====== CATEGORIE ======
async function loadCategories() {
    const categories = ["Action", "Comedy", "Horror", "Sci-Fi"];

    for (let cat of categories) {

        const section = document.createElement("div");
        section.innerHTML = `<h2>${cat}</h2>`;

        const movies = await searchMovies(cat);

        const wrapper = document.createElement("div");
        wrapper.className = "movie-row-wrapper";

        const row = document.createElement("div");
        row.className = "movie-row";

        for (let m of movies.slice(0, 12)) {
            const fullMovie = await getMovie(m.imdbID);
            row.appendChild(createCard(fullMovie));
        }

        const btnLeft = document.createElement("button");
        btnLeft.className = "scroll-left"; btnLeft.innerHTML = "&#10094;";
        const btnRight = document.createElement("button");
        btnRight.className = "scroll-right"; btnRight.innerHTML = "&#10095;";

        wrapper.appendChild(btnLeft);
        wrapper.appendChild(row);
        wrapper.appendChild(btnRight);

        section.appendChild(wrapper);
        categoriesSection.appendChild(section);

        enableRowScroll(wrapper, row);
    }
}

// ====== AVVIO ======
loadFeatured();
loadCategories();
