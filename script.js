const apiUrl = "https://api.lyrics.ovh/";
let extraInfo = {};

//Input field and search buttons
const songInput = document.getElementById("songInput");
const searchButton = document.getElementById("searchButton");
const fancyResult = document.getElementById("fancy-result");
const singleLyrics = document.getElementById("single-lyrics");
const lyricsContainer = document.getElementById("lyrics");
const lyricsTitle = document.querySelector("#single-lyrics h2");

document.querySelector(".go-back").style.display = "none";
document.querySelector("#hear-song").style.display = "none";

// searchButton functionality
searchButton.addEventListener("click", function () {
    if (songInput.value) {
        fancyResult.innerHTML = "";
        fetchMusic(songInput.value);
        toggleElement(singleLyrics, fancyResult);
        extraInfo.songInput = songInput.value;
        songInput.value = "";
    } else {
        alert("Please enter a song name.");
    }
});

// load data by song title
async function loadSongByTitle(title) {
    const res = await fetch(`${apiUrl}/suggest/${title}`);
    const data = await res.json();
    return data;
}

// render data to HTML
function fetchMusic(title) {
    const musics = loadSongByTitle(title);

    musics.then((musics) => {
        const musicList = musics.data;

        for (let i = 0; i < musicList.length; i++) {
            const music = musicList[i];
            const albumName = music.album.title;
            const artistName = music.artist.name;
            const title = music.title;
            extraInfo.cover = music.album.cover;
            extraInfo.songLink = music.link;

            fancyResult.innerHTML += `<div class="single-result row align-items-center my-3 p-3">
                                <div class="col-md-3">
                                    <img src = '${extraInfo.cover}' alt='cover' >
                                </div>
                                <div class="col-md-6">
                                    <h3 class="lyrics-name">${title}</h3>
                                    <p class="author lead">Album by <span>${artistName}</span></p>
                                </div>
                                <div class="col-md-3 text-md-right text-center">
                                    <button onclick="getLyrics('${artistName}','${title}')" class="btn btn-success">Get Lyrics</button>
                                </div>
                                </div>`;
            if (i === 9) {
                break;
            }
        }
    });
}

// Load lyrics
async function loadLyrics(artistName, title) {
    const res = await fetch(`${apiUrl}/v1/${artistName}/${title}`);
    const data = await res.json();
    return data;
}

// getLyrics by artistName and title
function getLyrics(artistName, title) {
    toggleElement(fancyResult, singleLyrics);
    const lyrics = loadLyrics(artistName, title);
    const hearSongButton = document.getElementById("hear-song");
    let albumCover = document.getElementById("albumCover");

    lyrics.then((lyric) => {
        if (lyric.lyrics) {
            lyricsContainer.innerHTML = lyric.lyrics;
            albumCover.src = extraInfo.cover;
            hearSongButton.href = extraInfo.songLink;
        } else {
            lyricsContainer.innerHTML = "Sorry! Lyrics not available.";
            albumCover.src = "";
        }
        
        const goToButton = document.querySelector(".btn.go-back");

        goToButton.onclick = function () {
            fancyResult.innerHTML = "";
            fetchMusic(extraInfo.songInput);
            toggleElement(singleLyrics, fancyResult);
        };

        lyricsTitle.innerHTML = title + " - " + artistName;
    });

    document.querySelector(".go-back").style.display = "inline";
    document.querySelector("#hear-song").style.display = "inline";
}

// change Element display state
function toggleElement(hideElement, displayElement) {
    hideElement.style.display = "none";
    displayElement.style.display = "block";
}