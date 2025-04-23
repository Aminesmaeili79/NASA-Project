import { useEffect, useState } from "react";
import AudioPlayer from './AudioPlayer';

export const MediaDisplay = ({
                                 mediaType = 'image',
                                 mediaUrl,
                                 fallbackUrl = null,
                                 title = '',
                                 onLoad = () => {},
                                 onError = () => {},
                                 className = ''
                             }) => {
    const [error, setError] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setError(false);
        setLoaded(false);
    }, [mediaUrl]);

    const handleError = () => {
        setError(true);
        onError();
    };

    const handleLoad = () => {
        setLoaded(true);
        onLoad();
    };

    // Base container classes
    const containerClasses = `media-container w-full ${className}`;

    if (!mediaUrl && !fallbackUrl) {
        return (
            <div className={containerClasses}>
                <div className="bg-gray-200 aspect-video flex items-center justify-center">
                    <p className="text-gray-500">No media available</p>
                </div>
            </div>
        );
    }

    // If there's an error and no fallback, show error message
    if (error && !fallbackUrl) {
        return (
            <div className={containerClasses}>
                <div className="bg-gray-200 aspect-video flex items-center justify-center">
                    <p className="text-gray-500">Failed to load media</p>
                </div>
            </div>
        );
    }

    // Display different media types
    switch (mediaType.toLowerCase()) {
        case 'video':
            return (
                <div className={containerClasses}>
                    {!error ? (
                        <video
                            controls
                            className="w-full rounded-lg shadow-lg"
                            src={mediaUrl}
                            alt={title}
                            onError={handleError}
                            onLoadedData={handleLoad}
                        >
                            Your browser does not support the video tag.
                        </video>
                    ) : fallbackUrl && (
                        <div className="flex flex-col items-center">
                            <img
                                src={fallbackUrl}
                                alt={`${title} (preview)`}
                                className="w-full rounded-lg shadow-lg"
                                onLoad={handleLoad}
                                onError={() => setError(true)}
                            />
                            <p className="mt-2 text-gray-500">Video is unavailable. Showing preview image.</p>
                        </div>
                    )}
                </div>
            );

        case 'audio':
            return (
                <div className={containerClasses}>
                    <AudioPlayer
                        src={mediaUrl}
                        title={title}
                        fallbackImage={fallbackUrl}
                        onError={() => {
                            handleError();
                            setError(true);
                        }}
                        className="shadow-md"
                    />

                    {error && !fallbackUrl && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg">
                            <p className="text-red-600 text-sm">
                                There was an issue loading this audio file. The format may not be supported by your browser.
                            </p>
                        </div>
                    )}
                </div>
            );

        case 'image':
        default:
            return (
                <div className={containerClasses}>
                    <img
                        src={error && fallbackUrl ? fallbackUrl : mediaUrl}
                        alt={title}
                        className="w-full rounded-lg shadow-lg"
                        onLoad={handleLoad}
                        onError={fallbackUrl ? handleError : () => {
                            setError(true);
                            onError();
                        }}
                    />
                </div>
            );
    }
};