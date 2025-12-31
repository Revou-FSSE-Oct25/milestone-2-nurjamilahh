export function stopAllAudio() {
    const allAudios = document.querySelectorAll('audio');
    allAudios.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
}
export function fadeInAudio(audio, targetVolume, step = 0.01, interval = 100) {
    stopAllAudio();
    audio.volume = 0;
    audio.play().catch(() => {
    });
    const fadeIn = setInterval(() => {
        if (audio.volume < targetVolume) {
            audio.volume = Math.min(targetVolume, audio.volume + step);
        }
        else {
            clearInterval(fadeIn);
        }
    }, interval);
}
//# sourceMappingURL=audio-helper.js.map