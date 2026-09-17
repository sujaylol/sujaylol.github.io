const audio = document.getElementById("audio");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const cover = document.getElementById("cover");
const play = document.getElementById("play");
const playIcon = document.getElementById("playIcon");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const volumeIcon = document.getElementById("volumeIcon");
const loop = document.getElementById("loop");
const loadingStatus = document.getElementById("loadingStatus");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

const tracks = [
    {
        title: "Champagne Poetry",
        artist: "Drake",
        file: "Music/Drake - Champagne Poetry (Audio).mp3",
        cover: "New folder/ab67616d0000b273cd945b4e3de57edd28481a3f.jpg"
    },
    {
        title: "One Dance",
        artist: "Drake",
        file: "Music/One Dance (feat. WizKid & Kyla) - Drake (Official Audio).mp3",
        cover: "New folder/artworks-sjVrZBxRaZXJ-0-t500x500.jpg"
    },
    {
        title: "Die Trying",
        artist: "PARTYNEXTDOOR & Drake",
        file: "Music/PARTYNEXTDOOR & DRAKE - DIE TRYING.mp3",
        cover: "New folder/ab67616d0000b27397ff4f3444787c0dd8660eb3.jpg"
    },
    {
        title: "Fair Trade",
        artist: "Drake ft. Travis Scott",
        file: "Music/Drake - Fair Trade (Audio) ft. Travis Scott.mp3",
        cover: "New folder/ab67616d0000b273cd945b4e3de57edd28481a3f.jpg"
    },
    {
        title: "Starboy",
        artist: "The Weeknd",
        file: "Music/Starboy.mp3",
        cover: "New folder/ab67616d0000b2734718e2b124f79258be7bc452.jpg"
    },
    {
        title: "Obsessed",
        artist: "Mariah Carey",
        file: "Music/Mariah Carey - Obsessed (Official Music Video).mp3",
        cover: "New folder/ab67616d0000b273a9e20a20b9fc607d81f9c335.jpg"
    },
    {
        title: "Confident",
        artist: "Justin Bieber ft. Chance The Rapper",
        file: "Music/Justin Bieber - Confident ft. Chance The Rapper (Official Audio).mp3",
        cover: "New folder/ab67616d0000b27327fbb028b1f4fdc715beac98.jpg"
    }
];

let current = 0;
let isLooping = false;
let loadingTimer = null;
let loadingDots = 0;

const playSVG = '<path d="M8 5.5v13l10-6.5-10-6.5Z"/>';
const pauseSVG = '<path d="M7 5h4v14H7V5Zm6 0h4v14h-4V5Z"/>';

function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return minutes + ":" + String(secs).padStart(2, "0");
}

function startLoading() {
    clearInterval(loadingTimer);

    loadingStatus.style.display = "block";
    loadingDots = 0;
    loadingStatus.textContent = "Loading";

    loadingTimer = setInterval(() => {
        loadingDots++;

        if (loadingDots > 3) {
            loadingDots = 0;
        }

        loadingStatus.textContent =
            "Loading" + ".".repeat(loadingDots);
    }, 400);
}

function stopLoading() {
    clearInterval(loadingTimer);
    loadingStatus.style.display = "none";
}

function setPlayingIcon(playing) {
    playIcon.innerHTML = playing ? pauseSVG : playSVG;
    play.dataset.tooltip = playing ? "Pause" : "Play";
}

async function tryAutoplay() {
    try {
        await audio.play();
        setPlayingIcon(true);
        stopLoading();
    } catch {
        setPlayingIcon(false);
    }
}

function loadTrack(index, autoPlay = false) {
    current = index;

    const track = tracks[current];

    startLoading();

    audio.pause();
    audio.src = track.file;
    audio.preload = "auto";

    title.textContent = track.title;
    artist.textContent = track.artist;
    cover.src = track.cover;

    progress.value = 0;
    currentTime.textContent = "0:00";
    duration.textContent = "0:00";

    audio.load();

    if (autoPlay) {
        tryAutoplay();
    } else {
        setPlayingIcon(false);
    }
}

audio.addEventListener("loadstart", startLoading);

audio.addEventListener("waiting", startLoading);

audio.addEventListener("canplay", stopLoading);

audio.addEventListener("loadedmetadata", () => {
    duration.textContent = formatTime(audio.duration);
});

audio.addEventListener("playing", () => {
    stopLoading();
    setPlayingIcon(true);
});

audio.addEventListener("pause", () => {
    setPlayingIcon(false);
});

audio.addEventListener("error", () => {
    clearInterval(loadingTimer);
    loadingStatus.style.display = "block";
    loadingStatus.textContent = "Couldn't load song";
});

play.addEventListener("click", () => {
    if (audio.paused) {
        audio.play().catch(() => {});
    } else {
        audio.pause();
    }
});

next.addEventListener("click", () => {
    const wasPlaying = !audio.paused;

    current = (current + 1) % tracks.length;

    loadTrack(current, wasPlaying);
});

prev.addEventListener("click", () => {
    const wasPlaying = !audio.paused;

    current = (current - 1 + tracks.length) % tracks.length;

    loadTrack(current, wasPlaying);
});

audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
        progress.value =
            (audio.currentTime / audio.duration) * 100;

        currentTime.textContent =
            formatTime(audio.currentTime);

        duration.textContent =
            formatTime(audio.duration);
    }
});

progress.addEventListener("input", () => {
    if (audio.duration) {
        audio.currentTime =
            (progress.value / 100) * audio.duration;
    }
});

volume.addEventListener("input", () => {
    audio.volume = Number(volume.value);

    if (audio.volume === 0) {
        volumeIcon.textContent = "🔇";
    } else if (audio.volume < 0.5) {
        volumeIcon.textContent = "🔉";
    } else {
        volumeIcon.textContent = "🔊";
    }
});

loop.addEventListener("click", () => {
    isLooping = !isLooping;

    audio.loop = isLooping;

    loop.dataset.tooltip =
        isLooping ? "Unloop" : "Loop";
});

audio.addEventListener("ended", () => {
    if (!isLooping) {
        current = (current + 1) % tracks.length;
        loadTrack(current, true);
    }
});

function updateClock() {
    const now = new Date();

    document.getElementById("clock").textContent =
        now.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit"
        });

    document.getElementById("date").textContent =
        now.toLocaleDateString([], {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        });
}

setInterval(updateClock, 1000);
updateClock();

audio.volume = 0.7;

loadTrack(0, true);

window.addEventListener("load", () => {
    setTimeout(() => {
        tryAutoplay();
    }, 100);
});

document.addEventListener("pointerdown", () => {
    if (audio.paused) {
        tryAutoplay();
    }
}, { once: true });