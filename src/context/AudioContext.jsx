import React, { createContext, useContext, useEffect, useRef, useCallback } from "react";

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
    const audioRef = useRef(null);
    const audioUnlockedRef = useRef(false);

    useEffect(() => {
        // Create audio instance once
        const audio = new Audio("/notification.wav");
        audio.volume = 0.6;
        audioRef.current = audio;

        const unlockAudio = () => {
            if (!audioUnlockedRef.current && audioRef.current) {
                audioRef.current.play().then(() => {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                    audioUnlockedRef.current = true;
                }).catch(err => console.log("Audio unlock failed:", err));
            }
        };

        // Try unlocking audio on first interaction
        document.addEventListener("click", unlockAudio, { once: true });
        document.addEventListener("touchstart", unlockAudio, { once: true });
        document.addEventListener("keydown", unlockAudio, { once: true });

        return () => {
            document.removeEventListener("click", unlockAudio);
            document.removeEventListener("touchstart", unlockAudio);
            document.removeEventListener("keydown", unlockAudio);
        };
    }, []);

    const playNotificationSound = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0; // Rewind
            const playPromise = audioRef.current.play();

            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn("Autoplay blocked or audio error:", error);
                });
            }
        }
    }, []);

    return (
        <AudioContext.Provider value={{ playNotificationSound }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => useContext(AudioContext);
