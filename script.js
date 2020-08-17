let extraInfo = {};

// input field and search buttons
const songNameInput = document.querySelector("#songNameInput");
const fancyResult = document.querySelector("#fancy-result");
const singleLyrics = document.querySelector("#single-lyrics");
const lyricsContainer = document.querySelector("#lyrics");
const lyricsTitle = document.querySelector("#single-lyrics h2");

document.querySelector(".go-back").style.display = "none";
document.querySelector("#hear-song").style.display = "none";

// search button functionality
document.querySelector(".search-btn").addEventListener("click", () => {
    if (songNameInput.value) {
        fancyResult.innerHTML = "";
        fetchMusic(songNameInput.value);
        toggleElement(singleLyrics, fancyResult);
        extraInfo.songNameInput = songNameInput.value;
        songNameInput.value = "";
    } else {
        alert("Please enter a song name.");
    }
});

// load data by song title
async function loadSongByTitle(title) {
    const res = await fetch(`https://api.lyrics.ovh/suggest/${title}`);
    const data = await res.json();
    return data;
}

// render data to HTML
function fetchMusic(title) {
    const musics = loadSongByTitle(title);

    musics.then((musics) => {
        const musicList = musics.data;

        for (let i = 0; i < musicList.length && i < 10; i++) {
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
        }
    });
}

// load lyrics
async function loadLyrics(artistName, title) {
    const res = await fetch(`https://api.lyrics.ovh/v1/${artistName}/${title}`);
    const data = await res.json();
    return data;
}

// getLyrics by artistName and title
function getLyrics(artistName, title) {
    toggleElement(fancyResult, singleLyrics);
    const lyrics = loadLyrics(artistName, title);
    let albumCover = document.getElementById("albumCover");

    lyrics.then((lyric) => {
        if (lyric.lyrics) {
            lyricsContainer.innerHTML = lyric.lyrics;
            albumCover.src = extraInfo.cover;

            document.querySelector("#hear-song").href = extraInfo.songLink;
        } else {
            lyricsContainer.innerHTML = "Sorry! Lyrics not available.";
            albumCover.src = "";
        }

        document.querySelector(".btn.go-back").onclick = () => {
            fancyResult.innerHTML = "";
            fetchMusic(extraInfo.songNameInput);
            toggleElement(singleLyrics, fancyResult);
        };

        lyricsTitle.innerHTML = `${title} - ${artistName}`
    });

    document.querySelector(".go-back").style.display = "inline";
    document.querySelector("#hear-song").style.display = "inline";
}

// change Element display state
function toggleElement(hideElement, displayElement) {
    hideElement.style.display = "none";
    displayElement.style.display = "block";
}