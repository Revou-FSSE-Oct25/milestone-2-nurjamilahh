export function stopAllAudio(): void {
    const allAudios = document.querySelectorAll('audio');
    allAudios.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
}

export function fadeInAudio(
    audio: HTMLAudioElement, 
    targetVolume: number, 
    step: number = 0.01, 
    interval: number = 100
): void {
    stopAllAudio(); 
    
    audio.volume = 0;
    audio.play().catch(() => {
    });
    const fadeIn = setInterval(() => {
        if (audio.volume < targetVolume) {
            audio.volume = Math.min(targetVolume, audio.volume + step);
        } else {
            clearInterval(fadeIn);
        }
    }, interval);
}