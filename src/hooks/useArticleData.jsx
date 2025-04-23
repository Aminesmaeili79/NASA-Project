import { useState, useEffect, useCallback } from 'react';
import { nasaApi } from '../services/nasaApi';


export const useArticleData = (initialArticle = null, initialType = '') => {
    const [article, setArticleData] = useState(initialArticle);
    const [articleType, setArticleType] = useState(initialType);
    const [mediaUrl, setMediaUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const setArticle = useCallback((newArticle, type = '') => {
        setArticleData(newArticle);
        if (type) {
            setArticleType(type);
        }
    }, []);

    const fetchArticleByTitle = useCallback(async (title) => {
        if (!title) return;

        setLoading(true);
        setError(null);

        try {
            const searchResult = await nasaApi.searchMedia(title, "");

            if (searchResult?.collection?.items?.length > 0) {
                const matchingItem = searchResult.collection.items.find(
                    item => item.data?.[0]?.title === decodeURIComponent(title)
                );

                if (matchingItem) {
                    let itemType = "image";
                    if (matchingItem.data[0].media_type) {
                        itemType = matchingItem.data[0].media_type;
                    }

                    setArticle(matchingItem, itemType);
                    return matchingItem;
                } else {
                    setError("Couldn't find the exact article");
                }
            } else {
                setError("No results found");
            }

            return null;
        } catch (err) {
            console.error("Error fetching article:", err);
            setError(err.customMessage || "Failed to fetch article services");
            return null;
        } finally {
            setLoading(false);
        }
    }, [setArticle]);

    useEffect(() => {
        const fetchVideoUrl = async () => {
            if (article && articleType === 'video') {
                setLoading(true);

                try {
                    const nasaId = article.data[0].nasa_id;

                    if (!nasaId) {
                        console.error("No NASA ID found for this video");
                        return;
                    }

                    const assetDetails = await nasaApi.getVideoAssetDetails(nasaId);

                    if (assetDetails && assetDetails.collection && assetDetails.collection.items) {
                        const mp4File = assetDetails.collection.items.find(item =>
                            item.href && item.href.endsWith('.mp4')
                        );

                        if (mp4File) {
                            setMediaUrl(mp4File.href);
                        } else {
                            const manifest = await nasaApi.getVideoManifest(nasaId);

                            if (manifest && manifest.location) {
                                setMediaUrl(manifest.location);
                            } else if (article.links && article.links[0]?.href) {
                                setMediaUrl(article.links[0].href);
                                console.warn("Using preview URL as fallback - may not be a video");
                            }
                        }
                    }
                } catch (err) {
                    console.error("Error fetching video URL:", err);
                    if (article.links && article.links[0]?.href) {
                        setMediaUrl(article.links[0].href);
                    }
                } finally {
                    setLoading(false);
                }
            } else if (article && article.links && article.links[0]?.href) {
                setMediaUrl(article.links[0].href);
            }
        };

        fetchVideoUrl();
    }, [article, articleType]);

    return {
        article,
        articleType,
        mediaUrl,
        loading,
        error,
        setArticle,
        setArticleType,
        fetchArticleByTitle
    };
};
