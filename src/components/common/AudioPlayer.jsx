import React, { useState, useRef, useEffect } from 'react';

const AudioPlayer = ({
                         src,
                         title = '',
                         fallbackImage = null,
                         onError = () => {},
                         className = ''
                     }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const audioRef = useRef(null);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(err => {
                    console.error("Error playing audio:", err);
                    setError(true);
                    onError(err);
                });
            }
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleSeek = (e) => {
        if (audioRef.current) {
            const newTime = e.target.value;
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
            setLoading(false);
        }
    };

    const handlePlay = () => {
        setIsPlaying(true);
    };

    const handlePause = () => {
        setIsPlaying(false);
    };

    const handleAudioError = (e) => {
        console.error("Audio playback error:", e);
        setError(true);
        setLoading(false);
        onError(e);
    };

    useEffect(() => {
        const audio = audioRef.current;

        if (audio) {
            audio.addEventListener('timeupdate', handleTimeUpdate);
            audio.addEventListener('loadedmetadata', handleLoadedMetadata);
            audio.addEventListener('play', handlePlay);
            audio.addEventListener('pause', handlePause);
            audio.addEventListener('error', handleAudioError);

            audio.load();
        }

        return () => {
            if (audio) {
                audio.removeEventListener('timeupdate', handleTimeUpdate);
                audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
                audio.removeEventListener('play', handlePlay);
                audio.removeEventListener('pause', handlePause);
                audio.removeEventListener('error', handleAudioError);
            }
        };
    }, [src]);

    return (
        <div className={`nasa-audio-player p-4 rounded-lg bg-gray-100 ${className}`}>
            <h3 className="text-lg font-bold mb-3 text-gray-800">{title || 'NASA Audio'}</h3>

            <audio
                ref={audioRef}
                src={src}
                preload="metadata"
                className="hidden"
            />

            <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-3">
                    <div className="text-gray-600 flex-1 text-center">
                        <span className="timer text-sm">
                            {formatTime(currentTime)} / {duration ? formatTime(duration) : '--:--'}
                        </span>
                    </div>
                </div>
                <div className="playback-controllers flex gap-2">
                    <button
                        onClick={togglePlayPause}
                        disabled={loading || error}
                        className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-full disabled:opacity-50"
                        title={isPlaying ? "Pause" : "Play"}
                    >
                        {loading ? (
                            <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : isPlaying ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor" className="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M15.75 5.25v13.5m-7.5-13.5v13.5"/>
                            </svg>

                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor" className="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"/>
                            </svg>

                        )}
                    </button>
                    <div className="flex items-center space-x-2">
                        <input
                            type="range"
                            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                            min="0"
                            max={duration || 0}
                            step="0.1"
                            value={currentTime}
                            onChange={handleSeek}
                            disabled={loading || error}
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="mt-3 text-red-500 text-sm">
                    Unable to play audio. The format may not be supported by your browser.
                </div>
            )}

            {fallbackImage && (
                <div className="mt-4">
                    <img
                        src={fallbackImage}
                        alt={`${title} illustration`}
                        className="w-full rounded-lg shadow-md"
                    />
                </div>
            )}
        </div>
    );
};

export default AudioPlayer;