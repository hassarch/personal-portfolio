// UFO music player using an MP3 file served from public/
// Expected file path: /audio/ufo-theme.mp3 (place under public/audio/)

let audioEl: HTMLAudioElement | null = null;
let playing = false;
const initialized = false;

const DEFAULT_SRC = "/song.mp3"; // placeholder path
let currentVolume = 0.45; // user preference
let loop = false; // play once by default

function ensureAudio(): HTMLAudioElement {
  if (!audioEl) {
    audioEl = new Audio(DEFAULT_SRC);
    audioEl.preload = "auto";
    audioEl.loop = loop;
    audioEl.volume = currentVolume;
    audioEl.addEventListener("ended", () => {
      playing = false;
    });
    audioEl.addEventListener("pause", () => {
      playing = false;
    });
    audioEl.addEventListener("play", () => {
      playing = true;
    });
  }
  return audioEl;
}

export async function toggleUfoMusic() {
  const el = ensureAudio();
  try {
    if (el.paused) {
      await el.play();
      playing = true;
    } else {
      el.pause();
      playing = false;
    }
  } catch (err) {
    // Some browsers need a direct gesture; errors may happen if blocked
    // Swallow the error to avoid console noise; caller is gesture-bound
    // Optionally could expose error to UI toast
  }
}

export function setUfoMusicVolume(v: number) {
  currentVolume = Math.max(0, Math.min(1, v));
  if (audioEl) audioEl.volume = currentVolume;
}

export function isUfoMusicPlaying() {
  return playing;
}

export function setUfoMusicLoop(shouldLoop: boolean) {
  loop = !!shouldLoop;
  if (audioEl) audioEl.loop = loop;
}
