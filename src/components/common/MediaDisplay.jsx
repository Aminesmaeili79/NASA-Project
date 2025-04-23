// MediaDisplay.jsx
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

    // Custom function to convert SRT to WebVTT
    const transformSrtToVtt = (srtContent) => {
        if (!srtContent || typeof srtContent !== 'string') {
            throw new Error('Invalid SRT content provided');
        }

        // WebVTT needs to start with "WEBVTT" and a blank line
        let vttContent = "WEBVTT\n\n";

        // Regular expression to parse SRT format
        // This regex captures the subtitle number, timing, and text content
        const regex = /(\d+)\r?\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\r?\n([\s\S]*?)(?=\r?\n\d+\r?\n|$)/g;

        let match;
        while ((match = regex.exec(srtContent)) !== null) {
            const number = match[1];
            const startTime = match[2].replace(',', '.');
            const endTime = match[3].replace(',', '.');
            const text = match[4].trim();

            // Add this subtitle to the VTT content
            vttContent += `${startTime} --> ${endTime}\n${text}\n\n`;
        }

        return vttContent;
    };

    // Fallback method if the regex approach fails
    const transformSrtToVttFallback = (srtContent) => {
        // WebVTT needs to start with "WEBVTT" and a blank line
        let vttContent = "WEBVTT\n\n";

        // Split the SRT content by double newline to get each subtitle block
        const subtitleBlocks = srtContent.trim().split(/\r?\n\r?\n/);

        subtitleBlocks.forEach(block => {
            const lines = block.trim().split(/\r?\n/);

            // Skip empty blocks or blocks with insufficient lines
            if (lines.length < 2) return;

            // Check if the first line is a number (subtitle index)
            const isFirstLineNumber = /^\d+$/.test(lines[0].trim());

            // Find the line with timing information (contains "-->")
            const timeLineIndex = lines.findIndex(line => line.includes('-->'));

            if (timeLineIndex !== -1) {
                // Convert SRT timestamp format (comma) to WebVTT format (period)
                const timeLine = lines[timeLineIndex].replace(/,/g, '.');

                // Get the text content (all lines after the timestamp line)
                // Skip the subtitle number if it exists
                const textContent = lines.slice(timeLineIndex + 1).join('\n');

                // Add this subtitle to the VTT content
                vttContent += `${timeLine}\n${textContent}\n\n`;
            }
        });

        return vttContent;
    };

    useEffect(() => {
        // Handle subtitles if they exist
        const loadSubtitles = async () => {
            if (!subsUrl) return;

            setIsLoadingSubtitles(true);
            setSubtitleError(null);

            try {
                // Fetch the SRT file
                const response = await fetch(subsUrl);
                if (!response.ok) {
                    throw new Error(`Failed to fetch subtitles: ${response.status}`);
                }

                const srtContent = await response.text();

                // Try the main method first, fall back to the alternate if it fails
                let vttContent;
                try {
                    vttContent = transformSrtToVtt(srtContent);

                    // Check if the conversion was successful (should have at least some timing data)
                    if (!vttContent.includes(' --> ')) {
                        vttContent = transformSrtToVttFallback(srtContent);
                    }
                } catch (err) {
                    console.warn("Primary SRT conversion failed, using fallback method", err);
                    vttContent = transformSrtToVttFallback(srtContent);
                }

                // Create a blob URL for the WebVTT content
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

        // Cleanup function to revoke URL when component unmounts
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

                    {/* Add the track element when trackUrl is available */}
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

    // Fallback for images or unknown media types
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