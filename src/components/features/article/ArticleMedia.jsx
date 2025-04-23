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

    // Set fallback URL from article links
    useEffect(() => {
        if (articleData?.links && articleData.links[0]?.href) {
            setFallbackUrl(articleData.links[0].href);
            // Default media URL is the first link
            if (!mediaUrl) {
                setMediaUrl(articleData.links[0].href);
            }
        }
    }, [articleData, mediaUrl]);

    // Fetch video URL if article is a video
    useEffect(() => {
        const fetchVideoUrl = async () => {
            if (articleData && mediaType === 'video') {
                setLoading(true);

                try {
                    const nasaId = articleData.data[0].nasa_id;

                    if (!nasaId) {
                        throw new Error("No NASA ID found for this video");
                    }

                    const assetDetails = await nasaApi.getVideoAssetDetails(nasaId);

                    if (assetDetails && assetDetails.collection && assetDetails.collection.items) {
                        const mp4File = assetDetails.collection.items.find(item =>
                            item.href && item.href.endsWith('.mp4')
                        );

                        if (mp4File) {
                            setMediaUrl(mp4File.href);
                        } else {
                            // Try getting manifest
                            const manifest = await nasaApi.getVideoManifest(nasaId);

                            if (manifest && manifest.location) {
                                setMediaUrl(manifest.location);
                            } else if (fallbackUrl) {
                                // Use preview URL as fallback
                                setMediaUrl(fallbackUrl);
                                console.warn("Using preview URL as fallback - may not be a video");
                            }
                        }
                    }
                } catch (err) {
                    console.error("Error fetching video URL:", err);
                    setError("Could not load video. Showing preview image instead.");
                    if (fallbackUrl) {
                        setMediaUrl(fallbackUrl);
                    }
                } finally {
                    setLoading(false);
                }
            }
        };

        if (mediaType === 'video') {
            fetchVideoUrl();
        }
    }, [articleData, mediaType, fallbackUrl]);

    if (loading) {
        return <Loading text="Loading media..." />;
    }

    return (
        <div className="article-media flex flex-col items-center mb-8">
            <MediaDisplay
                mediaType={mediaType}
                mediaUrl={mediaUrl}
                fallbackUrl={fallbackUrl}
                title={title}
                className="max-w-full rounded-lg shadow-lg"
            />

            {error && (
                <p className="mt-2 text-yellow-500">{error}</p>
            )}
        </div>
    );
};

export default ArticleMedia;
