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
    audio.play().catch((error) => {
        console.warn("Autoplay was prevented by the browser:", error);
    });

    const fadeIn = setInterval(() => {
        try {
            if (audio.volume < targetVolume) {
                let nextVolume = Math.min(targetVolume, audio.volume + step);
                if (nextVolume > 1) nextVolume = 1;
                audio.volume = Number(nextVolume.toFixed(2));
            } else {
                clearInterval(fadeIn);
            }
        } catch (error) {
            console.error("Audio fade failed:", error);
            clearInterval(fadeIn);
        }
    }, interval);
}