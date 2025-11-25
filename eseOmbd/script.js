const API_KEY = "ab98d384";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const featuredMovies = document.getElementById("featuredMovies");
const categoriesSection = document.getElementById("categories");
const overlay = document.getElementById("movieOverlay");
const overlayContent = document.getElementById("overlayContent");
const homeBtn = document.getElementById("homeBtn");

// SCROLL VERTICALE
document.getElementById("scrollTop").addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
document.getElementById("scrollBottom").addEventListener("click",()=>window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"}));

// CHIUDI OVERLAY
overlay.addEventListener("click",e=>{if(e.target===overlay) overlay.classList.remove("active");});

// TORNA ALLA HOME
homeBtn.addEventListener("click",()=>{
    homeBtn.classList.add("hidden");
    document.getElementById("featured").style.display="block";
    categoriesSection.style.display="block";
    categoriesSection.innerHTML="";
    loadCategories();
});

// CREA CARD FILM
function createMovieCard(movie){
    const card = document.createElement("div");
    card.className="movie-card";
    card.innerHTML=`<img src="${movie.Poster!=="N/A"?movie.Poster:'https://via.placeholder.com/200x300'}" alt="${movie.Title}">
                    <h3>${movie.Title}</h3>`;
    card.addEventListener("click",()=>showDetails(movie.imdbID));
    return card;
}

// MOSTRA DETTAGLI
async function showDetails(id){
    const res=await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`);
    const movie=await res.json();
    overlayContent.innerHTML=`<img src="${movie.Poster!=="N/A"?movie.Poster:'https://via.placeholder.com/200x300'}" alt="${movie.Title}">
        <div>
        <h2>${movie.Title} (${movie.Year})</h2>
        <p><strong>Genere:</strong> ${movie.Genre}</p>
        <p><strong>Regista:</strong> ${movie.Director}</p>
        <p><strong>Attori:</strong> ${movie.Actors}</p>
        <p><strong>Trama:</strong> ${movie.Plot}</p>
        <p><strong>IMDb:</strong> ⭐ ${movie.imdbRating}</p>
        </div>`;
    overlay.classList.add("active");
}

// SCROLL ORIZZONTALE
function addScrollButtons(rowWrapper,row){
    const btnLeft=rowWrapper.querySelector(".scroll-left");
    const btnRight=rowWrapper.querySelector(".scroll-right");
    btnLeft.onclick=()=>row.scrollBy({left:-300,behavior:"smooth"});
    btnRight.onclick=()=>row.scrollBy({left:300,behavior:"smooth"});
}

// RICERCA
searchBtn.addEventListener("click",async ()=>{
    const query=searchInput.value.trim();
    if(!query) return;
    const res=await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=movie`);
    const data=await res.json();
    if(data.Response==="True"){
        document.getElementById("featured").style.display="none";
        categoriesSection.style.display="block";
        categoriesSection.innerHTML="<h2>Risultati ricerca:</h2>";
        homeBtn.classList.remove("hidden");
        const rowWrapper=document.createElement("div"); rowWrapper.className="movie-row-wrapper";
        const row=document.createElement("div"); row.className="movie-row";
        data.Search.forEach(movie=>row.appendChild(createMovieCard(movie)));
        const btnLeft=document.createElement("button"); btnLeft.className="scroll-left"; btnLeft.innerHTML="&#10094;";
        const btnRight=document.createElement("button"); btnRight.className="scroll-right"; btnRight.innerHTML="&#10095;";
        rowWrapper.appendChild(btnLeft); rowWrapper.appendChild(row); rowWrapper.appendChild(btnRight);
        categoriesSection.appendChild(rowWrapper);
        addScrollButtons(rowWrapper,row);
    } else alert("Nessun risultato trovato!");
});

// CARICA FILM POPOLARI (~15)
async function loadFeatured(){
    const popularIds=["tt7286456","tt10954600","tt6751668","tt4154796","tt2488496","tt0499549","tt0088763","tt1375666","tt0816692","tt0110912","tt0137523","tt0468569","tt0109830","tt0114369","tt0120737","tt0133093"];
    popularIds.forEach(async id=>{
        const res=await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`);
        const movie=await res.json();
        featuredMovies.appendChild(createMovieCard(movie));
    });
}

// CARICA CATEGORIE (tutti i film con dettagli)
async function loadCategories(){
    const categories=["Action","Comedy","Horror","Sci-Fi"];
    for(const cat of categories){
        const res=await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${cat}&type=movie`);
        const data=await res.json();
        if(data.Response==="True"){
            const section=document.createElement("div");
            section.innerHTML=`<h2>${cat}</h2>`;
            const rowWrapper=document.createElement("div"); rowWrapper.className="movie-row-wrapper";
            const row=document.createElement("div"); row.className="movie-row";
            data.Search.slice(0,12).forEach(async m=>{
                const res2=await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${m.imdbID}`);
                const movieFull=await res2.json();
                row.appendChild(createMovieCard(movieFull));
            });
            const btnLeft=document.createElement("button"); btnLeft.className="scroll-left"; btnLeft.innerHTML="&#10094;";
            const btnRight=document.createElement("button"); btnRight.className="scroll-right"; btnRight.innerHTML="&#10095;";
            rowWrapper.appendChild(btnLeft); rowWrapper.appendChild(row); rowWrapper.appendChild(btnRight);
            section.appendChild(rowWrapper); categoriesSection.appendChild(section);
            addScrollButtons(rowWrapper,row);
        }
    }
}

// INIT
loadFeatured();
loadCategories();
