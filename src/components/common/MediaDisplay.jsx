import React, { useState, useEffect, useRef } from 'react';

export const MediaDisplay = ({
                                 mediaType,
                                 mediaUrl,
                                 subsUrl,
                                 fallbackUrl,
                                 title,
                                 onError,
                                 className = ''
                             }) => {
    const [trackUrl, setTrackUrl] = useState(null);
    const [isLoadingSubtitles, setIsLoadingSubtitles] = useState(false);
    const [subtitleError, setSubtitleError] = useState(null);
    const videoRef = useRef(null);

    const transformSrtToVtt = (srtContent) => {
        if (!srtContent || typeof srtContent !== 'string') {
            throw new Error('Invalid SRT content provided');
        }

        let vttContent = "WEBVTT\n\n";

        const regex = /(\d+)\r?\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\r?\n([\s\S]*?)(?=\r?\n\d+\r?\n|$)/g;

        let match;
        while ((match = regex.exec(srtContent)) !== null) {
            const number = match[1];
            const startTime = match[2].replace(',', '.');
            const endTime = match[3].replace(',', '.');
            const text = match[4].trim();

            vttContent += `${startTime} --> ${endTime}\n${text}\n\n`;
        }

        return vttContent;
    };

    const transformSrtToVttFallback = (srtContent) => {
        let vttContent = "WEBVTT\n\n";

        const subtitleBlocks = srtContent.trim().split(/\r?\n\r?\n/);

        subtitleBlocks.forEach(block => {
            const lines = block.trim().split(/\r?\n/);

            if (lines.length < 2) return;

            const isFirstLineNumber = /^\d+$/.test(lines[0].trim());

            const timeLineIndex = lines.findIndex(line => line.includes('-->'));

            if (timeLineIndex !== -1) {
                const timeLine = lines[timeLineIndex].replace(/,/g, '.');

                const textContent = lines.slice(timeLineIndex + 1).join('\n');

                vttContent += `${timeLine}\n${textContent}\n\n`;
            }
        });

        return vttContent;
    };

    useEffect(() => {
        const loadSubtitles = async () => {
            if (!subsUrl) return;

            setIsLoadingSubtitles(true);
            setSubtitleError(null);

            try {
                const response = await fetch(subsUrl);
                if (!response.ok) {
                    throw new Error(`Failed to fetch subtitles: ${response.status}`);
                }

                const srtContent = await response.text();

                let vttContent;
                try {
                    vttContent = transformSrtToVtt(srtContent);

                    if (!vttContent.includes(' --> ')) {
                        vttContent = transformSrtToVttFallback(srtContent);
                    }
                } catch (err) {
                    console.warn("Primary SRT conversion failed, using fallback method", err);
                    vttContent = transformSrtToVttFallback(srtContent);
                }

                const blob = new Blob([vttContent], { type: 'text/vtt' });
                const vttUrl = URL.createObjectURL(blob);

                setTrackUrl(vttUrl);
            } catch (error) {
                console.error('Error processing subtitles:', error);
                setSubtitleError(error.message);
            } finally {
                setIsLoadingSubtitles(false);
            }
        };

        if (subsUrl) {
            loadSubtitles();
        }

        return () => {
            if (trackUrl) {
                URL.revokeObjectURL(trackUrl);
            }
        };
    }, [subsUrl]);

    if (!mediaUrl) {
        return <div className="text-center p-4">No media available</div>;
    }

    if (mediaType === 'video') {
        return (
            <div className={`video-container w-full ${className}`}>
                <video
                    ref={videoRef}
                    className="w-full rounded-lg"
                    controls
                    preload="metadata"
                    onError={onError}
                >
                    <source src={mediaUrl} type="video/mp4" />

                    {trackUrl && (
                        <track
                            kind="subtitles"
                            src={trackUrl}
                            srcLang="en"
                            label="English"
                            default
                        />
                    )}

                    Your browser does not support the video tag.
                </video>

                {isLoadingSubtitles && (
                    <div className="text-sm text-gray-500 mt-1">Loading subtitles...</div>
                )}

                {subtitleError && (
                    <div className="text-sm text-red-500 mt-1">
                        Error loading subtitles: {subtitleError}
                    </div>
                )}
            </div>
        );
    }

    if (mediaType === 'audio') {
        return (
            <div className={`audio-container w-full ${className}`}>
                <audio
                    className="w-full"
                    controls
                    preload="metadata"
                    onError={onError}
                >
                    <source src={mediaUrl} />
                    Your browser does not support the audio element.
                </audio>
            </div>
        );
    }

    return (
        <div className={`image-container ${className}`}>
            <img
                src={mediaUrl}
                alt={title}
                className="w-full rounded-lg"
                onError={onError}
            />
        </div>
    );
};