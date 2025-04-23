import React, { useState, useEffect } from 'react';
import { MediaDisplay } from '../../common/MediaDisplay';
import { Loading } from '../../common/Loading';
import { nasaApi } from '../../../services/nasaApi';

/**
 * Component to display media (image, video, audio) in an article
 */
const ArticleMedia = ({
                          articleData,
                          mediaType = 'image',
                          title = ''
                      }) => {
    const [mediaUrl, setMediaUrl] = useState(null);
    const [fallbackUrl, setFallbackUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [debug, setDebug] = useState({});

    // Set fallback URL from article links
    useEffect(() => {
        if (articleData?.links && articleData.links[0]?.href) {
            setFallbackUrl(articleData.links[0].href);
            // Default media URL is the first link if no specific media URL is set yet
            if (!mediaUrl) {
                setMediaUrl(articleData.links[0].href);
            }
        }
    }, [articleData]);

    // Fetch media URL based on mediaType
    useEffect(() => {
        const fetchMediaUrl = async () => {
            if (!articleData || !articleData.data || !articleData.data[0]) {
                setError("No article data available");
                return;
            }

            setLoading(true);
            setError(null);
            const debugInfo = {};

            try {
                const nasaId = articleData.data[0].nasa_id;
                debugInfo.nasaId = nasaId;

                if (!nasaId) {
                    throw new Error(`No NASA ID found for this ${mediaType}`);
                }

                let assetDetails;

                // Get asset details based on media type
                if (mediaType === 'video') {
                    assetDetails = await nasaApi.getVideoAssetDetails(nasaId);
                } else if (mediaType === 'audio') {
                    assetDetails = await nasaApi.getAudioAssetDetails(nasaId);
                } else {
                    // For images, we likely already have the URL from the links
                    setLoading(false);
                    return;
                }

                debugInfo.assetDetails = {
                    hasCollection: !!assetDetails?.collection,
                    itemCount: assetDetails?.collection?.items?.length || 0
                };

                if (assetDetails && assetDetails.collection && assetDetails.collection.items) {
                    let mediaFile = null;

                    // Find appropriate file based on media type
                    if (mediaType === 'video') {
                        mediaFile = assetDetails.collection.items.find(item =>
                            item.href && item.href.endsWith('.mp4')
                        );
                    } else if (mediaType === 'audio') {
                        // Look for common audio formats
                        mediaFile = assetDetails.collection.items.find(item =>
                                item.href && (
                                    item.href.endsWith('.mp3') ||
                                    item.href.endsWith('.wav') ||
                                    item.href.endsWith('.ogg') ||
                                    item.href.endsWith('.m4a')
                                )
                        );

                        // Log all available files to help with debugging
                        debugInfo.availableFiles = assetDetails.collection.items
                            .filter(item => item.href)
                            .map(item => item.href);
                    }

                    if (mediaFile) {
                        debugInfo.foundMediaFile = mediaFile.href;
                        setMediaUrl(mediaFile.href);
                    } else {
                        // Try getting manifest for additional info
                        let manifest;

                        if (mediaType === 'video') {
                            manifest = await nasaApi.getVideoManifest(nasaId);
                        } else if (mediaType === 'audio') {
                            manifest = await nasaApi.getAudioManifest(nasaId);
                        }

                        debugInfo.manifest = manifest ? 'Retrieved' : 'Not available';

                        if (manifest && manifest.location) {
                            debugInfo.manifestLocation = manifest.location;
                            setMediaUrl(manifest.location);
                        } else if (fallbackUrl) {
                            debugInfo.usingFallback = true;
                            setMediaUrl(fallbackUrl);
                            setError(`Could not find ${mediaType} file. Using preview image instead.`);
                        }
                    }
                } else {
                    throw new Error(`No asset details found for ${mediaType}`);
                }
            } catch (err) {
                console.error(`Error fetching ${mediaType} URL:`, err);
                debugInfo.error = err.message;
                setError(`Could not load ${mediaType}. ${err.message}`);
                if (fallbackUrl) {
                    setMediaUrl(fallbackUrl);
                }
            } finally {
                setLoading(false);
                setDebug(debugInfo);
            }
        };

        if ((mediaType === 'video' || mediaType === 'audio') && articleData) {
            fetchMediaUrl();
        }
    }, [articleData, mediaType, fallbackUrl]);

    if (loading) {
        return <Loading />;
    }

    // Add development-only debugging display
    const showDebugInfo = process.env.NODE_ENV === 'development';

    return (
        <div className="article-media">
            <MediaDisplay
                mediaType={mediaType}
                mediaUrl={mediaUrl}
                fallbackUrl={fallbackUrl}
                title={title || (articleData?.data[0]?.title || 'Media')}
                onError={() => {
                    console.error(`Error playing ${mediaType} from URL: ${mediaUrl}`);
                    if (!error) {
                        setError(`${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} could not be played`);
                    }
                }}
                className="mb-2"
            />

            {error && (
                <div className="error-message my-2 text-red-500 text-sm">
                    {error}
                </div>
            )}

            {showDebugInfo && Object.keys(debug).length > 0 && (
                <div className="debug-info p-3 mt-4 bg-gray-100 rounded text-xs font-mono">
                    <details>
                        <summary className="cursor-pointer font-bold">Debug Info</summary>
                        <pre className="mt-2 overflow-auto max-h-60">
              {JSON.stringify(debug, null, 2)}
            </pre>
                    </details>
                </div>
            )}
        </div>
    );
};

export default ArticleMedia;